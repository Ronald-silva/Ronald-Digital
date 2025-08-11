// Teste local do agente (rode com: node test/test-agent.js)
import { MultiAgentSalesSystem } from "../lib/agents/multiAgent.js";

// Mock das variáveis de ambiente para teste
process.env.OPENAI_API_KEY = "sua_chave_aqui"; // Substitua pela sua chave
process.env.BUSINESS_EMAIL = "ronald.digital27@gmail.com";
process.env.BUSINESS_PHONE = "5585991993833";

async function testarAgente() {
  console.log("🤖 Iniciando teste do Multi-Agente...\n");

  const multiAgent = new MultiAgentSalesSystem();

  // Casos de teste
  const testCases = [
    {
      nome: "João Silva",
      email: "joao@empresa.com",
      mensagem:
        "Preciso de uma landing page para minha loja de roupas. Tenho orçamento de R$ 800 e preciso para próxima semana.",
      tipoServico: "landing-page",
    },
    {
      nome: "Maria Santos",
      email: "maria@freelancer.com",
      mensagem:
        "Sou fotógrafa e quero um portfólio online para mostrar meus trabalhos.",
      tipoServico: "portfolio",
    },
    {
      nome: "Pedro Costa",
      email: "pedro@startup.com",
      mensagem: "Quero saber mais sobre sites com IA. Não tenho pressa.",
      tipoServico: "",
    },
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n📋 TESTE ${i + 1}: ${testCase.nome}`);
    console.log("=".repeat(50));

    try {
      const resultado = await multiAgent.processFormSubmission(testCase);

      console.log("✅ Resultado:");
      console.log(`Etapa: ${resultado.etapa}`);
      console.log(`Lead Score: ${resultado.leadScore || "N/A"}`);
      console.log(`Próxima Ação: ${resultado.proximaAcao || "N/A"}`);
      console.log("\n💬 Resposta do Agente:");
      console.log(resultado.resposta);
    } catch (error) {
      console.error("❌ Erro no teste:", error.message);
    }

    console.log("\n" + "=".repeat(50));
  }

  console.log("\n🎉 Testes concluídos!");
}

// Executa os testes
testarAgente().catch(console.error);
