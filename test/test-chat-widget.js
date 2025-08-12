// Teste para simular o comportamento do ChatWidget corrigido
import { SaraAI } from "../lib/agents/saraAI.js";
import dotenv from "dotenv";

dotenv.config();

async function testarChatWidget() {
  console.log("🔧 Testando ChatWidget Corrigido\n");

  const sara = new SaraAI();

  // Simula exatamente o que acontecia no seu site
  const problematicCases = [
    {
      nome: "Caso 1: Saudação Simples",
      mensagem: "ola",
      expectativa: "Deve responder à saudação, não perguntar sobre tipo de negócio"
    },
    {
      nome: "Caso 2: Saudação Formal",
      mensagem: "bom dia",
      expectativa: "Deve cumprimentar de volta"
    },
    {
      nome: "Caso 3: Saudação Tarde",
      mensagem: "boa tarde",
      expectativa: "Deve responder à saudação, não pular para orçamento"
    },
    {
      nome: "Caso 4: Saudação Noite",
      mensagem: "boa noite",
      expectativa: "Deve responder à saudação, não dar análise de projeto"
    }
  ];

  for (let i = 0; i < problematicCases.length; i++) {
    const testCase = problematicCases[i];
    console.log(`\n${i + 1}. ${testCase.nome}`);
    console.log("=".repeat(50));
    console.log(`Mensagem: "${testCase.mensagem}"`);
    console.log(`Expectativa: ${testCase.expectativa}`);

    try {
      // Reinicia a conversa para cada teste (como no ChatWidget)
      sara.resetConversation();
      
      // Simula a chamada da API como no ChatWidget corrigido
      const resultado = await sara.processMessage(testCase.mensagem, {
        nome: 'Cliente Chat',
        email: 'cliente@chat.com',
        tipoServico: ''
      });

      console.log("\n✅ Nova Resposta da Sara:");
      console.log(`"${resultado.response}"`);
      
      // Verifica se a resposta é adequada
      const response = resultado.response.toLowerCase();
      const message = testCase.mensagem.toLowerCase();
      
      let isAppropriate = false;
      
      if (message.includes('ola') || message.includes('bom dia') || message.includes('boa tarde') || message.includes('boa noite')) {
        // Para saudações, deve cumprimentar de volta
        isAppropriate = response.includes('olá') || response.includes('oi') || response.includes('bom dia') || response.includes('boa tarde') || response.includes('boa noite');
      }
      
      console.log(`\n📊 Análise: ${isAppropriate ? '✅ ADEQUADA' : '❌ INADEQUADA'}`);
      console.log(`Agente Ativo: ${resultado.activeAgent}`);
      console.log(`Lead Score: ${resultado.leadScore}`);
      
    } catch (error) {
      console.error("❌ Erro no teste:", error.message);
    }

    console.log("\n" + "-".repeat(50));
  }

  // Teste de conversa sequencial (como acontece no chat real)
  console.log(`\n🔄 TESTE DE CONVERSA SEQUENCIAL`);
  console.log("=".repeat(60));
  
  try {
    sara.resetConversation();
    
    console.log("\n👤 Cliente: ola");
    let resultado = await sara.processMessage("ola", { nome: "Cliente", email: "cliente@chat.com" });
    console.log(`🤖 Sara: "${resultado.response}"`);
    
    console.log("\n👤 Cliente: bom dia");
    resultado = await sara.processMessage("bom dia");
    console.log(`🤖 Sara: "${resultado.response}"`);
    
    console.log("\n👤 Cliente: boa tarde");
    resultado = await sara.processMessage("boa tarde");
    console.log(`🤖 Sara: "${resultado.response}"`);
    
  } catch (error) {
    console.error("❌ Erro no teste sequencial:", error.message);
  }

  console.log("\n🎉 Teste do ChatWidget concluído!");
  console.log("\n📋 RESUMO DAS CORREÇÕES:");
  console.log("- ✅ ChatWidget agora usa API real da Sara AI");
  console.log("- ✅ Removida lógica robótica de múltiplos especialistas");
  console.log("- ✅ Implementada escuta ativa");
  console.log("- ✅ Respostas adaptativas baseadas na intenção");
  console.log("\n🚀 DEPLOY NECESSÁRIO para aplicar as mudanças no site!");
}

testarChatWidget().catch(console.error);