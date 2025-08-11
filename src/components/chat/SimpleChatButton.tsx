import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, X, User } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  time: string;
}

export function SimpleChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const addMessage = (type: 'user' | 'ai', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    // Adiciona mensagem do usuário
    addMessage('user', currentMessage);
    
    // Gera resposta automática baseada na mensagem
    const userMsg = currentMessage.toLowerCase();
    let response = "";
    
    if (userMsg.includes('oi') || userMsg.includes('olá')) {
      response = "Oi! 👋 Sou o Ronald, especialista em sites. Como posso te ajudar?";
    } else if (userMsg.includes('preço') || userMsg.includes('valor') || userMsg.includes('custa')) {
      response = "Os valores variam:\n• Landing Page: R$ 500-1.000\n• Portfólio: R$ 400-800\n• Site completo: R$ 800-2.000\n\nQue tipo de projeto você precisa?";
    } else if (userMsg.includes('site') || userMsg.includes('preciso')) {
      response = "Perfeito! Posso te ajudar com seu site. 🚀\n\nQue tipo você precisa? Loja online, portfólio, institucional?";
    } else if (userMsg.includes('loja') || userMsg.includes('e-commerce')) {
      response = "E-commerce é uma excelente escolha! 🛒\n\nFica entre R$ 1.200-3.000 com tudo integrado. Quantos produtos você tem?";
    } else if (userMsg.includes('portfolio') || userMsg.includes('portfólio')) {
      response = "Portfólios são ótimos para mostrar seu trabalho! 🎨\n\nVocê é de que área? Design, fotografia, arquitetura?";
    } else {
      response = "Entendi! Posso te ajudar com isso. 😊\n\nPara dar a melhor sugestão, me conta mais sobre seu projeto!";
    }
    
    // Adiciona resposta do bot após um delay
    setTimeout(() => {
      addMessage('ai', response);
    }, 1000);
    
    setCurrentMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    // Mensagem de boas-vindas se for a primeira vez
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage('ai', "👋 Oi! Sou o Ronald, especialista em sites.\n\nComo posso te ajudar hoje?");
      }, 500);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <Button
            onClick={handleOpen}
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
      <div className="bg-white border rounded-lg shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">Ronald</h3>
                <p className="text-blue-100 text-xs">Especialista em Sites • Online</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-800 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
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
                
                <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Replies */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {["Preciso de um site", "Quanto custa?", "Quero uma loja online", "Preciso de um portfólio"].map((reply, index) => (
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
        
        {/* Input */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 rounded-full"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim()}
              size="sm"
              className="rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>💬 Chat em tempo real</span>
            <button
              onClick={() => window.open('https://wa.me/5585991993833', '_blank')}
              className="hover:text-green-600 transition-colors"
            >
              WhatsApp: (85) 99199-3833
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}