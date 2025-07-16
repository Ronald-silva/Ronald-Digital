import { Star, Quote } from "lucide-react";
import mhImage from '../../assets/mh.png';


const testimonials = [
  {
    name: "Heribaldo Ferreira",
    role: "Professor",
    content: "Recomendo a todos os que buscam qualidade, inovação e um parceiro comprometido com o sucesso do seu negócio online. Ele não entrega apenas sites; ele entrega soluções que impulsionam resultados. Sou muito grato por essa parceria!",
    rating: 5,
    image: mhImage
  },
  {
    name: "João Santos",
    role: "Fotógrafo",
    content: "Meu portfólio ficou espetacular. Agora consigo mostrar meu trabalho de forma profissional.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Ana Costa",
    role: "Designer",
    content: "Atendimento impecável e resultado final perfeito. Recomendo para todos!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O que nossos <span className="text-gradient">clientes dizem</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Depoimentos reais de quem confia no nosso trabalho
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name}
              className="card-elegant card-hover p-8 rounded-xl relative"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-blue-500/20" />
              
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}