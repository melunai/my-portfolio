// src/components/Section.tsx
import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { useIOInView } from "./useIOInView";

type Props = PropsWithChildren<{ id: string; title: string }>;

export default function Section({ id, title, children }: Props) {
  const { ref, inView } = useIOInView<HTMLHeadingElement>({ once: true });
  const variants = {
    hide: { opacity: 0, y: 20, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  return (
    <section
      id={id}
      className="scroll-mt-24 py-16 sm:py-20 md:py-24 lg:py-28 relative overflow-hidden"
    >
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <motion.h2
          ref={ref}
          initial="hide"
          animate={inView ? "show" : "hide"}
          variants={variants}
          className="
            ty-title
            font-extrabold tracking-tight
            text-4xl sm:text-5xl md:text-6xl lg:text-[9rem] xl:text-[12rem]
            leading-none
            bg-gradient-to-b from-[var(--accent)] via-rose-400/90 to-pink-300/60
            bg-clip-text text-transparent select-none
            transform scale-y-[1.15]
          "
        >
          {title}
        </motion.h2>
      </div>
      {children}
    </section>
  );
}
