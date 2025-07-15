import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, DollarSign, Clock, MessageSquare } from "lucide-react";
import { BudgetFormData } from "../BudgetWizard";

interface ContactStepProps {
  formData: BudgetFormData;
  updateFormData: (data: Partial<BudgetFormData>) => void;
}

const budgetRanges = [
  { value: "ate-2000", label: "Até R$ 2.000" },
  { value: "2000-5000", label: "R$ 2.000 - R$ 5.000" },
  { value: "5000-10000", label: "R$ 5.000 - R$ 10.000" },
  { value: "10000-20000", label: "R$ 10.000 - R$ 20.000" },
  { value: "acima-20000", label: "Acima de R$ 20.000" },
  { value: "nao-sei", label: "Não tenho certeza" },
];

const timeframes = [
  { value: "urgente", label: "Urgente (até 1 semana)" },
  { value: "1-2-semanas", label: "1-2 semanas" },
  { value: "1-mes", label: "Até 1 mês" },
  { value: "2-3-meses", label: "2-3 meses" },
  { value: "flexivel", label: "Flexível" },
];

export function ContactStep({ formData, updateFormData }: ContactStepProps) {
  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">Informações de Contato</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium">
              Nome Completo *
            </Label>
            <Input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => updateFormData({ nome: e.target.value })}
              placeholder="Seu nome completo"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              E-mail *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              placeholder="seu@email.com"
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone" className="text-sm font-medium">
            WhatsApp/Telefone *
          </Label>
          <Input
            id="telefone"
            type="tel"
            value={formData.telefone}
            onChange={(e) => updateFormData({ telefone: e.target.value })}
            placeholder="(11) 99999-9999"
            className="h-11"
          />
        </div>
      </div>

      {/* Budget and Timeline */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <DollarSign className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">Orçamento e Prazo</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Orçamento Estimado
            </Label>
            <Select value={formData.orcamentoEstimado} onValueChange={(value) => updateFormData({ orcamentoEstimado: value })}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione uma faixa" />
              </SelectTrigger>
              <SelectContent>
                {budgetRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Prazo Desejado
            </Label>
            <Select value={formData.prazoDesejado} onValueChange={(value) => updateFormData({ prazoDesejado: value })}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Quando precisa ficar pronto?" />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map((timeframe) => (
                  <SelectItem key={timeframe.value} value={timeframe.value}>
                    {timeframe.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Additional Message */}
      <div className="space-y-2">
        <Label htmlFor="mensagemAdicional" className="text-sm font-medium">
          Mensagem Adicional
        </Label>
        <Textarea
          id="mensagemAdicional"
          value={formData.mensagemAdicional}
          onChange={(e) => updateFormData({ mensagemAdicional: e.target.value })}
          placeholder="Conte-nos mais sobre seu projeto, dúvidas específicas ou qualquer informação adicional que considere importante..."
          className="min-h-[100px] resize-none"
        />
      </div>

      {/* Summary Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span>Próximos Passos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div>
              <p className="text-sm font-medium">Análise da Solicitação</p>
              <p className="text-xs text-muted-foreground">
                Analisaremos seus requisitos em até 24 horas
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div>
              <p className="text-sm font-medium">Contato Inicial</p>
              <p className="text-xs text-muted-foreground">
                Entraremos em contato via WhatsApp para esclarecer detalhes
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div>
              <p className="text-sm font-medium">Proposta Personalizada</p>
              <p className="text-xs text-muted-foreground">
                Enviaremos uma proposta detalhada com cronograma e valores
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}