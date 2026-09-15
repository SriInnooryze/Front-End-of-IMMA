import { useEffect, useCallback, useRef } from "react";
import { UserInfo, Answer, SubmitAssessmentResponse } from "@/api";

const STORAGE_PREFIX = "imma_v1_";
const THEME_KEY = "imma_theme_preference"; // Separate localStorage for theme

interface WizardState {
  currentStep: number;
  businessType: "B2B" | "B2C" | null;
  userInfo: UserInfo | null;
  selectedCategories: string[];
  assessmentId: string;
  answers: Record<string, Answer>;
  results: SubmitAssessmentResponse | null;
  selectedPlan: "crawl" | "walk" | "run" | null;
}

const SESSION_KEYS = {
  currentStep: `${STORAGE_PREFIX}currentStep`,
  businessType: `${STORAGE_PREFIX}businessType`,
  userInfo: `${STORAGE_PREFIX}userInfo`,
  selectedCategories: `${STORAGE_PREFIX}selectedCategories`,
  assessmentId: `${STORAGE_PREFIX}assessmentId`,
  answers: `${STORAGE_PREFIX}answers`,
  results: `${STORAGE_PREFIX}results`,
  selectedPlan: `${STORAGE_PREFIX}selectedPlan`,
} as const;

function safeGetSessionItem<T>(key: string, fallback: T): T {
  try {
    const item = sessionStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function safeSetSessionItem(key: string, value: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail if sessionStorage is full or unavailable
  }
}

// Theme is stored separately in localStorage (persists across sessions)
export function getInitialTheme(): boolean {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored !== null) {
      return JSON.parse(stored);
    }
  } catch {
    // Fall through to default
  }
  // Default to dark mode
  return true;
}

export function saveThemePreference(isDarkMode: boolean): void {
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify(isDarkMode));
  } catch {
    // Silently fail
  }
}

// Session state (clears when tab/browser closes)
export function getPersistedState(): Partial<WizardState> {
  return {
    currentStep: safeGetSessionItem(SESSION_KEYS.currentStep, 1),
    businessType: safeGetSessionItem(SESSION_KEYS.businessType, null),
    userInfo: safeGetSessionItem(SESSION_KEYS.userInfo, null),
    selectedCategories: safeGetSessionItem(SESSION_KEYS.selectedCategories, []),
    assessmentId: safeGetSessionItem(SESSION_KEYS.assessmentId, ""),
    answers: safeGetSessionItem(SESSION_KEYS.answers, {}),
    results: safeGetSessionItem(SESSION_KEYS.results, null),
    selectedPlan: safeGetSessionItem(SESSION_KEYS.selectedPlan, null),
  };
}

export function useWizardPersistence(state: WizardState) {
  const isInitialMount = useRef(true);

  // Persist state changes to sessionStorage (skip on initial mount to avoid overwriting)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    safeSetSessionItem(SESSION_KEYS.currentStep, state.currentStep);
    safeSetSessionItem(SESSION_KEYS.businessType, state.businessType);
    safeSetSessionItem(SESSION_KEYS.userInfo, state.userInfo);
    safeSetSessionItem(SESSION_KEYS.selectedCategories, state.selectedCategories);
    safeSetSessionItem(SESSION_KEYS.assessmentId, state.assessmentId);
    safeSetSessionItem(SESSION_KEYS.answers, state.answers);
    safeSetSessionItem(SESSION_KEYS.results, state.results);
    safeSetSessionItem(SESSION_KEYS.selectedPlan, state.selectedPlan);
  }, [state]);

  const clearPersistedState = useCallback(() => {
    Object.values(SESSION_KEYS).forEach((key) => {
      sessionStorage.removeItem(key);
    });
  }, []);

  return { clearPersistedState };
}
