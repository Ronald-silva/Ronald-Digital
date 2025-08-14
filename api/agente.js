import { SaraAI } from "../../lib/agents/saraAI.js";
import cors from "cors";

// Configuração CORS
const corsOptions = {
  origin: process.env.VERCEL_URL || "*",
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Middleware CORS
function runCors(req, res) {
  return new Promise((resolve, reject) => {
    cors(corsOptions)(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Aplica CORS
  await runCors(req, res);

  // Só aceita POST
  if (req.method !== "POST") {
    return res.status(405).json({ 
      error: "Método não permitido",
      message: "Use POST para enviar dados do formulário" 
    });
  }

  try {
    // Valida dados do formulário
    const { nome, email, mensagem, tipoServico } = req.body;
    
    if (!nome || !email || !mensagem) {
      return res.status(400).json({
        error: "Dados obrigatórios ausentes",
        message: "Nome, email e mensagem são obrigatórios"
      });
    }

    // Valida email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Email inválido",
        message: "Forneça um email válido"
      });
    }

    // Log para debug (remover em produção)
    console.log("Processando lead:", { nome, email, tipoServico });

    // Inicializa a Sara AI com escuta ativa
    const sara = new SaraAI();
    
    // Processa a mensagem com a nova lógica de escuta ativa
    const resultado = await sara.processMessage(mensagem, {
      nome,
      email,
      tipoServico
    });

    // Log do resultado (remover em produção)
    console.log("Resultado do agente:", resultado);

    // Retorna resposta da Sara AI
    if (resultado.success) {
      return res.status(200).json({
        success: true,
        resposta: resultado.response, // Sara AI usa 'response' em vez de 'resposta'
        etapa: resultado.conversationStage,
        leadScore: resultado.leadScore,
        proximaAcao: resultado.nextAction,
        agenteAtivo: resultado.activeAgent,
        timestamp: new Date().toISOString()
      });
    } else {
      return res.status(500).json({
        success: false,
        error: resultado.error,
        resposta: resultado.response || "Erro interno do sistema"
      });
    }

  } catch (error) {
    console.error("Erro na API do agente:", error);
    
    // 🔄 FALLBACK INTELIGENTE QUANDO SARA AI FALHA
    const fallbackResponse = getIntelligentFallback(mensagem, { nome, email, tipoServico });
    
    return res.status(200).json({
      success: true,
      resposta: fallbackResponse,
      etapa: "fallback",
      leadScore: calculateFallbackLeadScore(mensagem),
      proximaAcao: "continuar_qualificacao",
      agenteAtivo: "sara_fallback",
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
}

// 🧠 FALLBACK INTELIGENTE DA API
function getIntelligentFallback(message, userInfo) {
  const lowerMsg = message.toLowerCase().trim();
  const nome = userInfo.nome || 'Cliente';
  
  console.log(`🔄 FALLBACK API ativo para: "${message}"`);
  
  // 🎯 ESPECIFICAÇÃO DETALHADA DE PROJETO
  if ((lowerMsg.includes('quero') || lowerMsg.includes('preciso')) && lowerMsg.includes('loja') && lowerMsg.includes('roupas')) {
    return `Perfeito, ${nome}! Loja de roupas multimarcas é um segmento incrível! 👗✨

Para lojas de moda online, recomendo um e-commerce completo com:

🛍️ **Funcionalidades Essenciais:**
• Catálogo organizado por categoria/marca
• Sistema de filtros (tamanho, cor, preço)
• Carrinho de compras otimizado
• Integração com redes sociais
• Área administrativa para controle de estoque

📈 **Resultados Comprovados:**
Uma cliente nossa aumentou as vendas em 250% no primeiro mês!

💰 **Investimento:** R$ 1.200-2.500
⏰ **Prazo:** 10-15 dias

Qual seu orçamento disponível para esse projeto?`;
  }

  // 🍕 RESTAURANTE
  if (lowerMsg.includes('restaurante')) {
    return `Que ótimo, ${nome}! Restaurante é um segmento que vende muito online! 🍕

Para restaurantes, recomendo:
• Cardápio digital interativo
• Sistema de pedidos online
• Integração com delivery
• Área de reservas

💰 **Investimento:** R$ 800-1.800
⏰ **Prazo:** 7-12 dias

Qual seu orçamento disponível?`;
  }

  // 👋 PERGUNTAS PESSOAIS
  if (lowerMsg.includes('qual seu nome') || lowerMsg.includes('quem é você')) {
    return `Oi ${nome}! Eu sou a Sara! 😊

Sou especialista em marketing digital da Ronald Digital. Meu trabalho é te ajudar a criar sites incríveis que realmente vendem!

Como posso te ajudar hoje?`;
  }

  // 💰 PERGUNTAS SOBRE PREÇOS
  if (lowerMsg.includes('preço') || lowerMsg.includes('valor') || lowerMsg.includes('custa')) {
    return `Ótima pergunta, ${nome}! 💰 Nossos preços são super justos:

🎯 **Landing Pages:** R$ 500-1.000
🎨 **Portfólios:** R$ 400-800  
🛍️ **E-commerce:** R$ 1.200-2.500
🌐 **Sites Completos:** R$ 800-2.000

✨ **Parcelamos em até 3x sem juros!**

Que tipo de projeto você precisa?`;
  }

  // 🎯 INTERESSE GERAL
  if (lowerMsg.includes('quero') || lowerMsg.includes('preciso') || lowerMsg.includes('site')) {
    return `Que ótimo, ${nome}! Fico feliz em te ajudar! 🚀

Para criar a proposta perfeita, me conta:
• Que tipo de negócio você tem?
• Qual seu orçamento disponível?
• Para quando você precisa?

Com essas informações, posso criar algo incrível para você!`;
  }

  // 👋 SAUDAÇÕES
  if (lowerMsg.includes('oi') || lowerMsg.includes('olá') || lowerMsg.includes('boa tarde')) {
    return `Oi ${nome}! Que bom te conhecer! 😊

Sou a Sara, especialista em criar sites que realmente vendem! 

Como posso te ajudar hoje? Precisa de:
• Site profissional?
• Landing page?
• E-commerce?`;
  }

  // 🔄 RESPOSTA PADRÃO
  return `Oi ${nome}! 😊

Para te ajudar da melhor forma, me conta:
• Que tipo de projeto você precisa?
• Para que tipo de negócio?

Assim posso criar a proposta perfeita para você! 🚀`;
}

// 📊 CALCULA LEAD SCORE NO FALLBACK
function calculateFallbackLeadScore(message) {
  const lowerMsg = message.toLowerCase();
  let score = 0;
  
  // Interesse específico
  if (lowerMsg.includes('quero') || lowerMsg.includes('preciso')) score += 1;
  
  // Especificação de projeto
  if (lowerMsg.includes('loja') || lowerMsg.includes('site') || lowerMsg.includes('landing')) score += 1;
  
  // Detalhes específicos
  if (lowerMsg.includes('roupas') || lowerMsg.includes('restaurante')) score += 1;
  
  // Urgência
  if (lowerMsg.includes('urgente') || lowerMsg.includes('rápido')) score += 1;
  
  return Math.min(score, 4);
}
}

// Configuração para Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb"
    },
    responseLimit: "8mb"
  }
};