import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Sparkles, Layers, Heart } from "lucide-react";
import { BudgetFormData } from "../BudgetWizard";

interface DesignStepProps {
  formData: BudgetFormData;
  updateFormData: (data: Partial<BudgetFormData>) => void;
}

const styles = [
  { 
    value: "moderno", 
    label: "Moderno", 
    icon: Sparkles, 
    description: "Design clean, minimalista e atual",
    color: "bg-blue-500"
  },
  { 
    value: "elegante", 
    label: "Elegante", 
    icon: Heart, 
    description: "Sofisticado e refinado",
    color: "bg-purple-500"
  },
  { 
    value: "criativo", 
    label: "Criativo", 
    icon: Palette, 
    description: "Único, artístico e diferenciado",
    color: "bg-pink-500"
  },
  { 
    value: "profissional", 
    label: "Profissional", 
    icon: Layers, 
    description: "Sério, confiável e corporativo",
    color: "bg-slate-500"
  },
];

export function DesignStep({ formData, updateFormData }: DesignStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Estilo Visual Preferido *
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {styles.map((style) => {
            const Icon = style.icon;
            return (
              <Card
                key={style.value}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.estiloPreferido === style.value
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => updateFormData({ estiloPreferido: style.value })}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${
                      formData.estiloPreferido === style.value
                        ? "bg-primary text-white"
                        : style.color + " text-white"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{style.label}</CardTitle>
                      <CardDescription className="text-sm">
                        {style.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="inspiracoes" className="text-sm font-medium">
          Inspirações e Referências
        </Label>
        <Textarea
          id="inspiracoes"
          value={formData.inspiracoes}
          onChange={(e) => updateFormData({ inspiracoes: e.target.value })}
          placeholder="Compartilhe sites que você admira, cores preferidas, ou qualquer inspiração para o design do seu projeto..."
          className="min-h-[100px] resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Exemplos: "Gosto do design do site da Apple", "Prefiro cores azul e branco", "Quero algo similar ao site X"
        </p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Dica:</strong> Não se preocupe se não tiver certeza sobre o estilo. 
          Podemos discutir as opções durante nossa conversa e fazer ajustes conforme necessário.
        </p>
      </div>
    </div>
  );
}