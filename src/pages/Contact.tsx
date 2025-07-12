import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em até 24 horas.",
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Entre em <span className="text-gradient">Contato</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pronto para transformar sua presença digital? Vamos conversar sobre seu projeto!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card-elegant p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Solicitar Orçamento</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" placeholder="Seu nome" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(11) 99999-9999" />
                </div>
                <div>
                  <Label htmlFor="service">Tipo de serviço</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site">Site Institucional</SelectItem>
                      <SelectItem value="portfolio">Portfólio</SelectItem>
                      <SelectItem value="landing">Landing Page</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="custom">Projeto Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="budget">Orçamento estimado</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma faixa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500-1000">R$ 500 - R$ 1.000</SelectItem>
                    <SelectItem value="1000-2000">R$ 1.000 - R$ 2.000</SelectItem>
                    <SelectItem value="2000-5000">R$ 2.000 - R$ 5.000</SelectItem>
                    <SelectItem value="5000+">Acima de R$ 5.000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Mensagem</Label>
                <Textarea 
                  id="message" 
                  placeholder="Conte-nos sobre seu projeto..."
                  rows={5}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full btn-gradient" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    Enviar Mensagem
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="card-elegant p-8 rounded-xl">
              <h3 className="text-xl font-bold mb-6">Informações de Contato</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-muted-foreground">contato@ronalddigital.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">WhatsApp</div>
                    <div className="text-muted-foreground">(85) 99199-3833</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Localização</div>
                    <div className="text-muted-foreground">Fortaleza, CE - Brasil</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-elegant p-8 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Tempo de Resposta</h3>
              <p className="text-muted-foreground mb-4">
                Respondemos todas as mensagens em até 24 horas. Para urgências, 
                entre em contato via WhatsApp.
              </p>
              
              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="text-sm font-medium text-primary mb-1">Horário de Atendimento</div>
                <div className="text-sm text-muted-foreground">Segunda a Sexta: 9h às 18h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}