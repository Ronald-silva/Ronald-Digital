// Configurações centralizadas da Sara AI
export const SARA_CONFIG = {
  // Configurações da API
  api: {
    maxTokens: 800,
    temperature: 0.7,
    model: {
      grok: "grok-beta",
      openai: "gpt-3.5-turbo",
      gemini: "gemini-1.5-flash"
    },
    priority: ["gemini", "grok", "openai"] // Ordem de prioridade das APIs
  },

  // Configurações de scoring
  leadScoring: {
    maxScore: 4,
    thresholds: {
      hot: 3,
      warm: 2,
      cold: 1
    },
    weights: {
      budget: 1,
      authority: 1,
      need: 1,
      timeline: 1
    }
  },

  // Configurações de preços para respostas dinâmicas
  pricing: {
    landingPage: {
      min: 400,
      max: 1000,
      prazo: "5-7 dias úteis"
    },
    portfolio: {
      min: 400,
      max: 800,
      prazo: "3-5 dias úteis"
    },
    siteCompleto: {
      min: 800,
      max: 2000,
      prazo: "7-14 dias úteis"
    }
  },

  // Gatilhos para roteamento de agentes
  triggers: {
    rackham: [
      "não sei o que preciso",
      "estou com um problema",
      "quais opções",
      "preciso de ajuda",
      "não tenho certeza",
      "qual a melhor",
      "me ajude a escolher"
    ],
    konrath: [
      "quanto custa",
      "preço",
      "orçamento",
      "prazo",
      "quanto tempo",
      "especificações",
      "funcionalidades",
      "valor",
      "investimento"
    ],
    vaynerchuk: [
      "quero saber mais",
      "me envie",
      "gostei",
      "interessante",
      "obrigado",
      "material",
      "conteúdo",
      "case",
      "exemplo"
    ]
  },

  // Ações baseadas no lead score
  nextActions: {
    4: "fechar_venda",
    3: "fechar_venda", 
    2: "agendar_reuniao",
    1: "continuar_qualificacao",
    0: "nutrir_lead"
  },

  // Estágios da conversa
  conversationStages: {
    inicial: "Primeiro contato",
    descoberta: "Descobrindo necessidades",
    qualificacao: "Qualificando lead",
    relacionamento: "Construindo relacionamento",
    proposta: "Apresentando proposta",
    fechamento: "Fechando venda"
  },

  // Informações de contato da empresa
  businessInfo: {
    email: "ronald.digital27@gmail.com",
    phone: "5585991993833",
    website: "https://ronald-digital.vercel.app",
    portfolio: "https://ronald-digital.vercel.app/portfolio"
  }
};

// Função para obter configuração de preço baseada no tipo de serviço
export function getPricingInfo(serviceType) {
  const type = serviceType?.toLowerCase();
  
  if (type?.includes('landing')) {
    return SARA_CONFIG.pricing.landingPage;
  }
  
  if (type?.includes('portfolio') || type?.includes('portfólio')) {
    return SARA_CONFIG.pricing.portfolio;
  }
  
  return SARA_CONFIG.pricing.siteCompleto;
}

// Função para determinar próxima ação baseada no score
export function getNextAction(leadScore) {
  return SARA_CONFIG.nextActions[leadScore] || "nutrir_lead";
}

// Função para classificar lead baseado no score
export function getLeadClassification(leadScore) {
  if (leadScore >= SARA_CONFIG.leadScoring.thresholds.hot) return "QUENTE";
  if (leadScore >= SARA_CONFIG.leadScoring.thresholds.warm) return "MORNO";
  return "FRIO";
}

// Função para detectar gatilhos na mensagem
export function detectTriggers(message) {
  const lowerMessage = message.toLowerCase();
  
  for (const [agent, triggers] of Object.entries(SARA_CONFIG.triggers)) {
    for (const trigger of triggers) {
      if (lowerMessage.includes(trigger)) {
        return agent;
      }
    }
  }
  
  return null;
}