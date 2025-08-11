import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Check, Loader2, Bot } from "lucide-react";
import { sendBudgetNotification } from "@/services/notificationService";
import { processarComAgente, type AgentRequest } from "@/services/aiAgent";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { GoalsStep } from "./steps/GoalsStep";
import { DesignStep } from "./steps/DesignStep";
import { ContactStep } from "./steps/ContactStep";
import { SuccessStep } from "./steps/SuccessStep";

export interface BudgetFormData {
  // Basic Info
  nomeNegocio: string;
  tipoNegocio: string;
  
  // Goals
  objetivoPrincipal: string;
  funcionalidades: string[];
  
  // Design
  estiloPreferido: string;
  inspiracoes: string;
  
  // Contact
  nome: string;
  email: string;
  telefone: string;
  orcamentoEstimado: string;
  prazoDesejado: string;
  mensagemAdicional: string;
}

const initialFormData: BudgetFormData = {
  nomeNegocio: "",
  tipoNegocio: "",
  objetivoPrincipal: "",
  funcionalidades: [],
  estiloPreferido: "",
  inspiracoes: "",
  nome: "",
  email: "",
  telefone: "",
  orcamentoEstimado: "",
  prazoDesejado: "",
  mensagemAdicional: "",
};

const steps = [
  { id: 1, title: "Informações Básicas", description: "Conte-nos sobre seu negócio" },
  { id: 2, title: "Objetivos", description: "Defina seus objetivos e funcionalidades" },
  { id: 3, title: "Design", description: "Escolha o estilo do seu projeto" },
  { id: 4, title: "Finalização", description: "Seus dados de contato e orçamento" },
];

export function BudgetWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BudgetFormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [showAiResponse, setShowAiResponse] = useState(false);
  const { toast } = useToast();

  const updateFormData = (data: Partial<BudgetFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.nomeNegocio.trim() !== "" && formData.tipoNegocio !== "";
      case 2:
        return formData.objetivoPrincipal !== "" && formData.funcionalidades.length > 0;
      case 3:
        return formData.estiloPreferido !== "";
      case 4:
        return formData.nome.trim() !== "" && formData.email.trim() !== "" && formData.telefone.trim() !== "";
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Processar com o Agente de IA
      let aiResult = null;
      try {
        const agentData: AgentRequest = {
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          mensagem: buildMensagemFromOrcamento(formData),
          tipoServico: mapTipoServico(formData.objetivoPrincipal),
          orcamento: formData.orcamentoEstimado,
          prazo: formData.prazoDesejado
        };

        aiResult = await processarComAgente(agentData);
        if (aiResult.success) {
          setAiResponse(aiResult.resposta);
          setAiAnalysis(aiResult);
          setShowAiResponse(true);
        }
      } catch (aiError) {
        console.warn("Agente de IA não disponível:", aiError);
      }

      // 2. Enviar notificações (email + WhatsApp)
      const result = await sendBudgetNotification(formData);
      
      if (result.emailSuccess || result.whatsappSuccess) {
        setIsSubmitted(true);
        
        let successMessage = "Solicitação enviada com sucesso!";
        if (result.emailSuccess && result.whatsappSuccess) {
          successMessage = "Orçamento enviado por email e notificação WhatsApp enviada!";
        } else if (result.emailSuccess) {
          successMessage = "Orçamento enviado por email com sucesso!";
        } else if (result.whatsappSuccess) {
          successMessage = "Notificação WhatsApp enviada com sucesso!";
        }

        // Adiciona informação sobre IA se disponível
        if (aiResult?.success) {
          successMessage += " Nosso especialista em IA já analisou seu projeto!";
        }
        
        toast({
          title: "✅ Orçamento Enviado!",
          description: successMessage + " Entraremos em contato em breve!",
        });
      } else {
        throw new Error("Falha em todos os métodos de envio");
      }
    } catch (error) {
      console.error("Erro ao enviar orçamento:", error);
      toast({
        title: "Erro no envio",
        description: "Houve um problema ao enviar sua solicitação. Tente novamente ou entre em contato diretamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funções auxiliares para o agente de IA
  const buildMensagemFromOrcamento = (formData: BudgetFormData): string => {
    let mensagem = `Solicitação de orçamento para ${formData.nomeNegocio || 'meu projeto'}.`;
    
    if (formData.tipoNegocio) {
      mensagem += ` Tipo de negócio: ${formData.tipoNegocio.replace('-', ' ')}.`;
    }
    
    if (formData.objetivoPrincipal) {
      mensagem += ` Objetivo principal: ${formData.objetivoPrincipal.replace('-', ' ')}.`;
    }
    
    if (formData.funcionalidades && formData.funcionalidades.length > 0) {
      mensagem += ` Funcionalidades desejadas: ${formData.funcionalidades.join(', ')}.`;
    }
    
    if (formData.estiloPreferido) {
      mensagem += ` Estilo preferido: ${formData.estiloPreferido}.`;
    }
    
    if (formData.inspiracoes) {
      mensagem += ` Inspirações: ${formData.inspiracoes}.`;
    }
    
    if (formData.mensagemAdicional) {
      mensagem += ` Informações adicionais: ${formData.mensagemAdicional}.`;
    }

    return mensagem;
  };

  const mapTipoServico = (objetivoPrincipal?: string): string => {
    if (!objetivoPrincipal) return '';
    
    const mapeamento: { [key: string]: string } = {
      'vendas-online': 'e-commerce',
      'presenca-digital': 'site-blog',
      'captacao-leads': 'landing-page',
      'portfolio-trabalhos': 'portfolio',
      'blog-conteudo': 'site-blog',
      'sistema-interno': 'site-blog'
    };

    return mapeamento[objetivoPrincipal] || objetivoPrincipal;
  };

  const getScoreColor = (score: number) => {
    if (score >= 3) return 'text-green-600';
    if (score >= 2) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 3) return '🔥';
    if (score >= 2) return '⭐';
    return '💡';
  };

  const progress = (currentStep / steps.length) * 100;

  if (isSubmitted) {
    return <SuccessStep formData={formData} />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <GoalsStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <DesignStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <ContactStep formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">
            Etapa {currentStep} de {steps.length}
          </h2>
          <div className="text-sm text-muted-foreground">
            {Math.round(progress)}% completo
          </div>
        </div>
        <Progress value={progress} className="h-2 mb-4" />
        
        {/* Step indicators */}
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center space-x-2 ${
                step.id <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id < currentStep
                    ? "bg-primary text-white"
                    : step.id === currentStep
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs text-muted-foreground">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* Resposta da IA */}
      {showAiResponse && aiResponse && (
        <Card className="card-elegant mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-blue-800">
              <Bot className="w-6 h-6" />
              Análise do Especialista em IA
            </CardTitle>
            <CardDescription className="text-blue-600">
              Nosso agente especialista analisou seu projeto e tem uma mensagem personalizada para você
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {aiResponse}
              </div>
            </div>
            
            {aiAnalysis && (
              <div className="mt-4 p-3 bg-white/50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Score de Qualificação:</span>
                    <span className={`font-bold ${getScoreColor(aiAnalysis.leadScore)}`}>
                      {aiAnalysis.leadScore}/4 {getScoreEmoji(aiAnalysis.leadScore)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Classificação:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      aiAnalysis.classificacao === 'QUENTE' ? 'bg-red-100 text-red-700' :
                      aiAnalysis.classificacao === 'MORNO' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {aiAnalysis.classificacao}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAiResponse(false)}
                className="text-blue-600 border-blue-200 hover:bg-blue-100"
              >
                Fechar Análise
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Card */}
      <Card className="card-elegant">
        <CardHeader>
          <CardTitle className="text-2xl">
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Button>

        {currentStep === steps.length ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-gradient flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <span>Enviar Solicitação</span>
                <Check className="w-4 h-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="btn-gradient flex items-center space-x-2"
          >
            <span>Próximo</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}