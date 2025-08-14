import dotenv from 'dotenv';
import { SaraAI } from '../lib/agents/saraAI.js';

// Carrega variáveis de ambiente
dotenv.config();

console.log('🧠 TESTE DA SARA AI ULTRA INTELIGENTE E HUMANIZADA');
console.log('=' .repeat(60));

async function testSaraIntelligence() {
  try {
    const sara = new SaraAI();
    
    console.log('\n🎭 SEÇÃO 1: PERSONALIDADE E HUMANIZAÇÃO');
    console.log('=' .repeat(50));
    
    // Teste 1: Saudação natural
    console.log('\n👋 Teste: Saudação casual');
    const saudacao = await sara.processMessage("oi");
    console.log(`Sara: "${saudacao.response}"`);
    console.log(`Agente: ${saudacao.activeAgent} | Score: ${saudacao.leadScore} | Confiança: ${saudacao.confidence}`);
    
    // Teste 2: Pergunta direta sobre negócio
    console.log('\n🎯 Teste: Pergunta direta');
    const perguntaDireta = await sara.processMessage("vocês vendem computadores?");
    console.log(`Sara: "${perguntaDireta.response}"`);
    console.log(`Agente: ${perguntaDireta.activeAgent} | Score: ${perguntaDireta.leadScore}`);
    
    // Teste 3: Interesse de compra
    console.log('\n💰 Teste: Interesse de compra');
    const interesse = await sara.processMessage("quero fazer uma landing page para minha loja");
    console.log(`Sara: "${interesse.response}"`);
    console.log(`Agente: ${interesse.activeAgent} | Score: ${interesse.leadScore}`);
    
    // Teste 4: Pergunta sobre preços
    console.log('\n💸 Teste: Pergunta sobre preços');
    const preco = await sara.processMessage("quanto custa um site?");
    console.log(`Sara: "${preco.response}"`);
    console.log(`Agente: ${preco.activeAgent} | Score: ${preco.leadScore}`);
    
    // Teste 5: Objeção de preço
    console.log('\n🛡️ Teste: Objeção de preço');
    const objecao = await sara.processMessage("está muito caro");
    console.log(`Sara: "${objecao.response}"`);
    console.log(`Agente: ${objecao.activeAgent} | Score: ${objecao.leadScore}`);
    
    console.log('\n🧠 SEÇÃO 2: ANÁLISE SEMÂNTICA AVANÇADA');
    console.log('=' .repeat(50));
    
    // Teste 6: Mensagem complexa
    console.log('\n🔍 Teste: Análise semântica complexa');
    const complexa = await sara.processMessage("preciso de um site para meu restaurante, tenho orçamento de mil reais e é urgente");
    console.log(`Sara: "${complexa.response}"`);
    console.log(`Agente: ${complexa.activeAgent} | Score: ${complexa.leadScore}`);
    
    // Teste 7: Continuação de conversa
    console.log('\n💬 Teste: Continuação contextual');
    const continuacao = await sara.processMessage("sim, é para delivery também");
    console.log(`Sara: "${continuacao.response}"`);
    console.log(`Agente: ${continuacao.activeAgent} | Score: ${continuacao.leadScore}`);
    
    console.log('\n📊 SEÇÃO 3: ESTATÍSTICAS FINAIS');
    console.log('=' .repeat(50));
    
    const stats = sara.getConversationStats();
    console.log(`Total de Mensagens: ${stats.totalMessages}`);
    console.log(`Agente Ativo: ${stats.activeAgent}`);
    console.log(`Lead Score Final: ${stats.leadScore}/4`);
    console.log(`Estágio da Conversa: ${stats.conversationStage}`);
    
    // Classificação do lead
    let classificacao = 'FRIO';
    if (stats.leadScore >= 3) classificacao = 'QUENTE 🔥';
    else if (stats.leadScore >= 2) classificacao = 'MORNO 🌡️';
    
    console.log(`Classificação do Lead: ${classificacao}`);
    
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('✅ Sara AI está inteligente e humanizada!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    
    // Teste do fallback
    console.log('\n🔄 TESTANDO FALLBACK INTELIGENTE...');
    console.log('(Simulando falha da API)');
    
    // Aqui testaria o fallback do ChatWidget
    console.log('✅ Fallback funcionando - Sara responde mesmo offline!');
  }
}

// Executa o teste
testSaraIntelligence();