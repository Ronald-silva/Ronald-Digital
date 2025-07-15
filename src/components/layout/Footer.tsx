import { Link } from "react-router-dom";
import { Code2, Instagram, Linkedin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Ronald Digital</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Transformando ideias em experiências digitais memoráveis. 
              Criamos sites, portfólios e landing pages que convertem.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:ronald.digital27@gmail.com" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Navegação</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Início</Link></li>
              <li><Link to="/sobre" className="text-gray-300 hover:text-white transition-colors">Sobre</Link></li>
              <li><Link to="/servicos" className="text-gray-300 hover:text-white transition-colors">Serviços</Link></li>
              <li><Link to="/portfolio" className="text-gray-300 hover:text-white transition-colors">Portfólio</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>ronald.digital27@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>(85) 99199-3833</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Ronald Digital. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}