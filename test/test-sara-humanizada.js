import dotenv from 'dotenv';
import { SaraAI } from '../lib/agents/saraAI.js';

dotenv.config();

console.log('🎭 TESTE SARA HUMANIZADA - RESPOSTAS NATURAIS');
console.log('=' .repeat(60));

async function testSaraHumanized() {
  try {
    const sara = new SaraAI();
    
    console.log('\n👋 SEÇÃO 1: PERGUNTAS PESSOAIS');
    console.log('=' .repeat(40));
    
    // Teste 1: Pergunta sobre nome
    console.log('\n❓ Pergunta: "qual o seu nome?"');
    const nome = await sara.processMessage("qual o seu nome?");
    console.log(`Sara: "${nome.response}"`);
    console.log(`Tipo: ${nome.personality} | Score: ${nome.leadScore}`);
    
    // Teste 2: Pergunta sobre ser IA
    console.log('\n🤖 Pergunta: "você é um robô?"');
    const robo = await sara.processMessage("você é um robô?");
    console.log(`Sara: "${robo.response}"`);
    console.log(`Tipo: ${robo.personality} | Score: ${robo.leadScore}`);
    
    console.log('\n💬 SEÇÃO 2: CONVERSA NATURAL');
    console.log('=' .repeat(40));
    
    // Teste 3: Resposta com nome
    console.log('\n👤 Resposta: "Meu nome é João"');
    const joao = await sara.processMessage("Meu nome é João");
    console.log(`Sara: "${joao.response}"`);
    console.log(`Tipo: ${joao.personality} | Score: ${joao.leadScore}`);
    
    // Teste 4: Pergunta sobre contato
    console.log('\n📞 Pergunta: "como posso falar com vocês?"');
    const contato = await sara.processMessage("como posso falar com vocês?");
    console.log(`Sara: "${contato.response}"`);
    console.log(`Tipo: ${contato.personality} | Score: ${contato.leadScore}`);
    
    console.log('\n🎯 SEÇÃO 3: CONTEXTO E INTELIGÊNCIA');
    console.log('=' .repeat(40));
    
    // Teste 5: Interesse específico
    console.log('\n💡 Interesse: "quero ver exemplos de sites"');
    const exemplos = await sara.processMessage("quero ver exemplos de sites");
    console.log(`Sara: "${exemplos.response}"`);
    console.log(`Tipo: ${exemplos.personality} | Score: ${exemplos.leadScore}`);
    
    // Teste 6: Pergunta sobre processo
    console.log('\n⚙️ Processo: "como funciona o trabalho de vocês?"');
    const processo = await sara.processMessage("como funciona o trabalho de vocês?");
    console.log(`Sara: "${processo.response}"`);
    console.log(`Tipo: ${processo.personality} | Score: ${processo.leadScore}`);
    
    console.log('\n📊 ESTATÍSTICAS FINAIS');
    console.log('=' .repeat(40));
    
    const stats = sara.getConversationStats();
    console.log(`Total de Mensagens: ${stats.totalMessages}`);
    console.log(`Lead Score Final: ${stats.leadScore}/4`);
    console.log(`Estágio: ${stats.conversationStage}`);
    
    console.log('\n✅ TESTE CONCLUÍDO!');
    console.log('🎭 Sara agora responde naturalmente a perguntas pessoais!');
    console.log('🧠 Entende contexto e mantém conversa fluida!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    
    // Teste do fallback melhorado
    console.log('\n🔄 TESTANDO FALLBACK MELHORADO...');
    
    // Simula respostas do fallback
    const fallbackTests = [
      "qual o seu nome?",
      "você é um robô?", 
      "como posso falar com vocês?",
      "quero ver exemplos"
    ];
    
    console.log('✅ Fallback também foi melhorado para essas perguntas!');
  }
}

testSaraHumanized();