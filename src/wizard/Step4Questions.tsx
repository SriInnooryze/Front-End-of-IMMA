import { useState, useEffect, useRef } from "react";
import { GlowingCard } from "@/components/GlowingCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FocusTooltip } from "@/components/FocusTooltip";
import { QUESTIONS, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS, Question, ChallengeQuestion, isChallengeQuestion } from "@/config/questions";
import { Answer } from "@/api";
import { Loader2, ChevronLeft, MessageSquare, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step4QuestionsProps {
  businessType: "B2B" | "B2C";
  selectedCategories: string[];
  onSubmit: (answers: Record<string, Answer>) => void;
  onBack?: () => void;
  loading: boolean;
  initialAnswers?: Record<string, Answer>;
}

const SCORE_LABELS = [
  { score: 1, label: "Not at all" },
  { score: 2, label: "Slightly" },
  { score: 3, label: "Moderately" },
  { score: 4, label: "Very" },
  { score: 5, label: "Extremely" },
];

const MAX_CHALLENGES = 3;

export function Step4Questions({
  businessType,
  selectedCategories,
  onSubmit,
  onBack,
  loading,
  initialAnswers,
}: Step4QuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, Answer>>(initialAnswers || {});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [challengeSelections, setChallengeSelections] = useState<Record<string, string[]>>({});
  const [otherText, setOtherText] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const currentCategory = selectedCategories[currentCategoryIndex];
  const categoryLabel = CATEGORY_LABELS[businessType][currentCategory as keyof typeof CATEGORY_LABELS[typeof businessType]];
  const categoryDescription = CATEGORY_DESCRIPTIONS[businessType][currentCategory as keyof typeof CATEGORY_DESCRIPTIONS[typeof businessType]];
  const questions: readonly (Question | ChallengeQuestion)[] = QUESTIONS[businessType][currentCategory as keyof typeof QUESTIONS[typeof businessType]] || [];

  // Scroll to top of form content on category change
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentCategoryIndex]);

  const setScore = (questionId: string, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        score,
      },
    }));
  };

  const setNote = (questionId: string, note: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        note,
      },
    }));
  };

  const toggleNotes = (questionId: string) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  // Handle challenge question selection
  const toggleChallengeOption = (questionId: string, optionId: string) => {
    setChallengeSelections((prev) => {
      const current = prev[questionId] || [];
      let updated: string[];
      
      if (current.includes(optionId)) {
        updated = current.filter(id => id !== optionId);
      } else {
        if (current.length >= MAX_CHALLENGES) {
          // Remove oldest selection and add new one
          updated = [...current.slice(1), optionId];
        } else {
          updated = [...current, optionId];
        }
      }
      
      // Update the answer with challenge selections
      const otherSelected = updated.includes("other");
      const otherValue = otherText[questionId] || "";
      
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: {
          ...prevAnswers[questionId],
          score: updated.length > 0 ? Math.min(5, updated.length + 2) : 0, // Pain intensity based on selection count
          note: JSON.stringify({ 
            challenges: updated.filter(id => id !== "other"),
            otherText: otherSelected ? otherValue : undefined
          }),
        },
      }));
      
      return { ...prev, [questionId]: updated };
    });
  };

  const handleOtherTextChange = (questionId: string, text: string) => {
    setOtherText((prev) => ({ ...prev, [questionId]: text }));
    
    // Update answer if "other" is selected
    const currentSelections = challengeSelections[questionId] || [];
    if (currentSelections.includes("other")) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: {
          ...prevAnswers[questionId],
          note: JSON.stringify({ 
            challenges: currentSelections.filter(id => id !== "other"),
            otherText: text
          }),
        },
      }));
    }
  };

  // Check if all questions are answered (including challenge questions)
  const allQuestionsAnswered = questions.every((q) => {
    if (isChallengeQuestion(q)) {
      const selections = challengeSelections[q.id] || [];
      return selections.length > 0;
    }
    return answers[q.id]?.score;
  });
  
  const answeredCount = questions.filter((q) => {
    if (isChallengeQuestion(q)) {
      const selections = challengeSelections[q.id] || [];
      return selections.length > 0;
    }
    return answers[q.id]?.score;
  }).length;

  const handleNext = () => {
    if (currentCategoryIndex < selectedCategories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    } else {
      onSubmit(answers);
    }
  };

  const handleBack = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const progress = ((currentCategoryIndex + 1) / selectedCategories.length) * 100;

  return (
    <div ref={formRef} className="animate-fade-in space-y-8">
      {/* Category Header */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-primary uppercase tracking-widest">
            Category {currentCategoryIndex + 1} of {selectedCategories.length}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            {categoryLabel}
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            {categoryDescription}
          </p>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{answeredCount} of {questions.length} questions answered</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-3xl mx-auto space-y-4">
        {questions.map((question, index) => {
          // Challenge question (5th question)
          if (isChallengeQuestion(question)) {
            const selectedOptions = challengeSelections[question.id] || [];
            const otherSelected = selectedOptions.includes("other");
            
            return (
              <div
                key={question.id}
                className={cn(
                  "p-5 rounded-xl border transition-all duration-200",
                  selectedOptions.length > 0
                    ? "bg-primary/5 border-primary/30"
                    : "bg-card border-border"
                )}
              >
                <div className="space-y-4">
                  {/* Question text with helper icon */}
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-medium text-amber-400">
                      {index + 1}
                    </span>
                    <div className="flex items-start gap-2 flex-1">
                      <h3 className="text-sm font-medium text-foreground leading-relaxed pt-0.5 flex-1">
                        {question.text}
                      </h3>
                      <FocusTooltip
                        content={
                          <div className="space-y-2">
                            <p className="font-medium text-foreground">Why this matters</p>
                            <p className="text-muted-foreground">{question.helperText}</p>
                          </div>
                        }
                      />
                    </div>
                  </div>

                  {/* Multi-select challenge options */}
                  <div className="pl-9 space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Select up to {MAX_CHALLENGES} challenges (selected: {selectedOptions.length}/{MAX_CHALLENGES})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {question.options.map((option) => {
                        const isSelected = selectedOptions.includes(option.id);
                        return (
                          <button
                            key={option.id}
                            onClick={() => toggleChallengeOption(question.id, option.id)}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left text-xs transition-all duration-200",
                              isSelected
                                ? "bg-primary/10 border-primary text-foreground"
                                : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <div className={cn(
                              "flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors",
                              isSelected
                                ? "bg-primary border-primary"
                                : "border-muted-foreground/50"
                            )}>
                              {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>
                            <span className="flex-1">{option.label}</span>
                          </button>
                        );
                      })}
                      
                      {/* Other option */}
                      <button
                        onClick={() => toggleChallengeOption(question.id, "other")}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left text-xs transition-all duration-200",
                          otherSelected
                            ? "bg-primary/10 border-primary text-foreground"
                            : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <div className={cn(
                          "flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors",
                          otherSelected
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/50"
                        )}>
                          {otherSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <span className="flex-1">Other (please specify)</span>
                      </button>
                    </div>
                    
                    {/* Other text input */}
                    {otherSelected && (
                      <Input
                        value={otherText[question.id] || ""}
                        onChange={(e) => handleOtherTextChange(question.id, e.target.value)}
                        placeholder="Please describe your challenge..."
                        className="input-enterprise text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Regular scored question
          const currentAnswer = answers[question.id];
          const hasScore = !!currentAnswer?.score;
          const showNotes = expandedNotes.has(question.id);

          return (
            <div
              key={question.id}
              className={cn(
                "p-5 rounded-xl border transition-all duration-200",
                hasScore
                  ? "bg-primary/5 border-primary/30"
                  : "bg-card border-border"
              )}
            >
              <div className="space-y-4">
                {/* Question text with helper icon */}
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="flex items-start gap-2 flex-1">
                    <h3 className="text-sm font-medium text-foreground leading-relaxed pt-0.5 flex-1">
                      {question.text}
                    </h3>
                    <FocusTooltip
                      content={
                        <div className="space-y-2">
                          <p className="font-medium text-foreground">Why this matters</p>
                          <p className="text-muted-foreground">{question.helperText}</p>
                        </div>
                      }
                    />
                  </div>
                </div>

                {/* Score selection */}
                <div className="pl-9 space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    {SCORE_LABELS.map(({ score, label }) => (
                      <button
                        key={score}
                        onClick={() => setScore(question.id, score)}
                        className={cn(
                          "flex-1 min-w-[60px] px-3 py-2.5 rounded-lg border text-xs font-medium transition-all duration-200",
                          currentAnswer?.score === score
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-base font-semibold">{score}</span>
                          <span className="hidden sm:block text-[10px] opacity-80">{label}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Notes toggle */}
                  {hasScore && (
                    <div className="space-y-2">
                      <button
                        onClick={() => toggleNotes(question.id)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        {showNotes ? "Hide notes" : "Add a note (optional)"}
                      </button>

                      {showNotes && (
                        <Textarea
                          value={currentAnswer?.note || ""}
                          onChange={(e) => setNote(question.id, e.target.value)}
                          placeholder="Add any context or comments..."
                          className="input-enterprise min-h-[70px] resize-none text-sm"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex items-center gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!allQuestionsAnswered || loading}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : currentCategoryIndex < selectedCategories.length - 1 ? (
              "Next Category"
            ) : (
              "Complete Assessment"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
