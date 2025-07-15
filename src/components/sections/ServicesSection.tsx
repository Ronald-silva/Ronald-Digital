import { Monitor, Palette, TrendingUp, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Monitor,
    title: "Sites Institucionais",
    description: "Sites corporativos modernos, responsivos e otimizados para SEO que fortalecem sua marca.",
    features: ["Design Responsivo", "SEO Otimizado", "Carregamento Rápido"]
  },
  {
    icon: Palette,
    title: "Portfólios Profissionais",
    description: "Portfólios impactantes que destacam seu trabalho e atraem clientes ideais.",
    features: ["Design Único", "Galeria Interativa", "Otimização Mobile"]
  },
  {
    icon: TrendingUp,
    title: "Landing Pages",
    description: "Páginas de alta conversão estrategicamente desenvolvidas para gerar leads e vendas.",
    features: ["Alta Conversão", "A/B Testing", "Analytics Integrado"]
  },
  {
    icon: Globe,
    title: "Blogs Personalizados",
    description: "Blogs funcionais e atraentes que engajam sua audiência e melhoram seu SEO.",
    features: ["CMS Intuitivo", "SEO Friendly", "Design Atrativo"]
  }
];

export function ServicesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Serviços que <span className="text-gradient">Transformam</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Soluções digitais completas para elevar sua presença online
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {services.map((service, index) => (
            <div 
              key={service.title} 
              className="card-elegant card-hover p-6 rounded-xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-xl mb-6 mx-auto">
                <service.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-center mb-4">{service.title}</h3>
              <p className="text-muted-foreground text-center mb-6">{service.description}</p>
              
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="btn-gradient">
            <Link to="/servicos">
              Ver Todos os Serviços
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}