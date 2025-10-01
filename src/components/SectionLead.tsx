import type{ PropsWithChildren } from "react";

export default function SectionLead({ children }: PropsWithChildren) {
  return (
    <p className="text-slate-600 dark:text-slate-300 max-w-2xl mb-6">
      {children}
    </p>
  );
}
