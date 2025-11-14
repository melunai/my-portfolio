import { motion } from "framer-motion";
import React from "react";

type SectionLeadProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Подзаголовок (лид) для секции.
 * Использует класс .ty-subtitle для единого управления типографикой.
 */
export default function SectionLead({
  children,
  className = "",
}: SectionLeadProps) {
  return (
    <motion.p
      className={`ty-subtitle lg text-center max-w-2xl mx-auto mb-12 opacity-90 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
    >
      {children}
    </motion.p>
  );
}
