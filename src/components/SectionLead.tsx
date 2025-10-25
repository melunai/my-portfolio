import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";

export default function SectionLead({ children }: PropsWithChildren) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
