import { Bot, Cog, FileText, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  { icon: Cog, text: "Calculando tempo de ciclo e eficiência..." },
  { icon: Shield, text: "Verificando carga útil e normas de segurança NR-12..." },
  { icon: Zap, text: "Dimensionando componentes e alcance do robô..." },
  { icon: Bot, text: "Gerando proposta técnica e comercial com IA..." },
  { icon: FileText, text: "Formatando documento profissional..." },
];

export function GeneratingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full brand-gradient flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
          <Bot className="h-10 w-10 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Gerando Proposta</h2>
        <p className="text-muted-foreground mb-8">
          A IA está processando os dados e gerando sua proposta completa
        </p>
        <div className="space-y-4 text-left">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : isDone
                    ? "text-success"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "animate-spin" : ""}`} />
                <span className={`text-sm ${isActive ? "font-medium" : ""}`}>{step.text}</span>
                {isDone && <span className="ml-auto text-success">✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
