import { motion, useMotionValue, useTransform } from "framer-motion";
import { Mail, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { useI18n } from "../i18n/i18n";

export default function Hero() {
  const { t } = useI18n();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-1, 1], [5, -5]);
  const rotateY = useTransform(x, [-1, 1], [-5, 5]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setReady(true), 300); // плавное появление
  }, []);

  return (
    <section
      id="home"
      onMouseMove={(e) => {
        const mx = (e.clientX / window.innerWidth - 0.5) * 2;
        const my = (e.clientY / window.innerHeight - 0.5) * -2;
        x.set(mx);
        y.set(my);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="relative flex flex-col items-center justify-center text-center 
                 w-full min-h-[100svh] pt-[var(--header-h,64px)] overflow-hidden px-6 sm:px-10"
    >
      {/* === Основной контент === */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="z-10"
        initial={{ opacity: 0, y: 80, filter: "blur(12px)" }}
        animate={{
          opacity: ready ? 1 : 0,
          y: ready ? 0 : 40,
          filter: ready ? "blur(0px)" : "blur(12px)",
        }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ delay: 0.4, duration: 1.5 }}
          className="ty-title xl font-extrabold text-[clamp(2.4rem,5vw,4.6rem)] leading-[1.1]
                     bg-gradient-to-r from-rose-400 to-pink-300 text-transparent bg-clip-text
                     drop-shadow-[0_2px_8px_rgba(236,72,153,0.25)]"
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ delay: 1.0, duration: 1.5 }}
          className="ty-subtitle lg mt-4 text-lg text-[color:var(--text-muted)] leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ delay: 1.4, duration: 1.2 }}
        >
          <button
            onClick={() =>
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white
                       bg-gradient-to-r from-rose-400 to-pink-300 hover:scale-105 transition-transform shadow-md"
          >
            <Sparkles className="size-4" /> {t('hero.ctaProjects')}
          </button>

          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium border border-[var(--border)]
                       hover:border-[var(--accent)] hover:shadow-[0_0_0_2px_var(--accent)] 
                       transition-all hover:scale-105"
          >
            <Mail className="size-4" /> {t('hero.ctaContact')}
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
