import { Monitor, Palette, TrendingUp, Globe, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Monitor,
    title: "Sites Institucionais",
    description: "Sites corporativos modernos, responsivos e otimizados para SEO que fortalecem sua marca no mercado digital.",
    features: [
      "Design responsivo para todos os dispositivos",
      "Otimização completa para motores de busca (SEO)",
      "Carregamento rápido e performance otimizada",
      "Integração com redes sociais",
      "Painel administrativo intuitivo",
      "Formulários de contato personalizados"
    ],
    benefits: [
      "Aumente sua credibilidade online",
      "Melhore o posicionamento no Google",
      "Conquiste mais clientes"
    ]
  },
  {
    icon: Palette,
    title: "Portfólios Profissionais",
    description: "Portfólios impactantes que destacam seu trabalho e atraem seus clientes ideais através de um design único.",
    features: [
      "Design personalizado e exclusivo",
      "Galeria interativa de projetos",
      "Otimização total para dispositivos móveis",
      "Sistema de categorização de trabalhos",
      "Formulário de contato integrado",
      "Carregamento otimizado de imagens"
    ],
    benefits: [
      "Destaque-se da concorrência",
      "Impressione clientes potenciais",
      "Mostre seu profissionalismo"
    ]
  },
  {
    icon: TrendingUp,
    title: "Landing Pages",
    description: "Páginas de alta conversão estrategicamente desenvolvidas para gerar leads qualificados e aumentar suas vendas.",
    features: [
      "Design focado em conversão",
      "Testes A/B para otimização",
      "Integração com ferramentas de analytics",
      "Formulários otimizados para leads",
      "Call-to-actions estratégicos",
      "Carregamento ultra-rápido"
    ],
    benefits: [
      "Aumente sua taxa de conversão",
      "Gere mais leads qualificados",
      "Maximize seu ROI em marketing"
    ]
  },
  {
    icon: Globe,
    title: "Blogs Personalizados",
    description: "Blogs funcionais e atraentes que engajam sua audiência, melhoram seu SEO e posicionam você como autoridade.",
    features: [
      "Sistema de gerenciamento de conteúdo (CMS) intuitivo",
      "Otimização SEO em cada artigo",
      "Design atrativo e profissional",
      "Sistema de comentários integrado",
      "Compartilhamento social automático",
      "Newsletter integrada"
    ],
    benefits: [
      "Construa autoridade no seu nicho",
      "Melhore seu posicionamento SEO",
      "Engaje e eduque sua audiência"
    ]
  }
];

export default function Services() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Nossos <span className="text-gradient">Serviços</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Soluções digitais completas e personalizadas para elevar sua presença online e impulsionar seus resultados
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {services.map((service, index) => (
            <div 
              key={service.title} 
              className="card-elegant card-hover p-8 rounded-xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-xl mr-4">
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">{service.title}</h3>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-foreground">O que está incluído:</h4>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-semibold mb-3 text-foreground">Benefícios:</h4>
                <ul className="space-y-1">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center text-sm font-medium text-blue-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="card-elegant p-8 rounded-xl mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Como Trabalhamos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nosso processo é transparente e colaborativo, garantindo que cada projeto seja executado com excelência
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Briefing", desc: "Entendemos suas necessidades e objetivos" },
              { step: "2", title: "Planejamento", desc: "Criamos a estratégia e estrutura do projeto" },
              { step: "3", title: "Desenvolvimento", desc: "Construímos sua solução digital" },
              { step: "4", title: "Entrega", desc: "Testamos, refinamos e colocamos no ar" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-glow text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="card-elegant p-8 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Começar seu Projeto?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Cada projeto é único e desenvolvido sob medida para suas necessidades. 
            Solicite um orçamento personalizado e vamos transformar sua visão em realidade digital.
          </p>
          <Button asChild className="btn-gradient">
            <Link to="/orcamento">
              Solicitar Orçamento Personalizado
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}