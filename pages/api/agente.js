import { MultiAgentSalesSystem } from "../../lib/agents/multiAgent.js";
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

    // Inicializa o sistema multi-agente
    const multiAgent = new MultiAgentSalesSystem();
    
    // Processa o formulário
    const resultado = await multiAgent.processFormSubmission({
      nome,
      email, 
      mensagem,
      tipoServico
    });

    // Log do resultado (remover em produção)
    console.log("Resultado do agente:", resultado);

    // Retorna resposta
    if (resultado.success) {
      return res.status(200).json({
        success: true,
        resposta: resultado.resposta,
        etapa: resultado.etapa,
        leadScore: resultado.leadScore,
        proximaAcao: resultado.proximaAcao,
        timestamp: new Date().toISOString()
      });
    } else {
      return res.status(500).json({
        success: false,
        error: resultado.error,
        resposta: resultado.resposta
      });
    }

  } catch (error) {
    console.error("Erro na API do agente:", error);
    
    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
      resposta: "Desculpe, houve um problema técnico. Nossa equipe foi notificada e entraremos em contato em breve.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
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