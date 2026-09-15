import { GlowingCard } from "@/components/GlowingCard";
import { Button } from "@/components/ui/button";
import { SubmitAssessmentResponse, GrowthSimulationCategory } from "@/api";
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  Gauge, 
  Compass,
  ChevronLeft,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

interface Step7ExecutiveSummaryProps {
  results: SubmitAssessmentResponse;
  selectedPlan: "crawl" | "walk" | "run";
  companyName?: string;
  businessType?: "B2B" | "B2C" | null;
  onFinish: () => void;
  onBack?: () => void;
}

const PLAN_LABELS = {
  crawl: { label: "Crawl", subtitle: "Foundations" },
  walk: { label: "Walk", subtitle: "Acceleration" },
  run: { label: "Run", subtitle: "Transformation" },
};

// Dynamic insight generation for Executive Snapshot cards
const generateMaturityInsight = (overallScore: number, benchmark: number): string => {
  const gap = benchmark - overallScore;
  if (gap <= 0) {
    return "Your marketing maturity is currently operating at or above industry benchmark.";
  }
  if (gap < 0.5) {
    return "Your marketing maturity is operating close to industry benchmark with minor gaps to close.";
  }
  if (gap < 1.0) {
    return "Your marketing maturity is currently operating slightly below industry benchmark.";
  }
  return "Your marketing maturity indicates meaningful room for improvement relative to peers.";
};

const generateGrowthPotentialInsight = (overallScore: number, projectedScore: number, benchmark: number): string => {
  const improvement = projectedScore - overallScore;
  const gapAfter = benchmark - projectedScore;
  
  if (gapAfter <= 0) {
    return "Your scores indicate strong upside with focused execution, positioning you at or above benchmark.";
  }
  if (improvement >= 1.0) {
    return "Your scores indicate significant upside potential with disciplined execution in key areas.";
  }
  if (improvement >= 0.5) {
    return "Your scores indicate solid growth opportunity with focused improvement in priority areas.";
  }
  return "Your scores indicate incremental upside through targeted optimization of existing capabilities.";
};

const generatePathInsight = (plan: "crawl" | "walk" | "run", avgGap: number): string => {
  const planLabel = PLAN_LABELS[plan].label;
  
  if (plan === "crawl") {
    return `The ${planLabel} path offers the fastest and most realistic impact by stabilizing foundations first.`;
  }
  if (plan === "walk") {
    return `The ${planLabel} path offers the fastest and most realistic impact by accelerating what's working.`;
  }
  return `The ${planLabel} path offers the fastest and most realistic impact through advanced automation and scale.`;
};

const generateBenchmarkOutlook = (projectedScore: number, benchmark: number, topCategories: string[]): string => {
  const gap = benchmark - projectedScore;
  const categoryList = topCategories.slice(0, 2).join(" and ");
  
  if (gap <= 0) {
    return `Executing the recommended path positions you to meet or exceed peers in ${categoryList}.`;
  }
  if (gap < 0.5) {
    return `Closing gaps in ${categoryList} positions you to meet or exceed peers.`;
  }
  return `Focused improvement in ${categoryList} will significantly close the gap to benchmark.`;
};

// Dynamic insight for "What you're doing well" - sentence format
const generateDoingWellSentence = (
  categoryName: string,
  companyName: string,
  gap: number,
  isB2B: boolean
): string => {
  const company = companyName || "Your organization";
  const formattedCategory = categoryName.toLowerCase();
  
  if (gap >= 1.0) {
    if (formattedCategory.includes("data")) {
      return `${company} has established foundational data management capabilities with core data capture in place, indicating early operational discipline that can be built upon systematically.`;
    }
    if (formattedCategory.includes("audience") || formattedCategory.includes("segment")) {
      return isB2B
        ? `${company} maintains defined audience profiles with account-level targeting foundations, providing a starting point for more sophisticated segmentation strategies.`
        : `${company} has baseline customer segmentation in place, creating a foundation for experience-driven personalization.`;
    }
    if (formattedCategory.includes("channel")) {
      return `${company} operates across key marketing channels with basic performance tracking, demonstrating multi-channel awareness even as optimization opportunities remain.`;
    }
    if (formattedCategory.includes("lead") || formattedCategory.includes("pipeline")) {
      return `${company} has established lead capture and handoff processes, indicating pipeline awareness that can be strengthened with automation.`;
    }
    if (formattedCategory.includes("conversion")) {
      return `${company} tracks conversion events across primary touchpoints, showing intent to optimize even as systematic testing remains limited.`;
    }
    if (formattedCategory.includes("analytics") || formattedCategory.includes("report")) {
      return `${company} has core dashboards and reporting cadences in place, demonstrating commitment to measurement even as actionable insights remain reactive.`;
    }
    if (formattedCategory.includes("people") || formattedCategory.includes("process")) {
      return `${company} maintains documented roles and repeatable processes, providing operational stability that can support more sophisticated execution.`;
    }
    if (formattedCategory.includes("technology") || formattedCategory.includes("enablement")) {
      return `${company} has deployed core marketing tools with basic integrations, establishing a technology foundation that can be optimized for scale.`;
    }
    return `${company} has established foundational ${categoryName} capabilities, indicating operational discipline that positions the team for structured improvement.`;
  }
  
  // Near benchmark - emphasize strength
  if (formattedCategory.includes("data")) {
    return `${company} demonstrates mature data management practices with consistent capture and partial cross-system integration, positioning the team close to benchmark performance.`;
  }
  if (formattedCategory.includes("audience") || formattedCategory.includes("segment")) {
    return isB2B
      ? `${company} shows strong audience targeting capabilities with account-based approaches and defined ICPs, approaching benchmark precision.`
      : `${company} delivers meaningful segmentation with behavioral targeting active, nearing the consistency needed for competitive personalization.`;
  }
  if (formattedCategory.includes("channel")) {
    return `${company} executes channel strategy with cross-channel coordination and attribution in place, approaching the optimization level of high-performing peers.`;
  }
  if (formattedCategory.includes("lead") || formattedCategory.includes("pipeline")) {
    return `${company} manages pipeline with qualified handoffs and scoring in place, demonstrating maturity close to peer benchmarks.`;
  }
  if (formattedCategory.includes("conversion")) {
    return `${company} shows solid conversion practices with testing active and journey optimization underway, nearing the systematic approach of top performers.`;
  }
  if (formattedCategory.includes("analytics") || formattedCategory.includes("report")) {
    return `${company} maintains analytics discipline with performance visibility and regular stakeholder reviews, approaching insight-to-action speed of leading organizations.`;
  }
  if (formattedCategory.includes("people") || formattedCategory.includes("process")) {
    return `${company} operates with mature process structures including cross-functional alignment, close to operational excellence of benchmark peers.`;
  }
  if (formattedCategory.includes("technology") || formattedCategory.includes("enablement")) {
    return `${company} leverages technology effectively with integrated tools and automation in progress, approaching utilization of high-performing organizations.`;
  }
  return `${company} shows solid ${categoryName} maturity with established practices and consistent execution, positioning close to benchmark performance.`;
};

// Dynamic insight for "What's limiting growth" - sentence format
const generateLimitingGrowthSentence = (
  categoryName: string,
  companyName: string,
  gap: number,
  isB2B: boolean
): string => {
  const company = companyName || "Your organization";
  const formattedCategory = categoryName.toLowerCase();
  
  if (gap >= 1.0) {
    // Significant gap - urgent but professional
    if (formattedCategory.includes("data")) {
      return `The maturity gap in ${categoryName} indicates fragmented data across systems, preventing ${company} from achieving unified customer intelligence and reliable attribution.`;
    }
    if (formattedCategory.includes("audience") || formattedCategory.includes("segment")) {
      return isB2B
        ? `The gap in ${categoryName} suggests limited depth in account intelligence and buying committee targeting, reducing ${company}'s ability to personalize at scale.`
        : `The gap in ${categoryName} indicates underdeveloped behavioral and lifecycle segmentation, limiting ${company}'s personalization relevance.`;
    }
    if (formattedCategory.includes("channel")) {
      return `The ${categoryName} gap reveals siloed channel execution without coordinated orchestration, preventing ${company} from optimizing cross-channel customer journeys.`;
    }
    if (formattedCategory.includes("lead") || formattedCategory.includes("pipeline")) {
      return `The gap in ${categoryName} indicates weak handoff processes and limited scoring sophistication, reducing ${company}'s pipeline velocity and predictability.`;
    }
    if (formattedCategory.includes("conversion")) {
      return `The ${categoryName} gap shows limited systematic testing and journey friction, preventing ${company} from maximizing acquisition and retention efficiency.`;
    }
    if (formattedCategory.includes("analytics") || formattedCategory.includes("report")) {
      return `The gap in ${categoryName} indicates reactive reporting and limited predictive insight, delaying ${company}'s ability to make proactive, data-driven decisions.`;
    }
    if (formattedCategory.includes("people") || formattedCategory.includes("process")) {
      return `The ${categoryName} gap reveals process inconsistencies and skill gaps, limiting ${company}'s ability to scale execution without proportional effort.`;
    }
    if (formattedCategory.includes("technology") || formattedCategory.includes("enablement")) {
      return `The gap in ${categoryName} indicates underutilized tools and integration friction, preventing ${company} from realizing full technology ROI.`;
    }
    return `The maturity gap in ${categoryName} suggests fragmented execution and limited system integration, preventing ${company} from achieving consistent, measurable outcomes.`;
  }
  
  // Near benchmark - close-to-breakthrough language
  if (formattedCategory.includes("data")) {
    return `Remaining ${categoryName} gaps center on advanced integration and real-time activation, which would unlock predictive capabilities for ${company}.`;
  }
  if (formattedCategory.includes("audience") || formattedCategory.includes("segment")) {
    return isB2B
      ? `The remaining ${categoryName} gap relates to dynamic segmentation and intent signals, which would sharpen ${company}'s account prioritization.`
      : `The remaining ${categoryName} gap involves real-time behavioral triggers, which would elevate ${company}'s personalization precision.`;
  }
  if (formattedCategory.includes("channel")) {
    return `The remaining ${categoryName} gap involves orchestrated sequencing across channels, which would improve ${company}'s journey coherence.`;
  }
  if (formattedCategory.includes("lead") || formattedCategory.includes("pipeline")) {
    return `The remaining ${categoryName} gap focuses on predictive scoring and automated nurture, which would accelerate ${company}'s pipeline velocity.`;
  }
  if (formattedCategory.includes("conversion")) {
    return `The remaining ${categoryName} gap relates to continuous optimization loops, which would compound ${company}'s conversion improvements over time.`;
  }
  if (formattedCategory.includes("analytics") || formattedCategory.includes("report")) {
    return `The remaining ${categoryName} gap centers on predictive analytics and automated alerting, which would shift ${company} from reactive to proactive.`;
  }
  if (formattedCategory.includes("people") || formattedCategory.includes("process")) {
    return `The remaining ${categoryName} gap involves advanced automation of workflows, which would free ${company}'s team for higher-value activities.`;
  }
  if (formattedCategory.includes("technology") || formattedCategory.includes("enablement")) {
    return `The remaining ${categoryName} gap relates to advanced automation features, which would multiply ${company}'s technology leverage.`;
  }
  return `The remaining ${categoryName} gap centers on advanced capabilities that would position ${company} for scalable, repeatable growth.`;
};

// Dynamic business outcomes based on top gaps and business type
const generateBusinessOutcomes = (
  topCategories: { category: string; gap: number }[],
  businessType: "B2B" | "B2C" | null,
  plan: "crawl" | "walk" | "run"
): string[] => {
  const isB2B = businessType === "B2B";
  const outcomes: string[] = [];
  
  // Based on top category gaps
  topCategories.slice(0, 3).forEach(({ category }) => {
    const cat = category.toLowerCase();
    
    if (cat.includes("data")) {
      outcomes.push("Unified data foundations will enable clearer attribution and more confident investment decisions");
    } else if (cat.includes("audience") || cat.includes("segment")) {
      outcomes.push(isB2B 
        ? "Sharper targeting will improve account engagement and accelerate pipeline quality"
        : "Better personalization will increase relevance, driving higher conversion and retention"
      );
    } else if (cat.includes("channel")) {
      outcomes.push("Coordinated channel execution will reduce waste and improve customer journey coherence");
    } else if (cat.includes("lead") || cat.includes("pipeline")) {
      outcomes.push("Streamlined pipeline processes will accelerate revenue velocity and improve forecasting accuracy");
    } else if (cat.includes("conversion")) {
      outcomes.push("Systematic optimization will compound conversion improvements and reduce acquisition costs");
    } else if (cat.includes("analytics") || cat.includes("report")) {
      outcomes.push("Actionable insights will shift decision-making from reactive to proactive, improving agility");
    } else if (cat.includes("people") || cat.includes("process")) {
      outcomes.push("Scalable processes will enable growth without proportional increases in team size or effort");
    } else if (cat.includes("technology") || cat.includes("enablement")) {
      outcomes.push("Optimized technology utilization will unlock capacity and improve marketing ROI");
    }
  });
  
  // Ensure exactly 3 outcomes
  if (outcomes.length < 3) {
    if (plan === "crawl") {
      outcomes.push("Stabilized foundations will reduce execution risk and improve consistency");
    } else if (plan === "walk") {
      outcomes.push("Increased automation will accelerate execution and free capacity for strategic initiatives");
    } else {
      outcomes.push("Advanced capabilities will support predictable, scalable revenue growth");
    }
  }
  
  return outcomes.slice(0, 3);
};

type CategoryScoreWithGap = {
  category: string;
  current: number;
  benchmark: number;
  gap: number;
};

export function Step7ExecutiveSummary({
  results,
  selectedPlan,
  companyName,
  businessType,
  onFinish,
  onBack,
}: Step7ExecutiveSummaryProps) {
  const isB2B = businessType === "B2B";
  
  // Parse category scores from results (same approach as Step5Results)
  const scores = results.scores || [];
  const benchmarks = results.benchmarks || {};
  
  const normalizedScores = scores.map((s: any) => ({
    category: s.category,
    current: typeof s.current === "number" ? s.current : (s as any).score || 0,
  }));

  const scoredCategories: CategoryScoreWithGap[] = normalizedScores
    .filter((s) => s.category !== "overall" && s.current > 0)
    .map((s) => {
      const benchmarkScore = benchmarks[s.category]?.score || 0;
      const gap = benchmarkScore - s.current;
      return {
        category: s.category,
        current: s.current,
        benchmark: benchmarkScore,
        gap,
      };
    });

  const sortedByGap = [...scoredCategories].sort((a, b) => b.gap - a.gap);
  const top3Categories = sortedByGap.slice(0, 3);
  
  // Calculate overall metrics
  const overallScore = scoredCategories.reduce((sum, c) => sum + c.current, 0) / (scoredCategories.length || 1);
  const overallBenchmark = scoredCategories.reduce((sum, c) => sum + c.benchmark, 0) / (scoredCategories.length || 1);
  
  // Get projection data from growth simulation
  const simulation = results.growthSimulation?.[selectedPlan] || [];
  const simulationArray: GrowthSimulationCategory[] = Array.isArray(simulation) ? simulation : [simulation];
  
  const parseScores = (category: GrowthSimulationCategory) => {
    const current = typeof (category as any).currentScore === "number" ? (category as any).currentScore :
                    typeof (category as any).current === "number" ? (category as any).current : 0;
    const after = typeof (category as any).afterScore === "number" ? (category as any).afterScore :
                  typeof (category as any).projectedScore === "number" ? (category as any).projectedScore :
                  typeof (category as any).after === "number" ? (category as any).after : 0;
    const benchmark = typeof (category as any).benchmarkScore === "number" ? (category as any).benchmarkScore :
                      typeof (category as any).benchmark === "number" ? (category as any).benchmark : 0;
    return { current, after, benchmark };
  };
  
  const projectedOverall = simulationArray.length
    ? simulationArray.reduce((sum, cat) => sum + parseScores(cat).after, 0) / simulationArray.length
    : overallScore;
  
  const avgGap = top3Categories.reduce((sum, c) => sum + c.gap, 0) / (top3Categories.length || 1);
  const topCategoryNames = top3Categories.map(c => formatCategoryName(c.category));
  
  // Generate dynamic business outcomes
  const businessOutcomes = generateBusinessOutcomes(
    top3Categories.map(c => ({ category: c.category, gap: c.gap })),
    businessType,
    selectedPlan
  );
  
  function formatCategoryName(name: string): string {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Your Executive Growth Summary
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            A strategic interpretation of your results and the path forward.
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
            Back to projection
          </Button>
        )}
      </div>

      {/* 1. Executive Snapshot - 4 Insight Cards - 2x2 grid on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {/* Current Maturity */}
        <GlowingCard className="glass-card-solid cursor-default" hover={false}>
          <div className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Current Maturity</p>
              <p className="text-sm text-foreground leading-relaxed">
                {generateMaturityInsight(overallScore, overallBenchmark)}
              </p>
            </div>
          </div>
        </GlowingCard>

        {/* Growth Potential */}
        <GlowingCard className="glass-card-solid cursor-default" hover={false}>
          <div className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Growth Potential</p>
              <p className="text-sm text-foreground leading-relaxed">
                {generateGrowthPotentialInsight(overallScore, projectedOverall, overallBenchmark)}
              </p>
            </div>
          </div>
        </GlowingCard>

        {/* Recommended Path */}
        <GlowingCard className="glass-card-solid cursor-default" hover={false}>
          <div className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
              <Compass className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Recommended Path</p>
              <p className="text-sm text-foreground leading-relaxed">
                {generatePathInsight(selectedPlan, avgGap)}
              </p>
            </div>
          </div>
        </GlowingCard>

        {/* Benchmark Outlook */}
        <GlowingCard className="glass-card-solid cursor-default" hover={false}>
          <div className="p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Benchmark Outlook</p>
              <p className="text-sm text-foreground leading-relaxed">
                {generateBenchmarkOutlook(projectedOverall, overallBenchmark, topCategoryNames)}
              </p>
            </div>
          </div>
        </GlowingCard>
      </div>
      
      {/* Benchmark Reference Note */}
      <div className="max-w-4xl mx-auto">
        <p className="text-xs text-muted-foreground/70 text-center italic">
          Benchmark reference: Derived from industry maturity patterns commonly cited across Deloitte Digital, Salesforce State of Marketing, and similar CX/MarTech benchmarking studies.
        </p>
      </div>

      {/* 2. Top 3 Focus Areas - Executive Interpretation */}
      <div className="max-w-4xl mx-auto space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Top 3 Focus Areas
        </h3>
        
        <div className="grid gap-4">
          {top3Categories.map((cat, index) => (
            <GlowingCard key={cat.category} className="glass-card-solid cursor-default" hover={false}>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    {formatCategoryName(cat.category)}
                  </h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Gap:</span>
                    <span className={`font-semibold ${cat.gap >= 1 ? 'text-rose-500' : 'text-amber-500'}`}>
                      {cat.gap.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* What's working */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      What's working
                    </p>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {generateDoingWellSentence(cat.category, companyName || "", cat.gap, isB2B)}
                    </p>
                  </div>
                  
                  {/* What's limiting growth */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                      What's limiting growth
                    </p>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {generateLimitingGrowthSentence(cat.category, companyName || "", cat.gap, isB2B)}
                    </p>
                  </div>
                </div>
              </div>
            </GlowingCard>
          ))}
        </div>
      </div>

      {/* 3. What This Means for Your Business */}
      <div className="max-w-3xl mx-auto">
        <GlowingCard className="glass-card-solid border-primary/20 cursor-default" hover={false}>
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-primary" />
              What this means for your business
            </h3>
            
            <ul className="space-y-3">
              {businessOutcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {outcome}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </GlowingCard>
      </div>

      {/* 4. Primary CTA */}
      <div className="max-w-xl mx-auto text-center space-y-5 pt-4">
        <Button
          asChild
          size="lg"
          className="w-full md:w-auto px-10 py-6 bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-lg text-base cursor-pointer"
        >
          <a
            href="https://innooryze.zohobookings.in/#/innooryze"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book a free growth consultation
          </a>
        </Button>
        
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We'll review your results, validate assumptions, and outline practical next steps tailored to your business.
        </p>
      </div>

      {/* Thank you message */}
      <div className="text-center pt-4 pb-4">
        <p className="text-sm text-muted-foreground">
          Thank you for completing the InnoRyze Marketing Maturity Assessment.
        </p>
      </div>
    </div>
  );
}
