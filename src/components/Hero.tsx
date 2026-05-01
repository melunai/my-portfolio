import { motion, useMotionValue} from "framer-motion";
import { Mail, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { useI18n } from "../i18n/i18n";

export default function Hero() {
  const { t } = useI18n();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 300);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <section
      id="home"
      onMouseMove={(e) => {
        if (isMobile) return;

        const mx = (e.clientX / window.innerWidth - 0.5) * 2;
        const my = (e.clientY / window.innerHeight - 0.5) * -2;
        x.set(mx);
        y.set(my);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 pt-[var(--header-h,64px)] text-center sm:px-6 md:px-10"
    >
      {/* === Основной контент === */}
<motion.div
  style={{ transformStyle: "preserve-3d" }}
className="z-10 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center overflow-hidden"
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
  className="ty-title xl w-full max-w-full break-words px-2 text-center text-[clamp(1.8rem,9vw,4.6rem)] font-extrabold leading-[1.08]
             bg-gradient-to-r from-rose-400 to-pink-300 bg-clip-text text-transparent
             drop-shadow-[0_2px_8px_rgba(236,72,153,0.25)]"
  style={{
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  }}
>
  {t("hero.title")}
</motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ delay: 1.0, duration: 1.5 }}
          className="ty-subtitle lg mt-4 max-w-2xl text-center text-base leading-relaxed text-[color:var(--text-muted)] sm:text-lg"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          className="mt-8 flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ delay: 1.4, duration: 1.2 }}
        >
          <button
            onClick={() =>
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white
                       bg-gradient-to-r from-rose-400 to-pink-300 shadow-md transition-transform hover:scale-105 sm:w-auto"
          >
            <Sparkles className="size-4" /> {t("hero.ctaProjects")}
          </button>

          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-medium
                       transition-all hover:scale-105 hover:border-[var(--accent)] hover:shadow-[0_0_0_2px_var(--accent)] sm:w-auto"
          >
            <Mail className="size-4" /> {t("hero.ctaContact")}
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}