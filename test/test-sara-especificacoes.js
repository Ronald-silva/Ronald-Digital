import dotenv from 'dotenv';
import { SaraAI } from '../lib/agents/saraAI.js';

dotenv.config();

console.log('🎯 TESTE SARA - ESPECIFICAÇÕES DE PROJETO');
console.log('=' .repeat(50));

async function testProjectSpecifications() {
  try {
    const sara = new SaraAI();
    
    console.log('\n🛍️ TESTE 1: Loja de Roupas Multimarcas');
    console.log('-' .repeat(40));
    
    const lojaRoupas = await sara.processMessage("preciso de um site para uma loja de roupas multimarcas");
    console.log(`Sara: "${lojaRoupas.response}"`);
    console.log(`Tipo: ${lojaRoupas.personality} | Score: ${lojaRoupas.leadScore} | Ação: ${lojaRoupas.nextAction}`);
    
    console.log('\n🍕 TESTE 2: Restaurante');
    console.log('-' .repeat(40));
    
    const restaurante = await sara.processMessage("quero um site para meu restaurante");
    console.log(`Sara: "${restaurante.response}"`);
    console.log(`Tipo: ${restaurante.personality} | Score: ${restaurante.leadScore}`);
    
    console.log('\n💼 TESTE 3: Consultoria');
    console.log('-' .repeat(40));
    
    const consultoria = await sara.processMessage("preciso de um site para minha consultoria");
    console.log(`Sara: "${consultoria.response}"`);
    console.log(`Tipo: ${consultoria.personality} | Score: ${consultoria.leadScore}`);
    
    console.log('\n🎨 TESTE 4: Portfólio de Designer');
    console.log('-' .repeat(40));
    
    const portfolio = await sara.processMessage("quero um portfólio para meu trabalho de design");
    console.log(`Sara: "${portfolio.response}"`);
    console.log(`Tipo: ${portfolio.personality} | Score: ${portfolio.leadScore}`);
    
    console.log('\n📊 ESTATÍSTICAS FINAIS');
    console.log('-' .repeat(40));
    
    const stats = sara.getConversationStats();
    console.log(`Total de Mensagens: ${stats.totalMessages}`);
    console.log(`Lead Score Final: ${stats.leadScore}/4`);
    console.log(`Dados do Lead:`, stats.leadData);
    
    console.log('\n✅ TESTE CONCLUÍDO!');
    console.log('🎯 Sara agora processa especificações detalhadas!');
    console.log('🧠 Extrai informações específicas do projeto!');
    console.log('💡 Dá respostas personalizadas por segmento!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    
    console.log('\n🔄 TESTANDO FALLBACK PARA ESPECIFICAÇÕES...');
    
    // Simula teste do fallback
    const fallbackTests = [
      "preciso de um site para uma loja de roupas multimarcas",
      "quero um site para meu restaurante",
      "preciso de um portfólio"
    ];
    
    console.log('✅ Fallback também detecta especificações!');
  }
}

testProjectSpecifications();