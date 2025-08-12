// Teste específico do Gemini API (rode com: node test/test-gemini.js)
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env
dotenv.config();

async function testarGemini() {
  console.log("🔮 Testando integração com Gemini API...\n");

  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY não configurada no .env");
    console.log("💡 Adicione sua chave do Gemini no arquivo .env:");
    console.log("GEMINI_API_KEY=sua_chave_aqui");
    return;
  }

  try {
    // Inicializa o Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    });

    console.log("✅ Gemini API inicializada com sucesso!");

    // Teste simples
    const prompt = `
Você é a Sara, uma assistente de IA especializada em vendas da Ronald Digital.

TESTE: Responda de forma amigável e profissional para o seguinte cliente:
"Olá, estou interessado em criar um site para minha empresa. Podem me ajudar?"

Seja calorosa, profissional e ofereça ajuda específica.
`;

    console.log("🤖 Enviando prompt de teste...");
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("\n💬 Resposta do Gemini:");
    console.log("─".repeat(60));
    console.log(text);
    console.log("─".repeat(60));

    console.log("\n✅ Teste do Gemini concluído com sucesso!");
    console.log("🎉 A Sara AI agora pode usar o Gemini como provider principal!");

  } catch (error) {
    console.error("❌ Erro no teste do Gemini:", error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log("\n💡 Dicas para resolver:");
      console.log("1. Verifique se a chave do Gemini está correta");
      console.log("2. Acesse: https://makersuite.google.com/app/apikey");
      console.log("3. Gere uma nova chave se necessário");
    }
  }
}

// Executa o teste
testarGemini().catch(console.error);