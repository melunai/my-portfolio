import React from 'react';
import { cn } from '../lib/cn';

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-2xl border backdrop-blur-xl shadow-sm transition-shadow hover:shadow-glow-pink',
          'bg-[var(--glass-bg)] border-[var(--glass-border)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = 'GlassCard';
export default GlassCard;
