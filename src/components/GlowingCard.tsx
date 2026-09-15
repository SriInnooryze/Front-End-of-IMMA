import { cn } from "@/lib/utils";
import { ReactNode, HTMLAttributes } from "react";

interface GlowingCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  hover?: boolean;
}

export function GlowingCard({
  children,
  className,
  onClick,
  selected = false,
  hover = true,
  ...props
}: GlowingCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-card p-6 transition-all duration-200 ease-out",
        selected
          ? "border-primary glow-subtle"
          : "border-border",
        hover && "cursor-pointer hover:border-primary/50",
        onClick && "active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
