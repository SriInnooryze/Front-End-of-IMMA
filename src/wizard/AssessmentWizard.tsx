import { useState, useEffect, useRef } from "react";
import { ExternalLink, RotateCcw, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/Stepper";
import { BackgroundLayer } from "@/components/BackgroundLayer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Step1BusinessType } from "./Step1BusinessType";
import { Step2BasicInfo } from "./Step2BasicInfo";
import { Step3Categories } from "./Step3Categories";
import { Step4Questions } from "./Step4Questions";
import { Step5Results } from "./Step5Results";
import { Step6Growth } from "./Step6Growth";
import { Step7ExecutiveSummary } from "./Step7ExecutiveSummary";
import {
  UserInfo,
  Answer,
  SubmitAssessmentResponse,
  startAssessment,
  submitAssessment,
} from "@/api";
import { toast } from "@/hooks/use-toast";
import { useWizardPersistence, getPersistedState, getInitialTheme, saveThemePreference } from "@/hooks/useWizardPersistence";
import logoLightMode from "@/assets/ir-logo-light-mode.svg";

// Dark mode uses the white/light logo (remote URL), Light mode uses the dark/black logo (local)
const LOGO_DARK_MODE = "https://innooryze.com/wp-content/uploads/2025/05/Frame-72.svg";

export function AssessmentWizard() {
  // Initialize session state from sessionStorage
  const persisted = getPersistedState();
  const mainRef = useRef<HTMLDivElement>(null);
  
  // Theme is separate - stored in localStorage (persists across sessions)
  const [isDarkMode, setIsDarkMode] = useState(() => getInitialTheme());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(persisted.currentStep ?? 1);
  const [businessType, setBusinessType] = useState<"B2B" | "B2C" | null>(persisted.businessType ?? null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(persisted.userInfo ?? null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(persisted.selectedCategories ?? []);
  const [assessmentId, setAssessmentId] = useState<string>(persisted.assessmentId ?? "");
  const [answers, setAnswers] = useState<Record<string, Answer>>(persisted.answers ?? {});
  const [results, setResults] = useState<SubmitAssessmentResponse | null>(persisted.results ?? null);
  const [selectedPlan, setSelectedPlan] = useState<"crawl" | "walk" | "run" | null>(persisted.selectedPlan ?? null);
  const [loading, setLoading] = useState(false);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  }, [currentStep]);

  // Persist session state (NOT theme - that's separate)
  const { clearPersistedState } = useWizardPersistence({
    currentStep,
    businessType,
    userInfo,
    selectedCategories,
    assessmentId,
    answers,
    results,
    selectedPlan,
  });

  // Apply theme class on mount and changes + persist to localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("light", !isDarkMode);
    saveThemePreference(isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleStartOver = () => {
    clearPersistedState();
    setCurrentStep(1);
    setBusinessType(null);
    setUserInfo(null);
    setSelectedCategories([]);
    setAssessmentId("");
    setAnswers({});
    setResults(null);
    setSelectedPlan(null);
    toast({
      title: "Assessment Reset",
      description: "You can start a new assessment now.",
    });
  };

  const handleBusinessTypeSelect = (type: "B2B" | "B2C") => {
    setBusinessType(type);
    setCurrentStep(2);
  };

  const handleBasicInfoNext = async (info: UserInfo) => {
    setUserInfo(info);
    setLoading(true);
    try {
      const response = await startAssessment({
        businessType: businessType!,
        userInfo: info,
        selectedCategories: [],
      });
      setAssessmentId(response.assessmentId);
      setCurrentStep(3);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriesNext = (categories: string[]) => {
    setSelectedCategories(categories);
    setCurrentStep(4);
  };

  const handleQuestionsSubmit = async (submittedAnswers: Record<string, Answer>) => {
    setAnswers(submittedAnswers);
    setLoading(true);
    try {
      const response = await submitAssessment(assessmentId, {
        businessType: businessType!,
        selectedCategories,
        answers: submittedAnswers,
      });
      setResults(response);
      setCurrentStep(5);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: "crawl" | "walk" | "run") => {
    setSelectedPlan(plan);
    setCurrentStep(6);
  };

  const handlePlanChange = (plan: "crawl" | "walk" | "run") => {
    setSelectedPlan(plan);
  };

  const handleViewSummary = () => {
    setCurrentStep(7);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    toast({
      title: "Assessment Complete!",
      description: "Thank you for completing the Marketing Maturity Assessment.",
    });
    // Clear persisted state and reset wizard
    clearPersistedState();
    setCurrentStep(1);
    setBusinessType(null);
    setUserInfo(null);
    setSelectedCategories([]);
    setAnswers({});
    setResults(null);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen relative">
      {/* Ambient Background Particles */}
      <BackgroundLayer isDarkMode={isDarkMode} />

      {/* Persistent Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo - switches based on theme: dark mode = light logo, light mode = dark logo */}
          <div className="flex items-center gap-3">
            <img 
              src={isDarkMode ? LOGO_DARK_MODE : logoLightMode} 
              alt="InnoRyze Marketing Maturity Assessment"
              className="h-8 w-auto"
              key={isDarkMode ? 'dark' : 'light'}
            />
          </div>

          {/* Right side: Start Over + Contact + Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Start Over - only show if past step 1 */}
            {currentStep > 1 && (
              <button
                onClick={handleStartOver}
                className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Start over"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Start over</span>
              </button>
            )}

            {/* Secondary Action - Contact (Desktop) */}
            <a
              href="https://innooryze.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border/50 rounded-md hover:border-border transition-colors"
            >
              <span>Contact Us</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Theme Toggle - Segmented Control */}
            <div className="hidden sm:flex items-center bg-muted/60 rounded-lg p-0.5 border border-border">
              <button
                onClick={() => setIsDarkMode(true)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-300 ${
                  isDarkMode 
                    ? "bg-card text-foreground shadow-sm border border-border" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={isDarkMode}
              >
                Dark
              </button>
              <button
                onClick={() => setIsDarkMode(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-300 ${
                  !isDarkMode 
                    ? "bg-card text-foreground shadow-sm border border-border" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={!isDarkMode}
              >
                Light
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-border/50 bg-background/95 backdrop-blur-md">
            <div className="px-4 py-3 space-y-3">
              {/* Contact Us */}
              <a
                href="https://innooryze.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >
                <span>Contact Us</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              
              {/* Theme Toggle */}
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-muted-foreground">Theme</span>
                <div className="flex items-center bg-muted/60 rounded-lg p-0.5 border border-border">
                  <button
                    onClick={() => setIsDarkMode(true)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-300 ${
                      isDarkMode 
                        ? "bg-card text-foreground shadow-sm border border-border" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setIsDarkMode(false)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-300 ${
                      !isDarkMode 
                        ? "bg-card text-foreground shadow-sm border border-border" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Light
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content - positioned above background */}
      <main className="py-8 md:py-12 px-4 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Marketing Maturity Assessment
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Discover your marketing strengths and unlock growth opportunities
            </p>
          </div>

          {/* Stepper */}
          {currentStep > 0 && (
            <Stepper currentStep={currentStep} totalSteps={7} />
          )}

          {/* Step Content */}
          <div className="min-h-[500px] animate-fade-in">
            {currentStep === 1 && (
              <Step1BusinessType onSelect={handleBusinessTypeSelect} />
            )}

            {currentStep === 2 && (
              <Step2BasicInfo 
                onNext={handleBasicInfoNext} 
                onBack={handleBack}
                loading={loading}
                initialData={userInfo}
              />
            )}

            {currentStep === 3 && businessType && (
              <Step3Categories
                businessType={businessType}
                onNext={handleCategoriesNext}
                onBack={handleBack}
                initialCategories={selectedCategories}
              />
            )}

            {currentStep === 4 && businessType && (
              <Step4Questions
                businessType={businessType}
                selectedCategories={selectedCategories}
                onSubmit={handleQuestionsSubmit}
                onBack={handleBack}
                loading={loading}
                initialAnswers={answers}
              />
            )}

            {currentStep === 5 && results && (
              <Step5Results 
                results={results} 
                onSelectPlan={handlePlanSelect}
                onBack={handleBack}
                companyName={userInfo?.businessName}
                businessType={businessType}
              />
            )}

            {currentStep === 6 && selectedPlan && results && (
              <Step6Growth
                assessmentId={assessmentId}
                selectedPlan={selectedPlan}
                simulation={results.growthSimulation[selectedPlan]}
                onFinish={handleViewSummary}
                onBack={handleBack}
                onChangePlan={handlePlanChange}
              />
            )}

            {currentStep === 7 && selectedPlan && results && (
              <Step7ExecutiveSummary
                results={results}
                selectedPlan={selectedPlan}
                companyName={userInfo?.businessName}
                businessType={businessType}
                onFinish={handleFinish}
                onBack={handleBack}
              />
            )}
          </div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTop threshold={200} />
    </div>
  );
}
