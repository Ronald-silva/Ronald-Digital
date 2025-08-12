import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Send, Bot, User, Brain, Zap } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'sara';
  timestamp: Date;
  agent?: string;
}

interface SaraResponse {
  success: boolean;
  response: string;
  activeAgent?: string;
  leadScore?: number;
  nextAction?: string;
  conversationStage?: string;
  error?: boolean;
}

export default function SaraAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saraStats, setSaraStats] = useState({
    activeAgent: null,
    leadScore: 0,
    conversationStage: 'inicial'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Adiciona mensagem de boas-vindas inicial
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      content: 'Olá! Sou a Sara, sua assistente de IA da Ronald Digital. Como posso te ajudar hoje? 😊',
      sender: 'sara',
      timestamp: new Date(),
      agent: 'maestro'
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Chama a API real da Sara AI
      const apiResponse = await fetch('/api/agente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: 'Cliente Chat',
          email: 'cliente@chat.com',
          mensagem: inputMessage,
          tipoServico: ''
        }),
      });

      const response = await apiResponse.json();
      
      if (response.success) {
        const saraMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.resposta,
          sender: 'sara',
          timestamp: new Date(),
          agent: response.agenteAtivo
        };

        setMessages(prev => [...prev, saraMessage]);
        
        // Atualiza estatísticas
        setSaraStats({
          activeAgent: response.agenteAtivo,
          leadScore: response.leadScore || 0,
          conversationStage: response.etapa || 'inicial'
        });
      } else {
        throw new Error(response.error || 'Erro na API');
      }

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, houve um problema técnico. Pode tentar novamente?',
        sender: 'sara',
        timestamp: new Date(),
        agent: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getAgentInfo = (agent?: string) => {
    switch (agent) {
      case 'rackham':
        return { name: 'Neil Rackham', color: 'bg-blue-500', icon: '🎯' };
      case 'konrath':
        return { name: 'Jill Konrath', color: 'bg-green-500', icon: '⚡' };
      case 'vaynerchuk':
        return { name: 'Gary Vaynerchuk', color: 'bg-purple-500', icon: '💎' };
      case 'maestro':
        return { name: 'Maestro', color: 'bg-orange-500', icon: '🎭' };
      default:
        return { name: 'Sara AI', color: 'bg-gray-500', icon: '🤖' };
    }
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 3) return 'bg-green-500';
    if (score >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              Sara AI - Mega Cérebro
            </CardTitle>
            
            {/* Estatísticas em tempo real */}
            <div className="flex gap-2">
              {saraStats.activeAgent && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <span>{getAgentInfo(saraStats.activeAgent).icon}</span>
                  {getAgentInfo(saraStats.activeAgent).name}
                </Badge>
              )}
              
              <Badge 
                variant="outline" 
                className={`flex items-center gap-1 text-white ${getLeadScoreColor(saraStats.leadScore)}`}
              >
                <Zap className="h-3 w-3" />
                Score: {saraStats.leadScore}/4
              </Badge>
              
              <Badge variant="outline">
                {saraStats.conversationStage}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.sender === 'sara' && (
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${getAgentInfo(message.agent).color}`}></div>
                      <span className="font-medium">
                        {getAgentInfo(message.agent).name}
                      </span>
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  <div className={`text-xs mt-2 opacity-70`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 animate-pulse" />
                    <span>Sara está pensando...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 mt-2 text-center">
            Powered by Sara AI - Sistema Multi-Agente Inteligente
          </div>
        </div>
      </Card>
    </div>
  );
}

// Componente agora usa a API real da Sara AI