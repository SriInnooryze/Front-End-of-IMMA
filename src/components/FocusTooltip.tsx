import { useState, useRef, useEffect, ReactNode } from "react";
import { Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FocusTooltipProps {
  content: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function FocusTooltip({ content, children, className }: FocusTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={cn("relative inline-flex", className)}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={handleToggle}
        onMouseEnter={() => {
          // Only show on hover for desktop - check if not touch device
          if (window.matchMedia("(hover: hover)").matches) {
            setIsOpen(true);
          }
        }}
        onMouseLeave={() => {
          // Only hide on mouse leave if desktop
          if (window.matchMedia("(hover: hover)").matches) {
            // Small delay to allow moving to tooltip
            setTimeout(() => {
              if (!tooltipRef.current?.matches(":hover")) {
                setIsOpen(false);
              }
            }, 100);
          }
        }}
        className={cn(
          "inline-flex items-center justify-center",
          "w-5 h-5 rounded-full",
          "bg-muted/50 border border-border/50",
          "text-muted-foreground",
          "cursor-pointer",
          "transition-all duration-200",
          "hover:bg-primary/10 hover:border-primary/30 hover:text-primary",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 focus:ring-offset-background",
          isOpen && "bg-primary/10 border-primary/30 text-primary"
        )}
        aria-label="More information"
        aria-expanded={isOpen}
        type="button"
      >
        {children || <Info className="w-3 h-3" />}
      </button>

      {/* Tooltip Content */}
      {isOpen && (
        <>
          {/* Desktop tooltip */}
          <div
            ref={tooltipRef}
            className={cn(
              "hidden md:block",
              "absolute z-50",
              "bottom-full left-1/2 -translate-x-1/2 mb-2",
              "min-w-[200px] max-w-[280px]",
              "p-3",
              "rounded-lg",
              "bg-popover border border-border",
              "shadow-lg",
              "text-sm text-popover-foreground",
              "animate-fade-in"
            )}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {content}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="w-2.5 h-2.5 bg-popover border-r border-b border-border rotate-45 -mt-1.5" />
            </div>
          </div>

          {/* Mobile bottom sheet */}
          <div className="md:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Sheet */}
            <div
              ref={tooltipRef}
              className={cn(
                "absolute bottom-0 left-0 right-0",
                "max-h-[60vh]",
                "p-4 pb-8",
                "rounded-t-2xl",
                "bg-popover border-t border-border",
                "shadow-2xl",
                "animate-slide-up"
              )}
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
              
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Content */}
              <div className="text-sm text-popover-foreground leading-relaxed pr-8">
                {content}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
