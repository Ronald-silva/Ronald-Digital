# 🤖 Agente de IA Multi-Especialista - Ronald Digital

Sistema de agente multi-agente com LangChain para captação, qualificação e vendas de sites usando as personas de Neil Patel, Jill Konrath e Gary Vaynerchuk.

## 🎯 Funcionalidades

### 🧠 Multi-Agente System

- **Neil Patel (Captação)**: Analisa necessidades e faz perguntas estratégicas
- **Jill Konrath (Qualificação)**: Aplica metodologia BANT para qualificar leads
- **Gary Vaynerchuk (Vendas)**: Fecha vendas ou nutre relacionamento

### 💰 Serviços Oferecidos

- **Landing Pages**: R$ 500-1.000 (conversão e captação)
- **Portfólios**: R$ 400-800 (credibilidade profissional)
- **Sites/Blogs**: R$ 800-2.000 (autoridade e SEO)

### 🚀 Tecnologias

- **LangChain**: Framework para agentes de IA
- **Grok API**: IA da xAI (gratuita) com fallback para OpenAI
- **Next.js**: Framework React para API routes
- **Vercel**: Deploy serverless gratuito

## 📦 Instalação

### 1. Clone e instale dependências

```bash
git clone <seu-repo>
cd ronald-digital-ai-agent
npm install
```

### 2. Configure variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
# API Keys (obtenha uma das duas)
GROK_API_KEY=your_grok_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Configurações do negócio
BUSINESS_EMAIL=ronald.digital27@gmail.com
BUSINESS_PHONE=5585991993833
BUSINESS_NAME=Ronald Digital

# Preços dos serviços
LANDING_PAGE_MIN=500
LANDING_PAGE_MAX=1000
PORTFOLIO_MIN=400
PORTFOLIO_MAX=800
WEBSITE_MIN=800
WEBSITE_MAX=2000
```

### 3. Teste localmente

```bash
# Desenvolvimento
npm run dev

# Teste do agente
npm run test
```

## 🔑 Obtendo API Keys

### Grok API (Recomendado - Gratuito)

1. Acesse: https://console.x.ai/
2. Crie conta e obtenha API key
3. Adicione em `GROK_API_KEY`

### OpenAI API (Fallback)

1. Acesse: https://platform.openai.com/
2. Crie conta e obtenha API key
3. Adicione em `OPENAI_API_KEY`

## 🚀 Deploy no Vercel

### 1. Deploy automático

```bash
# Instale Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. Configure variáveis no Vercel

No dashboard do Vercel, adicione as environment variables:

- `GROK_API_KEY` ou `OPENAI_API_KEY`
- `BUSINESS_EMAIL`
- `BUSINESS_PHONE`

### 3. Teste em produção

Acesse: `https://seu-site.vercel.app/agente-teste`

## 📋 Como Usar

### 1. Integração no seu site

```javascript
// Exemplo de integração
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
    // Exibe resposta do agente
    console.log(resultado.resposta);
    console.log("Lead Score:", resultado.leadScore);
  }
};
```

### 2. Página de teste

Acesse `/agente-teste` para testar o formulário completo.

## 🔄 Fluxo do Agente

```
📝 Formulário → 🎯 Neil Patel → 📊 Jill Konrath → 💰 Gary Vaynerchuk → 📧 Resposta
    ↓              ↓               ↓                ↓                  ↓
  Input do      Captação e      Qualificação     Vendas ou         Resposta
   Cliente      Perguntas        BANT           Nutrição         Personalizada
```

### Exemplo de Resposta

```json
{
  "success": true,
  "resposta": "Olá João! Vi que você precisa de uma landing page para sua loja de roupas. Com R$ 800 de orçamento, posso criar uma landing page otimizada com IA que vai converter visitantes em clientes. Que tal agendar uma conversa de 15 minutos para detalhar seu projeto?",
  "etapa": "vendas",
  "leadScore": 4,
  "proximaAcao": "fechar_venda"
}
```

## 🧪 Testes

### Teste local

```bash
node test/test-agent.js
```

### Casos de teste inclusos

- Lead quente (orçamento + prazo definidos)
- Lead morno (interesse mas sem urgência)
- Lead frio (apenas curiosidade)

## 💡 Personalização

### Modificar Personas

Edite `lib/agents/personas.js` para ajustar:

- Personalidade dos agentes
- Conhecimentos específicos
- Processo de vendas
- Preços e serviços

### Adicionar Novos Agentes

```javascript
// Em personas.js
NOVO_AGENTE: {
  name: "Seu Nome",
  role: "Sua Especialidade",
  prompt: "Seu prompt personalizado..."
}
```

## 📊 Métricas e Analytics

O sistema retorna:

- **Lead Score**: 0-4 (baseado em BANT)
- **Classificação**: Quente/Morno/Frio
- **Etapa**: Captação/Qualificação/Vendas
- **Próxima Ação**: Fechar/Agendar/Nutrir

## 🔧 Troubleshooting

### Erro de API Key

```
Error: GROK_API_KEY ou OPENAI_API_KEY não configurada
```

**Solução**: Configure pelo menos uma das API keys.

### Timeout no Vercel

```
Error: Function execution timed out
```

**Solução**: Reduza o `maxTokens` ou otimize prompts.

### CORS Error

```
Error: CORS policy blocked
```

**Solução**: Configure `VERCEL_URL` corretamente.

## 💰 Custos

### Grok API (Gratuito)

- Tier gratuito generoso
- Ideal para começar

### OpenAI API

- ~R$ 0,10 por conversa
- ~R$ 10-30/mês para 100-300 conversas

### Vercel (Gratuito)

- 100GB bandwidth
- Serverless functions incluídas

## 🚀 Próximos Passos

1. **Integre no seu site atual**
2. **Teste com clientes reais**
3. **Ajuste prompts baseado nos resultados**
4. **Adicione analytics mais detalhados**
5. **Implemente follow-up automático**

## 📞 Suporte

Para dúvidas ou problemas:

- Email: ronald.digital27@gmail.com
- WhatsApp: +55 85 99199-3833

---

**🎉 Agora você tem um agente de IA especialista em vendas rodando 24/7 por menos de R$ 30/mês!**
