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

  // 🧠 Carrega todas as configurações de IA da Sara
  loadPersonas() {
    try {
      const dataPath = path.join(process.cwd(), 'data');
      
      // Configurações principais
      this.maestro = JSON.parse(fs.readFileSync(path.join(dataPath, 'maestro.json'), 'utf8'));
      this.saraPersonality = JSON.parse(fs.readFileSync(path.join(dataPath, 'sara_personality.json'), 'utf8'));
      
      // Personas especialistas
      this.personas = {
        rackham: JSON.parse(fs.readFileSync(path.join(dataPath, 'persona_rackham.json'), 'utf8')),
        konrath: JSON.parse(fs.readFileSync(path.join(dataPath, 'persona_konrath.json'), 'utf8')),
        vaynerchuk: JSON.parse(fs.readFileSync(path.join(dataPath, 'persona_vaynerchuk.json'), 'utf8'))
      };

      console.log("✅ Sara AI carregada com personalidade humanizada!");
      console.log(`🎭 Personalidade: ${this.saraPersonality.personalidade.core_traits.join(', ')}`);
      
    } catch (error) {
      console.error("❌ Erro ao carregar configurações da Sara:", error);
      throw new Error("Falha ao inicializar o sistema de IA da Sara");
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

  // 🧠 ANÁLISE ULTRA INTELIGENTE DE INTENÇÃO
  analyzeMessageIntention(userMessage) {
    const message = userMessage.toLowerCase().trim();
    const priorities = this.maestro.regras_de_prioridade;

    console.log(`🔍 Analisando mensagem: "${message}"`);

    // 🚨 PRIORIDADE MÁXIMA: Perguntas diretas sobre negócio
    const maxTriggers = priorities.prioridade_maxima.gatilhos;
    for (const trigger of maxTriggers) {
      if (message.includes(trigger.toLowerCase())) {
        console.log(`🎯 PRIORIDADE MÁXIMA detectada: "${trigger}"`);
        return {
          priority: "maxima",
          type: "pergunta_direta",
          trigger: trigger,
          action: priorities.prioridade_maxima.acao,
          confidence: 0.95
        };
      }
    }

    // ⚡ PRIORIDADE ALTA: Expressões de dúvida ou abertura
    const altaTriggers = priorities.prioridade_alta.gatilhos;
    for (const trigger of altaTriggers) {
      if (message.includes(trigger.toLowerCase())) {
        console.log(`🔥 PRIORIDADE ALTA detectada: "${trigger}"`);
        return {
          priority: "alta",
          type: "duvida_abertura",
          trigger: trigger,
          action: priorities.prioridade_alta.acao,
          confidence: 0.85
        };
      }
    }

    // 📈 PRIORIDADE MÉDIA: Continuação inteligente de conversa
    if (this.conversationHistory.length > 1) {
      const lastBotMessage = this.conversationHistory
        .filter(msg => msg.role === 'assistant')
        .pop()?.content || '';
      
      // Detecta se é resposta a uma pergunta específica
      if (lastBotMessage.includes('?') || lastBotMessage.includes('me conta')) {
        console.log(`💬 CONTINUAÇÃO DE CONVERSA detectada`);
        return {
          priority: "media",
          type: "continuacao",
          action: "continuar_conversa_contextual",
          confidence: 0.75,
          context: "resposta_a_pergunta"
        };
      }
    }

    // 👋 PRIORIDADE BAIXA: Saudações e mensagens genéricas
    const baixaTriggers = priorities.prioridade_baixa.gatilhos;
    for (const trigger of baixaTriggers) {
      if (message.includes(trigger.toLowerCase())) {
        console.log(`😊 SAUDAÇÃO detectada: "${trigger}"`);
        return {
          priority: "baixa",
          type: "saudacao",
          trigger: trigger,
          action: priorities.prioridade_baixa.acao,
          confidence: 0.65
        };
      }
    }

    // 🤖 ANÁLISE SEMÂNTICA AVANÇADA para mensagens não categorizadas
    const semanticAnalysis = this.performSemanticAnalysis(message);
    
    return {
      priority: semanticAnalysis.priority || "baixa",
      type: semanticAnalysis.type || "generica",
      action: semanticAnalysis.action || "resposta_inteligente",
      confidence: semanticAnalysis.confidence || 0.5,
      semantic: true
    };
  }

  // 🧠 ANÁLISE SEMÂNTICA AVANÇADA
  performSemanticAnalysis(message) {
    // Detecta intenção de compra/interesse
    const buyingIntentWords = ['quero', 'preciso', 'gostaria', 'interessado', 'contratar', 'fazer'];
    const hasBuyingIntent = buyingIntentWords.some(word => message.includes(word));
    
    // Detecta perguntas sobre preço/valor
    const priceWords = ['preço', 'valor', 'custa', 'orçamento', 'investimento'];
    const isPriceQuestion = priceWords.some(word => message.includes(word));
    
    // Detecta perguntas sobre processo/como funciona
    const processWords = ['como', 'funciona', 'processo', 'etapas', 'prazo'];
    const isProcessQuestion = processWords.some(word => message.includes(word));
    
    // Detecta objeções ou hesitação
    const objectionWords = ['caro', 'muito', 'não sei', 'talvez', 'pensar'];
    const hasObjection = objectionWords.some(word => message.includes(word));

    if (isPriceQuestion) {
      return {
        priority: "alta",
        type: "pergunta_preco",
        action: "responder_preco_inteligente",
        confidence: 0.9
      };
    }

    if (hasBuyingIntent) {
      return {
        priority: "alta", 
        type: "interesse_compra",
        action: "qualificar_lead",
        confidence: 0.85
      };
    }

    if (isProcessQuestion) {
      return {
        priority: "media",
        type: "pergunta_processo", 
        action: "explicar_processo",
        confidence: 0.8
      };
    }

    if (hasObjection) {
      return {
        priority: "alta",
        type: "objecao",
        action: "tratar_objecao",
        confidence: 0.75
      };
    }

    return {
      priority: "baixa",
      type: "conversa_geral",
      action: "resposta_amigavel",
      confidence: 0.6
    };
  }

  // 🚀 PROCESSAMENTO INTELIGENTE BASEADO EM PRIORIDADE
  async processBasedOnPriority(intentionAnalysis, userMessage) {
    console.log(`🎯 Processando com prioridade: ${intentionAnalysis.priority} | Tipo: ${intentionAnalysis.type}`);
    
    switch (intentionAnalysis.priority) {
      case "maxima":
        return await this.handleDirectBusinessQuestion(userMessage, intentionAnalysis);
      
      case "alta":
        // Verifica se é análise semântica específica
        if (intentionAnalysis.semantic) {
          return await this.handleSemanticResponse(userMessage, intentionAnalysis);
        }
        return await this.handleDoubtOrOpenness(userMessage, intentionAnalysis);
      
      case "media":
        return await this.handleConversationContinuation(userMessage);
      
      case "baixa":
      default:
        return await this.handleGreetingOrGeneric(userMessage, intentionAnalysis);
    }
  }

  // 🧠 RESPOSTA SEMÂNTICA INTELIGENTE
  async handleSemanticResponse(userMessage, intentionAnalysis) {
    switch (intentionAnalysis.type) {
      case "pergunta_preco":
        return await this.handlePriceQuestion(userMessage, intentionAnalysis);
      
      case "interesse_compra":
        return await this.handleBuyingInterest(userMessage, intentionAnalysis);
      
      case "pergunta_processo":
        return await this.handleProcessQuestion(userMessage, intentionAnalysis);
      
      case "objecao":
        return await this.handleObjection(userMessage, intentionAnalysis);
      
      default:
        return await this.handleGeneralConversation(userMessage, intentionAnalysis);
    }
  }

  // 💰 RESPOSTA INTELIGENTE SOBRE PREÇOS
  async handlePriceQuestion(userMessage, intentionAnalysis) {
    const pricePrompt = `
Você é a Sara, especialista em marketing digital. O cliente perguntou sobre PREÇOS.

PERGUNTA: "${userMessage}"
CONFIANÇA DA ANÁLISE: ${intentionAnalysis.confidence}

TABELA DE PREÇOS RONALD DIGITAL:
• Landing Pages: R$ 500-1.000 (alta conversão)
• Portfólios: R$ 400-800 (credibilidade profissional)  
• Sites Completos: R$ 800-2.000 (presença digital completa)

PERSONALIDADE DA SARA:
- Transparente com preços
- Foca no VALOR, não no custo
- Explica o ROI (retorno do investimento)
- Oferece opções para diferentes orçamentos

ESTRATÉGIA DE RESPOSTA:
1. Seja transparente com os preços
2. Explique o valor por trás do investimento
3. Dê exemplos de ROI
4. Qualifique o tipo de projeto
5. Ofereça consultoria gratuita

EXEMPLO: "Nossos preços variam de R$ 400 a R$ 2.000, dependendo do projeto. Uma landing page de R$ 800 pode gerar R$ 10.000 em vendas no primeiro mês! Que tipo de projeto você tem em mente?"

RESPONDA COMO SARA ESPECIALISTA EM VENDAS:
`;

    const response = await this.apiManager.invoke([
      { role: "system", content: pricePrompt },
      { role: "user", content: userMessage }
    ]);

    return this.formatResponse(response.content, "sara_price");
  }

  // 🎯 RESPOSTA PARA INTERESSE DE COMPRA
  async handleBuyingInterest(userMessage, intentionAnalysis) {
    const buyingPrompt = `
Você é a Sara, especialista em vendas digitais. O cliente demonstrou INTERESSE DE COMPRA!

MENSAGEM: "${userMessage}"
NÍVEL DE INTERESSE: ${intentionAnalysis.confidence * 100}%

PERSONALIDADE DA SARA:
- Entusiasmada mas profissional
- Foca em qualificar rapidamente
- Usa metodologia BANT (Budget, Authority, Need, Timeline)
- Cria senso de urgência sutil

ESTRATÉGIA PARA LEAD QUENTE:
1. Demonstre entusiasmo genuíno
2. Qualifique rapidamente (BANT)
3. Ofereça consultoria gratuita
4. Crie próximo passo claro
5. Use prova social sutil

PERGUNTAS BANT NATURAIS:
- Budget: "Qual faixa de investimento você tem em mente?"
- Authority: "Você é quem decide sobre esse projeto?"
- Need: "Qual seu principal objetivo com o site?"
- Timeline: "Para quando você precisa?"

RESPONDA COMO SARA VENDEDORA ESPECIALISTA:
`;

    const response = await this.apiManager.invoke([
      { role: "system", content: buyingPrompt },
      { role: "user", content: userMessage }
    ]);

    return this.formatResponse(response.content, "sara_buying");
  }

  // ⚙️ RESPOSTA SOBRE PROCESSO
  async handleProcessQuestion(userMessage, intentionAnalysis) {
    const processPrompt = `
Você é a Sara, especialista em projetos digitais. O cliente quer entender o PROCESSO.

PERGUNTA: "${userMessage}"

PROCESSO RONALD DIGITAL:
1. 📋 Briefing (entendemos sua necessidade)
2. 🎨 Design (criamos o layout)
3. 💻 Desenvolvimento (construímos o site)
4. 🧪 Testes (garantimos qualidade)
5. 🚀 Entrega (site no ar!)

PRAZOS TÍPICOS:
• Landing Page: 3-5 dias
• Portfólio: 5-7 dias
• Site Completo: 7-15 dias

PERSONALIDADE DA SARA:
- Didática e clara
- Transparente sobre prazos
- Foca na qualidade
- Tranquiliza sobre o processo

RESPONDA EXPLICANDO O PROCESSO DE FORMA NATURAL E CONFIANTE:
`;

    const response = await this.apiManager.invoke([
      { role: "system", content: processPrompt },
      { role: "user", content: userMessage }
    ]);

    return this.formatResponse(response.content, "sara_process");
  }

  // 🛡️ TRATAMENTO DE OBJEÇÕES
  async handleObjection(userMessage, intentionAnalysis) {
    const objectionPrompt = `
Você é a Sara, especialista em vendas. O cliente demonstrou uma OBJEÇÃO.

OBJEÇÃO: "${userMessage}"

PERSONALIDADE DA SARA:
- Empática e compreensiva
- Não pressiona, educa
- Foca no valor e ROI
- Oferece alternativas
- Usa prova social

TÉCNICAS DE TRATAMENTO:
1. Reconheça a preocupação
2. Faça pergunta para entender melhor
3. Eduque sobre valor/ROI
4. Ofereça alternativas
5. Use prova social

EXEMPLOS DE OBJEÇÕES COMUNS:
- "Está caro" → Foque no ROI e parcelamento
- "Preciso pensar" → Crie urgência sutil e ofereça garantia
- "Não tenho tempo" → Explique que cuidamos de tudo

RESPONDA COMO SARA CONSULTORA ESPECIALISTA:
`;

    const response = await this.apiManager.invoke([
      { role: "system", content: objectionPrompt },
      { role: "user", content: userMessage }
    ]);

    return this.formatResponse(response.content, "sara_objection");
  }

  // 💬 CONVERSA GERAL INTELIGENTE
  async handleGeneralConversation(userMessage, intentionAnalysis) {
    const generalPrompt = `
Você é a Sara, especialista em marketing digital. Conversa geral com o cliente.

MENSAGEM: "${userMessage}"

PERSONALIDADE DA SARA:
- Amigável e acessível
- Sempre tenta ajudar
- Direciona para oportunidades
- Mantém conversa interessante
- Foca em descobrir necessidades

ESTRATÉGIA:
1. Responda de forma natural
2. Mantenha interesse na conversa
3. Procure oportunidades de qualificação
4. Seja genuinamente útil
5. Direcione para próximo passo

RESPONDA COMO SARA HUMANA E ESPECIALISTA:
`;

    const response = await this.apiManager.invoke([
      { role: "system", content: generalPrompt },
      { role: "user", content: userMessage }
    ]);

    return this.formatResponse(response.content, "sara_general");
  }

  // 🎯 RESPOSTA DIRETA E INTELIGENTE (PRIORIDADE MÁXIMA)
  async handleDirectBusinessQuestion(userMessage, intentionAnalysis) {
    const businessKnowledge = this.maestro.conhecimento_empresa;
    
    // 🧠 Análise específica da pergunta
    const questionAnalysis = this.analyzeSpecificQuestion(userMessage);
    
    const directAnswerPrompt = `
Você é a Sara, especialista em marketing digital da Ronald Digital. Você é INTELIGENTE, CARISMÁTICA e HUMANA.

PERGUNTA ESPECÍFICA DO CLIENTE: "${userMessage}"
GATILHO DETECTADO: "${intentionAnalysis.trigger}"
ANÁLISE DA PERGUNTA: ${questionAnalysis}

CONHECIMENTO COMPLETO DA EMPRESA:
✅ OFERECEMOS:
${businessKnowledge.servicos_oferecidos.map(s => `• ${s}`).join('\n')}

❌ NÃO OFERECEMOS:
${businessKnowledge.nao_oferecemos.map(s => `• ${s}`).join('\n')}

🚀 NOSSOS DIFERENCIAIS:
${businessKnowledge.diferenciais.map(d => `• ${d}`).join('\n')}

PERSONALIDADE DA SARA:
- Especialista confiante mas acessível
- Usa linguagem natural e moderna
- Empática e solucionadora
- Foca em resultados para o cliente
- Usa emojis moderadamente para humanizar

INSTRUÇÕES PARA RESPOSTA PERFEITA:
1. Responda DIRETAMENTE à pergunta (não enrole!)
2. Se não oferecemos, seja honesta mas redirecione para o que fazemos
3. Use tom conversacional, como se fosse uma amiga especialista
4. Inclua um benefício ou insight de valor
5. Termine com pergunta inteligente para qualificar

EXEMPLOS DE RESPOSTAS NATURAIS:
- "Não, a gente não vende computadores. Nosso foco é criar sites que vendem! Você tem algum negócio que precisa de presença digital?"
- "Sim! Fazemos landing pages que convertem muito bem. Qual produto ou serviço você quer promover?"

RESPONDA COMO A SARA REAL:
`;

    const response = await this.apiManager.invoke([
      { role: "system", content: directAnswerPrompt },
      { role: "user", content: userMessage }
    ]);

    return this.formatResponse(response.content, "sara_direct");
  }

  // 🔍 Analisa especificamente o que o cliente está perguntando
  analyzeSpecificQuestion(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('computador') || lowerMsg.includes('hardware')) {
      return "Cliente pergunta sobre hardware - redirecionar para serviços digitais";
    }
    if (lowerMsg.includes('app') || lowerMsg.includes('aplicativo')) {
      return "Cliente pergunta sobre apps - explicar foco em web";
    }
    if (lowerMsg.includes('site') || lowerMsg.includes('página')) {
      return "Cliente interessado em web - oportunidade direta";
    }
    if (lowerMsg.includes('preço') || lowerMsg.includes('valor')) {
      return "Cliente quer saber preços - lead quente";
    }
    if (lowerMsg.includes('como funciona') || lowerMsg.includes('processo')) {
      return "Cliente quer entender processo - educar e qualificar";
    }
    
    return "Pergunta geral sobre serviços - qualificar necessidade";
  }

  // 🤝 ACOLHIMENTO INTELIGENTE (PRIORIDADE ALTA)
  async handleDoubtOrOpenness(userMessage, intentionAnalysis) {
    // 🧠 Detecta o tipo específico de abertura
    const opennessType = this.detectOpennessType(userMessage);
    
    const openPrompt = `
Você é a Sara, especialista em marketing digital. O cliente demonstrou ABERTURA para conversar.

MENSAGEM DO CLIENTE: "${userMessage}"
GATILHO: "${intentionAnalysis.trigger}"
TIPO DE ABERTURA: ${opennessType}

PERSONALIDADE DA SARA:
- Acolhedora mas profissional
- Especialista confiante
- Foca em ajudar genuinamente
- Linguagem natural e moderna

ESTRATÉGIA DE RESPOSTA:
1. Acolha com empatia genuína
2. Demonstre expertise sutil
3. Faça pergunta inteligente para descobrir necessidade
4. Mantenha porta aberta para qualificação

EXEMPLOS NATURAIS:
- "Claro! Adoro ajudar com projetos digitais. Qual sua principal dúvida?"
- "Fico feliz em te ajudar! Sobre que tipo de projeto você quer saber?"
- "Sem problemas! Sou especialista nisso. Me conta: qual seu objetivo?"

RESPONDA COMO SARA HUMANA E ESPECIALISTA:
`;

    const response = await this.apiManager.invoke([
      { role: "system", content: openPrompt },
      { role: "user", content: userMessage }
    ]);

    return this.formatResponse(response.content, "sara_open");
  }

  // 🔍 Detecta o tipo específico de abertura do cliente
  detectOpennessType(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('dúvida') || lowerMsg.includes('pergunta')) {
      return "Cliente tem dúvida específica - preparar para resposta técnica";
    }
    if (lowerMsg.includes('ajuda') || lowerMsg.includes('auxílio')) {
      return "Cliente precisa de orientação - posicionar como consultora";
    }
    if (lowerMsg.includes('informação') || lowerMsg.includes('saber')) {
      return "Cliente quer se informar - educar com valor";
    }
    if (lowerMsg.includes('conversar') || lowerMsg.includes('falar')) {
      return "Cliente quer diálogo - criar conexão genuína";
    }
    
    return "Abertura geral - qualificar necessidade com empatia";
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

  // 👋 SAUDAÇÃO INTELIGENTE E HUMANIZADA
  async handleGreetingOrGeneric(userMessage, intentionAnalysis) {
    // 🧠 Analisa o contexto da saudação
    const greetingContext = this.analyzeGreetingContext(userMessage);
    
    const greetingPrompt = `
Você é a Sara, especialista em marketing digital da Ronald Digital. O cliente te cumprimentou.

SAUDAÇÃO DO CLIENTE: "${userMessage}"
GATILHO: "${intentionAnalysis.trigger}"
CONTEXTO: ${greetingContext}

PERSONALIDADE DA SARA:
- Calorosa mas profissional
- Especialista acessível
- Genuinamente interessada em ajudar
- Linguagem natural e moderna
- Foca em descobrir como pode ajudar

ESTRATÉGIA DE PRIMEIRA IMPRESSÃO:
1. Retribua o cumprimento com energia positiva
2. Apresente-se de forma interessante (não robótica)
3. Desperte curiosidade sobre seus serviços
4. Faça pergunta inteligente para descobrir necessidade
5. Crie conexão genuína

EXEMPLOS DE RESPOSTAS NATURAIS:
- "Oi! Que bom te ver por aqui! 😊 Sou a Sara, especialista em criar sites que realmente vendem. Como posso te ajudar hoje?"
- "Olá! Prazer em te conhecer! Sou a Sara da Ronald Digital. Trabalho ajudando negócios a crescerem online. Qual seu projeto?"
- "Oi! Fico feliz em te atender! Sou especialista em transformar ideias em sites incríveis. Me conta: que tipo de negócio você tem?"

RESPONDA COMO SARA HUMANA E CARISMÁTICA:
`;

    const response = await this.apiManager.invoke([
      { role: "system", content: greetingPrompt },
      { role: "user", content: userMessage }
    ]);

    return this.formatResponse(response.content, "sara_greeting");
  }

  // 🔍 Analisa o contexto específico da saudação
  analyzeGreetingContext(message) {
    const lowerMsg = message.toLowerCase();
    const hour = new Date().getHours();
    
    let timeContext = "";
    if (hour >= 6 && hour < 12) timeContext = "manhã";
    else if (hour >= 12 && hour < 18) timeContext = "tarde";
    else timeContext = "noite";
    
    if (lowerMsg.includes('bom dia') || lowerMsg.includes('boa tarde') || lowerMsg.includes('boa noite')) {
      return `Cliente educado, usa saudação formal - período: ${timeContext}`;
    }
    if (lowerMsg.includes('oi') || lowerMsg.includes('olá')) {
      return `Cliente casual e amigável - período: ${timeContext}`;
    }
    if (lowerMsg.includes('e aí') || lowerMsg.includes('beleza')) {
      return `Cliente muito informal - período: ${timeContext}`;
    }
    
    return `Saudação genérica - período: ${timeContext}`;
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

  // ✨ FORMATA RESPOSTA COM PERSONALIDADE HUMANIZADA
  formatResponse(content, agentType) {
    // Remove marcadores internos da resposta
    let cleanContent = content.replace(/\[AGENTE_ATIVO:.*?\]/gi, '').trim();
    
    // 🎭 Aplica personalidade humanizada
    cleanContent = this.applyPersonalityToResponse(cleanContent, agentType);
    
    // 📝 Adiciona ao histórico
    this.conversationHistory.push({
      role: "assistant",
      content: cleanContent,
      agent: agentType,
      timestamp: new Date().toISOString(),
      leadScore: this.calculateLeadScore()
    });

    const leadScore = this.calculateLeadScore();
    const nextAction = this.determineNextAction();
    
    console.log(`✅ Resposta formatada | Agente: ${agentType} | Lead Score: ${leadScore} | Próxima Ação: ${nextAction}`);

    return {
      success: true,
      response: cleanContent,
      activeAgent: this.currentAgent,
      leadScore: leadScore,
      nextAction: nextAction,
      conversationStage: this.getConversationStage(),
      personality: agentType,
      confidence: this.getResponseConfidence(cleanContent)
    };
  }

  // 🎭 APLICA PERSONALIDADE HUMANIZADA À RESPOSTA
  applyPersonalityToResponse(content, agentType) {
    const personality = this.saraPersonality.personalidade;
    
    // Garante que não seja muito formal
    if (personality.tom_de_voz.formal < 50) {
      content = content.replace(/Prezado/g, 'Oi');
      content = content.replace(/Cordialmente/g, '😊');
      content = content.replace(/Atenciosamente/g, 'Abraços!');
    }
    
    // Adiciona emojis se necessário (mas não exagera)
    if (personality.linguagem.usa_emojis && !content.includes('😊') && !content.includes('🚀')) {
      if (content.includes('Ótimo') || content.includes('Perfeito')) {
        content = content.replace(/Ótimo/g, 'Ótimo! 😊');
        content = content.replace(/Perfeito/g, 'Perfeito! ✨');
      }
    }
    
    // Garante tom natural baseado no tipo de agente
    if (agentType === 'sara_direct') {
      // Resposta direta mas amigável
      if (!content.includes('!') && content.length < 200) {
        content = content.replace(/\.$/, '! 😊');
      }
    } else if (agentType === 'sara_price') {
      // Resposta sobre preços - confiante
      if (!content.includes('💰') && content.includes('R$')) {
        content = content.replace(/R\$/g, '💰 R$');
      }
    }
    
    return content;
  }

  // 📊 CALCULA CONFIANÇA DA RESPOSTA
  getResponseConfidence(content) {
    let confidence = 0.7; // Base
    
    // Aumenta confiança se tem informações específicas
    if (content.includes('R$')) confidence += 0.1;
    if (content.includes('dias')) confidence += 0.1;
    if (content.includes('Ronald Digital')) confidence += 0.1;
    
    // Diminui se muito genérica
    if (content.length < 50) confidence -= 0.2;
    if (content.includes('Como posso ajudar')) confidence -= 0.1;
    
    return Math.min(Math.max(confidence, 0.3), 1.0);
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