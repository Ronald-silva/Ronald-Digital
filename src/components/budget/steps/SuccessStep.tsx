import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle, Calendar, FileText, ArrowRight } from "lucide-react";
import { BudgetFormData } from "../BudgetWizard";
import { Link } from "react-router-dom";

interface SuccessStepProps {
  formData: BudgetFormData;
}

export function SuccessStep({ formData }: SuccessStepProps) {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* Success Header */}
      <div className="space-y-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Solicitação Enviada com Sucesso!
        </h1>
        <p className="text-lg text-muted-foreground">
          Obrigado pelo interesse, <strong>{formData.nome}</strong>! 
          Sua solicitação foi recebida e será analisada em breve.
        </p>
      </div>

      {/* Summary Card */}
      <Card className="card-elegant text-left">
        <CardHeader>
          <CardTitle className="text-xl">Resumo da Solicitação</CardTitle>
          <CardDescription>
            Aqui está um resumo das informações que você forneceu:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Negócio</p>
              <p className="text-foreground">{formData.nomeNegocio}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo</p>
              <p className="text-foreground capitalize">{formData.tipoNegocio?.replace('-', ' ')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Objetivo</p>
              <p className="text-foreground capitalize">{formData.objetivoPrincipal?.replace('-', ' ')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estilo</p>
              <p className="text-foreground capitalize">{formData.estiloPreferido}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contato</p>
              <p className="text-foreground">{formData.telefone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">E-mail</p>
              <p className="text-foreground">{formData.email}</p>
            </div>
          </div>
          
          {formData.funcionalidades.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Funcionalidades</p>
              <div className="flex flex-wrap gap-2">
                {formData.funcionalidades.map((func) => (
                  <span
                    key={func}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {func.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div>
              <p className="font-medium">Análise da Solicitação</p>
              <p className="text-sm text-muted-foreground">
                Nossa equipe analisará seus requisitos em até 24 horas
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div>
              <p className="font-medium">Contato Inicial</p>
              <p className="text-sm text-muted-foreground">
                Entraremos em contato via WhatsApp para esclarecer detalhes
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div>
              <p className="font-medium">Proposta Personalizada</p>
              <p className="text-sm text-muted-foreground">
                Enviaremos uma proposta detalhada com cronograma e valores
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          asChild
          className="btn-gradient flex items-center space-x-2"
        >
          <Link to="/contato">
            <MessageCircle className="w-4 h-4" />
            <span>Falar no WhatsApp</span>
          </Link>
        </Button>
        
        <Button
          asChild
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Link to="/portfolio">
            <FileText className="w-4 h-4" />
            <span>Ver Portfólio</span>
          </Link>
        </Button>
      </div>

      {/* Contact Info */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Dúvidas?</strong> Entre em contato conosco:
        </p>
        <p className="text-sm">
          WhatsApp: <span className="text-primary font-medium">(11) 99999-9999</span> | 
          E-mail: <span className="text-primary font-medium">contato@ronalddigital.com</span>
        </p>
      </div>
    </div>
  );
}