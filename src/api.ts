export const API_BASE_URL = "http://localhost:5000";

export interface UserInfo {
  firstName: string;
  email: string;
  businessName: string;
  country?: string;
  industry?: string;
}

export interface StartAssessmentRequest {
  businessType: "B2B" | "B2C";
  userInfo: UserInfo;
  selectedCategories: string[];
}

export interface StartAssessmentResponse {
  assessmentId: string;
}

export interface Answer {
  score: number;
  note?: string;
}

export interface SubmitAssessmentRequest {
  businessType: "B2B" | "B2C";
  selectedCategories: string[];
  answers: Record<string, Answer>;
}

export interface CategoryScore {
  category: string;
  current: number;
  after?: number;
}

export interface PlanOption {
  title: string;
  description: string;
  recommendedActions: string[];
}

export interface GrowthSimulationCategory {
  category: string;
  currentScore: number;
  afterScore: number;
}

export interface StrongCategory {
  category: string;
  score: number;
  benchmark: number;
}

export interface StretchCategory {
  category: string;
  score: number;
  benchmark: number;
}

export interface CategoryInsight {
  category: string;
  headline?: string;
  doingWell: string[];
  behind: string[];
}

export interface BenchmarkEntry {
  score: number;
  label?: string;
}

export interface SubmitAssessmentResponse {
  scores: CategoryScore[];
  analysis: {
    perCategory?: CategoryInsight[];
    [key: string]: any;
  };
  benchmarks: Record<string, BenchmarkEntry>;
  options: Record<
    string,
    {
      label?: string;
      summary?: string;
      actions?: string[];
    }
  >;
  growthSimulation: {
    crawl: GrowthSimulationCategory[];
    walk: GrowthSimulationCategory[];
    run: GrowthSimulationCategory[];
  };
  resultMode?: string;
  strongCategories?: StrongCategory[];
  stretchCategories?: StretchCategory[];
}

export async function startAssessment(data: StartAssessmentRequest): Promise<StartAssessmentResponse> {
  const response = await fetch(`${API_BASE_URL}/api/assessments/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to start assessment: ${response.statusText}`);
  }

  return response.json();
}

export async function submitAssessment(
  assessmentId: string,
  data: SubmitAssessmentRequest,
): Promise<SubmitAssessmentResponse> {
  const response = await fetch(`${API_BASE_URL}/api/assessments/${assessmentId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit assessment: ${response.statusText}`);
  }

  return response.json();
}

export async function getAssessment(assessmentId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/assessments/${assessmentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get assessment: ${response.statusText}`);
  }

  return response.json();
}

export async function generatePDF(assessmentId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/assessments/${assessmentId}/pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 501) {
    throw new Error("PDF generation is not yet implemented");
  }

  if (!response.ok) {
    throw new Error(`Failed to generate PDF: ${response.statusText}`);
  }
}
