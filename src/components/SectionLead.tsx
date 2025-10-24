import type { PropsWithChildren } from "react";

export default function SectionLead({ children }: PropsWithChildren) {
  return (
    <p
      className="
        glass-lead
        text-center max-w-3xl mx-auto mb-10
        text-[1.4rem] md:text-[1.7rem]
        leading-snug font-light
      "
    >
      {children}
    </p>
  );
}
