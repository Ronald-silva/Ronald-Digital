import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Store, Globe, Users } from "lucide-react";
import { BudgetFormData } from "../BudgetWizard";

interface BasicInfoStepProps {
  formData: BudgetFormData;
  updateFormData: (data: Partial<BudgetFormData>) => void;
}

const businessTypes = [
  { value: "ecommerce", label: "E-commerce", icon: Store, description: "Loja online para vender produtos" },
  { value: "servicos", label: "Serviços", icon: Users, description: "Empresa prestadora de serviços" },
  { value: "portfolio", label: "Portfólio", icon: Globe, description: "Showcase de trabalhos e projetos" },
  { value: "institucional", label: "Institucional", icon: Building, description: "Site corporativo empresarial" },
];

export function BasicInfoStep({ formData, updateFormData }: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nomeNegocio" className="text-sm font-medium">
          Nome do Negócio *
        </Label>
        <Input
          id="nomeNegocio"
          type="text"
          value={formData.nomeNegocio}
          onChange={(e) => updateFormData({ nomeNegocio: e.target.value })}
          placeholder="Digite o nome do seu negócio"
          className="h-11"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Tipo de Negócio *
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {businessTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.value}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.tipoNegocio === type.value
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => updateFormData({ tipoNegocio: type.value })}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      formData.tipoNegocio === type.value
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{type.label}</CardTitle>
                      <CardDescription className="text-xs">
                        {type.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Dica:</strong> Essas informações nos ajudam a entender melhor seu negócio e 
          personalizar a proposta de acordo com suas necessidades específicas.
        </p>
      </div>
    </div>
  );
}