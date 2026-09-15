import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollToTopProps {
  threshold?: number;
  className?: string;
}

export function ScrollToTop({ threshold = 200, className }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        // Square with rounded corners - brand consistent
        "fixed bottom-6 right-6 z-50 p-3 rounded-xl",
        // Solid brand color - no opacity
        "bg-primary",
        // Subtle shadow
        "shadow-md",
        // Text color
        "text-primary-foreground",
        // Transitions
        "transition-all duration-200 ease-out",
        // Hover state - elevation + slight brighten
        "hover:bg-primary/90",
        "hover:shadow-lg hover:-translate-y-0.5",
        // Focus state
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
        // Pointer only on the button
        "cursor-pointer",
        // Visibility animation
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
        className
      )}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
