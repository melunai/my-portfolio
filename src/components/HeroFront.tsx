import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSceneDark from "./HeroSceneDark";
import HeroSceneLight from "./HeroSceneLight";

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

  // следим за темой
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
    const hero = document.querySelector("#hero"); // Hero секция

    if (main) {
      main.style.opacity = "0";
      main.style.transition = "opacity 1s ease";
    }
    if (hero) hero.classList.remove("wake-up");

    setExploding(true); // 💥 запускаем взрыв

    // HeroFront исчезает быстро
    setTimeout(() => {
      setVisible(false);
      onFinish();
    }, 600);

    // Сайт fade-in + Hero wake-up
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
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(12px) pointer-events-none" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
            style={{
              pointerEvents: exploding ? "none" : "auto",
              background:
                theme === "dark"
                  ? "radial-gradient(circle at 30% 40%, #1e1b4b, #000)"
                  : "linear-gradient(to bottom right, #fefcff, #e0eaff)",
            }}
          >
            {/* === Canvas сцена === */}
            <div className="absolute inset-0 -z-10">
              {theme === "dark" ? (
                <HeroSceneDark mouse={{ x: 0, y: 0 }} exploding={exploding} />
              ) : (
                <HeroSceneLight mouse={{ x: 0, y: 0 }} />
              )}
            </div>

            {/* === Контент === */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center text-white max-w-xl px-6"
            >
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
                {theme === "dark"
                  ? "Ощути тепло Солнца"
                  : "Поймай сияние вдохновения"}
              </h1>
              <p className="text-lg opacity-85 mb-8">
                {theme === "dark"
                  ? "Позволь энергии света направить твой путь в коде."
                  : "Лёгкость, цвет и движение — твой путь в создании красоты."}
              </p>

              <motion.button
                onClick={handleClick}
                className="inline-flex items-center gap-3 rounded-2xl px-6 py-3 text-lg font-semibold
                           bg-gradient-to-r from-rose-500 to-pink-400 text-white shadow-lg
                           hover:shadow-xl hover:scale-105 transition-all"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                🚀 Продолжить
              </motion.button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* === keyframes только для Hero === */}
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
      `}</style>
    </>
  );
}
