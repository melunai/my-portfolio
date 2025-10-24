import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";

type Props = PropsWithChildren<{ id: string; title: string }>;

/**
 * Обновлённая секция:
 * — крупный нежный заголовок с "стеклянным" размытием низа
 * — центрированная композиция
 * — мягкая анимация появления
 */
export default function Section({ id, title, children }: Props) {
  return (
    <section id={id} className="scroll-mt-24 py-20 md:py-28 relative overflow-hidden">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="
            glass-section-title
            font-extrabold tracking-tight
            text-[10rem] md:text-[18rem] leading-tight
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
