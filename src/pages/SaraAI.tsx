import React from 'react';
import SaraAIChat from '../components/SaraAIChat';
import { Brain, Zap, Target, Heart, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function SaraAI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-12 w-12 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Sara AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            O primeiro sistema de IA multi-agente do Brasil especializado em vendas consultivas. 
            Combinando as melhores metodologias de vendas em uma única inteligência artificial.
          </p>
          
          {/* Badges das metodologias */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Target className="h-4 w-4 mr-2" />
              SPIN Selling (Rackham)
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Zap className="h-4 w-4 mr-2" />
              BANT Qualification (Konrath)
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Heart className="h-4 w-4 mr-2" />
              Value-First (Vaynerchuk)
            </Badge>
          </div>
        </div>

        {/* Cards explicativos */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Target className="h-5 w-5" />
                Neil Rackham
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Especialista em Vendas Consultivas</strong>
              </p>
              <p className="text-sm text-gray-700">
                Usa a metodologia SPIN Selling para descobrir necessidades profundas do cliente através de perguntas estratégicas sobre Situação, Problema, Implicação e Necessidade.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Zap className="h-5 w-5" />
                Jill Konrath
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Qualificadora Rápida</strong>
              </p>
              <p className="text-sm text-gray-700">
                Especialista em qualificar leads ocupados usando BANT (Budget, Authority, Need, Timeline) de forma eficiente e direta ao ponto.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Heart className="h-5 w-5" />
                Gary Vaynerchuk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Especialista em Relacionamento</strong>
              </p>
              <p className="text-sm text-gray-700">
                Foca em construir relacionamentos duradouros oferecendo valor primeiro, nutrindo leads e criando conexões autênticas.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Como funciona */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-none">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-gray-800">
              🧠 Como o Mega Cérebro Funciona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🎭</span>
                </div>
                <h3 className="font-semibold">1. Maestro</h3>
                <p className="text-sm text-gray-600">
                  Analisa a intenção do cliente e roteia para o agente ideal
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">2. Descoberta</h3>
                <p className="text-sm text-gray-600">
                  Rackham explora problemas e necessidades profundas
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold">3. Qualificação</h3>
                <p className="text-sm text-gray-600">
                  Konrath qualifica rapidamente usando critérios BANT
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">4. Relacionamento</h3>
                <p className="text-sm text-gray-600">
                  Vaynerchuk nutre o lead com valor e constrói confiança
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat da Sara AI */}
        <SaraAIChat />

        {/* Footer informativo */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Users className="h-5 w-5" />
            <span className="text-sm">
              Sistema desenvolvido pela Ronald Digital usando LangChain + Grok API
            </span>
          </div>
          
          <div className="text-xs text-gray-500 max-w-2xl mx-auto">
            <p>
              A Sara AI combina décadas de conhecimento em vendas dos maiores especialistas mundiais 
              em uma única inteligência artificial. Cada conversa é personalizada e otimizada para 
              maximizar a conversão e satisfação do cliente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}