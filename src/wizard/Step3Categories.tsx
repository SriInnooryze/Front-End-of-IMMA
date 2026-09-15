import { useState } from "react";
import { GlowingCard } from "@/components/GlowingCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS, CATEGORY_GROUPS } from "@/config/questions";
import { ChevronLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step3CategoriesProps {
  businessType: "B2B" | "B2C";
  onNext: (categories: string[]) => void;
  onBack?: () => void;
  initialCategories?: string[];
}

export function Step3Categories({ businessType, onNext, onBack, initialCategories }: Step3CategoriesProps) {
  const allCategories = Object.keys(CATEGORY_LABELS[businessType]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategories && initialCategories.length > 0 ? initialCategories : allCategories
  );
  const groups = CATEGORY_GROUPS[businessType];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleGroup = (groupCategories: readonly string[]) => {
    const allSelected = groupCategories.every((c) => selectedCategories.includes(c));
    if (allSelected) {
      setSelectedCategories((prev) => prev.filter((c) => !groupCategories.includes(c)));
    } else {
      setSelectedCategories((prev) => [...new Set([...prev, ...groupCategories])]);
    }
  };

  const handleNext = () => {
    onNext(selectedCategories);
  };

  const selectAll = () => setSelectedCategories(allCategories);
  const clearAll = () => setSelectedCategories([]);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
          Select Assessment Categories
        </h2>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
          Choose the areas you want to assess. Select what best reflects your current marketing setup and priorities.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Selection controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Select All
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              onClick={clearAll}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear All
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            {selectedCategories.length} of {allCategories.length} selected
          </span>
        </div>

        {/* Grouped Categories */}
        <div className="space-y-6">
          {groups.map((group) => {
            const groupSelected = group.categories.filter((c) =>
              selectedCategories.includes(c)
            ).length;
            const allGroupSelected = groupSelected === group.categories.length;

            return (
              <div key={group.name} className="space-y-3">
                {/* Group Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                    {group.name}
                  </h3>
                  <button
                    onClick={() => toggleGroup(group.categories)}
                    className={cn(
                      "text-xs font-medium transition-colors",
                      allGroupSelected
                        ? "text-muted-foreground hover:text-foreground"
                        : "text-primary hover:text-primary/80"
                    )}
                  >
                    {allGroupSelected ? "Deselect group" : "Select group"}
                  </button>
                </div>

                {/* Category Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.categories.map((category) => {
                    const label =
                      CATEGORY_LABELS[businessType][
                        category as keyof (typeof CATEGORY_LABELS)[typeof businessType]
                      ];
                    const description =
                      CATEGORY_DESCRIPTIONS[businessType][
                        category as keyof (typeof CATEGORY_DESCRIPTIONS)[typeof businessType]
                      ];
                    const isSelected = selectedCategories.includes(category);

                    return (
                      <div
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={cn(
                          "group relative p-4 rounded-xl border cursor-pointer transition-all duration-200",
                          "hover:border-primary/50",
                          isSelected
                            ? "bg-primary/5 border-primary/60"
                            : "bg-card border-border"
                        )}
                      >
                        {/* Selection indicator */}
                        <div
                          className={cn(
                            "absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                            isSelected
                              ? "bg-primary border-primary"
                              : "border-muted-foreground/40 group-hover:border-primary/50"
                          )}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-primary-foreground" />
                          )}
                        </div>

                        <div className="pr-8 space-y-1.5">
                          <h4
                            className={cn(
                              "font-medium text-sm transition-colors",
                              isSelected ? "text-primary" : "text-foreground"
                            )}
                          >
                            {label}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {selectedCategories.length === 0 && (
          <p className="text-center text-destructive text-sm">
            Please select at least one category to continue
          </p>
        )}

        <div className="flex gap-3 pt-4">
          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={selectedCategories.length === 0}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth"
          >
            Start Assessment ({selectedCategories.length}{" "}
            {selectedCategories.length === 1 ? "category" : "categories"})
          </Button>
        </div>
      </div>
    </div>
  );
}
