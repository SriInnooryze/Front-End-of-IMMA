import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export function Stepper({ currentStep, totalSteps }: StepperProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            {/* Step Node */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  step < currentStep &&
                    "bg-primary border-primary",
                  step === currentStep &&
                    "border-primary text-primary glow-subtle",
                  step > currentStep &&
                    "border-muted text-muted-foreground"
                )}
              >
                {step < currentStep ? (
                  <Check className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <span className="text-sm font-medium">{step}</span>
                )}
              </div>
              <div
                className={cn(
                  "mt-2 text-xs text-center transition-colors duration-200",
                  step === currentStep && "text-primary font-medium",
                  step < currentStep && "text-primary",
                  step > currentStep && "text-muted-foreground"
                )}
              >
                Step {step}
              </div>
            </div>
            
            {/* Connector Line */}
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 transition-all duration-200",
                  step < currentStep
                    ? "bg-primary"
                    : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}