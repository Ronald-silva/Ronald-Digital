import { ChatOpenAI } from "@langchain/openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import { SARA_CONFIG, getPricingInfo, getNextAction, getLeadClassification, detectTriggers } from '../config/saraConfig.js';

// Sistema de múltiplas APIs com fallback automático
class MultiAPIManager {
  constructor() {
    this.models = {};
    this.currentProvider = null;
    this.initializeModels();
  }

  initializeModels() {
    // Gemini
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.models.gemini = genAI.getGenerativeModel({ 
          model: SARA_CONFIG.api.model.gemini,
          generationConfig: {
            temperature: SARA_CONFIG.api.temperature,
            maxOutputTokens: SARA_CONFIG.api.maxTokens,
          }
        });
        console.log("✅ Gemini API inicializada");
      } catch (error) {
        console.warn("⚠️ Erro ao inicializar Gemini:", error.message);
      }
    }

    // Grok
    if (process.env.GROK_API_KEY) {
      try {
        this.models.grok = new ChatOpenAI({
          apiKey: process.env.GROK_API_KEY,
          modelName: SARA_CONFIG.api.model.grok,
          temperature: SARA_CONFIG.api.temperature,
          maxTokens: SARA_CONFIG.api.maxTokens,
          configuration: { baseURL: "https://api.x.ai/v1" }
        });
        console.log("✅ Grok API inicializada");
      } catch (error) {
        console.warn("⚠️ Erro ao inicializar Grok:", error.message);
      }
    }

    // OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        this.models.openai = new ChatOpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          modelName: SARA_CONFIG.api.model.openai,
          temperature: SARA_CONFIG.api.temperature,
          maxTokens: SARA_CONFIG.api.maxTokens
        });
        console.log("✅ OpenAI API inicializada");
      } catch (error) {
        console.warn("⚠️ Erro ao inicializar OpenAI:", error.message);
      }
    }

    if (Object.keys(this.models).length === 0) {
      throw new Error("Nenhuma API configurada. Configure GEMINI_API_KEY, GROK_API_KEY ou OPENAI_API_KEY");
    }
  }

  async invoke(messages) {
    const providers = SARA_CONFIG.api.priority.filter(p => this.models[p]);
    
    for (const provider of providers) {
      try {
        console.log(`🤖 Tentando ${provider.toUpperCase()}...`);
        
        if (provider === 'gemini') {
          return await this.invokeGemini(messages);
        } else {
          return await this.models[provider].invoke(messages);
        }
      } catch (error) {
        console.warn(`⚠️ Falha em ${provider}:`, error.message);
        continue;
      }
    }
    
    throw new Error("Todas as APIs falharam");
  }

  async invokeGemini(messages) {
    // Converte formato LangChain para Gemini
    const prompt = messages.map(msg => {
      if (msg.role === 'system') {
        return `INSTRUÇÕES DO SISTEMA: ${msg.content}`;
      }
      return `${msg.role === 'user' ? 'USUÁRIO' : 'ASSISTENTE'}: ${msg.content}`;
    }).join('\n\n');

    const result = await this.models.gemini.generateContent(prompt);
    const response = await result.response;
    
    return {
      content: response.text()
    };
  }
}

// Classe principal do Mega Cérebro da Sara
export class SaraAI {
  constructor() {
    this.apiManager = new MultiAPIManager();
    this.conversationHistory = [];
    this.currentAgent = null;
    this.leadData = {};
    
    // Carrega as configurações das personas
    this.loadPersonas();
  }

  // Carrega todas as personas dos arquivos JSON
  loadPersonas() {
    try {
      const dataPath = path.join(process.cwd(), 'data');
      
      this.maestro = JSON.parse(fs.readFileSync(path.join(dataPath, 'maestro.json'), 'utf8'));
      this.personas = {
        rackham: JSON.parse(fs.readFileSync(path.join(dataPath, 'persona_rackham.json'), 'utf8')),
        konrath: JSON.parse(fs.readFileSync(path.join(dataPath, 'persona_konrath.json'), 'utf8')),
        vaynerchuk: JSON.parse(fs.readFileSync(path.join(dataPath, 'persona_vaynerchuk.json'), 'utf8'))
      };
    } catch (error) {
      console.error("Erro ao carregar personas:", error);
      throw new Error("Falha ao inicializar o sistema de personas");
    }
  }

  // Método principal para processar mensagens com ESCUTA ATIVA
  async processMessage(userMessage, userInfo = {}) {
    try {
      // Atualiza dados do lead
      this.updateLeadData(userInfo);
      
      // Adiciona mensagem do usuário ao histórico
      this.conversationHistory.push({
        role: "user",
        content: userMessage,
        timestamp: new Date().toISOString()
      });

      // NOVA LÓGICA: Analisa intenção ANTES de qualquer roteiro
      const intentionAnalysis = this.analyzeMessageIntention(userMessage);
      
      // Processa baseado na prioridade da intenção
      return await this.processBasedOnPriority(intentionAnalysis, userMessage);

    } catch (error) {
      console.error("Erro no processamento:", error);
      return this.getErrorResponse();
    }
  }

  // Analisa a intenção da mensagem baseado nas prioridades do maestro
  analyzeMessageIntention(userMessage) {
    const message = userMessage.toLowerCase();
    const priorities = this.maestro.regras_de_prioridade;

    // PRIORIDADE MÁXIMA: Perguntas diretas sobre negócio
    for (const trigger of priorities.prioridade_maxima.gatilhos) {
      if (message.includes(trigger.toLowerCase())) {
        return {
          priority: "maxima",
          type: "pergunta_direta",
          trigger: trigger,
          action: priorities.prioridade_maxima.acao
        };
      }
    }

    // PRIORIDADE ALTA: Expressões de dúvida ou abertura
    for (const trigger of priorities.prioridade_alta.gatilhos) {
      if (message.includes(trigger.toLowerCase())) {
        return {
          priority: "alta",
          type: "duvida_abertura",
          trigger: trigger,
          action: priorities.prioridade_alta.acao
        };
      }
    }

    // PRIORIDADE BAIXA: Saudações e mensagens genéricas
    for (const trigger of priorities.prioridade_baixa.gatilhos) {
      if (message.includes(trigger.toLowerCase())) {
        return {
          priority: "baixa",
          type: "saudacao",
          trigger: trigger,
          action: priorities.prioridade_baixa.acao
        };
      }
    }

    // PRIORIDADE MÉDIA: Continuação de conversa (se já tem contexto)
    if (this.conversationHistory.length > 1) {
      return {
        priority: "media",
        type: "continuacao",
        action: priorities.prioridade_media.acao
      };
    }

    // Fallback para mensagens não categorizadas
    return {
      priority: "baixa",
      type: "generica",
      action: "cumprimentar_e_qualificar"
    };
  }

  // Processa mensagem baseado na prioridade identificada
  async processBasedOnPriority(intentionAnalysis, userMessage) {
    switch (intentionAnalysis.priority) {
      case "maxima":
        return await this.handleDirectBusinessQuestion(userMessage, intentionAnalysis);
      
      case "alta":
        return await this.handleDoubtOrOpenness(userMessage, intentionAnalysis);
      
      case "media":
        return await this.handleConversationContinuation(userMessage);
      
      case "baixa":
      default:
        return await this.handleGreetingOrGeneric(userMessage, intentionAnalysis);
    }
  }

  // Lida com perguntas diretas sobre o negócio (PRIORIDADE MÁXIMA)
  async handleDirectBusinessQuestion(userMessage, intentionAnalysis) {
    const businessKnowledge = this.maestro.conhecimento_empresa;
    
    const directAnswerPrompt = `
Você é a Sara da Ronald Digital. O cliente fez uma pergunta DIRETA sobre o negócio.

PERGUNTA DO CLIENTE: "${userMessage}"

CONHECIMENTO DA EMPRESA:
SERVIÇOS QUE OFERECEMOS:
${businessKnowledge.servicos_oferecidos.map(s => `- ${s}`).join('\n')}

NÃO OFERECEMOS:
${businessKnowledge.nao_oferecemos.map(s => `- ${s}`).join('\n')}

DIFERENCIAIS:
${businessKnowledge.diferenciais.map(d => `- ${d}`).join('\n')}

INSTRUÇÕES:
1. Responda DIRETAMENTE à pergunta do cliente
2. Seja clara e objetiva
3. Se não oferecemos o que ele perguntou, explique o que oferecemos
4. Mantenha tom amigável mas profissional
5. Após responder, faça uma pergunta sutil para qualificar

EXEMPLO: "Não, nós não vendemos computadores. Somos especialistas em criação de sites, landing pages e portfólios profissionais. Posso te ajudar com algum projeto digital?"
`;

    const response = await this.apiManager.invoke([
      { role: "system", content: directAnswerPrompt },
      { role: "user", content: userMessage }
    ]);

    return this.formatResponse(response.content, "sara_direct");
  }

  // Lida com expressões de dúvida ou abertura (PRIORIDADE ALTA)
  async handleDoubtOrOpenness(userMessage, intentionAnalysis) {
    const openPrompt = `
Você é a Sara da Ronald Digital. O cliente expressou que tem dúvidas ou precisa de ajuda.

MENSAGEM DO CLIENTE: "${userMessage}"
GATILHO IDENTIFICADO: "${intentionAnalysis.trigger}"

INSTRUÇÕES:
1. Seja acolhedora e empática
2. Convide o cliente a fazer sua pergunta
3. Demonstre disponibilidade para ajudar
4. Use tom caloroso e profissional

EXEMPLOS DE RESPOSTA:
- "Claro! Pode perguntar à vontade. Estou aqui para te ajudar com qualquer dúvida."
- "Fico feliz em ajudar! Qual é sua dúvida?"
- "Sem problemas! Me conta o que você gostaria de saber."
`;

    const response = await this.apiManager.invoke([
      { role: "system", content: openPrompt },
      { role: "user", content: userMessage }
    ]);

    return this.formatResponse(response.content, "sara_open");
  }

  // Lida com continuação de conversa ativa (PRIORIDADE MÉDIA)
  async handleConversationContinuation(userMessage) {
    // Se já tem um agente ativo, continua com ele
    if (this.currentAgent && this.currentAgent !== "sara_direct" && this.currentAgent !== "sara_open") {
      return await this.continueWithCurrentAgent(userMessage);
    }

    // Caso contrário, analisa qual agente usar baseado no contexto
    return await this.analyzeAndRouteMessage(userMessage);
  }

  // Lida com saudações e mensagens genéricas (PRIORIDADE BAIXA)
  async handleGreetingOrGeneric(userMessage, intentionAnalysis) {
    const greetingPrompt = `
Você é a Sara da Ronald Digital. O cliente enviou uma saudação ou mensagem genérica.

MENSAGEM DO CLIENTE: "${userMessage}"

INSTRUÇÕES:
1. Cumprimente de forma calorosa
2. Se apresente brevemente
3. Faça uma pergunta aberta para iniciar a qualificação
4. Seja natural e amigável

EXEMPLO: "Olá! Fico feliz em te ajudar. Sou a Sara da Ronald Digital, especializada em sites e landing pages. Para começar, me conta: qual o seu tipo de negócio e o que você precisa?"
`;

    const response = await this.apiManager.invoke([
      { role: "system", content: greetingPrompt },
      { role: "user", content: userMessage }
    ]);

    return this.formatResponse(response.content, "sara_greeting");
  }

  // Introdução inicial com o Maestro
  async handleMaestroIntroduction(userMessage) {
    const introPrompt = `
${this.maestro.prompt_inicial}

MENSAGEM DO CLIENTE: "${userMessage}"

INSTRUÇÕES:
1. Cumprimente o cliente de forma calorosa
2. Analise a intenção da mensagem
3. Decida qual agente acionar baseado nas regras:
   - RACKHAM: ${this.maestro.regras_de_acionamento.rackham.prompt}
   - KONRATH: ${this.maestro.regras_de_acionamento.konrath.prompt}  
   - VAYNERCHUK: ${this.maestro.regras_de_acionamento.vaynerchuk.prompt}

4. Responda como o agente escolhido, seguindo sua personalidade
5. No final da resposta, inclua: [AGENTE_ATIVO: nome_do_agente]

GATILHOS:
- Rackham: ${this.maestro.regras_de_acionamento.rackham.gatilhos.join(', ')}
- Konrath: ${this.maestro.regras_de_acionamento.konrath.gatilhos.join(', ')}
- Vaynerchuk: ${this.maestro.regras_de_acionamento.vaynerchuk.gatilhos.join(', ')}
`;

    const response = await this.apiManager.invoke([
      { role: "system", content: introPrompt },
      { role: "user", content: userMessage }
    ]);

    // Extrai qual agente foi ativado
    this.extractActiveAgent(response.content);
    
    return this.formatResponse(response.content, "maestro");
  }

  // Continua conversa com o agente atual
  async continueWithCurrentAgent(userMessage) {
    const persona = this.personas[this.currentAgent];
    
    let contextualPrompt = this.buildContextualPrompt(persona, userMessage);
    
    const response = await this.apiManager.invoke([
      { role: "system", content: contextualPrompt },
      { role: "user", content: userMessage }
    ]);

    return this.formatResponse(response.content, this.currentAgent);
  }

  // Analisa mensagem e roteia para agente apropriado
  async analyzeAndRouteMessage(userMessage) {
    const agentesEspecialistas = this.maestro.agentes_especialistas;
    
    const routingPrompt = `
Analise a mensagem do cliente e determine qual agente deve responder:

MENSAGEM: "${userMessage}"

AGENTES DISPONÍVEIS:
1. RACKHAM (Consultivo): ${agentesEspecialistas.rackham.quando_usar}
   Gatilhos: ${agentesEspecialistas.rackham.gatilhos.join(', ')}

2. KONRATH (Objetivo): ${agentesEspecialistas.konrath.quando_usar}
   Gatilhos: ${agentesEspecialistas.konrath.gatilhos.join(', ')}

3. VAYNERCHUK (Relacionamento): ${agentesEspecialistas.vaynerchuk.quando_usar}
   Gatilhos: ${agentesEspecialistas.vaynerchuk.gatilhos.join(', ')}

Responda APENAS com: rackham, konrath ou vaynerchuk
`;

    const routingResponse = await this.apiManager.invoke([
      { role: "system", content: routingPrompt },
      { role: "user", content: userMessage }
    ]);

    const selectedAgent = routingResponse.content.toLowerCase().trim();
    this.currentAgent = selectedAgent;

    return await this.continueWithCurrentAgent(userMessage);
  }

  // Constrói prompt contextual baseado na persona
  buildContextualPrompt(persona, userMessage) {
    let prompt = `${persona.prompt_inicial}\n\n`;
    
    // Adiciona contexto específico da persona
    if (persona.nome === "Neil Rackham") {
      prompt += `METODOLOGIA SPIN:
- Situação: ${persona.perguntas_spin.situacao}
- Problema: ${persona.perguntas_spin.problema}
- Implicação: ${persona.perguntas_spin.implicacao}
- Necessidade: ${persona.perguntas_spin.necessidade_solucao}

Use essas perguntas para guiar a conversa de forma natural.\n\n`;
    }
    
    if (persona.nome === "Jill Konrath") {
      prompt += `QUALIFICAÇÃO BANT:
- Budget: ${persona.perguntas_bant.budget}
- Authority: ${persona.perguntas_bant.authority}
- Need: ${persona.perguntas_bant.need}
- Timeline: ${persona.perguntas_bant.timeline}

RESPOSTAS RÁPIDAS:
- Preços: ${persona.respostas_rapidas.precos.replace('{{min_price}}', '400').replace('{{max_price}}', '2000')}
- Vantagem: ${persona.respostas_rapidas.vantagem_principal}\n\n`;
    }
    
    if (persona.nome === "Gary Vaynerchuk") {
      prompt += `CONTEÚDOS DE VALOR:
${persona.conteudos_de_valor.map(c => `- ${c.titulo}: ${c.link}`).join('\n')}

FRASES DE RELACIONAMENTO:
${persona.frases_de_relacionamento.map(f => `- ${f}`).join('\n')}\n\n`;
    }

    // Adiciona histórico da conversa
    if (this.conversationHistory.length > 1) {
      prompt += `HISTÓRICO DA CONVERSA:\n`;
      this.conversationHistory.slice(-4).forEach(msg => {
        prompt += `${msg.role === 'user' ? 'Cliente' : 'Sara'}: ${msg.content}\n`;
      });
      prompt += `\n`;
    }

    // Adiciona dados do lead se disponíveis
    if (Object.keys(this.leadData).length > 0) {
      prompt += `DADOS DO LEAD:\n${JSON.stringify(this.leadData, null, 2)}\n\n`;
    }

    prompt += `INSTRUÇÕES FINAIS:
- Seja natural e conversacional
- Mantenha o foco no objetivo da sua persona
- Use emojis moderadamente
- Seja empático e profissional
- Se necessário, colete informações para qualificação

MENSAGEM ATUAL DO CLIENTE: "${userMessage}"`;

    return prompt;
  }

  // Extrai qual agente foi ativado da resposta
  extractActiveAgent(responseContent) {
    const match = responseContent.match(/\[AGENTE_ATIVO:\s*(\w+)\]/i);
    if (match) {
      this.currentAgent = match[1].toLowerCase();
    }
  }

  // Atualiza dados do lead
  updateLeadData(userInfo) {
    this.leadData = { ...this.leadData, ...userInfo };
  }

  // Formata resposta final
  formatResponse(content, agentType) {
    // Remove marcadores internos da resposta
    const cleanContent = content.replace(/\[AGENTE_ATIVO:.*?\]/gi, '').trim();
    
    this.conversationHistory.push({
      role: "assistant",
      content: cleanContent,
      agent: agentType,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      response: cleanContent,
      activeAgent: this.currentAgent,
      leadScore: this.calculateLeadScore(),
      nextAction: this.determineNextAction(),
      conversationStage: this.getConversationStage()
    };
  }

  // Calcula score do lead baseado na conversa
  calculateLeadScore() {
    let score = 0;
    const conversationText = this.conversationHistory
      .map(msg => msg.content.toLowerCase())
      .join(' ');

    // Budget indicators
    if (conversationText.includes('orçamento') || conversationText.includes('preço') || 
        conversationText.includes('valor') || conversationText.includes('custo')) {
      score += 1;
    }

    // Authority indicators  
    if (conversationText.includes('decisão') || conversationText.includes('responsável') ||
        conversationText.includes('dono') || conversationText.includes('gerente')) {
      score += 1;
    }

    // Need indicators
    if (conversationText.includes('preciso') || conversationText.includes('quero') ||
        conversationText.includes('necessário') || conversationText.includes('problema')) {
      score += 1;
    }

    // Timeline indicators
    if (conversationText.includes('urgente') || conversationText.includes('prazo') ||
        conversationText.includes('quando') || conversationText.includes('rápido')) {
      score += 1;
    }

    return Math.min(score, 4);
  }

  // Determina próxima ação
  determineNextAction() {
    const score = this.calculateLeadScore();
    
    if (score >= 3) return "fechar_venda";
    if (score >= 2) return "agendar_reuniao";
    if (this.currentAgent === "vaynerchuk") return "nutrir_lead";
    return "continuar_qualificacao";
  }

  // Identifica estágio da conversa
  getConversationStage() {
    if (this.conversationHistory.length <= 2) return "inicial";
    if (this.currentAgent === "rackham") return "descoberta";
    if (this.currentAgent === "konrath") return "qualificacao";
    if (this.currentAgent === "vaynerchuk") return "relacionamento";
    return "indefinido";
  }

  // Resposta de erro
  getErrorResponse() {
    return {
      success: false,
      response: "Desculpe, houve um problema técnico. Pode repetir sua mensagem?",
      activeAgent: this.currentAgent,
      error: true
    };
  }

  // Reinicia conversa
  resetConversation() {
    this.conversationHistory = [];
    this.currentAgent = null;
    this.leadData = {};
  }

  // Obtém estatísticas da conversa
  getConversationStats() {
    return {
      totalMessages: this.conversationHistory.length,
      activeAgent: this.currentAgent,
      leadScore: this.calculateLeadScore(),
      conversationStage: this.getConversationStage(),
      leadData: this.leadData
    };
  }
}