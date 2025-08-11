import { ChatOpenAI } from "@langchain/openai";
import { PERSONAS, getPersonaPrompt } from "./personas.js";

// Configuração da API (usando OpenAI como fallback para Grok)
const initializeModel = () => {
  // Tenta usar Grok primeiro, depois OpenAI como fallback
  const apiKey = process.env.GROK_API_KEY || process.env.OPENAI_API_KEY;
  const baseURL = process.env.GROK_API_KEY ? "https://api.x.ai/v1" : undefined;
  
  if (!apiKey) {
    throw new Error("GROK_API_KEY ou OPENAI_API_KEY não configurada");
  }

  return new ChatOpenAI({
    apiKey,
    modelName: process.env.GROK_API_KEY ? "grok-beta" : "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 500,
    configuration: baseURL ? { baseURL } : undefined
  });
};

// Classe principal do Multi-Agente
export class MultiAgentSalesSystem {
  constructor() {
    this.model = initializeModel();
    this.conversationHistory = [];
  }

  // Processa o input inicial do formulário
  async processFormSubmission(formData) {
    try {
      const { nome, email, mensagem, tipoServico } = formData;
      
      // Contexto inicial
      const context = {
        cliente: {
          nome,
          email,
          mensagem,
          tipoServico
        },
        etapa: "captacao",
        timestamp: new Date().toISOString()
      };

      // Inicia o fluxo com Neil Patel (Captação)
      const captacaoResult = await this.executeCaptacao(context);
      
      // Se tiver informações suficientes, prossegue para qualificação
      if (this.shouldProceedToQualification(captacaoResult)) {
        const qualificacaoResult = await this.executeQualificacao({
          ...context,
          captacao: captacaoResult
        });
        
        // Se lead estiver qualificado, prossegue para vendas
        if (qualificacaoResult.leadScore >= 2) {
          const vendasResult = await this.executeVendas({
            ...context,
            captacao: captacaoResult,
            qualificacao: qualificacaoResult
          });
          
          return {
            success: true,
            etapa: "vendas",
            resposta: vendasResult.resposta,
            leadScore: qualificacaoResult.leadScore,
            proximaAcao: vendasResult.proximaAcao
          };
        }
      }

      // Retorna resultado da captação se não prosseguir
      return {
        success: true,
        etapa: "captacao",
        resposta: captacaoResult.resposta,
        proximaAcao: captacaoResult.proximaAcao
      };

    } catch (error) {
      console.error("Erro no processamento:", error);
      return {
        success: false,
        error: "Erro interno do sistema",
        resposta: "Desculpe, houve um problema técnico. Entre em contato diretamente conosco."
      };
    }
  }

  // Agente 1: Neil Patel - Captação
  async executeCaptacao(context) {
    const prompt = getPersonaPrompt("NEIL_PATEL", context);
    
    const response = await this.model.invoke([
      { role: "system", content: prompt },
      { role: "user", content: `
        Cliente: ${context.cliente.nome}
        Email: ${context.cliente.email}
        Mensagem: ${context.cliente.mensagem}
        Tipo de Serviço: ${context.cliente.tipoServico || "Não especificado"}
        
        Analise este lead e faça perguntas estratégicas para entender a necessidade.
      `}
    ]);

    return {
      resposta: response.content,
      proximaAcao: "aguardar_resposta_cliente",
      insights: this.extractInsights(response.content),
      timestamp: new Date().toISOString()
    };
  }

  // Agente 2: Jill Konrath - Qualificação BANT
  async executeQualificacao(context) {
    const prompt = getPersonaPrompt("JILL_KONRATH", context);
    
    const response = await this.model.invoke([
      { role: "system", content: prompt },
      { role: "user", content: `
        Baseado nas informações coletadas, qualifique este lead usando BANT:
        
        INFORMAÇÕES DISPONÍVEIS:
        ${JSON.stringify(context, null, 2)}
        
        Classifique o lead e identifique próximos passos.
      `}
    ]);

    const leadScore = this.calculateLeadScore(context, response.content);
    
    return {
      resposta: response.content,
      leadScore,
      classificacao: this.getLeadClassification(leadScore),
      bantAnalysis: this.extractBANTInfo(response.content),
      timestamp: new Date().toISOString()
    };
  }

  // Agente 3: Gary Vaynerchuk - Vendas e Fechamento
  async executeVendas(context) {
    const prompt = getPersonaPrompt("GARY_VAYNERCHUK", context);
    
    const response = await this.model.invoke([
      { role: "system", content: prompt },
      { role: "user", content: `
        Lead qualificado para fechamento:
        
        CONTEXTO COMPLETO:
        ${JSON.stringify(context, null, 2)}
        
        Apresente proposta específica ou estratégia de nutrição.
      `}
    ]);

    return {
      resposta: response.content,
      proximaAcao: this.determineNextAction(context.qualificacao.leadScore),
      proposta: this.generateProposta(context),
      timestamp: new Date().toISOString()
    };
  }

  // Métodos auxiliares
  shouldProceedToQualification(captacaoResult) {
    // Lógica simples: se tem insights suficientes, prossegue
    return captacaoResult.insights && captacaoResult.insights.length > 0;
  }

  extractInsights(content) {
    // Extrai insights básicos do conteúdo
    const insights = [];
    if (content.toLowerCase().includes("orçamento")) insights.push("budget_mentioned");
    if (content.toLowerCase().includes("prazo")) insights.push("timeline_mentioned");
    if (content.toLowerCase().includes("decisão")) insights.push("authority_mentioned");
    return insights;
  }

  calculateLeadScore(context, qualificationContent) {
    let score = 0;
    
    // Budget (0-1 ponto)
    if (qualificationContent.toLowerCase().includes("orçamento") || 
        context.cliente.mensagem.toLowerCase().includes("preço")) {
      score += 1;
    }
    
    // Authority (0-1 ponto)  
    if (qualificationContent.toLowerCase().includes("decisão") ||
        qualificationContent.toLowerCase().includes("autoridade")) {
      score += 1;
    }
    
    // Need (0-1 ponto)
    if (context.cliente.tipoServico || 
        context.cliente.mensagem.length > 20) {
      score += 1;
    }
    
    // Timeline (0-1 ponto)
    if (qualificationContent.toLowerCase().includes("prazo") ||
        qualificationContent.toLowerCase().includes("urgente")) {
      score += 1;
    }
    
    return score;
  }

  getLeadClassification(score) {
    if (score >= 3) return "QUENTE";
    if (score >= 2) return "MORNO";
    return "FRIO";
  }

  extractBANTInfo(content) {
    return {
      budget: content.includes("orçamento") ? "identificado" : "não_identificado",
      authority: content.includes("decisão") ? "identificado" : "não_identificado", 
      need: content.includes("necessidade") ? "identificado" : "não_identificado",
      timeline: content.includes("prazo") ? "identificado" : "não_identificado"
    };
  }

  determineNextAction(leadScore) {
    if (leadScore >= 3) return "fechar_venda";
    if (leadScore >= 2) return "agendar_reuniao";
    return "nutrir_lead";
  }

  generateProposta(context) {
    const tipoServico = context.cliente.tipoServico?.toLowerCase() || "";
    
    if (tipoServico.includes("landing")) {
      return {
        servico: "Landing Page com IA",
        preco: "R$ 500 - R$ 1.000",
        prazo: "5-7 dias úteis",
        diferenciais: ["Integração com IA", "Otimização automática", "Analytics avançado"]
      };
    }
    
    if (tipoServico.includes("portfolio")) {
      return {
        servico: "Portfólio Inteligente", 
        preco: "R$ 400 - R$ 800",
        prazo: "3-5 dias úteis",
        diferenciais: ["Design responsivo", "Galeria inteligente", "SEO otimizado"]
      };
    }
    
    return {
      servico: "Site/Blog Completo com IA",
      preco: "R$ 800 - R$ 2.000", 
      prazo: "7-14 dias úteis",
      diferenciais: ["CMS personalizado", "IA para conteúdo", "Integração completa"]
    };
  }
}