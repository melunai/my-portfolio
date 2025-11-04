import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSceneDark from "./HeroSceneDark";
import HeroSceneLight from "./HeroSceneLight";
import ThemeToggle from "./ThemeToggle";

type HeroFrontProps = {
  onFinish: () => void;
};

export default function HeroFront({ onFinish }: HeroFrontProps) {
  const [visible, setVisible] = useState(true);
  const [exploding, setExploding] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light"
  );

  // Scroll lock fix
  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      const y = body.style.top;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      window.scrollTo(0, parseInt(y || "0") * -1);
    };
  }, []);

  // Следим за темой
  useEffect(() => {
    const obs = new MutationObserver(() => {
      const th = document.documentElement.getAttribute("data-theme");
      if (th === "dark" || th === "light") setTheme(th);
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  const handleClick = () => {
    const main = document.getElementById("main");
    const hero = document.querySelector("#hero");

    if (main) {
      main.style.opacity = "0";
      main.style.transition = "opacity 1s ease";
    }
    if (hero) hero.classList.remove("wake-up");

    setExploding(true);

    setTimeout(() => {
      setVisible(false);
      onFinish();
    }, 600);

    setTimeout(() => {
      if (main) main.style.opacity = "1";
      if (hero) hero.classList.add("wake-up");
    }, 1400);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.section
            key="hero-front"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.05,
              filter: "blur(12px)",
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-colors duration-700"
            style={{
              pointerEvents: exploding ? "none" : "auto",
              background:
                theme === "dark"
                  ? "radial-gradient(circle at 40% 45%, #241c4d, #06060d)"
                  : "linear-gradient(to bottom right, #fefcff, #e0eaff)",
            }}
          >
            {/* === Тоггл темы === */}
            <div className="absolute top-6 right-6 z-[10000]">
              <ThemeToggle />
            </div>

            {/* === Canvas сцена === */}
            <motion.div
              key={theme}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 -z-10"
            >
              {theme === "dark" ? (
                <HeroSceneDark mouse={{ x: 0, y: 0 }} exploding={exploding} />
              ) : (
                <HeroSceneLight mouse={{ x: 0, y: 0 }} />
              )}
            </motion.div>

            {/* === Контент === */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="relative text-center max-w-2xl px-6"
              style={{
                color: theme === "dark" ? "#f8fafc" : "#1e1e2f",
                textShadow:
                  theme === "dark"
                    ? "0 0 16px rgba(255,255,255,0.25), 0 0 40px rgba(255,215,140,0.25)"
                    : "0 0 10px rgba(0,0,0,0.06)",
                transform: "translateY(-6vh)",
              }}
            >
              <motion.h1
                key={theme + "-title"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight"
              >
                {theme === "dark"
                  ? "Ощути тепло Солнца"
                  : "Поймай сияние вдохновения"}
              </motion.h1>

              <motion.p
                key={theme + "-desc"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="text-lg opacity-90 mb-10 max-w-lg mx-auto"
                style={{
                  color: theme === "dark" ? "rgba(248,250,252,0.9)" : "#222",
                }}
              >
                {theme === "dark"
                  ? "Позволь энергии света направить твой путь в коде. Яркие идеи начинаются здесь."
                  : "Лёгкость, цвет и движение — твой путь в создании красоты."}
              </motion.p>

              <motion.button
                onClick={handleClick}
                className="inline-flex items-center gap-3 rounded-2xl px-6 py-3 text-lg font-semibold
                           bg-gradient-to-r from-rose-500 to-pink-400 text-white shadow-lg
                           hover:shadow-xl hover:scale-105 transition-all duration-300"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                🚀 Продолжить
              </motion.button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes wakeUp {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.96);
            filter: blur(8px);
          }
          40% {
            opacity: 0.7;
            transform: translateY(10px) scale(1.03);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        #hero.wake-up {
          animation: wakeUp 1.4s ease-out forwards;
        }
        :root, [data-theme="dark"], [data-theme="light"] {
          transition:
            background-color 0.6s ease,
            color 0.6s ease,
            border-color 0.6s ease,
            box-shadow 0.6s ease,
            filter 0.6s ease;
        }
      `}</style>
    </>
  );
}
