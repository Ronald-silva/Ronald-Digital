import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/config/emailjs';

export interface BudgetNotificationData {
  nomeNegocio: string;
  tipoNegocio: string;
  objetivoPrincipal: string;
  funcionalidades: string[];
  estiloPreferido: string;
  inspiracoes: string;
  nome: string;
  email: string;
  telefone: string;
  orcamentoEstimado: string;
  prazoDesejado: string;
  mensagemAdicional: string;
}

// Inicializar EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

export const sendBudgetNotification = async (data: BudgetNotificationData): Promise<{
  emailSuccess: boolean;
  whatsappSuccess: boolean;
  errors: string[];
}> => {
  const results = {
    emailSuccess: false,
    whatsappSuccess: false,
    errors: [] as string[]
  };

  // 1. Enviar por Email usando EmailJS
  try {
    const emailParams = {
      to_email: EMAILJS_CONFIG.TO_EMAIL,
      from_name: data.nome,
      from_email: data.email,
      subject: `Novo Orçamento - ${data.nomeNegocio}`,
      
      // Dados do cliente
      cliente_nome: data.nome,
      cliente_email: data.email,
      cliente_telefone: data.telefone,
      
      // Dados do projeto
      nome_negocio: data.nomeNegocio,
      tipo_negocio: data.tipoNegocio.replace('-', ' '),
      objetivo_principal: data.objetivoPrincipal.replace('-', ' '),
      funcionalidades: data.funcionalidades.join(', '),
      estilo_preferido: data.estiloPreferido,
      inspiracoes: data.inspiracoes || 'Não informado',
      orcamento_estimado: data.orcamentoEstimado,
      prazo_desejado: data.prazoDesejado,
      mensagem_adicional: data.mensagemAdicional || 'Nenhuma mensagem adicional',
      
      // Data/hora
      data_solicitacao: new Date().toLocaleString('pt-BR')
    };

    await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, emailParams);
    results.emailSuccess = true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    results.errors.push('Falha no envio do email');
  }

  // 2. Enviar notificação para WhatsApp
  try {
    const whatsappMessage = formatWhatsAppMessage(data);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${EMAILJS_CONFIG.WHATSAPP_NUMBER}&text=${encodeURIComponent(whatsappMessage)}`;
    
    // Abrir WhatsApp em nova aba (funciona como notificação)
    window.open(whatsappUrl, '_blank');
    results.whatsappSuccess = true;
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error);
    results.errors.push('Falha na notificação do WhatsApp');
  }

  return results;
};

const formatWhatsAppMessage = (data: BudgetNotificationData): string => {
  return `🚨 *NOVO ORÇAMENTO RECEBIDO!*

👤 *Cliente:* ${data.nome}
📧 *Email:* ${data.email}
📱 *Telefone:* ${data.telefone}

🏢 *Negócio:* ${data.nomeNegocio}
📋 *Tipo:* ${data.tipoNegocio.replace('-', ' ')}
🎯 *Objetivo:* ${data.objetivoPrincipal.replace('-', ' ')}

💰 *Orçamento:* ${data.orcamentoEstimado}
⏰ *Prazo:* ${data.prazoDesejado}

📝 *Funcionalidades:*
${data.funcionalidades.map(f => `• ${f}`).join('\n')}

🎨 *Estilo:* ${data.estiloPreferido}

${data.mensagemAdicional ? `💬 *Mensagem:* ${data.mensagemAdicional}` : ''}

⏰ *Recebido em:* ${new Date().toLocaleString('pt-BR')}`;
};

// Função para testar a configuração
export const testNotificationSetup = async (): Promise<boolean> => {
  try {
    const testData: BudgetNotificationData = {
      nomeNegocio: 'Teste',
      tipoNegocio: 'e-commerce',
      objetivoPrincipal: 'vendas-online',
      funcionalidades: ['Catálogo de produtos'],
      estiloPreferido: 'Moderno',
      inspiracoes: 'Teste',
      nome: 'Teste',
      email: 'teste@teste.com',
      telefone: '11999999999',
      orcamentoEstimado: 'ate-2000',
      prazoDesejado: '1-mes',
      mensagemAdicional: 'Teste de configuração'
    };

    const result = await sendBudgetNotification(testData);
    return result.emailSuccess || result.whatsappSuccess;
  } catch (error) {
    console.error('Erro no teste:', error);
    return false;
  }
};