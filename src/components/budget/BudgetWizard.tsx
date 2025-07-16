import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { sendBudgetNotification } from "@/services/notificationService";
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