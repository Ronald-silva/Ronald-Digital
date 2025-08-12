// Teste específico para validar a nova lógica de escuta ativa da Sara
import { SaraAI } from "../lib/agents/saraAI.js";
import dotenv from "dotenv";

// Carrega as variáveis do arquivo .env
dotenv.config();

async function testarEscutaAtiva() {
  console.log("🎯 Testando Nova Lógica de Escuta Ativa da Sara\n");

  const sara = new SaraAI();

  // Casos de teste para validar as prioridades
  const testCases = [
    {
      categoria: "PRIORIDADE MÁXIMA - Perguntas Diretas",
      casos: [
        {
          nome: "Pergunta sobre produto não oferecido",
          mensagem: "Vocês vendem computadores?",
          expectativa: "Deve responder diretamente que não vende computadores e explicar o que oferece"
        },
        {
          nome: "Pergunta sobre serviços",
          mensagem: "Que tipo de sites vocês fazem?",
          expectativa: "Deve explicar os tipos de sites oferecidos"
        },
        {
          nome: "Pergunta sobre trabalho",
          mensagem: "Vocês trabalham com e-commerce?",
          expectativa: "Deve responder sobre capacidades de e-commerce"
        }
      ]
    },
    {
      categoria: "PRIORIDADE ALTA - Expressões de Dúvida",
      casos: [
        {
          nome: "Cliente com dúvidas",
          mensagem: "Preciso tirar algumas dúvidas",
          expectativa: "Deve convidar o cliente a fazer perguntas"
        },
        {
          nome: "Cliente pedindo ajuda",
          mensagem: "Me ajuda com uma coisa?",
          expectativa: "Deve demonstrar disponibilidade para ajudar"
        },
        {
          nome: "Cliente com pergunta",
          mensagem: "Tenho uma pergunta importante",
          expectativa: "Deve encorajar o cliente a perguntar"
        }
      ]
    },
    {
      categoria: "PRIORIDADE BAIXA - Saudações",
      casos: [
        {
          nome: "Saudação simples",
          mensagem: "Oi",
          expectativa: "Deve cumprimentar e iniciar qualificação sutil"
        },
        {
          nome: "Saudação formal",
          mensagem: "Boa tarde",
          expectativa: "Deve cumprimentar e perguntar como pode ajudar"
        },
        {
          nome: "Saudação casual",
          mensagem: "E aí, tudo bem?",
          expectativa: "Deve responder de forma amigável e iniciar conversa"
        }
      ]
    }
  ];

  for (const categoria of testCases) {
    console.log(`\n📋 ${categoria.categoria}`);
    console.log("=".repeat(60));

    for (let i = 0; i < categoria.casos.length; i++) {
      const caso = categoria.casos[i];
      console.log(`\n${i + 1}. ${caso.nome}`);
      console.log(`Mensagem: "${caso.mensagem}"`);
      console.log(`Expectativa: ${caso.expectativa}`);
      
      try {
        // Reinicia a conversa para cada teste
        sara.resetConversation();
        
        const resultado = await sara.processMessage(caso.mensagem, {
          nome: "Cliente Teste",
          email: "teste@email.com"
        });

        console.log("✅ Resposta da Sara:");
        console.log(`"${resultado.response}"`);
        console.log(`Agente Ativo: ${resultado.activeAgent}`);
        console.log(`Estágio: ${resultado.conversationStage}`);
        
      } catch (error) {
        console.error("❌ Erro no teste:", error.message);
      }

      console.log("-".repeat(40));
    }
  }

  // Teste de continuação de conversa
  console.log(`\n📋 TESTE DE CONTINUAÇÃO DE CONVERSA`);
  console.log("=".repeat(60));
  
  try {
    sara.resetConversation();
    
    console.log("\n1. Primeira mensagem (saudação):");
    let resultado = await sara.processMessage("Oi, tudo bem?");
    console.log(`Sara: "${resultado.response}"`);
    
    console.log("\n2. Segunda mensagem (pergunta direta):");
    resultado = await sara.processMessage("Vocês fazem landing pages?");
    console.log(`Sara: "${resultado.response}"`);
    
    console.log("\n3. Terceira mensagem (dúvida):");
    resultado = await sara.processMessage("Tenho uma dúvida sobre preços");
    console.log(`Sara: "${resultado.response}"`);
    
  } catch (error) {
    console.error("❌ Erro no teste de continuação:", error.message);
  }

  console.log("\n🎉 Testes de Escuta Ativa concluídos!");
  console.log("\n📊 RESUMO DOS TESTES:");
  console.log("- Prioridade Máxima: Perguntas diretas sobre negócio");
  console.log("- Prioridade Alta: Expressões de dúvida ou abertura");
  console.log("- Prioridade Baixa: Saudações e mensagens genéricas");
  console.log("- Continuação: Fluxo de conversa adaptativo");
}

// Executa os testes
testarEscutaAtiva().catch(console.error);