import { useState } from "react";
import { GlowingCard } from "@/components/GlowingCard";
import { Button } from "@/components/ui/button";
import { SubmitAssessmentResponse } from "@/api";
import { ArrowRight, TrendingUp, ChevronLeft, Target, AlertCircle, CheckCircle2, XCircle, Clock, Check, Award, Lightbulb } from "lucide-react";

type Step5ResultsProps = {
  results: SubmitAssessmentResponse;
  onSelectPlan: (plan: "crawl" | "walk" | "run") => void;
  onBack?: () => void;
  companyName?: string;
  businessType?: "B2B" | "B2C" | null;
};

type CategoryScore = {
  category: string;
  current: number;
  benchmark: number;
  gap: number;
  status: "ahead" | "on-track" | "behind";
};

// Dynamic insight generation based on company, category, gap, and business type
const generateDoingWellInsight = (
  categoryName: string,
  companyName: string,
  gap: number,
  isB2B: boolean
): string => {
  const formattedCategory = categoryName.toLowerCase();
  const company = companyName || "Your organization";
  
  // Large gap (≥1.0) - acknowledge foundation but emphasize room to grow
  if (gap >= 1.0) {
    if (formattedCategory.includes("data")) {
      return `${company} has established foundational ${categoryName} capabilities with core data capture in place, indicating early operational discipline that can be built upon systematically.`;
    }
    if (formattedCategory.includes("audience") || formattedCategory.includes("segment")) {
      return isB2B
        ? `${company} maintains defined audience profiles with account-level targeting foundations, providing a starting point for more sophisticated segmentation strategies.`
        : `${company} has baseline customer segmentation in place with demographic targeting active, creating a foundation for experience-driven personalization.`;
    }
    if (formattedCategory.includes("channel")) {
      return `${company} operates across key marketing channels with basic performance tracking, demonstrating awareness of multi-channel needs even as optimization opportunities remain.`;
    }
    if (formattedCategory.includes("lead") || formattedCategory.includes("pipeline")) {
      return `${company} has established lead capture and handoff processes between marketing and sales, indicating pipeline awareness that can be strengthened with automation.`;
    }
    if (formattedCategory.includes("conversion")) {
      return `${company} tracks conversion events across primary touchpoints with documented customer journeys, showing intent to optimize even as systematic testing remains limited.`;
    }
    if (formattedCategory.includes("analytics") || formattedCategory.includes("report")) {
      return `${company} has core dashboards and regular reporting cadences in place, demonstrating commitment to measurement even as actionable insights remain reactive.`;
    }
    if (formattedCategory.includes("people") || formattedCategory.includes("process")) {
      return `${company} maintains documented roles and repeatable processes, providing operational stability that can support more sophisticated ways of working.`;
    }
    if (formattedCategory.includes("technology") || formattedCategory.includes("enablement")) {
      return `${company} has deployed core marketing tools with basic integrations functioning, establishing a technology foundation that can be optimized for scale.`;
    }
    return `${company} has established foundational ${categoryName} capabilities, indicating early operational discipline that positions the team for structured improvement.`;
  }
  
  // Smaller gap (<1.0) - emphasize near-breakthrough status
  if (formattedCategory.includes("data")) {
    return `${company} demonstrates mature ${categoryName} practices with consistent data capture and partial cross-system integration, positioning the team close to benchmark performance.`;
  }
  if (formattedCategory.includes("audience") || formattedCategory.includes("segment")) {
    return isB2B
      ? `${company} shows strong ${categoryName} capabilities with account-based targeting and defined ICPs, approaching the precision required for benchmark-level performance.`
      : `${company} delivers meaningful ${categoryName} with behavioral targeting active across channels, nearing the consistency needed for competitive personalization.`;
  }
  if (formattedCategory.includes("channel")) {
    return `${company} executes ${categoryName} strategy with cross-channel coordination and attribution in place, approaching the optimization level of high-performing peers.`;
  }
  if (formattedCategory.includes("lead") || formattedCategory.includes("pipeline")) {
    return `${company} manages ${categoryName} with qualified handoffs and scoring in place, demonstrating pipeline maturity that is close to peer benchmarks.`;
  }
  if (formattedCategory.includes("conversion")) {
    return `${company} shows solid ${categoryName} practices with testing active and journey optimization underway, nearing the systematic approach of top performers.`;
  }
  if (formattedCategory.includes("analytics") || formattedCategory.includes("report")) {
    return `${company} maintains ${categoryName} discipline with performance visibility and regular stakeholder reviews, approaching the insight-to-action speed of leading organizations.`;
  }
  if (formattedCategory.includes("people") || formattedCategory.includes("process")) {
    return `${company} operates with mature ${categoryName} structures including cross-functional alignment and documented workflows, close to the operational excellence of benchmark peers.`;
  }
  if (formattedCategory.includes("technology") || formattedCategory.includes("enablement")) {
    return `${company} leverages ${categoryName} effectively with integrated tools and automation in progress, approaching the technology utilization of high-performing organizations.`;
  }
  return `${company} shows solid ${categoryName} maturity with established practices and consistent execution, positioning the team close to benchmark performance.`;
};

const generateHoldingBackInsight = (
  categoryName: string,
  companyName: string,
  gap: number,
  isB2B: boolean
): string => {
  const formattedCategory = categoryName.toLowerCase();
  const company = companyName || "Your organization";
  
  // Large gap (≥1.0) - diagnostic and urgent
  if (gap >= 1.0) {
    if (formattedCategory.includes("data")) {
      return `The ${categoryName} gap indicates fragmented systems and limited real-time visibility, preventing ${company} from making data-informed decisions at the speed required for market responsiveness.`;
    }
    if (formattedCategory.includes("audience") || formattedCategory.includes("segment")) {
      return isB2B
        ? `The ${categoryName} gap reflects limited account intelligence and static segmentation, constraining ${company}'s ability to deliver relevance at each stage of the buyer journey.`
        : `The ${categoryName} gap reveals rules-based rather than behavior-driven personalization, limiting ${company}'s ability to deliver the individualized experiences customers expect.`;
    }
    if (formattedCategory.includes("channel")) {
      return `The ${categoryName} gap suggests siloed execution and incomplete attribution, preventing ${company} from optimizing spend allocation and ensuring consistent cross-channel customer experiences.`;
    }
    if (formattedCategory.includes("lead") || formattedCategory.includes("pipeline")) {
      return `The ${categoryName} gap indicates inconsistent qualification and manual nurturing, limiting ${company}'s ability to convert demand into predictable, high-quality pipeline.`;
    }
    if (formattedCategory.includes("conversion")) {
      return `The ${categoryName} gap points to reactive optimization and limited personalization in conversion paths, reducing ${company}'s ability to maximize return on traffic and engagement.`;
    }
    if (formattedCategory.includes("analytics") || formattedCategory.includes("report")) {
      return `The ${categoryName} gap reflects insight delays and difficulty linking activities to revenue, preventing ${company} from demonstrating marketing's impact and prioritizing high-value actions.`;
    }
    if (formattedCategory.includes("people") || formattedCategory.includes("process")) {
      return `The ${categoryName} gap indicates ad-hoc collaboration and limited learning loops, constraining ${company}'s ability to scale execution and retain institutional knowledge.`;
    }
    if (formattedCategory.includes("technology") || formattedCategory.includes("enablement")) {
      return `The ${categoryName} gap reflects manual workarounds and integration gaps, limiting ${company}'s ability to execute at scale and respond to market demands with speed.`;
    }
    return `The ${categoryName} gap indicates systemic constraints in execution and integration, preventing ${company} from achieving the consistency and scale required for competitive performance.`;
  }
  
  // Smaller gap (<1.0) - close to breakthrough
  if (formattedCategory.includes("data")) {
    return `Closing the remaining ${categoryName} gap requires moving from reactive to predictive data use, enabling ${company} to anticipate needs rather than respond to historical patterns.`;
  }
  if (formattedCategory.includes("audience") || formattedCategory.includes("segment")) {
    return isB2B
      ? `Closing the ${categoryName} gap means activating dynamic account scoring and real-time signals, allowing ${company} to engage prospects at moments of highest intent.`
      : `Closing the ${categoryName} gap requires real-time behavioral triggers and cross-channel consistency, enabling ${company} to deliver personalization that feels seamless.`;
  }
  if (formattedCategory.includes("channel")) {
    return `Closing the ${categoryName} gap requires unified orchestration and dynamic budget reallocation, enabling ${company} to optimize investment across the full customer journey.`;
  }
  if (formattedCategory.includes("lead") || formattedCategory.includes("pipeline")) {
    return `Closing the ${categoryName} gap means automating qualification and nurture triggers, enabling ${company} to accelerate velocity and improve conversion predictability.`;
  }
  if (formattedCategory.includes("conversion")) {
    return `Closing the ${categoryName} gap requires systematic experimentation and predictive path optimization, enabling ${company} to proactively improve outcomes rather than react to results.`;
  }
  if (formattedCategory.includes("analytics") || formattedCategory.includes("report")) {
    return `Closing the ${categoryName} gap means connecting insights directly to prioritized actions and revenue attribution, enabling ${company} to demonstrate clear marketing ROI.`;
  }
  if (formattedCategory.includes("people") || formattedCategory.includes("process")) {
    return `Closing the ${categoryName} gap requires systematizing collaboration and institutionalizing learning, enabling ${company} to scale without losing operational quality.`;
  }
  if (formattedCategory.includes("technology") || formattedCategory.includes("enablement")) {
    return `Closing the ${categoryName} gap means eliminating manual processes and activating automation, enabling ${company} to focus talent on strategy rather than execution overhead.`;
  }
  return `Closing the ${categoryName} gap requires systematic improvements to achieve the execution consistency and scale that distinguish high-performing marketing organizations.`;
};

// Contextualized growth path descriptions based on user's gaps and business type
const getContextualizedPlanDetails = (
  plan: "crawl" | "walk" | "run",
  averageGap: number,
  isB2B: boolean,
  topGapCategories: string[]
) => {
  const hasLargeGaps = averageGap >= 0.8;
  const topGapsText = topGapCategories.slice(0, 2).map(c => 
    c.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
  ).join(" and ");
  
  const baseDetails = {
    crawl: { 
      timeline: "4–6 weeks", 
      description: "Foundations",
      positioning: hasLargeGaps
        ? `Stabilization for teams below benchmark who need execution clarity—especially in ${topGapsText}.`
        : `Targeted stabilization to address specific gaps in ${topGapsText} before accelerating.`,
      outcome: isB2B
        ? "Establish reliable pipeline foundations and consistent marketing-sales handoffs"
        : "Build stable customer data foundations and consistent cross-channel execution",
      bullets: isB2B
        ? [
            "Consolidate lead and account data across systems",
            "Standardize qualification criteria and handoff processes",
            "Establish baseline attribution and pipeline visibility",
            "Document core campaign playbooks and reduce manual effort"
          ]
        : [
            "Unify customer data sources and resolve identity gaps",
            "Standardize measurement frameworks across touchpoints",
            "Establish consistent brand experience across channels",
            "Document journey maps and reduce operational friction"
          ]
    },
    walk: { 
      timeline: "8–12 weeks", 
      description: "Accelerate",
      positioning: hasLargeGaps
        ? `Acceleration for teams closing foundational gaps who need speed and consistency across ${topGapsText}.`
        : `Acceleration for teams close to benchmark who need consistency and velocity in ${topGapsText}.`,
      outcome: isB2B
        ? "Improve lead velocity, nurture effectiveness, and marketing-attributed pipeline"
        : "Increase conversion rates, personalization depth, and customer engagement",
      bullets: isB2B
        ? [
            "Implement automated lead scoring and nurture sequences",
            "Enhance account-based targeting and personalization",
            "Strengthen multi-touch attribution and ROI visibility",
            "Introduce scalable content and campaign workflows"
          ]
        : [
            "Deploy behavioral triggers and dynamic personalization",
            "Optimize conversion paths with systematic testing",
            "Enhance segmentation with real-time customer signals",
            "Scale campaign execution with automation"
          ]
    },
    run: { 
      timeline: "3–6 months", 
      description: "Transform",
      positioning: hasLargeGaps
        ? `Transformation for teams ready to leapfrog gaps with advanced automation and intelligence in ${topGapsText}.`
        : `Transformation for teams at or near benchmark ready to scale with predictive capabilities.`,
      outcome: isB2B
        ? "Enable predictive pipeline management and revenue-connected marketing intelligence"
        : "Deliver real-time customer orchestration and predictive experience optimization",
      bullets: isB2B
        ? [
            "Deploy predictive lead and account scoring models",
            "Automate complex multi-stage nurture journeys",
            "Build revenue-connected dashboards and forecasting",
            "Enable proactive, data-driven growth decisions"
          ]
        : [
            "Activate predictive audience and content optimization",
            "Orchestrate real-time cross-channel customer journeys",
            "Implement advanced personalization at scale",
            "Enable proactive customer lifetime value management"
          ]
    }
  };
  
  return baseDetails[plan];
};

export function Step5Results({ results, onSelectPlan, onBack, companyName, businessType }: Step5ResultsProps) {
  const [selectedPath, setSelectedPath] = useState<"crawl" | "walk" | "run" | null>(null);
  
  // Safe defaults to prevent blank screens
  const resultMode = results.resultMode || "below_benchmark";
  const isAboveBenchmark = resultMode === "above_benchmark";
  const safeStrongCategories = results.strongCategories || [];
  console.log("Results:", results);
  console.log("Strong Categories:", results.strongCategories);
  const safeStretchCategories = results.stretchCategories || [];
  
  const scores = results.scores || [];
  const benchmarks = results.benchmarks || {};
  const options = results.options || {};
  
  const handleSelectPlan = (plan: "crawl" | "walk" | "run") => {
    setSelectedPath(plan);
    onSelectPlan(plan);
  };

  const normalizedScores = scores.map((s: any) => ({
    category: s.category,
    current: typeof s.current === "number" ? s.current : s.score || 0,
  }));

  const scoredCategories: CategoryScore[] = normalizedScores
    .filter((s) => s.category !== "overall" && s.current > 0)
    .map((s) => {
      const benchmarkScore = benchmarks[s.category]?.score || 0;
      const gap = benchmarkScore - s.current;
      let status: "ahead" | "on-track" | "behind" = "on-track";
      if (gap > 0.3) status = "behind";
      else if (gap < -0.3) status = "ahead";
      return {
        category: s.category,
        current: s.current,
        benchmark: benchmarkScore,
        gap,
        status,
      };
    });

  const overallScore =
    scoredCategories.length > 0
      ? scoredCategories.reduce((sum, s) => sum + s.current, 0) / scoredCategories.length
      : 0;

  const overallBenchmark =
    scoredCategories.length > 0
      ? scoredCategories.reduce((sum, s) => sum + s.benchmark, 0) / scoredCategories.length
      : 0;

  const overallGap = overallBenchmark - overallScore;

  // Top 3 priority areas (largest gaps)
  const priorityAreas = [...scoredCategories]
    .filter((s) => s.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3);

  // Non-priority categories
  const otherCategories = scoredCategories.filter(
    (s) => !priorityAreas.find((p) => p.category === s.category)
  );

  const isB2B = businessType === "B2B";
  const company = companyName || "Your organization";
  const averageGap = scoredCategories.length > 0 
    ? scoredCategories.reduce((sum, s) => sum + Math.max(0, s.gap), 0) / scoredCategories.length 
    : 0;
  const topGapCategories = priorityAreas.map(p => p.category);

  // Generate dynamic insights for a category
  const getDynamicInsights = (category: string, gap: number) => {
    const categoryName = formatCategoryName(category);
    return {
      doingWell: generateDoingWellInsight(categoryName, company, gap, isB2B),
      holdingBack: generateHoldingBackInsight(categoryName, company, gap, isB2B)
    };
  };

  // Get contextualized plan details
  const getPlanDetails = (plan: "crawl" | "walk" | "run") => {
    return getContextualizedPlanDetails(plan, averageGap, isB2B, topGapCategories);
  };

  const getStatusBadge = (status: "ahead" | "on-track" | "behind") => {
    switch (status) {
      case "ahead":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-600/40 dark:border-emerald-500/30">
            On Track
          </span>
        );
      case "on-track":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-600/20 text-amber-700 dark:text-amber-400 border border-amber-600/40 dark:border-amber-500/30">
            Near Benchmark
          </span>
        );
      case "behind":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-600/20 text-rose-700 dark:text-rose-400 border border-rose-600/40 dark:border-rose-500/30">
            Behind Benchmark
          </span>
        );
    }
  };

  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
          Your Marketing Maturity Results
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Compared to similar organisations, this is where your marketing maturity stands today.
        </p>
      </div>

      {/* A. Overall Maturity Snapshot - BENCHMARK-FIRST */}
      <GlowingCard className="glass-card-solid max-w-3xl mx-auto cursor-default" hover={false}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2 text-center flex items-center justify-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Overall Maturity vs Benchmark
          </h3>
          
          <p className="text-xs text-muted-foreground text-center">
            How your marketing capabilities compare to industry benchmarks
          </p>

          {/* Spacer for clear visual separation */}
          <div className="mt-8 pt-4" />

          <div className="relative">
            {/* Combined bar visualization */}
            <div className="relative h-12 w-full rounded-lg bg-muted/50 dark:bg-muted/30 overflow-visible border border-border/50">
              {/* User score bar with animation */}
              <div
                className="absolute inset-y-0 left-0 bg-primary transition-all duration-1000 ease-out rounded-l-lg"
                style={{ width: `${(overallScore / 5) * 100}%` }}
              />
              
              {/* Benchmark line - VISUALLY DOMINANT */}
              <div
                className="absolute top-0 bottom-0 w-2 bg-secondary z-10 rounded-full shadow-[0_0_20px_4px_hsl(var(--secondary)/0.5)]"
                style={{ left: `calc(${(overallBenchmark / 5) * 100}% - 4px)` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-bold text-secondary-foreground bg-secondary px-3 py-1 rounded-md shadow-lg">
                    Benchmark: {overallBenchmark.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Score labels */}
            <div className="flex justify-between mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary" />
                <span className="text-sm text-foreground">
                  Your Score: <span className="font-bold text-lg">{overallScore.toFixed(1)}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1.5 bg-secondary rounded-full" />
                <span className="text-sm text-foreground">
                  Industry Benchmark: <span className="font-bold text-secondary text-lg">{overallBenchmark.toFixed(1)}</span>
                </span>
              </div>
            </div>

            {/* Gap indicator - PROMINENT with interpretation line */}
            {overallGap > 0 && (
              <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border text-center space-y-3">
                <p className="text-sm text-foreground">
                  You are currently <span className="font-bold text-primary text-lg">{overallGap.toFixed(1)} points</span> below the industry benchmark.
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Your maturity is slightly below peers in similar organisations. Closing this gap typically improves execution speed, consistency, and ROI.
                </p>
              </div>
            )}
            {overallGap <= 0 && (
              <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                <p className="text-sm text-foreground">
                  You are <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">{Math.abs(overallGap).toFixed(1)} points</span> {overallGap === 0 ? "at" : "above"} the industry benchmark.
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Your maturity is at or above peers in similar organisations. Focus on sustaining your lead and exploring advanced capabilities.
                </p>
              </div>
            )}
          </div>
          
          {/* Benchmark Reference Note */}
          <p className="text-xs text-muted-foreground/70 text-center italic mt-4">
            Benchmark reference: Derived from industry maturity patterns commonly cited across Deloitte Digital, Salesforce State of Marketing, and similar CX/MarTech benchmarking studies.
          </p>
        </div>
      </GlowingCard>

      {/* B. Category Performance Overview - ALL Categories */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          Category Performance Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scoredCategories.map((cat) => (
            <div key={cat.category} className="glass-card-solid rounded-xl p-4 cursor-default transition-all duration-200 hover:border-border/80">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-foreground">
                  {formatCategoryName(cat.category)}
                </h4>
                {getStatusBadge(cat.status)}
              </div>
              
              <div className="relative h-2.5 w-full rounded-full bg-muted/60 dark:bg-muted/50 overflow-hidden border border-border/30">
                {/* Score bar */}
                <div
                  className="absolute inset-y-0 left-0 bg-primary transition-all"
                  style={{ width: `${(cat.current / 5) * 100}%` }}
                />
                {/* Benchmark marker */}
                {cat.benchmark > 0 && (
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-secondary rounded-full shadow-[0_0_6px_hsl(var(--secondary)/0.8)]"
                    style={{ left: `calc(${(cat.benchmark / 5) * 100}% - 2px)` }}
                  />
                )}
              </div>
              
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-foreground">Score: <span className="font-semibold">{cat.current.toFixed(1)}</span></span>
                <span className="text-foreground">Benchmark: <span className="font-semibold text-secondary">{cat.benchmark.toFixed(1)}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* C. Top 3 Priority Areas - WITH INSIGHTS - 3-column grid on desktop */}
      {priorityAreas.length > 0 && (
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-foreground">
              Your Top {priorityAreas.length} Priority Areas
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            These categories have the largest gaps to benchmark and offer the most improvement potential.
          </p>
          
          {/* 3-column grid on desktop, 1-column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {priorityAreas.map((area, index) => {
              const insights = getDynamicInsights(area.category, area.gap);
              return (
                <GlowingCard 
                  key={area.category} 
                  className="glass-card-solid border-amber-500/20 cursor-default"
                  hover={false}
                >
                  <div className="p-4">
                    {/* Header with rank */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                        {index + 1}
                      </span>
                      <h4 className="text-sm font-semibold text-foreground">
                        {formatCategoryName(area.category)}
                      </h4>
                    </div>
                    
                    {/* Score info - compact */}
                    <div className="grid grid-cols-3 gap-2 text-xs mb-4 p-2 rounded-lg bg-muted/30">
                      <div className="text-center">
                        <p className="text-muted-foreground text-[10px]">Current</p>
                        <p className="text-foreground font-semibold">{area.current.toFixed(1)}</p>
                      </div>
                      <div className="text-center border-x border-border/50">
                        <p className="text-muted-foreground text-[10px]">Benchmark</p>
                        <p className="text-secondary font-semibold">{area.benchmark.toFixed(1)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground text-[10px]">Gap</p>
                        <p className="text-rose-400 font-semibold">-{area.gap.toFixed(1)}</p>
                      </div>
                    </div>

                    {/* Insights - stacked */}
                    <div className="space-y-3">
                      {/* What you're doing well */}
                      <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                        <div className="flex items-center gap-1.5 mb-2">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">Doing well</span>
                        </div>
                        <p className="text-xs text-foreground/90 leading-relaxed">
                          {insights.doingWell}
                        </p>
                      </div>

                      {/* What's holding you back */}
                      <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
                        <div className="flex items-center gap-1.5 mb-2">
                          <XCircle className="w-3 h-3 text-rose-400" />
                          <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wide">Limiting growth</span>
                        </div>
                        <p className="text-xs text-foreground/90 leading-relaxed">
                          {insights.holdingBack}
                        </p>
                      </div>
                    </div>
                  </div>
                </GlowingCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Other Categories - Summary Only */}
      {otherCategories.length > 0 && (
        <div className="max-w-5xl mx-auto">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Other Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {otherCategories.map((cat) => (
              <div key={cat.category} className="glass-card-solid rounded-lg p-3 cursor-default opacity-80 transition-opacity hover:opacity-100">
                <h4 className="text-xs font-medium text-foreground truncate mb-1.5">
                  {formatCategoryName(cat.category)}
                </h4>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">{cat.current.toFixed(1)}</span>
                  <span className="text-secondary">{cat.benchmark.toFixed(1)}</span>
                </div>
                <div className="relative h-1.5 w-full rounded-full bg-muted/30 overflow-hidden mt-1.5">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/50 rounded-full"
                    style={{ width: `${(cat.current / 5) * 100}%` }}
                  />
                  {cat.benchmark > 0 && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-secondary/70"
                      style={{ left: `${(cat.benchmark / 5) * 100}%` }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* D. Growth Path Selection OR High-Performance Mode */}
      {isAboveBenchmark ? (
        /* HIGH-PERFORMANCE MODE — replaces Crawl/Walk/Run */
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1: Above Benchmark Message */}
          <GlowingCard className="glass-card-solid cursor-default" hover={false}>
            <div className="p-6 text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Award className="w-6 h-6 text-emerald-500" />
                <h3 className="text-lg font-semibold text-foreground">
                  You are already performing at or above industry benchmark
                </h3>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Your current setup reflects strong marketing maturity across key areas. The opportunity now is to further optimise and extend your advantage.
              </p>
            </div>
          </GlowingCard>

          {/* Section 2: Where you are strong */}
          {safeStrongCategories.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Where you are strong
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {safeStrongCategories.map((cat) => (
                  <GlowingCard key={cat.category} className="glass-card-solid cursor-default" hover={false}>
                    <div className="p-4 space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">
                        {formatCategoryName(cat.category)}
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative h-3 rounded-full bg-muted/50 dark:bg-muted/30 overflow-visible border border-border/30">
                          <div
                            className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all duration-700"
                            style={{ width: `${(cat.score / 5) * 100}%` }}
                          />
                          {cat.benchmark > 0 && (
                            <div
                              className="absolute top-0 bottom-0 w-1.5 bg-secondary rounded-full shadow-[0_0_8px_hsl(var(--secondary)/0.8)] z-10"
                              style={{ left: `calc(${(cat.benchmark / 5) * 100}% - 3px)` }}
                            />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-foreground w-8 text-right">{cat.score.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium border text-emerald-600 dark:text-emerald-400 bg-emerald-600/20 dark:bg-emerald-500/15 border-emerald-600/40 dark:border-emerald-500/30">
                          Above Benchmark
                        </span>
                        <span className="text-secondary font-semibold">Benchmark: {cat.benchmark.toFixed(1)}</span>
                      </div>
                    </div>
                  </GlowingCard>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Where you can push further */}
          {safeStretchCategories.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Where you can push further
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {safeStretchCategories.map((cat) => (
                  <GlowingCard key={cat.category} className="glass-card-solid cursor-default" hover={false}>
                    <div className="p-4 space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">
                        {formatCategoryName(cat.category)}
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative h-3 rounded-full bg-muted/50 dark:bg-muted/30 overflow-visible border border-border/30">
                          <div
                            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700"
                            style={{ width: `${(cat.score / 5) * 100}%` }}
                          />
                          {cat.benchmark > 0 && (
                            <div
                              className="absolute top-0 bottom-0 w-1.5 bg-secondary rounded-full shadow-[0_0_8px_hsl(var(--secondary)/0.8)] z-10"
                              style={{ left: `calc(${(cat.benchmark / 5) * 100}% - 3px)` }}
                            />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-foreground w-8 text-right">{cat.score.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium border text-amber-700 dark:text-amber-400 bg-amber-600/20 dark:bg-amber-500/15 border-amber-600/40 dark:border-amber-500/30">
                          Opportunity to optimise further
                        </span>
                        <span className="text-secondary font-semibold">Benchmark: {cat.benchmark.toFixed(1)}</span>
                      </div>
                    </div>
                  </GlowingCard>
                ))}
              </div>
            </div>
          )}

          {/* Continue button for above_benchmark users */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => onSelectPlan("run")}
              className="flex items-center gap-2"
            >
              Continue to Growth Projection
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        /* STANDARD MODE — Crawl / Walk / Run */
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Choose your Growth Path
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Select one option below to see your projected improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["crawl", "walk", "run"] as const).map((plan) => {
              const planDetails = getPlanDetails(plan);
              const isSelected = selectedPath === plan;
              return (
                <GlowingCard
                  key={plan}
                  className={`transition-all duration-200 glass-card-solid group focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background ${
                    isSelected 
                      ? "border-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)] scale-[1.02] bg-primary/5" 
                      : "hover:border-primary/50 hover:shadow-md"
                  }`}
                  hover={false}
                >
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-foreground">
                            {plan.charAt(0).toUpperCase() + plan.slice(1)}
                          </h4>
                          <span className="text-xs text-muted-foreground">({planDetails.description})</span>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-foreground/90 mb-2">
                        {planDetails.positioning}
                      </p>
                      
                      <p className="text-xs text-muted-foreground font-medium mb-3">
                        {planDetails.outcome}
                      </p>
                      
                      <ul className="space-y-1.5 mb-3">
                        {planDetails.bullets.map((bullet, i) => (
                          <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                            <span className="text-primary/60 mt-0.5">•</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-foreground">
                        {planDetails.timeline}
                      </span>
                    </div>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
                      }`}
                    >
                      {isSelected ? (
                        <span className="flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" />
                          Selected
                        </span>
                      ) : (
                        `Select ${plan.charAt(0).toUpperCase() + plan.slice(1)}`
                      )}
                    </button>
                  </div>
                </GlowingCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Back Button */}
      {onBack && (
        <div className="flex justify-start max-w-4xl mx-auto">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
