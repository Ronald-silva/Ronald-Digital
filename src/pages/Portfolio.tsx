import { useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const portfolioItems = [
  {
    id: 1,
    title: "Portfólio Fotógrafo",
    category: "portfolio",
    description: "Portfólio elegante para fotógrafo profissional com galeria interativa",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    technologies: ["React", "CSS3", "JavaScript"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 2,
    title: "Site Empresa Tech",
    category: "site",
    description: "Site institucional moderno para empresa de tecnologia",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    technologies: ["React", "Tailwind", "TypeScript"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 3,
    title: "Landing Page SaaS",
    category: "landing",
    description: "Landing page de alta conversão para produto SaaS",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
    technologies: ["Next.js", "Tailwind", "Framer Motion"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 4,
    title: "Blog Pessoal",
    category: "blog",
    description: "Blog responsivo com sistema de gestão de conteúdo",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop",
    technologies: ["React", "Node.js", "MongoDB"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 5,
    title: "E-commerce Fashion",
    category: "site",
    description: "Loja online completa com carrinho e pagamento",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    technologies: ["React", "Node.js", "Stripe"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 6,
    title: "Portfolio Designer",
    category: "portfolio",
    description: "Portfólio criativo para designer gráfico",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
    technologies: ["React", "GSAP", "CSS3"],
    liveUrl: "#",
    githubUrl: "#"
  }
];

const categories = [
  { value: "all", label: "Todos" },
  { value: "portfolio", label: "Portfólios" },
  { value: "site", label: "Sites" },
  { value: "landing", label: "Landing Pages" },
  { value: "blog", label: "Blogs" }
];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems = selectedCategory === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Nosso <span className="text-gradient">Portfólio</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cada projeto é desenvolvido com foco em resultados, combinando design moderno e funcionalidade excepcional
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
              className={selectedCategory === category.value ? "btn-gradient" : ""}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="card-elegant card-hover rounded-xl overflow-hidden">
              <div className="relative group">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex gap-2">
                      {item.liveUrl !== "#" && (
                        <Button size="sm" variant="secondary" asChild>
                          <a href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {item.githubUrl !== "#" && (
                        <Button size="sm" variant="secondary" asChild>
                          <a href={item.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {item.liveUrl === "#" && item.githubUrl === "#" && (
                        <div className="bg-black/50 text-white px-3 py-1 rounded text-sm">
                          Em breve
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-1 bg-blue-100 text-blue-500 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="card-elegant p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-4">Gostou do que viu?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Estes são apenas alguns exemplos do nosso trabalho. Cada projeto é único e desenvolvido especialmente para atender às necessidades do cliente.
            </p>
            <Button asChild className="btn-gradient">
              <Link to="/orcamento">Solicitar Orçamento</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}