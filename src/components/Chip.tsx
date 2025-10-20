import { cn } from '../lib/cn';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Props = PropsWithChildren<
  { active?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>
>;

export default function Chip({ children, active, className, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-sm backdrop-blur-sm transition-all',
        active
          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-glow-pink'
          : 'bg-[var(--chip-bg)] border-[var(--chip-border)] hover:bg-[var(--chip-hover)]',
        className
      )}
    >
      {children}
    </button>
  );
}
