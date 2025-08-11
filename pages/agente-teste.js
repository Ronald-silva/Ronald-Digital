import AgentForm from "../components/AgentForm";

export default function AgenteTeste() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 Agente de IA Multi-Especialista
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nosso agente combina a expertise de Neil Patel (captação), 
            Jill Konrath (qualificação) e Gary Vaynerchuk (vendas) 
            para oferecer a melhor experiência de atendimento.
          </p>
        </div>
        
        <AgentForm />
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Powered by LangChain + Grok API | Ronald Digital © 2025
          </p>
        </div>
      </div>
    </div>
  );
}