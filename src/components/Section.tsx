import type{ PropsWithChildren } from "react";
import { motion } from "framer-motion";

type Props = PropsWithChildren<{ id: string; title: string }>;

export default function Section({ id, title, children }: Props) {
  return (
    <section id={id} className="scroll-mt-24 py-16 md:py-24">
      <div className="flex items-center gap-2 mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent"
        >
          {title}
        </motion.h2>
        <span aria-hidden className="select-none animate-sparkle">✨</span>
      </div>
      {children}
    </section>
  );
}
