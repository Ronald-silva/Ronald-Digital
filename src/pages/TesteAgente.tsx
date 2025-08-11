import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { processarComAgente, getAgentConfig, type AgentRequest } from "@/services/aiAgent";
import { Bot, TestTube, CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";

export default function TesteAgente() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
    tipoServico: "",
    orcamento: "",
    prazo: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const { toast } = useToast();

  const config = getAgentConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.mensagem) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos nome, email e mensagem.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const agentData: AgentRequest = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        mensagem: formData.mensagem,
        tipoServico: formData.tipoServico,
        orcamento: formData.orcamento,
        prazo: formData.prazo
      };

      const result = await processarComAgente(agentData);
      setResponse(result);

      if (result.success) {
        toast({
          title: "✅ Teste realizado com sucesso!",
          description: "O agente processou sua solicitação.",
        });
      }
    } catch (error) {
      console.error("Erro no teste:", error);
      toast({
        title: "❌ Erro no teste",
        description: "Houve um problema ao testar o agente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runQuickTest = async () => {
    const testData: AgentRequest = {
      nome: "João Silva",
      email: "joao@teste.com",
      telefone: "11999999999",
      mensagem: "Preciso de uma landing page para minha loja de roupas. Tenho orçamento de R$ 800 e preciso para próxima semana.",
      tipoServico: "landing-page",
      orcamento: "ate-1000",
      prazo: "1-semana"
    };

    setIsLoading(true);
    try {
      const result = await processarComAgente(testData);
      setResponse(result);
      setFormData({
        nome: testData.nome,
        email: testData.email,
        telefone: testData.telefone || "",
        mensagem: testData.mensagem,
        tipoServico: testData.tipoServico || "",
        orcamento: testData.orcamento || "",
        prazo: testData.prazo || ""
      });
    } catch (error) {
      console.error("Erro no teste rápido:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 Teste do Agente de IA
          </h1>
          <p className="text-xl text-gray-600">
            Teste nosso especialista em vendas de sites com IA
          </p>
        </div>

        {/* Status da Configuração */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Status da Configuração
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {config.hasGrok ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span>Grok API: {config.hasGrok ? 'Configurada' : 'Não configurada'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {config.hasOpenAI ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span>OpenAI API: {config.hasOpenAI ? 'Configurada' : 'Não configurada'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {config.isConfigured ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
                <span>Status: {config.isConfigured ? 'Pronto' : 'Modo Fallback'}</span>
              </div>
            </div>
            
            {!config.isConfigured && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Modo Fallback:</strong> O agente funcionará com respostas inteligentes pré-programadas. 
                  Para IA completa, configure VITE_GROK_API_KEY ou VITE_OPENAI_API_KEY no arquivo .env.local
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário de Teste */}
          <Card>
            <CardHeader>
              <CardTitle>Teste Personalizado</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={runQuickTest}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                >
                  Teste Rápido
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Nome *"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  />
                  <Select value={formData.tipoServico} onValueChange={(value) => setFormData(prev => ({ ...prev, tipoServico: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landing-page">Landing Page</SelectItem>
                      <SelectItem value="portfolio">Portfólio</SelectItem>
                      <SelectItem value="site-blog">Site/Blog</SelectItem>
                      <SelectItem value="e-commerce">E-commerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Select value={formData.orcamento} onValueChange={(value) => setFormData(prev => ({ ...prev, orcamento: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Orçamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ate-500">Até R$ 500</SelectItem>
                      <SelectItem value="500-1000">R$ 500 - R$ 1.000</SelectItem>
                      <SelectItem value="1000-2000">R$ 1.000 - R$ 2.000</SelectItem>
                      <SelectItem value="acima-2000">Acima de R$ 2.000</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={formData.prazo} onValueChange={(value) => setFormData(prev => ({ ...prev, prazo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Prazo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-semana">1 semana</SelectItem>
                      <SelectItem value="2-semanas">2 semanas</SelectItem>
                      <SelectItem value="1-mes">1 mês</SelectItem>
                      <SelectItem value="sem-pressa">Sem pressa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Textarea
                  placeholder="Mensagem sobre seu projeto *"
                  value={formData.mensagem}
                  onChange={(e) => setFormData(prev => ({ ...prev, mensagem: e.target.value }))}
                  rows={4}
                  required
                />
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Testar Agente
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Resposta do Agente */}
          <Card>
            <CardHeader>
              <CardTitle>Resposta do Agente</CardTitle>
            </CardHeader>
            <CardContent>
              {response ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Resposta:</h4>
                    <div className="text-sm whitespace-pre-wrap">
                      {response.resposta}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">Lead Score</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {response.leadScore}/4
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium text-green-800">Classificação</div>
                      <div className="text-lg font-bold text-green-600">
                        {response.classificacao}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm font-medium text-yellow-800">Próxima Ação</div>
                    <div className="text-sm text-yellow-700">
                      {response.proximaAcao}
                    </div>
                  </div>
                  
                  {response.error && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-sm font-medium text-red-800">Observação</div>
                      <div className="text-sm text-red-700">
                        {response.error}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Preencha o formulário e clique em "Testar Agente" para ver a resposta
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}