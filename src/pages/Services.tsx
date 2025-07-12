import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const servicePackages = [
  {
    name: "Básico",
    price: "R$ 799",
    description: "Ideal para freelancers e pequenos negócios",
    features: [
      "Design responsivo",
      "Até 5 páginas",
      "Formulário de contato",
      "Otimização básica SEO",
      "Integração com redes sociais",
      "30 dias de suporte"
    ]
  },
  {
    name: "Profissional",
    price: "R$ 1.299",
    description: "Perfeito para empresas em crescimento",
    features: [
      "Tudo do plano Básico",
      "Até 10 páginas",
      "Blog integrado",
      "SEO avançado",
      "Analytics integrado",
      "Chat online",
      "60 dias de suporte"
    ],
    popular: true
  },
  {
    name: "Premium",
    price: "R$ 1.999",
    description: "Solução completa para grandes projetos",
    features: [
      "Tudo do plano Profissional",
      "Páginas ilimitadas",
      "E-commerce básico",
      "Integrações avançadas",
      "Treinamento personalizado",
      "3 meses de suporte",
      "Manutenção mensal inclusa"
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
            Soluções digitais completas para transformar sua presença online e acelerar seu crescimento
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {servicePackages.map((pkg, index) => (
            <div 
              key={pkg.name}
              className={`card-elegant card-hover p-8 rounded-xl relative ${
                pkg.popular ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-primary-glow text-white px-4 py-2 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold text-primary mb-2">{pkg.price}</div>
                <p className="text-muted-foreground">{pkg.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                asChild 
                className={`w-full ${pkg.popular ? 'btn-gradient' : ''}`}
                variant={pkg.popular ? 'default' : 'outline'}
              >
                <Link to="/contato">
                  Escolher Plano
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Custom Solutions */}
        <div className="card-elegant p-8 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Precisa de algo personalizado?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Cada projeto é único. Oferecemos soluções sob medida para atender às suas necessidades específicas.
          </p>
          <Button asChild className="btn-gradient">
            <Link to="/contato">Solicitar Orçamento Personalizado</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}