import { GlowingCard } from "@/components/GlowingCard";
import { Building2, Users } from "lucide-react";
interface Step1BusinessTypeProps {
  onSelect: (type: "B2B" | "B2C") => void;
}
export function Step1BusinessType({
  onSelect
}: Step1BusinessTypeProps) {
  return <div className="animate-fade-in space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
          Select your business model
        </h2>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          This helps us tailor benchmarks and recommendations that are relevant to how your business operates.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <GlowingCard onClick={() => onSelect("B2B")} className="flex flex-col items-center justify-center py-10 md:py-12 space-y-4 glass-card-solid hover:border-primary/60">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">B2B</h3>
          <p className="text-center text-muted-foreground text-sm px-4">
            Business to Business — selling products or services to other companies
          </p>
        </GlowingCard>

        <GlowingCard onClick={() => onSelect("B2C")} className="flex flex-col items-center justify-center py-10 md:py-12 space-y-4 glass-card-solid hover:border-primary/60">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">B2C</h3>
          <p className="text-center text-muted-foreground text-sm px-4">
            Business to Consumer — selling directly to individual customers
          </p>
        </GlowingCard>
      </div>

      
    </div>;
}