import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { useIOInView } from "./useIOInView";

export default function SectionLead({ children }: PropsWithChildren) {
  const { ref, inView } = useIOInView<HTMLParagraphElement>({
    once: true,
    rootMargin: "-30% 0% -45% 0%",
  });
  const variants = {
    hide: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  return (
    <motion.p
      ref={ref}
      initial="hide"
      animate={inView ? "show" : "hide"}
      variants={variants}
      className="
        glass-lead
        text-center max-w-3xl mx-auto mb-10
        text-[1.35rem] md:text-[1.6rem]
        leading-relaxed tracking-wide
      "
    >
      {children}
    </motion.p>
  );
}
