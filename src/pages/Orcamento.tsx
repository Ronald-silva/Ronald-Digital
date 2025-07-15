import { BudgetWizard } from "@/components/budget/BudgetWizard";

export default function Orcamento() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Solicitar <span className="text-gradient">Orçamento</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conte-nos sobre seu projeto e receba uma proposta personalizada em poucos passos
          </p>
        </div>

        {/* Wizard */}
        <BudgetWizard />
      </div>
    </div>
  );
}