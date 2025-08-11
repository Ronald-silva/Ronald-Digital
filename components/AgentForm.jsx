import { useState } from "react";

export default function AgentForm() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
    tipoServico: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/agente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data);
      } else {
        setError(data.error || "Erro desconhecido");
      }
    } catch (err) {
      console.error("Erro ao enviar formulário:", err);
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        🤖 Agente de IA - Ronald Digital
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo *
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Seu nome completo"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label htmlFor="tipoServico" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Serviço
          </label>
          <select
            id="tipoServico"
            name="tipoServico"
            value={formData.tipoServico}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione um serviço</option>
            <option value="landing-page">Landing Page (R$ 500-1.000)</option>
            <option value="portfolio">Portfólio (R$ 400-800)</option>
            <option value="site-blog">Site/Blog (R$ 800-2.000)</option>
            <option value="ecommerce">E-commerce</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div>
          <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
            Mensagem *
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            value={formData.mensagem}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Conte-nos sobre seu projeto, necessidades, orçamento e prazo..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "🤖 Processando..." : "🚀 Enviar para IA"}
        </button>
      </form>

      {/* Resposta do Agente */}
      {response && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            🎯 Resposta do Especialista
          </h3>
          <div className="text-green-700 whitespace-pre-wrap">
            {response.resposta}
          </div>
          
          {response.leadScore && (
            <div className="mt-3 text-sm text-green-600">
              <strong>Score do Lead:</strong> {response.leadScore}/4 | 
              <strong> Etapa:</strong> {response.etapa} |
              <strong> Próxima Ação:</strong> {response.proximaAcao}
            </div>
          )}
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            ❌ Erro
          </h3>
          <div className="text-red-700">
            {error}
          </div>
        </div>
      )}

      {/* Informações */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">
          ℹ️ Como funciona
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Neil Patel:</strong> Analisa sua necessidade e faz perguntas estratégicas</li>
          <li>• <strong>Jill Konrath:</strong> Qualifica seu projeto usando metodologia BANT</li>
          <li>• <strong>Gary Vaynerchuk:</strong> Apresenta proposta personalizada ou nutre o relacionamento</li>
        </ul>
      </div>
    </div>
  );
}