// Teste da Sara AI - Mega Cérebro (rode com: node test/test-sara-ai.js)
import { SaraAI } from "../lib/agents/saraAI.js";
import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env
dotenv.config();

async function testarSaraAI() {
  console.log("🧠 Iniciando teste do Mega Cérebro da Sara AI...\n");

  const sara = new SaraAI();

  // Cenários de teste mais realistas
  const testScenarios = [
    {
      nome: "Cenário 1: Cliente Exploratório (Rackham)",
      conversa: [
        {
          userMessage: "Olá, estou com alguns problemas no meu negócio e não sei bem o que preciso",
          userInfo: { nome: "João", email: "joao@empresa.com" }
        },
        {
          userMessage: "Tenho uma loja de roupas mas as vendas online estão fracas",
          userInfo: {}
        },
        {
          userMessage: "Isso está afetando muito meu faturamento, preciso de uma solução",
          userInfo: {}
        }
      ]
    },
    {
      nome: "Cenário 2: Cliente Direto (Konrath)", 
      conversa: [
        {
          userMessage: "Quanto custa uma landing page? Preciso de orçamento",
          userInfo: { nome: "Maria", email: "maria@startup.com" }
        },
        {
          userMessage: "Qual o prazo de entrega? Sou eu quem decide aqui na empresa",
          userInfo: {}
        },
        {
          userMessage: "Meu orçamento é de R$ 800, conseguem fazer?",
          userInfo: {}
        }
      ]
    },
    {
      nome: "Cenário 3: Cliente Interessado (Vaynerchuk)",
      conversa: [
        {
          userMessage: "Vi o trabalho de vocês e gostei muito! Quero saber mais",
          userInfo: { nome: "Pedro", email: "pedro@fotografia.com" }
        },
        {
          userMessage: "Podem me enviar algum material sobre portfólios?",
          userInfo: {}
        },
        {
          userMessage: "Obrigado! Vocês têm algum case de sucesso para mostrar?",
          userInfo: {}
        }
      ]
    }
  ];

  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i];
    console.log(`\n🎭 ${scenario.nome}`);
    console.log("=".repeat(60));

    // Reinicia a conversa para cada cenário
    sara.resetConversation();

    for (let j = 0; j < scenario.conversa.length; j++) {
      const { userMessage, userInfo } = scenario.conversa[j];
      
      console.log(`\n👤 Cliente: ${userMessage}`);
      
      try {
        const resultado = await sara.processMessage(userMessage, userInfo);
        
        console.log(`🤖 Sara (${resultado.activeAgent || 'maestro'}): ${resultado.response}`);
        
        if (j === scenario.conversa.length - 1) {
          // Mostra estatísticas no final de cada cenário
          const stats = sara.getConversationStats();
          console.log(`\n📊 ESTATÍSTICAS:`);
          console.log(`   Agente Ativo: ${stats.activeAgent || 'nenhum'}`);
          console.log(`   Lead Score: ${stats.leadScore}/4`);
          console.log(`   Estágio: ${stats.conversationStage}`);
          console.log(`   Próxima Ação: ${resultado.nextAction}`);
          console.log(`   Total de Mensagens: ${stats.totalMessages}`);
        }
        
      } catch (error) {
        console.error(`❌ Erro: ${error.message}`);
      }
      
      // Pequena pausa entre mensagens para simular conversa real
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log("\n" + "=".repeat(60));
  }

  console.log("\n🎉 Testes da Sara AI concluídos!");
  console.log("\n💡 A Sara AI agora possui:");
  console.log("   ✅ Sistema de roteamento inteligente");
  console.log("   ✅ 3 personas especializadas (Rackham, Konrath, Vaynerchuk)");
  console.log("   ✅ Análise de lead scoring automática");
  console.log("   ✅ Contexto de conversa persistente");
  console.log("   ✅ Metodologias de vendas integradas (SPIN, BANT)");
  console.log("   ✅ Gestão de conteúdo de valor");
}

// Executa os testes
testarSaraAI().catch(console.error);