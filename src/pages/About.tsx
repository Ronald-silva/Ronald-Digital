import { CheckCircle, Code, Lightbulb, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ronaldPhoto from "@/assets/ronald-photo.jpg";

export default function About() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Sobre <span className="text-gradient">Ronald Digital</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Estudante apaixonado por programação e desenvolvimento web, especializado em criar experiências digitais únicas
          </p>
        </div>

        {/* About Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">
          <div className="lg:w-2/5">
            <img 
              src={ronaldPhoto} 
              alt="Ronald - Desenvolvedor Web" 
              className="w-72 h-72 rounded-full object-cover mx-auto shadow-lg"
            />
          </div>
          
          <div className="lg:w-3/5">
            <h2 className="text-3xl font-bold mb-6">Minha História</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Sou Ronald, desenvolvedor web especializado em criar experiências digitais que realmente convertem. 
              Com 2 anos de experiência no mercado, já ajudei mais de 50 empresas a transformarem sua presença online.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Minha paixão é combinar design elegante com funcionalidade impecável, utilizando as tecnologias mais 
              modernas do mercado para entregar resultados que superam expectativas.
            </p>
            <Button asChild className="btn-gradient">
              <Link to="/contato">Vamos Conversar</Link>
            </Button>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <div className="card-elegant p-6 rounded-xl text-center">
            <Code className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Tecnologias Modernas</h3>
            <p className="text-sm text-muted-foreground">HTML5, CSS3, JavaScript, React</p>
          </div>
          <div className="card-elegant p-6 rounded-xl text-center">
            <Lightbulb className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Soluções Criativas</h3>
            <p className="text-sm text-muted-foreground">Design único e funcional</p>
          </div>
          <div className="card-elegant p-6 rounded-xl text-center">
            <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Foco no Cliente</h3>
            <p className="text-sm text-muted-foreground">Atendimento personalizado</p>
          </div>
          <div className="card-elegant p-6 rounded-xl text-center">
            <CheckCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Qualidade Garantida</h3>
            <p className="text-sm text-muted-foreground">Projetos de alta qualidade</p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-elegant p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Minha Missão</h3>
            <p className="text-muted-foreground">
              Criar soluções digitais personalizadas que ajudem empresas e profissionais a se destacarem online, 
              transformando ideias em experiências digitais memoráveis e eficazes.
            </p>
          </div>
          
          <div className="card-elegant p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Minha Visão</h3>
            <p className="text-muted-foreground">
              Ser reconhecido como uma referência em desenvolvimento web, oferecendo soluções inovadoras que 
              combinem design excepcional com funcionalidade impecável.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}