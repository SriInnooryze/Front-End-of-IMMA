import { useState } from "react";
import { GlowingCard } from "@/components/GlowingCard";
import { Button } from "@/components/ui/button";
import { GrowthSimulationCategory } from "@/api";
import { ArrowRight, TrendingUp, ChevronLeft, Target, Info, ArrowUpRight, Zap, BarChart3, Users } from "lucide-react";
import { FocusTooltip } from "@/components/FocusTooltip";

interface Step6GrowthProps {
  assessmentId: string;
  selectedPlan: "crawl" | "walk" | "run";
  simulation: GrowthSimulationCategory[] | GrowthSimulationCategory | null | undefined;
  onFinish: () => void;
  onBack?: () => void;
  onChangePlan?: (plan: "crawl" | "walk" | "run") => void;
}

const PLAN_LABELS = {
  crawl: { label: "Crawl", subtitle: "Foundations", description: "Establish core capabilities" },
  walk: { label: "Walk", subtitle: "Acceleration", description: "Scale what's working" },
  run: { label: "Run", subtitle: "Transformation", description: "Drive market leadership" },
};

const CATEGORY_INSIGHTS: Record<string, string> = {
  "data-management": "Strong data foundations enable better targeting and measurement.",
  "audience-segmentation": "Clear segmentation improves campaign relevance and conversion.",
  "channel-mix": "Optimized channel mix maximizes reach and efficiency.",
  "lead-pipeline": "Aligned qualification accelerates revenue velocity.",
  "conversion": "Streamlined conversion paths improve customer acquisition.",
  "analytics-reporting": "Better insights lead to faster, smarter decisions.",
  "people-process": "Capable teams with clear processes scale execution.",
  "technology-enablement": "Right technology removes friction and enables growth.",
};

// Dynamic outcomes based on selected plan - PERSONALIZED and outcome-driven
const PLAN_OUTCOMES: Record<"crawl" | "walk" | "run", { icon: any; headline: string; text: string }[]> = {
  crawl: [
    { icon: Zap, headline: "Reduced manual effort", text: "Stabilizing data foundations and standardizing processes reduces manual coordination and increases execution velocity across campaigns" },
    { icon: BarChart3, headline: "Consistent measurement", text: "Improved measurement frameworks enable more reliable performance tracking and clearer ROI visibility for stakeholders" },
    { icon: Users, headline: "Stronger alignment", text: "Documented processes and clearer data flows improve cross-functional alignment between marketing, sales, and operations" },
  ],
  walk: [
    { icon: Zap, headline: "Faster execution", text: "Automation of repetitive tasks accelerates campaign delivery and frees up team capacity for strategic initiatives" },
    { icon: Users, headline: "Higher relevance", text: "Enhanced personalization across touchpoints drives better engagement, higher conversion rates, and improved customer experience" },
    { icon: BarChart3, headline: "Clearer attribution", text: "Stronger attribution connects marketing activities directly to revenue impact, enabling smarter budget allocation" },
  ],
  run: [
    { icon: Zap, headline: "Scale without proportional growth", text: "Advanced automation enables you to scale campaign volume and complexity without proportional increases in team size or cost" },
    { icon: Users, headline: "Predictive engagement", text: "AI-driven personalization and real-time orchestration deliver the right message at the right moment across every touchpoint" },
    { icon: BarChart3, headline: "Predictable revenue", text: "Mature data and analytics capabilities support more accurate forecasting, proactive decision-making, and growth leadership" },
  ],
};

export function Step6Growth({
  assessmentId,
  selectedPlan,
  simulation,
  onFinish,
  onBack,
  onChangePlan,
}: Step6GrowthProps) {
  const [activePlan, setActivePlan] = useState<"crawl" | "walk" | "run">(selectedPlan);

  const handlePlanChange = (plan: "crawl" | "walk" | "run") => {
    setActivePlan(plan);
    onChangePlan?.(plan);
  };

  const simulationArray: GrowthSimulationCategory[] = Array.isArray(simulation)
    ? simulation
    : simulation
    ? [simulation as GrowthSimulationCategory]
    : [];

  const parseScores = (category: GrowthSimulationCategory) => {
    const current =
      typeof (category as any).currentScore === "number"
        ? (category as any).currentScore
        : typeof (category as any).current === "number"
        ? (category as any).current
        : 0;

    const after =
      typeof (category as any).afterScore === "number"
        ? (category as any).afterScore
        : typeof (category as any).projectedScore === "number"
        ? (category as any).projectedScore
        : typeof (category as any).after === "number"
        ? (category as any).after
        : 0;

    const benchmark =
      typeof (category as any).benchmarkScore === "number"
        ? (category as any).benchmarkScore
        : typeof (category as any).benchmark === "number"
        ? (category as any).benchmark
        : 0;

    return { current, after, benchmark };
  };

  const overall = simulationArray.length
    ? simulationArray.reduce(
        (acc, cat) => {
          const { current, after, benchmark } = parseScores(cat);
          acc.current += current;
          acc.after += after;
          acc.benchmark += benchmark;
          return acc;
        },
        { current: 0, after: 0, benchmark: 0 }
      )
    : { current: 0, after: 0, benchmark: 0 };

  if (simulationArray.length) {
    overall.current /= simulationArray.length;
    overall.after /= simulationArray.length;
    overall.benchmark = overall.benchmark > 0 ? overall.benchmark / simulationArray.length : 0;
  }

  const overallLift = overall.current > 0 ? ((overall.after - overall.current) / overall.current * 100) : 0;
  const gapToClose = overall.benchmark - overall.current;
  const gapAfter = overall.benchmark - overall.after;
  const gapClosed = gapToClose > 0 ? ((gapToClose - gapAfter) / gapToClose * 100) : 0;

  // Sort by improvement potential
  const sortedCategories = [...simulationArray].sort((a, b) => {
    const aScores = parseScores(a);
    const bScores = parseScores(b);
    return (bScores.after - bScores.current) - (aScores.after - aScores.current);
  });

  const priorityCategories = sortedCategories.slice(0, 3);
  const otherCategories = sortedCategories.slice(3);

  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusLabel = (current: number, after: number, benchmark: number) => {
    if (benchmark === 0) return null;
    if (after >= benchmark) return { label: "At/Above Benchmark", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-600/20 dark:bg-emerald-500/15 border-emerald-600/40 dark:border-emerald-500/30" };
    if (after >= benchmark - 0.5) return { label: "Near Benchmark", color: "text-amber-700 dark:text-amber-400 bg-amber-600/20 dark:bg-amber-500/15 border-amber-600/40 dark:border-amber-500/30" };
    return { label: "Below Benchmark", color: "text-rose-700 dark:text-rose-400 bg-rose-600/20 dark:bg-rose-500/15 border-rose-600/40 dark:border-rose-500/30" };
  };

  const getCategoryInsight = (category: string) => {
    const key = category.toLowerCase().replace(/\s+/g, "-");
    return CATEGORY_INSIGHTS[key] || "Improvement in this area contributes to overall maturity.";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Your Growth Projection
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            This projection shows how close you move toward the industry benchmark with the{" "}
            <span className="font-medium text-primary">{PLAN_LABELS[activePlan].label}</span> growth path.
          </p>
        </div>

        {onBack && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="shrink-0 border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to results
          </Button>
        )}
      </div>

      {/* A. Growth Path Selection - Interactive */}
      <div className="max-w-3xl mx-auto">
        {/* Visual hint for clickability */}
        <p className="text-xs text-center text-muted-foreground mb-2">
          Switch growth path to compare projections
        </p>
        <div className="grid grid-cols-3 gap-2 p-1 bg-muted/30 rounded-xl border border-border/50">
          {(["crawl", "walk", "run"] as const).map((plan) => (
            <button
              key={plan}
              onClick={() => handlePlanChange(plan)}
              aria-pressed={activePlan === plan}
              className={`px-4 py-3 rounded-lg transition-all duration-300 text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                activePlan === plan
                  ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-[1.01]"
              }`}
            >
              <div className="text-sm font-semibold">{PLAN_LABELS[plan].label}</div>
              <div className="text-[10px] opacity-80">{PLAN_LABELS[plan].subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      {/* B. Split Layout: Overall Projection + Category Growth */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Overall Maturity Projection - HORIZONTAL BAR - BENCHMARK-LED */}
        <div className="lg:col-span-2">
          <GlowingCard className="glass-card-solid h-full cursor-default" hover={false}>
            <div className="p-6 space-y-5">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Overall Projection
              </h3>

              {/* HORIZONTAL bar visualization with animation */}
              <div className="space-y-4">
                {/* Current */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground">Current</span>
                    <span className="font-semibold text-foreground">{overall.current.toFixed(1)}</span>
                  </div>
                  <div className="relative h-4 w-full rounded-full bg-muted/50 dark:bg-muted/30 overflow-visible border border-border/30">
                    <div 
                      className="absolute inset-y-0 left-0 bg-muted-foreground/50 dark:bg-muted-foreground/40 rounded-full transition-all duration-500"
                      style={{ width: `${(overall.current / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Projected */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-primary font-semibold">Projected</span>
                    <span className="font-bold text-primary">{overall.after.toFixed(1)}</span>
                  </div>
                  <div className="relative h-4 w-full rounded-full bg-muted/50 dark:bg-muted/30 overflow-visible border border-border/30">
                    <div 
                      className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(overall.after / 5) * 100}%` }}
                    />
                    {/* Benchmark marker - VISUALLY DOMINANT */}
                    {overall.benchmark > 0 && (
                      <div 
                        className="absolute top-0 bottom-0 w-2 bg-secondary rounded-full shadow-[0_0_12px_hsl(var(--secondary)/0.8)] z-10"
                        style={{ left: `calc(${(overall.benchmark / 5) * 100}% - 4px)` }}
                      />
                    )}
                  </div>
                  {overall.benchmark > 0 && (
                    <div className="flex justify-end">
                      <span className="text-xs font-bold text-secondary">
                        Benchmark: {overall.benchmark.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Improvement metrics */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-[10px] text-muted-foreground">Improvement</p>
                  <p className="text-lg font-bold text-primary flex items-center justify-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    +{overallLift.toFixed(0)}%
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                  <p className="text-[10px] text-muted-foreground">Gap Closed</p>
                  <p className="text-lg font-bold text-secondary">
                    {gapClosed.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          </GlowingCard>
        </div>

        {/* Right: Category-level Growth - TOP 3 EXPANDED with HORIZONTAL bars */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Category Growth
          </h3>
          
          <>
            {/* Priority Categories - HORIZONTAL progress bars */}
            <div className="space-y-3">
              {priorityCategories.map((cat) => {
                const { current, after, benchmark } = parseScores(cat);
                const categoryName = (cat as any).category || "Unknown";
                const delta = after - current;
                const status = getStatusLabel(current, after, benchmark);

                return (
                  <GlowingCard key={categoryName} className="glass-card-solid cursor-default" hover={false}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-foreground">
                          {formatCategoryName(categoryName)}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded-full">
                            +{delta.toFixed(1)}
                          </span>
                          {status && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium border ${status.color}`}>
                              {status.label}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* HORIZONTAL bar visualization */}
                      <div className="space-y-2">
                        {/* Current */}
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-foreground w-16">Current</span>
                          <div className="flex-1 relative h-3 rounded-full bg-muted/50 dark:bg-muted/30 overflow-visible border border-border/30">
                            <div 
                              className="absolute inset-y-0 left-0 bg-muted-foreground/50 dark:bg-muted-foreground/40 rounded-full transition-all duration-500"
                              style={{ width: `${(current / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-foreground font-medium w-8 text-right">{current.toFixed(1)}</span>
                        </div>

                        {/* Projected with benchmark */}
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-primary font-semibold w-16">Projected</span>
                          <div className="flex-1 relative h-3 rounded-full bg-muted/50 dark:bg-muted/30 overflow-visible border border-border/30">
                            <div 
                              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700"
                              style={{ width: `${(after / 5) * 100}%` }}
                            />
                            {/* Benchmark marker */}
                            {benchmark > 0 && (
                              <div 
                                className="absolute top-0 bottom-0 w-1.5 bg-secondary rounded-full shadow-[0_0_8px_hsl(var(--secondary)/0.8)] z-10"
                                style={{ left: `calc(${(benchmark / 5) * 100}% - 3px)` }}
                              />
                            )}
                          </div>
                          <span className="text-[10px] text-primary font-semibold w-8 text-right">{after.toFixed(1)}</span>
                        </div>
                        
                        {/* Benchmark label */}
                        {benchmark > 0 && (
                          <div className="flex justify-end">
                            <span className="text-[10px] text-secondary font-semibold">
                              Benchmark: {benchmark.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="w-full mt-3 flex items-center justify-center gap-1 text-[10px] text-muted-foreground cursor-default">
                        <Info className="w-3 h-3" />
                        <span>{getCategoryInsight(categoryName)}</span>
                      </div>
                    </div>
                  </GlowingCard>
                );
              })}
            </div>

            {/* Other Categories - Compact summarized bars */}
            {otherCategories.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">Other categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {otherCategories.map((cat) => {
                    const { current, after, benchmark } = parseScores(cat);
                    const categoryName = (cat as any).category || "Unknown";
                    const delta = after - current;

                    return (
                      <div
                        key={categoryName}
                        className="glass-card-solid rounded-lg p-2.5 opacity-80"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-medium text-foreground truncate">
                            {formatCategoryName(categoryName)}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-medium">+{delta.toFixed(1)}</span>
                        </div>
                        <div className="relative h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-primary/50 rounded-full transition-all duration-500"
                            style={{ width: `${(after / 5) * 100}%` }}
                          />
                          {benchmark > 0 && (
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-secondary/70"
                              style={{ left: `${(benchmark / 5) * 100}%` }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        </div>
      </div>

      {/* Benchmark Reference Note */}
      <div className="max-w-3xl mx-auto">
        <p className="text-xs text-muted-foreground/70 text-center italic">
          Benchmark reference: Benchmarks are informed by aggregated industry research from Salesforce State of Marketing and Adobe Digital Trends, with supporting insights from McKinsey on personalization impact.
        </p>
      </div>

      {/* D. What This Means for Your Business - DYNAMIC and outcome-driven */}
      <div className="max-w-3xl mx-auto">
        <GlowingCard className="glass-card-solid border-primary/20 cursor-default" hover={false}>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              What this means for your business
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Based on your assessment and the <span className="font-medium text-primary">{PLAN_LABELS[activePlan].label}</span> path, here's how improvements will translate to outcomes:
            </p>
            <ul className="space-y-4">
              {PLAN_OUTCOMES[activePlan].map((outcome, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <outcome.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-0.5">{outcome.headline}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{outcome.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </GlowingCard>
      </div>

      {/* E. Primary CTA - Natural continuation */}
      <div className="max-w-xl mx-auto text-center space-y-5">
        <div className="space-y-2">
          <p className="text-sm text-foreground/80">
            Ready to turn these insights into action?
          </p>
        </div>
        
        <Button
          onClick={onFinish}
          size="lg"
          className="w-full md:w-auto px-10 py-6 bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-lg text-base cursor-pointer"
        >
          <ArrowRight className="w-5 h-5 mr-2" />
          View your executive growth summary
        </Button>
        
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          See your personalized executive summary with strategic insights.
        </p>
      </div>

      {/* Thank you message */}
      <div className="text-center pt-6 pb-4">
        <p className="text-sm text-muted-foreground">
          Thank you for completing the InnooRyze Marketing Maturity Assessment.
        </p>
      </div>
    </div>
  );
}
