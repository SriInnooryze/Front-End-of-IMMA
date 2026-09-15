export interface Question {
  id: string;
  text: string;
  helperText: string;
}

// Challenge question for multi-select - replaces 5th question in each category
export interface ChallengeQuestion {
  id: string;
  text: string;
  helperText: string;
  isChallenge: true;
  options: ChallengeOption[];
}

export interface ChallengeOption {
  id: string;
  label: string;
}

// Category descriptions for better UX
export const CATEGORY_DESCRIPTIONS = {
  B2B: {
    data: "Evaluates how well you collect, store, and use customer data to drive marketing decisions.",
    targeting: "Measures your ability to define and reach the right accounts and decision-makers.",
    channels: "Assesses your multi-channel strategy and how well channels work together.",
    content: "Reviews your content strategy, quality, and alignment with buyer journeys.",
    "lead-to-pipe": "Examines your lead qualification process and sales-marketing alignment.",
    analytics: "Evaluates your measurement capabilities and data-driven decision making.",
    technology: "Assesses your marketing technology stack integration and automation maturity.",
    "customer-experience": "Measures how well you deliver personalized, consistent experiences.",
    people: "Reviews your team structure, skills, and development practices.",
    process: "Evaluates your workflow efficiency and operational maturity.",
  },
  B2C: {
    "offers-targeting": "Evaluates how well you personalize offers and target consumer segments.",
    channels: "Assesses your omnichannel presence and mobile-first marketing approach.",
    engagement: "Measures your ability to build relationships and drive customer interaction.",
    "data-analytics": "Reviews your customer data collection and behavioral analytics capabilities.",
    technology: "Evaluates your martech stack and e-commerce platform integration.",
    "customer-experience": "Assesses the seamlessness of your purchase journey and brand consistency.",
    loyalty: "Measures your retention strategies and customer lifetime value optimization.",
    people: "Reviews your team capabilities and collaborative culture.",
    process: "Evaluates your workflow standardization and campaign management efficiency.",
  },
} as const;

// Category groupings for better organization
export const CATEGORY_GROUPS = {
  B2B: [
    {
      name: "Strategy & Foundation",
      categories: ["targeting", "content", "data"],
    },
    {
      name: "Data, Technology & Enablement",
      categories: ["technology", "analytics"],
    },
    {
      name: "Campaigns & Execution",
      categories: ["channels", "lead-to-pipe"],
    },
    {
      name: "Performance & Operations",
      categories: ["customer-experience", "people", "process"],
    },
  ],
  B2C: [
    {
      name: "Strategy & Foundation",
      categories: ["offers-targeting", "engagement"],
    },
    {
      name: "Data, Technology & Enablement",
      categories: ["technology", "data-analytics"],
    },
    {
      name: "Campaigns & Execution",
      categories: ["channels", "loyalty"],
    },
    {
      name: "Performance & Operations",
      categories: ["customer-experience", "people", "process"],
    },
  ],
} as const;

// Challenge options per category - B2B
const B2B_CHALLENGE_OPTIONS: Record<string, ChallengeOption[]> = {
  data: [
    { id: "data-fragmented", label: "Data fragmented across systems" },
    { id: "data-no-unified", label: "No unified customer profile" },
    { id: "data-quality", label: "Poor data quality or governance" },
    { id: "data-identity", label: "Identity resolution issues" },
    { id: "data-activation", label: "Limited activation of data" },
  ],
  targeting: [
    { id: "targeting-icp", label: "Unclear or inconsistent ICP definition" },
    { id: "targeting-segments", label: "Segments not actionable in campaigns" },
    { id: "targeting-personalization", label: "Limited personalization by segment" },
    { id: "targeting-abm", label: "ABM efforts fragmented or inconsistent" },
    { id: "targeting-learning", label: "No feedback loop to refine targeting" },
  ],
  channels: [
    { id: "channels-silos", label: "Channels operate in silos" },
    { id: "channels-attribution", label: "Unclear attribution across channels" },
    { id: "channels-consistency", label: "Inconsistent messaging across channels" },
    { id: "channels-budget", label: "Budget allocation not data-driven" },
    { id: "channels-testing", label: "Slow to test or adopt new channels" },
  ],
  content: [
    { id: "content-strategy", label: "Content not aligned to strategy" },
    { id: "content-journey", label: "Gaps in buyer journey coverage" },
    { id: "content-quality", label: "Inconsistent quality or voice" },
    { id: "content-repurpose", label: "Poor content repurposing" },
    { id: "content-measurement", label: "Unable to measure content ROI" },
  ],
  "lead-to-pipe": [
    { id: "l2p-qualification", label: "Inconsistent lead qualification" },
    { id: "l2p-nurturing", label: "Manual or ad-hoc nurturing" },
    { id: "l2p-alignment", label: "Sales and marketing misaligned" },
    { id: "l2p-automation", label: "Limited automation in handoffs" },
    { id: "l2p-visibility", label: "No pipeline visibility from marketing" },
  ],
  analytics: [
    { id: "analytics-trust", label: "Low trust in reporting accuracy" },
    { id: "analytics-dashboards", label: "Dashboards not actionable" },
    { id: "analytics-action", label: "Insights don't lead to action" },
    { id: "analytics-attribution", label: "No clear attribution model" },
    { id: "analytics-predictive", label: "No predictive or advanced analytics" },
  ],
  technology: [
    { id: "tech-gaps", label: "Gaps in core marketing tools" },
    { id: "tech-integration", label: "Poor integration between systems" },
    { id: "tech-workarounds", label: "Manual workarounds required" },
    { id: "tech-scalability", label: "Tools not scalable for growth" },
    { id: "tech-adoption", label: "Low adoption of existing tools" },
  ],
  "customer-experience": [
    { id: "cx-personalization", label: "Limited personalization at scale" },
    { id: "cx-journey", label: "No clear journey orchestration" },
    { id: "cx-feedback", label: "Customer feedback not acted on" },
    { id: "cx-consistency", label: "Inconsistent brand experience" },
    { id: "cx-measurement", label: "Customer satisfaction not measured" },
  ],
  people: [
    { id: "people-roles", label: "Unclear roles and responsibilities" },
    { id: "people-process", label: "Inconsistent campaign processes" },
    { id: "people-collaboration", label: "Poor cross-functional collaboration" },
    { id: "people-learning", label: "Limited learning from campaigns" },
    { id: "people-change", label: "Resistance to new tools or methods" },
  ],
  process: [
    { id: "process-documentation", label: "Processes not documented" },
    { id: "process-standardization", label: "Lack of standardized workflows" },
    { id: "process-agility", label: "Slow to adapt to change" },
    { id: "process-planning", label: "Inefficient campaign planning" },
    { id: "process-optimization", label: "No process efficiency measurement" },
  ],
};

// Challenge options per category - B2C
const B2C_CHALLENGE_OPTIONS: Record<string, ChallengeOption[]> = {
  "offers-targeting": [
    { id: "offers-icp", label: "Customer profiles inconsistently defined" },
    { id: "offers-segments", label: "Segments not used in campaigns" },
    { id: "offers-personalization", label: "Offers not personalized by segment" },
    { id: "offers-targeting", label: "Targeting approaches fragmented" },
    { id: "offers-learning", label: "No feedback loop to improve targeting" },
  ],
  channels: [
    { id: "channels-silos", label: "Channels operate in silos" },
    { id: "channels-attribution", label: "Unclear attribution across channels" },
    { id: "channels-consistency", label: "Inconsistent messaging across channels" },
    { id: "channels-budget", label: "Budget allocation not data-driven" },
    { id: "channels-testing", label: "Slow to test or adopt new channels" },
  ],
  engagement: [
    { id: "engagement-content", label: "Content not driving engagement" },
    { id: "engagement-relationships", label: "Weak customer relationship building" },
    { id: "engagement-response", label: "Slow response to interactions" },
    { id: "engagement-email", label: "Email/SMS performance declining" },
    { id: "engagement-viral", label: "No organic amplification strategy" },
  ],
  "data-analytics": [
    { id: "data-fragmented", label: "Customer data fragmented across systems" },
    { id: "data-quality", label: "Poor data quality or governance" },
    { id: "data-realtime", label: "No real-time data activation" },
    { id: "data-behavior", label: "Behavioral data underutilized" },
    { id: "data-compliance", label: "Unclear data compliance practices" },
  ],
  technology: [
    { id: "tech-gaps", label: "Gaps in core marketing tools" },
    { id: "tech-integration", label: "Poor integration between systems" },
    { id: "tech-workarounds", label: "Manual workarounds required" },
    { id: "tech-scalability", label: "Tools not scalable for growth" },
    { id: "tech-adoption", label: "Low adoption of existing tools" },
  ],
  "customer-experience": [
    { id: "cx-personalization", label: "Hard to personalize at scale" },
    { id: "cx-journey", label: "Friction in purchase journey" },
    { id: "cx-support", label: "Poor customer service integration" },
    { id: "cx-consistency", label: "Inconsistent brand experience" },
    { id: "cx-measurement", label: "Satisfaction not measured" },
  ],
  loyalty: [
    { id: "loyalty-conversion", label: "Unclear conversion approach" },
    { id: "loyalty-nurturing", label: "Prospects not nurtured effectively" },
    { id: "loyalty-signals", label: "Teams misaligned on readiness signals" },
    { id: "loyalty-automation", label: "Limited automation in journeys" },
    { id: "loyalty-optimization", label: "No systematic conversion optimization" },
  ],
  people: [
    { id: "people-roles", label: "Unclear roles and responsibilities" },
    { id: "people-process", label: "Inconsistent campaign processes" },
    { id: "people-collaboration", label: "Poor cross-functional collaboration" },
    { id: "people-learning", label: "Limited learning from campaigns" },
    { id: "people-change", label: "Resistance to new tools or methods" },
  ],
  process: [
    { id: "process-documentation", label: "Processes not documented" },
    { id: "process-standardization", label: "Lack of standardized workflows" },
    { id: "process-agility", label: "Slow to adapt to change" },
    { id: "process-planning", label: "Inefficient campaign planning" },
    { id: "process-optimization", label: "No process efficiency measurement" },
  ],
};

export const QUESTIONS = {
  B2B: {
    data: [
      { 
        id: "b2b-data-1", 
        text: "How centralized is your customer and prospect data today?",
        helperText: "Think about whether teams rely on one main system or multiple disconnected tools."
      },
      { 
        id: "b2b-data-2", 
        text: "How reliable and up-to-date is the data used for marketing activities?",
        helperText: "Consider how often data quality issues affect targeting, reporting, or campaigns."
      },
      { 
        id: "b2b-data-3", 
        text: "How often are marketing decisions driven by data rather than intuition?",
        helperText: "Focus on how decisions are actually made, not intent or plans."
      },
      { 
        id: "b2b-data-4", 
        text: "How consistently do you capture interactions across customer touchpoints?",
        helperText: "This includes website, campaigns, sales interactions, and support signals."
      },
      { 
        id: "b2b-data-5", 
        text: "What are the top challenges limiting progress in Data Management today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2B_CHALLENGE_OPTIONS.data
      } as ChallengeQuestion,
    ],
    targeting: [
      { 
        id: "b2b-targeting-1", 
        text: "How clearly defined is your ideal customer profile across teams?",
        helperText: "Consider whether sales and marketing describe the same type of customer."
      },
      { 
        id: "b2b-targeting-2", 
        text: "How actionable are your audience segments in day-to-day campaigns?",
        helperText: "Focus on whether segments are actively used, not just documented."
      },
      { 
        id: "b2b-targeting-3", 
        text: "How tailored is your messaging across different audiences?",
        helperText: "Think about meaningful differences, not minor copy changes."
      },
      { 
        id: "b2b-targeting-4", 
        text: "How consistently do you apply targeted or account-based approaches where relevant?",
        helperText: "Consider execution consistency, not isolated efforts."
      },
      { 
        id: "b2b-targeting-5", 
        text: "What are the top challenges limiting progress in Audience & Segmentation today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2B_CHALLENGE_OPTIONS.targeting
      } as ChallengeQuestion,
    ],
    channels: [
      { 
        id: "b2b-channels-1", 
        text: "How intentional is your choice of marketing channels today?",
        helperText: "Think about strategy versus historical habit."
      },
      { 
        id: "b2b-channels-2", 
        text: "How actively do you optimize performance across channels?",
        helperText: "Consider ongoing improvement, not one-time changes."
      },
      { 
        id: "b2b-channels-3", 
        text: "How coordinated are campaigns across multiple channels?",
        helperText: "Focus on customer experience, not internal planning."
      },
      { 
        id: "b2b-channels-4", 
        text: "How clearly do you understand which channels drive meaningful outcomes?",
        helperText: "Think beyond surface metrics like clicks or impressions."
      },
      { 
        id: "b2b-channels-5", 
        text: "What are the top challenges limiting progress in Channel Mix & Activation today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2B_CHALLENGE_OPTIONS.channels
      } as ChallengeQuestion,
    ],
    content: [
      { 
        id: "b2b-content-1", 
        text: "How strategic is your content planning and creation?",
        helperText: "Think about alignment with goals, not volume of content."
      },
      { 
        id: "b2b-content-2", 
        text: "How well does your content align with buyer journey stages?",
        helperText: "Consider whether content matches what buyers need at each stage."
      },
      { 
        id: "b2b-content-3", 
        text: "How consistent is your content quality and brand voice?",
        helperText: "Focus on recognizable standards across outputs."
      },
      { 
        id: "b2b-content-4", 
        text: "How effectively do you repurpose and distribute content?",
        helperText: "Think about getting more value from existing assets."
      },
      { 
        id: "b2b-content-5", 
        text: "What are the top challenges limiting progress in Content Strategy today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2B_CHALLENGE_OPTIONS.content
      } as ChallengeQuestion,
    ],
    "lead-to-pipe": [
      { 
        id: "b2b-l2p-1", 
        text: "How clear and consistent is your lead qualification approach?",
        helperText: "Think about shared understanding, not documentation alone."
      },
      { 
        id: "b2b-l2p-2", 
        text: "How effectively are prospects nurtured before sales engagement?",
        helperText: "Focus on consistency, not isolated journeys."
      },
      { 
        id: "b2b-l2p-3", 
        text: "How aligned are marketing and sales on readiness signals?",
        helperText: "Consider real handoffs, not process diagrams."
      },
      { 
        id: "b2b-l2p-4", 
        text: "How automated is the journey from initial engagement to pipeline?",
        helperText: "Think about repeatability, not full automation."
      },
      { 
        id: "b2b-l2p-5", 
        text: "What are the top challenges limiting progress in Lead-to-Pipeline today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2B_CHALLENGE_OPTIONS["lead-to-pipe"]
      } as ChallengeQuestion,
    ],
    analytics: [
      { 
        id: "b2b-analytics-1", 
        text: "How confident are you in the accuracy of your marketing reports?",
        helperText: "Think about trust in numbers during decision-making."
      },
      { 
        id: "b2b-analytics-2", 
        text: "How well do dashboards support day-to-day decisions?",
        helperText: "Focus on usefulness, not volume."
      },
      { 
        id: "b2b-analytics-3", 
        text: "How often do insights lead to clear action?",
        helperText: "Consider whether data changes behavior."
      },
      { 
        id: "b2b-analytics-4", 
        text: "How clearly can marketing activity be linked to business outcomes?",
        helperText: "Think beyond campaign-level metrics."
      },
      { 
        id: "b2b-analytics-5", 
        text: "What are the top challenges limiting progress in Analytics & Reporting today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2B_CHALLENGE_OPTIONS.analytics
      } as ChallengeQuestion,
    ],
    technology: [
      { 
        id: "b2b-tech-1", 
        text: "How well does your current marketing technology support your goals?",
        helperText: "Think about enablement, not feature lists."
      },
      { 
        id: "b2b-tech-2", 
        text: "How integrated are your core marketing and customer systems?",
        helperText: "Consider data flow, not vendor count."
      },
      { 
        id: "b2b-tech-3", 
        text: "How easy is it for teams to execute without manual workarounds?",
        helperText: "Focus on friction in daily execution."
      },
      { 
        id: "b2b-tech-4", 
        text: "How scalable is your current setup as the business grows?",
        helperText: "Think about sustainability, not short-term fixes."
      },
      { 
        id: "b2b-tech-5", 
        text: "What are the top challenges limiting progress in Technology & Enablement today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2B_CHALLENGE_OPTIONS.technology
      } as ChallengeQuestion,
    ],
    "customer-experience": [
      { 
        id: "b2b-cx-1", 
        text: "How personalized is your customer experience across touchpoints?",
        helperText: "Think about meaningful personalization, not just name tokens."
      },
      { 
        id: "b2b-cx-2", 
        text: "How well do you map and optimize the customer journey?",
        helperText: "Consider whether journeys are actively managed or just documented."
      },
      { 
        id: "b2b-cx-3", 
        text: "How responsive are you to customer feedback?",
        helperText: "Focus on action taken, not collection methods."
      },
      { 
        id: "b2b-cx-4", 
        text: "How consistent is your brand experience across channels?",
        helperText: "Think about what customers experience, not internal consistency."
      },
      { 
        id: "b2b-cx-5", 
        text: "What are the top challenges limiting progress in Customer Experience today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2B_CHALLENGE_OPTIONS["customer-experience"]
      } as ChallengeQuestion,
    ],
    people: [
      { 
        id: "b2b-people-1", 
        text: "How clearly defined are roles and responsibilities within marketing?",
        helperText: "Think about clarity in execution, not org charts."
      },
      { 
        id: "b2b-people-2", 
        text: "How consistently are campaigns planned and executed using repeatable processes?",
        helperText: "Focus on how work actually gets done."
      },
      { 
        id: "b2b-people-3", 
        text: "How well do teams collaborate across marketing, sales, and other functions?",
        helperText: "Consider day-to-day coordination, not meetings."
      },
      { 
        id: "b2b-people-4", 
        text: "How effectively do teams learn from past campaigns?",
        helperText: "Think about applied learning, not reports."
      },
      { 
        id: "b2b-people-5", 
        text: "What are the top challenges limiting progress in People & Process today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2B_CHALLENGE_OPTIONS.people
      } as ChallengeQuestion,
    ],
    process: [
      { 
        id: "b2b-process-1", 
        text: "How well-documented are your marketing processes?",
        helperText: "Think about whether processes exist and are followed."
      },
      { 
        id: "b2b-process-2", 
        text: "How standardized and repeatable are your workflows?",
        helperText: "Focus on consistency across similar work."
      },
      { 
        id: "b2b-process-3", 
        text: "How agile and adaptable are your marketing processes?",
        helperText: "Consider responsiveness to change."
      },
      { 
        id: "b2b-process-4", 
        text: "How effectively do you manage campaign planning and execution?",
        helperText: "Think about coordination and follow-through."
      },
      { 
        id: "b2b-process-5", 
        text: "What are the top challenges limiting progress in Process & Operations today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2B_CHALLENGE_OPTIONS.process
      } as ChallengeQuestion,
    ],
  },
  B2C: {
    "offers-targeting": [
      { 
        id: "b2c-offers-1", 
        text: "How clearly defined is your ideal customer profile across teams?",
        helperText: "Consider whether teams describe the same type of customer."
      },
      { 
        id: "b2c-offers-2", 
        text: "How actionable are your audience segments in day-to-day campaigns?",
        helperText: "Focus on whether segments are actively used, not just documented."
      },
      { 
        id: "b2c-offers-3", 
        text: "How tailored is your messaging across different audiences?",
        helperText: "Think about meaningful differences, not minor copy changes."
      },
      { 
        id: "b2c-offers-4", 
        text: "How consistently do you apply targeted approaches across campaigns?",
        helperText: "Consider execution consistency, not isolated efforts."
      },
      { 
        id: "b2c-offers-5", 
        text: "What are the top challenges limiting progress in Audience & Segmentation today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2C_CHALLENGE_OPTIONS["offers-targeting"]
      } as ChallengeQuestion,
    ],
    channels: [
      { 
        id: "b2c-channels-1", 
        text: "How intentional is your choice of marketing channels today?",
        helperText: "Think about strategy versus historical habit."
      },
      { 
        id: "b2c-channels-2", 
        text: "How actively do you optimize performance across channels?",
        helperText: "Consider ongoing improvement, not one-time changes."
      },
      { 
        id: "b2c-channels-3", 
        text: "How coordinated are campaigns across multiple channels?",
        helperText: "Focus on customer experience, not internal planning."
      },
      { 
        id: "b2c-channels-4", 
        text: "How clearly do you understand which channels drive meaningful outcomes?",
        helperText: "Think beyond surface metrics like clicks or impressions."
      },
      { 
        id: "b2c-channels-5", 
        text: "What are the top challenges limiting progress in Channel Mix & Activation today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2C_CHALLENGE_OPTIONS.channels
      } as ChallengeQuestion,
    ],
    engagement: [
      { 
        id: "b2c-engagement-1", 
        text: "How engaging is your content and messaging?",
        helperText: "Think about audience response and interaction."
      },
      { 
        id: "b2c-engagement-2", 
        text: "How well do you build and nurture customer relationships?",
        helperText: "Focus on ongoing connection, not one-time campaigns."
      },
      { 
        id: "b2c-engagement-3", 
        text: "How responsive are you to customer interactions?",
        helperText: "Consider speed and quality of response."
      },
      { 
        id: "b2c-engagement-4", 
        text: "How effective are your email and SMS campaigns?",
        helperText: "Think about engagement and conversion, not just delivery."
      },
      { 
        id: "b2c-engagement-5", 
        text: "What are the top challenges limiting progress in Customer Engagement today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2C_CHALLENGE_OPTIONS.engagement
      } as ChallengeQuestion,
    ],
    "data-analytics": [
      { 
        id: "b2c-data-1", 
        text: "How centralized is your customer data today?",
        helperText: "Think about whether teams rely on one main system or multiple disconnected tools."
      },
      { 
        id: "b2c-data-2", 
        text: "How reliable and up-to-date is the data used for marketing activities?",
        helperText: "Consider how often data quality issues affect targeting, reporting, or campaigns."
      },
      { 
        id: "b2c-data-3", 
        text: "How often are marketing decisions driven by data rather than intuition?",
        helperText: "Focus on how decisions are actually made, not intent or plans."
      },
      { 
        id: "b2c-data-4", 
        text: "How consistently do you capture interactions across customer touchpoints?",
        helperText: "This includes website, campaigns, purchase behavior, and support signals."
      },
      { 
        id: "b2c-data-5", 
        text: "What are the top challenges limiting progress in Data Management today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2C_CHALLENGE_OPTIONS["data-analytics"]
      } as ChallengeQuestion,
    ],
    technology: [
      { 
        id: "b2c-tech-1", 
        text: "How well does your current marketing technology support your goals?",
        helperText: "Think about enablement, not feature lists."
      },
      { 
        id: "b2c-tech-2", 
        text: "How integrated are your core marketing and customer systems?",
        helperText: "Consider data flow, not vendor count."
      },
      { 
        id: "b2c-tech-3", 
        text: "How easy is it for teams to execute without manual workarounds?",
        helperText: "Focus on friction in daily execution."
      },
      { 
        id: "b2c-tech-4", 
        text: "How scalable is your current setup as the business grows?",
        helperText: "Think about sustainability, not short-term fixes."
      },
      { 
        id: "b2c-tech-5", 
        text: "What are the top challenges limiting progress in Technology & Enablement today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2C_CHALLENGE_OPTIONS.technology
      } as ChallengeQuestion,
    ],
    "customer-experience": [
      { 
        id: "b2c-cx-1", 
        text: "How personalized is the customer experience?",
        helperText: "Think about meaningful personalization, not just name tokens."
      },
      { 
        id: "b2c-cx-2", 
        text: "How seamless is the purchase journey?",
        helperText: "Consider friction points from discovery to purchase."
      },
      { 
        id: "b2c-cx-3", 
        text: "How well do you handle customer service and support?",
        helperText: "Focus on responsiveness and resolution quality."
      },
      { 
        id: "b2c-cx-4", 
        text: "How consistent is your brand experience?",
        helperText: "Think about what customers experience across touchpoints."
      },
      { 
        id: "b2c-cx-5", 
        text: "What are the top challenges limiting progress in Customer Experience today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2C_CHALLENGE_OPTIONS["customer-experience"]
      } as ChallengeQuestion,
    ],
    loyalty: [
      { 
        id: "b2c-loyalty-1", 
        text: "How clear and consistent is your conversion approach?",
        helperText: "Think about shared understanding, not documentation alone."
      },
      { 
        id: "b2c-loyalty-2", 
        text: "How effectively are prospects nurtured before conversion?",
        helperText: "Focus on consistency, not isolated journeys."
      },
      { 
        id: "b2c-loyalty-3", 
        text: "How aligned are teams on customer readiness signals?",
        helperText: "Consider real coordination, not process diagrams."
      },
      { 
        id: "b2c-loyalty-4", 
        text: "How automated is the journey from initial engagement to conversion?",
        helperText: "Think about repeatability, not full automation."
      },
      { 
        id: "b2c-loyalty-5", 
        text: "What are the top challenges limiting progress in Conversion today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2C_CHALLENGE_OPTIONS.loyalty
      } as ChallengeQuestion,
    ],
    people: [
      { 
        id: "b2c-people-1", 
        text: "How clearly defined are roles and responsibilities within marketing?",
        helperText: "Think about clarity in execution, not org charts."
      },
      { 
        id: "b2c-people-2", 
        text: "How consistently are campaigns planned and executed using repeatable processes?",
        helperText: "Focus on how work actually gets done."
      },
      { 
        id: "b2c-people-3", 
        text: "How well do teams collaborate across marketing and other functions?",
        helperText: "Consider day-to-day coordination, not meetings."
      },
      { 
        id: "b2c-people-4", 
        text: "How effectively do teams learn from past campaigns?",
        helperText: "Think about applied learning, not reports."
      },
      { 
        id: "b2c-people-5", 
        text: "What are the top challenges limiting progress in People & Process today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2C_CHALLENGE_OPTIONS.people
      } as ChallengeQuestion,
    ],
    process: [
      { 
        id: "b2c-process-1", 
        text: "How well-documented are your marketing processes?",
        helperText: "Think about whether processes exist and are followed."
      },
      { 
        id: "b2c-process-2", 
        text: "How standardized and repeatable are your workflows?",
        helperText: "Focus on consistency across similar work."
      },
      { 
        id: "b2c-process-3", 
        text: "How agile and adaptable are your marketing processes?",
        helperText: "Consider responsiveness to change."
      },
      { 
        id: "b2c-process-4", 
        text: "How effectively do you manage campaign planning and execution?",
        helperText: "Think about coordination and follow-through."
      },
      { 
        id: "b2c-process-5", 
        text: "What are the top challenges limiting progress in Process & Operations today?",
        helperText: "Select up to 3 challenges that best describe your current situation.",
        isChallenge: true,
        options: B2C_CHALLENGE_OPTIONS.process
      } as ChallengeQuestion,
    ],
  },
} as const;

export const CATEGORY_LABELS = {
  B2B: {
    data: "Data Management",
    targeting: "Audience & Segmentation",
    channels: "Channel Mix & Activation",
    content: "Content Strategy",
    "lead-to-pipe": "Lead-to-Pipeline",
    analytics: "Analytics & Reporting",
    technology: "Technology & Enablement",
    "customer-experience": "Customer Experience",
    people: "People & Process",
    process: "Process & Operations",
  },
  B2C: {
    "offers-targeting": "Audience & Segmentation",
    channels: "Channel Mix & Activation",
    engagement: "Customer Engagement",
    "data-analytics": "Data Management",
    technology: "Technology & Enablement",
    "customer-experience": "Customer Experience",
    loyalty: "Conversion",
    people: "People & Process",
    process: "Process & Operations",
  },
} as const;

// Helper to check if a question is a challenge question
export function isChallengeQuestion(question: Question | ChallengeQuestion): question is ChallengeQuestion {
  return 'isChallenge' in question && question.isChallenge === true;
}
