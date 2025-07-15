import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Entre em <span className="text-gradient">Contato</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transforme sua visão em realidade digital. Entre em contato e vamos discutir como podemos impulsionar seu negócio
          </p>
        </div>

        {/* Contact Information Section */}
        <div className="max-w-4xl mx-auto">
          <div className="card-elegant p-8 rounded-xl mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Como Entrar em Contato</h2>
            <p className="text-muted-foreground text-center mb-8">
              Estamos prontos para transformar suas ideias em realidade digital. Entre em contato através dos canais abaixo.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-4">
                  <Mail className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground mb-2">ronald.digital27@gmail.com</p>
                <p className="text-sm text-muted-foreground">Resposta em até 24h</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-4">
                  <Phone className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <p className="text-muted-foreground mb-2">(85) 99199-3833</p>
                <p className="text-sm text-muted-foreground">Para conversas rápidas</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Localização</h3>
                <p className="text-muted-foreground mb-2">Fortaleza, CE</p>
                <p className="text-sm text-muted-foreground">Atendimento remoto</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-elegant p-8 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Horário de Atendimento</h3>
              <p className="text-muted-foreground mb-6">
                Estamos disponíveis para atender você nos seguintes horários:
              </p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="font-medium">Segunda a Sexta</span>
                  <span className="text-muted-foreground">9h às 18h</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="font-medium">Sábado</span>
                  <span className="text-muted-foreground">9h às 12h</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Domingo</span>
                  <span className="text-muted-foreground">Fechado</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mt-6">
                <p className="text-sm text-blue-600">
                  <strong>Urgências:</strong> Entre em contato via WhatsApp para respostas mais rápidas.
                </p>
              </div>
            </div>

            <div className="card-elegant p-8 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Pronto para Começar?</h3>
              <p className="text-muted-foreground mb-6">
                Tem um projeto em mente? Solicite um orçamento personalizado e vamos transformar sua visão em realidade.
              </p>
              
              <Button asChild className="w-full btn-gradient mb-4">
                <Link to="/orcamento">
                  Solicitar Orçamento
                  <Send className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <p className="text-sm text-center text-muted-foreground">
                Resposta garantida em até 24 horas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}