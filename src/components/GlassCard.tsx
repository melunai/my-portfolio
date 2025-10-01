import React from "react";
import { cn } from "../lib/cn";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl border bg-white/70 dark:bg-white/5 backdrop-blur-xl",
          "border-rose-200/60 dark:border-rose-200/15 shadow-sm hover:shadow-glow-pink transition-shadow"
          , className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";
export default GlassCard;
