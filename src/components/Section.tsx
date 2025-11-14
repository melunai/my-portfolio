import { motion } from "framer-motion";
import React from "react";

type SectionProps = {
  id?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Универсальный контейнер для секции сайта.
 * — выравнивает контент
 * — добавляет отступы
 * — автоматически анимирует заголовок
 */
export default function Section({
  id,
  title,
  children,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative mx-auto max-w-6xl px-4 py-16 sm:py-24 ${className}`}
    >
      {title && (
        <motion.h2
          className="ty-title section text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>
      )}

      {children}
    </section>
  );
}
