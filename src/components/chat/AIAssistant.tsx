import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Bot, Send, Loader2, X, MessageCircle, User, Sparkles } from "lucide-react";
import { processarComAgente, type AgentRequest } from "@/services/aiAgent";

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  leadScore?: number;
  classificacao?: string;
  isTyping?: boolean;
}

interface LeadData {
  nome?: string;
  email?: string;
  telefone?: string;
  projeto?: string;
  orcamento?: string;
  prazo?: string;
  tipoServico?: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [leadData, setLeadData] = useState<LeadData>({});
  const [conversationStep, setConversationStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Mensagem de boas-vindas
      setTimeout(() => {
        addMessage('ai', "👋 Oi! Sou o Ronald, especialista em sites e desenvolvimento web.\n\nComo posso te ajudar hoje?");
      }, 500);
    }
  }, [isOpen]);

  const addMessage = (type: 'user' | 'ai' | 'system', content: string, extra?: any) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: new Date(),
      ...extra
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addTypingMessage = () => {
    const typingMessage: Message = {
      id: 'typing',
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);
  };

  const removeTypingMessage = () => {
    setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
  };

  const extractInfoFromMessage = (message: string): Partial<LeadData> => {
    const info: Partial<LeadData> = {};
    const lowerMessage = message.toLowerCase();
    
    // Detecta tipo de projeto
    if (lowerMessage.includes('landing') || lowerMessage.includes('página de vendas')) {
      info.tipoServico = 'landing-page';
    } else if (lowerMessage.includes('portfólio') || lowerMessage.includes('portfolio')) {
      info.tipoServico = 'portfolio';
    } else if (lowerMessage.includes('loja') || lowerMessage.includes('e-commerce') || lowerMessage.includes('venda')) {
      info.tipoServico = 'e-commerce';
    } else if (lowerMessage.includes('blog') || lowerMessage.includes('site')) {
      info.tipoServico = 'site-blog';
    }
    
    // Detecta orçamento
    if (lowerMessage.includes('500') || lowerMessage.includes('quinhentos')) {
      info.orcamento = 'ate-500';
    } else if (lowerMessage.includes('1000') || lowerMessage.includes('mil')) {
      info.orcamento = '500-1000';
    } else if (lowerMessage.includes('2000') || lowerMessage.includes('dois mil')) {
      info.orcamento = '1000-2000';
    }
    
    // Detecta prazo
    if (lowerMessage.includes('urgente') || lowerMessage.includes('rápido') || lowerMessage.includes('semana')) {
      info.prazo = 'urgente';
    } else if (lowerMessage.includes('mês')) {
      info.prazo = '1-mes';
    }
    
    return info;
  };

  const generateContextualResponse = (userMessage: string, currentData: LeadData): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Respostas baseadas no que o usuário mencionou
    if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('custa')) {
      if (currentData.tipoServico === 'landing-page') {
        return "Landing pages ficam entre R$ 500-1.000. Depende das funcionalidades que você precisa.\n\nQue tipo de negócio você tem? Isso me ajuda a dar um valor mais preciso! 😊";
      } else if (currentData.tipoServico === 'e-commerce') {
        return "E-commerce completo fica entre R$ 1.200-3.000, com pagamento integrado e tudo.\n\nQuantos produtos você pretende vender? E qual seu nome para eu te atender melhor?";
      } else {
        return "Os valores variam:\n• Landing Page: R$ 500-1.000\n• Portfólio: R$ 400-800\n• Site completo: R$ 800-2.000\n\nQue tipo de projeto você tem em mente?";
      }
    }
    
    if (lowerMessage.includes('prazo') || lowerMessage.includes('tempo') || lowerMessage.includes('demora')) {
      return "Normalmente entrego em 5-10 dias úteis, dependendo da complexidade.\n\nSe for urgente, posso priorizar seu projeto! Qual seu prazo ideal?";
    }
    
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('portfólio')) {
      return "Portfólios são ótimos para mostrar credibilidade! 🎨\n\nVocê é de que área? Fotografia, design, arquitetura...? E qual seu nome?";
    }
    
    if (lowerMessage.includes('loja') || lowerMessage.includes('vender') || lowerMessage.includes('produto')) {
      return "Perfeito! E-commerce é o futuro das vendas! 🛒\n\nQue tipo de produtos você quer vender? E você já tem as fotos dos produtos?";
    }
    
    // Resposta padrão amigável
    return "Entendi! Posso te ajudar com isso sim.\n\nPara dar a melhor sugestão, me conta: qual seu nome e que tipo de projeto você tem em mente?";
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const userMessage = currentMessage.trim();
    setCurrentMessage("");
    
    // Adiciona mensagem do usuário
    addMessage('user', userMessage);
    
    // Extrai informações da mensagem
    const newInfo = extractInfoFromMessage(userMessage);
    const updatedLeadData = { ...leadData, ...newInfo };
    setLeadData(updatedLeadData);
    
    // Adiciona indicador de digitação
    addTypingMessage();
    setIsLoading(true);
    
    try {
      // Simula tempo de digitação
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      removeTypingMessage();
      
      // Gera resposta contextual
      const contextualResponse = generateContextualResponse(userMessage, updatedLeadData);
      addMessage('ai', contextualResponse);
      
      // Se temos informações suficientes, processa com IA
      if (updatedLeadData.tipoServico && conversationStep >= 2) {
        setTimeout(async () => {
          try {
            const agentData: AgentRequest = {
              nome: updatedLeadData.nome || 'Cliente',
              email: updatedLeadData.email || 'nao-informado@temp.com',
              telefone: updatedLeadData.telefone || '',
              mensagem: userMessage,
              tipoServico: updatedLeadData.tipoServico,
              orcamento: updatedLeadData.orcamento,
              prazo: updatedLeadData.prazo
            };

            const response = await processarComAgente(agentData);
            
            if (response.success && response.leadScore > 2) {
              addMessage('ai', `\n🎯 **Análise do seu projeto:**\nScore: ${response.leadScore}/4 ${getScoreEmoji(response.leadScore)}\nClassificação: ${response.classificacao}\n\n${response.resposta}`);
            }
          } catch (error) {
            console.log('IA não disponível, usando respostas contextuais');
          }
        }, 2000);
      }
      
      setConversationStep(prev => prev + 1);
      
    } catch (error) {
      removeTypingMessage();
      addMessage('ai', "Ops, tive um probleminha técnico. Mas estou aqui! Pode continuar falando comigo 😊");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 3) return "🔥";
    if (score >= 2) return "⭐";
    return "💡";
  };

  const getProximaAcaoTexto = (acao: string) => {
    switch (acao) {
      case 'fechar_venda': return 'Proposta personalizada';
      case 'agendar_reuniao': return 'Agendar conversa';
      case 'nutrir_lead': return 'Acompanhamento';
      default: return 'Análise completa';
    }
  };

  const resetChat = () => {
    setMessages([]);
    setLeadData({});
    setConversationStep(0);
    setCurrentMessage("");
  };

  const getQuickReplies = () => {
    if (conversationStep === 0) {
      return [
        "Preciso de um site",
        "Quanto custa?",
        "Quero uma loja online",
        "Preciso de um portfólio"
      ];
    } else if (conversationStep === 1 && !leadData.tipoServico) {
      return [
        "Landing page",
        "E-commerce",
        "Site institucional",
        "Portfólio"
      ];
    }
    return [];
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Bot className="w-7 h-7" />
          </Button>
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
          
          {/* Tooltip */}
          <div className="absolute -top-14 -left-20 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-90 shadow-lg">
            💬 Oi! Precisa de um site?
            <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-blue-200 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <CardTitle className="text-lg">Ronald</CardTitle>
                <p className="text-blue-100 text-xs">Especialista em Sites • Online</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-800 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                  message.type === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                {/* Message */}
                <div className={`max-w-[75%] ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.isTyping ? (
                    <div className="bg-gray-100 p-3 rounded-2xl">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  )}
                  
                  <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {getQuickReplies().length > 0 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {getQuickReplies().map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage(reply);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="text-xs h-7 px-3 rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t bg-white p-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  disabled={isLoading}
                  className="border-gray-200 focus:border-blue-400 rounded-full px-4 py-2 resize-none"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !currentMessage.trim()}
                size="sm"
                className="rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                <span>Powered by IA</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={resetChat}
                  className="hover:text-blue-600 transition-colors"
                >
                  Nova conversa
                </button>
                <button
                  onClick={() => window.open('https://wa.me/5585991993833', '_blank')}
                  className="hover:text-green-600 transition-colors"
                >
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}