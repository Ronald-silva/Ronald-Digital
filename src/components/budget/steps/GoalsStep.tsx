import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, ShoppingCart, Users, Search, Mail, Phone, MessageSquare, Calendar } from "lucide-react";
import { BudgetFormData } from "../BudgetWizard";

interface GoalsStepProps {
  formData: BudgetFormData;
  updateFormData: (data: Partial<BudgetFormData>) => void;
}

const objectives = [
  { value: "atrair-clientes", label: "Atrair novos clientes", icon: Users },
  { value: "vender-online", label: "Vender produtos/serviços online", icon: ShoppingCart },
  { value: "melhorar-credibilidade", label: "Melhorar credibilidade", icon: Target },
  { value: "mostrar-trabalhos", label: "Mostrar trabalhos/portfólio", icon: Search },
];

const features = [
  { id: "formulario-contato", label: "Formulário de contato", icon: Mail },
  { id: "whatsapp", label: "Integração com WhatsApp", icon: Phone },
  { id: "chat-online", label: "Chat online", icon: MessageSquare },
  { id: "agendamento", label: "Sistema de agendamento", icon: Calendar },
  { id: "blog", label: "Blog/Notícias", icon: MessageSquare },
  { id: "galeria", label: "Galeria de fotos", icon: Search },
  { id: "seo", label: "Otimização para Google (SEO)", icon: Search },
  { id: "responsivo", label: "Design responsivo (mobile)", icon: Phone },
];

export function GoalsStep({ formData, updateFormData }: GoalsStepProps) {
  const handleFeatureToggle = (featureId: string) => {
    const updatedFeatures = formData.funcionalidades.includes(featureId)
      ? formData.funcionalidades.filter(id => id !== featureId)
      : [...formData.funcionalidades, featureId];
    
    updateFormData({ funcionalidades: updatedFeatures });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Objetivo Principal *
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {objectives.map((objective) => {
            const Icon = objective.icon;
            return (
              <Card
                key={objective.value}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.objetivoPrincipal === objective.value
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => updateFormData({ objetivoPrincipal: objective.value })}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      formData.objetivoPrincipal === objective.value
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-base">{objective.label}</CardTitle>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Funcionalidades Desejadas *
        </Label>
        <p className="text-sm text-muted-foreground">
          Selecione todas as funcionalidades que você gostaria de ter no seu site:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isSelected = formData.funcionalidades.includes(feature.id);
            
            return (
              <div
                key={feature.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => handleFeatureToggle(feature.id)}
              >
                <Checkbox
                  id={feature.id}
                  checked={isSelected}
                  onChange={() => handleFeatureToggle(feature.id)}
                  className="pointer-events-none"
                />
                <div className="flex items-center space-x-2">
                  <Icon className={`w-4 h-4 ${
                    isSelected ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <Label
                    htmlFor={feature.id}
                    className={`cursor-pointer ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {feature.label}
                  </Label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Dica:</strong> Quanto mais específico você for sobre seus objetivos, 
          melhor poderemos personalizar a solução para seu negócio.
        </p>
      </div>
    </div>
  );
}