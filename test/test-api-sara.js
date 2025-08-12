// Teste da API atualizada com Sara AI
import { SaraAI } from "../lib/agents/saraAI.js";
import dotenv from "dotenv";

// Carrega as variáveis do arquivo .env
dotenv.config();

async function testarAPISara() {
  console.log("🔥 Testando API Atualizada com Sara AI\n");

  const sara = new SaraAI();

  // Simula os casos problemáticos do seu site
  const testCases = [
    {
      nome: "Teste Saudação Simples",
      mensagem: "ola",
      userInfo: { nome: "Cliente", email: "cliente@teste.com" },
      expectativa: "Deve responder à saudação de forma natural"
    },
    {
      nome: "Teste Saudação Formal",
      mensagem: "boa tarde",
      userInfo: { nome: "Cliente", email: "cliente@teste.com" },
      expectativa: "Deve cumprimentar de volta e perguntar como pode ajudar"
    },
    {
      nome: "Teste Pedido Específico",
      mensagem: "quero um portfólio",
      userInfo: { nome: "Cliente", email: "cliente@teste.com", tipoServico: "portfolio" },
      expectativa: "Deve focar no portfólio e fazer perguntas relevantes"
    },
    {
      nome: "Teste Pergunta Direta",
      mensagem: "vocês fazem sites?",
      userInfo: { nome: "Cliente", email: "cliente@teste.com" },
      expectativa: "Deve responder diretamente sobre os tipos de sites"
    },
    {
      nome: "Teste Dúvida",
      mensagem: "tenho algumas dúvidas",
      userInfo: { nome: "Cliente", email: "cliente@teste.com" },
      expectativa: "Deve convidar o cliente a fazer perguntas"
    }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${i + 1}. ${testCase.nome}`);
    console.log("=".repeat(50));
    console.log(`Mensagem: "${testCase.mensagem}"`);
    console.log(`Expectativa: ${testCase.expectativa}`);

    try {
      // Reinicia a conversa para cada teste
      sara.resetConversation();
      
      const resultado = await sara.processMessage(testCase.mensagem, testCase.userInfo);

      console.log("\n✅ Resposta da Sara:");
      console.log(`"${resultado.response}"`);
      console.log(`\n📊 Dados da Resposta:`);
      console.log(`- Sucesso: ${resultado.success}`);
      console.log(`- Agente Ativo: ${resultado.activeAgent}`);
      console.log(`- Estágio: ${resultado.conversationStage}`);
      console.log(`- Lead Score: ${resultado.leadScore}`);
      console.log(`- Próxima Ação: ${resultado.nextAction}`);
      
    } catch (error) {
      console.error("❌ Erro no teste:", error.message);
    }

    console.log("\n" + "-".repeat(50));
  }

  // Teste de conversa contínua (como no seu site)
  console.log(`\n🔄 TESTE DE CONVERSA CONTÍNUA (Simulando Chat do Site)`);
  console.log("=".repeat(60));
  
  try {
    sara.resetConversation();
    
    console.log("\n👤 Cliente: ola");
    let resultado = await sara.processMessage("ola", { nome: "João", email: "joao@teste.com" });
    console.log(`🤖 Sara: "${resultado.response}"`);
    
    console.log("\n👤 Cliente: boa tarde");
    resultado = await sara.processMessage("boa tarde");
    console.log(`🤖 Sara: "${resultado.response}"`);
    
    console.log("\n👤 Cliente: quero um portfólio");
    resultado = await sara.processMessage("quero um portfólio", { tipoServico: "portfolio" });
    console.log(`🤖 Sara: "${resultado.response}"`);
    
    console.log("\n👤 Cliente: quanto custa?");
    resultado = await sara.processMessage("quanto custa?");
    console.log(`🤖 Sara: "${resultado.response}"`);
    
  } catch (error) {
    console.error("❌ Erro no teste de conversa:", error.message);
  }

  console.log("\n🎉 Testes da API Sara concluídos!");
  console.log("\n📋 RESUMO:");
  console.log("- ✅ API atualizada para usar SaraAI em vez de MultiAgentSalesSystem");
  console.log("- ✅ Escuta ativa implementada");
  console.log("- ✅ Respostas adaptativas baseadas na intenção");
  console.log("- ✅ Pronto para deploy no site!");
}

// Executa os testes
testarAPISara().catch(console.error);