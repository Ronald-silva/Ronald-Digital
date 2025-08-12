🤖 Agente de IA Multi-Especialista - Ronald Digital
Sistema de agente multi-agente com LangChain para captação, qualificação e vendas de sites, utilizando as filosofias de vendas de Neil Rackham, Jill Konrath e Gary Vaynerchuk.

🎯 Funcionalidades
🧠 Sistema de Agente Multi-Especialista
Neil Rackham (Captação e Análise Consultiva): Atua como um consultor, fazendo perguntas estratégicas baseadas no SPIN Selling para entender a fundo a situação, o problema, a implicação e a necessidade do cliente. Ele garante que a solução proposta seja a mais adequada, e não apenas um produto genérico.

Jill Konrath (Qualificação e Eficiência): Especialista em lidar com clientes ocupados. Ela aplica a metodologia BANT (Budget, Authority, Need, Timeline) de forma concisa e direta, qualificando o lead rapidamente para garantir que o tempo do cliente e do agente seja usado de forma eficiente.

Gary Vaynerchuk (Vendas e Relacionamento): Focado em construir valor e confiança. Este agente é responsável por apresentar a proposta de forma persuasiva, oferecer conteúdo de valor (como guias e artigos) e, por fim, fechar a venda ou nutrir o relacionamento para futuras oportunidades.

💰 Serviços Oferecidos
Landing Pages: R$ 500-1.000 (Foco em alta conversão e captação de leads).

Portfólios: R$ 400-800 (Foco em credibilidade e apresentação profissional).

Sites/Blogs: R$ 800-2.000 (Foco em autoridade, SEO e conteúdo).

🚀 Tecnologias
LangChain: Framework robusto para orquestração de agentes de IA.

Grok API: IA da xAI (gratuita) com fallback para OpenAI para maior estabilidade.

Next.js: Framework React para as rotas da API.

Vercel: Plataforma serverless para deploy gratuito e escalável.

📦 Instalação
1. Clone o repositório e instale as dependências
Bash

git clone <seu-repo>
cd ronald-digital-ai-agent
npm install
2. Configure as variáveis de ambiente
Copie o arquivo de exemplo e edite as suas informações:

Bash

cp .env.example .env.local
Edite o arquivo .env.local com suas chaves e informações de negócio:

Snippet de código

# API Keys (obtenha pelo menos uma)
GROK_API_KEY=your_grok_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Configurações do seu negócio
BUSINESS_EMAIL=ronald.digital27@gmail.com
BUSINESS_PHONE=5585991993833
BUSINESS_NAME=Ronald Digital

# Faixas de preço dos serviços
LANDING_PAGE_MIN=500
LANDING_PAGE_MAX=1000
PORTFOLIO_MIN=400
PORTFOLIO_MAX=800
WEBSITE_MIN=800
WEBSITE_MAX=2000
3. Teste a aplicação localmente
Bash

# Para iniciar o ambiente de desenvolvimento
npm run dev

# Para rodar os testes unitários do agente
npm run test
🔑 Obtendo suas API Keys
Grok API (Recomendado - Gratuito)
Acesse: https://console.x.ai/

Crie sua conta e obtenha a sua chave.

Adicione a chave em GROK_API_KEY no seu .env.local.

OpenAI API (Fallback)
Acesse: https://platform.openai.com/

Crie sua conta e obtenha a chave.

Adicione a chave em OPENAI_API_KEY no seu .env.local.

🚀 Deploy no Vercel
1. Faça o deploy automático
Bash

# Instale a Vercel CLI, se ainda não tiver
npm i -g vercel

# Execute o deploy
vercel --prod
2. Configure as variáveis no Vercel
No painel do Vercel, adicione suas variáveis de ambiente na seção de configurações do projeto, como GROK_API_KEY, BUSINESS_EMAIL, etc.

3. Teste em produção
Acesse a página de teste do agente na URL gerada pelo Vercel: https://seu-site.vercel.app/agente-teste

📋 Como Usar
1. Integração com seu site
Use a seguinte estrutura de código para enviar dados do seu formulário ou chat para o agente:

JavaScript

const enviarParaAgente = async (formData) => {
  const response = await fetch("/api/agente", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: formData.nome,
      email: formData.email,
      mensagem: formData.mensagem,
      tipoServico: formData.tipoServico,
    }),
  });

  const resultado = await response.json();

  if (resultado.success) {
    // Ação com a resposta do agente
    console.log(resultado.resposta);
    console.log("Pontuação do Lead:", resultado.leadScore);
  }
};
2. Página de teste
Acesse a rota /agente-teste para simular o formulário completo e testar o fluxo de qualificação.

🔄 Fluxo do Agente
O agente principal "Maestro" direciona a conversa, acionando a persona ideal para cada interação:

📝 Formulário → 🎯 Neil Rackham → 📊 Jill Konrath → 💰 Gary Vaynerchuk → 📧 Resposta
   ↓                ↓                   ↓                  ↓                  ↓
 Input do       Análise e          Qualificação         Vendas ou         Resposta
   Cliente      Perguntas         (Metodologia         Nutrição          Personalizada
                Consultivas          BANT)
Exemplo de Resposta
JSON

{
  "success": true,
  "resposta": "Olá João! Com base no que você me disse, nossa landing page otimizada com IA pode ser a solução ideal. Com um orçamento de R$ 800, podemos focar em converter visitantes em clientes para sua loja. Que tal agendarmos uma conversa de 15 minutos para detalharmos o seu projeto?",
  "etapa": "vendas",
  "leadScore": 4,
  "proximaAcao": "fechar_venda"
}
🧪 Testes
Teste local
Bash

node test/test-agent.js
Casos de teste incluídos
Lead Quente (orçamento + prazo definidos)

Lead Morno (interesse, mas sem urgência)

Lead Frio (apenas curiosidade)

💡 Personalização
Modificar Personas
Edite o arquivo lib/agents/personas.js para ajustar:

Personalidade dos agentes

Conhecimentos específicos de cada um

Processo de vendas e preços

Prompt inicial do agente "Maestro"

Adicionar novos agentes
Basta seguir a mesma estrutura no arquivo personas.js para criar um novo agente:

JavaScript

NOVO_AGENTE: {
  name: "Seu Nome",
  role: "Sua Especialidade",
  prompt: "Seu prompt personalizado..."
}
📊 Métricas e Analytics
O sistema retorna dados valiosos que podem ser usados para analisar a performance do agente:

Lead Score: 0-4 (baseado na metodologia BANT).

Classificação: Quente/Morno/Frio.

Etapa: Captação/Qualificação/Vendas.

Próxima Ação: Fechar/Agendar/Nutrir.

🔧 Troubleshooting
Erro de API Key
Error: GROK_API_KEY ou OPENAI_API_KEY não configurada
Solução: Certifique-se de que pelo menos uma das chaves de API esteja configurada corretamente.

Erro de Timeout
Error: Function execution timed out
Solução: Otimize os prompts para serem mais concisos e reduza o maxTokens na configuração da API para evitar processamentos longos.

CORS Error
Error: CORS policy blocked
Solução: Certifique-se de que a variável de ambiente VERCEL_URL esteja configurada corretamente.

💰 Custos
Grok API (Gratuito)
Nível gratuito generoso, ideal para começar.

OpenAI API
Custo por token. Estime ~R$ 0,10 por conversa, resultando em ~R$ 10-30/mês para 100-300 conversas.

Vercel (Gratuito)
100GB de largura de banda e funções serverless incluídas no plano gratuito.

📞 Suporte
Para dúvidas ou problemas, entre em contato:

Email: ronald.digital27@gmail.com

WhatsApp: +55 85 99199-3833

🎉 Agora você tem um agente de IA especialista em vendas rodando 24/7, com uma estratégia de vendas clara e poderosa!