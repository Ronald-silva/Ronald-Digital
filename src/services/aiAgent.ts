// Serviço do Agente de IA - Implementação Simples e Robusta
export interface AgentRequest {
  nome: string;
  email: string;
  mensagem: string;
  tipoServico?: string;
  telefone?: string;
  orcamento?: string;
  prazo?: string;
}

export interface AgentResponse {
  success: boolean;
  resposta: string;
  leadScore: number;
  classificacao: 'QUENTE' | 'MORNO' | 'FRIO';
  proximaAcao: string;
  error?: string;
}

// Configuração da API
const getApiConfig = () => {
  // Tenta Grok primeiro, depois OpenAI
  const grokKey = import.meta.env.VITE_GROK_API_KEY;
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (grokKey) {
    return {
      apiKey: grokKey,
      baseURL: 'https://api.x.ai/v1',
      model: 'grok-beta'
    };
  } else if (openaiKey) {
    return {
      apiKey: openaiKey,
      baseURL: 'https://api.openai.com/v1',
      model: 'gpt-3.5-turbo'
    };
  }
  
  return null;
};

// Prompt do especialista em vendas
const createPrompt = (data: AgentRequest) => {
  return `Você é um especialista em vendas de sites e desenvolvimento web, combinando a expertise de Neil Patel (marketing), Jill Konrath (qualificação) e Gary Vaynerchuk (vendas).

DADOS DO CLIENTE:
- Nome: ${data.nome}
- Email: ${data.email}
- Telefone: ${data.telefone || 'Não informado'}
- Tipo de Serviço: ${data.tipoServico || 'Não especificado'}
- Orçamento: ${data.orcamento || 'Não informado'}
- Prazo: ${data.prazo || 'Não informado'}
- Mensagem: ${data.mensagem}

SERVIÇOS DISPONÍVEIS:
- Landing Page: R$ 500-1.000 (conversão e captação de leads)
- Portfólio: R$ 400-800 (credibilidade profissional)
- Site/Blog: R$ 800-2.000 (autoridade e SEO)
- E-commerce: R$ 1.200-3.000 (vendas online)

SUA MISSÃO:
1. Analise o perfil do cliente usando critérios BANT (Budget, Authority, Need, Timeline)
2. Classifique como QUENTE (3-4 critérios), MORNO (2 critérios) ou FRIO (0-1 critério)
3. Responda de forma consultiva, educativa e amigável
4. Faça perguntas estratégicas se necessário
5. Sugira a solução mais adequada
6. Crie urgência sutil se for lead quente

PERSONALIDADE:
- Consultivo, não agressivo
- Educativo e profissional
- Focado em valor, não apenas preço
- Empático e compreensivo

RESPONDA EM PORTUGUÊS BRASILEIRO de forma natural e conversacional.`;
};

// Função principal do agente
export const processarComAgente = async (data: AgentRequest): Promise<AgentResponse> => {
  try {
    const config = getApiConfig();
    
    if (!config) {
      return {
        success: false,
        resposta: "Olá! Obrigado pelo seu interesse. Nosso assistente de IA não está disponível no momento, mas nossa equipe recebeu sua mensagem e entrará em contato em breve. Para urgências, entre em contato via WhatsApp: (85) 99199-3833",
        leadScore: 0,
        classificacao: 'FRIO',
        proximaAcao: 'contato_manual',
        error: 'API não configurada'
      };
    }

    const prompt = createPrompt(data);
    
    const response = await fetch(`${config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: `Analise meu perfil e me ajude com meu projeto: ${data.mensagem}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    const aiResponse = result.choices[0].message.content;

    // Calcula score do lead
    const leadScore = calcularLeadScore(data, aiResponse);
    const classificacao = getClassificacao(leadScore);
    const proximaAcao = getProximaAcao(leadScore);

    return {
      success: true,
      resposta: aiResponse,
      leadScore,
      classificacao,
      proximaAcao
    };

  } catch (error) {
    console.error('Erro no agente de IA:', error);
    
    // Fallback inteligente baseado nos dados
    const fallbackResponse = gerarRespostaFallback(data);
    
    return {
      success: true, // Mantém como success para não quebrar o fluxo
      resposta: fallbackResponse.resposta,
      leadScore: fallbackResponse.leadScore,
      classificacao: fallbackResponse.classificacao,
      proximaAcao: fallbackResponse.proximaAcao,
      error: 'Usando resposta fallback'
    };
  }
};

// Calcula score do lead baseado nos dados
const calcularLeadScore = (data: AgentRequest, aiResponse: string): number => {
  let score = 0;
  
  // Budget (0-1 ponto)
  if (data.orcamento || data.mensagem.toLowerCase().includes('orçamento') || 
      data.mensagem.toLowerCase().includes('preço') || data.mensagem.toLowerCase().includes('valor')) {
    score += 1;
  }
  
  // Authority (0-1 ponto) - assume que quem preenche tem autoridade
  if (data.nome && data.email) {
    score += 1;
  }
  
  // Need (0-1 ponto)
  if (data.tipoServico || data.mensagem.length > 30) {
    score += 1;
  }
  
  // Timeline (0-1 ponto)
  if (data.prazo || data.mensagem.toLowerCase().includes('prazo') || 
      data.mensagem.toLowerCase().includes('urgente') || data.mensagem.toLowerCase().includes('rápido')) {
    score += 1;
  }
  
  return score;
};

// Classifica o lead
const getClassificacao = (score: number): 'QUENTE' | 'MORNO' | 'FRIO' => {
  if (score >= 3) return 'QUENTE';
  if (score >= 2) return 'MORNO';
  return 'FRIO';
};

// Define próxima ação
const getProximaAcao = (score: number): string => {
  if (score >= 3) return 'fechar_venda';
  if (score >= 2) return 'agendar_reuniao';
  return 'nutrir_lead';
};

// Resposta fallback inteligente quando IA não está disponível
const gerarRespostaFallback = (data: AgentRequest) => {
  const leadScore = calcularLeadScore(data, '');
  const classificacao = getClassificacao(leadScore);
  
  let resposta = `Olá ${data.nome}! Obrigado pelo seu interesse em nossos serviços. `;
  
  // Resposta baseada no tipo de serviço
  if (data.tipoServico) {
    switch (data.tipoServico.toLowerCase()) {
      case 'landing-page':
        resposta += `Vi que você tem interesse em Landing Pages. É uma excelente escolha para converter visitantes em clientes! Nossos projetos de Landing Page ficam entre R$ 500-1.000 e são entregues em 5-7 dias úteis.`;
        break;
      case 'portfolio':
        resposta += `Portfólios são fundamentais para mostrar credibilidade! Criamos portfólios profissionais por R$ 400-800, entregues em 3-5 dias úteis.`;
        break;
      case 'e-commerce':
        resposta += `E-commerce é o futuro das vendas! Desenvolvemos lojas online completas por R$ 1.200-3.000, com integração de pagamento e gestão de estoque.`;
        break;
      default:
        resposta += `Baseado no seu interesse em ${data.tipoServico}, posso criar uma solução personalizada para seu negócio.`;
    }
  } else {
    resposta += `Analisando sua mensagem, posso sugerir a melhor solução para seu projeto.`;
  }
  
  // Adiciona call-to-action baseado na classificação
  if (classificacao === 'QUENTE') {
    resposta += ` Vou entrar em contato nas próximas horas para agendar uma conversa de 15 minutos e detalhar sua proposta personalizada!`;
  } else if (classificacao === 'MORNO') {
    resposta += ` Que tal agendar uma conversa rápida para entender melhor suas necessidades? Posso criar uma proposta sob medida para você.`;
  } else {
    resposta += ` Enviei algumas informações para seu email. Qualquer dúvida, estou à disposição!`;
  }
  
  resposta += `\n\n📱 WhatsApp: (85) 99199-3833\n📧 Email: ronald.digital27@gmail.com`;
  
  return {
    resposta,
    leadScore,
    classificacao,
    proximaAcao: getProximaAcao(leadScore)
  };
};

// Verifica se o agente está configurado
export const isAgentConfigured = (): boolean => {
  return !!(import.meta.env.VITE_GROK_API_KEY || import.meta.env.VITE_OPENAI_API_KEY);
};

// Retorna configuração atual
export const getAgentConfig = () => {
  return {
    hasGrok: !!import.meta.env.VITE_GROK_API_KEY,
    hasOpenAI: !!import.meta.env.VITE_OPENAI_API_KEY,
    isConfigured: isAgentConfigured()
  };
};