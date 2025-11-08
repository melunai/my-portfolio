import { motion, useAnimationFrame, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";

export default function HeroSceneLight({ shine = false }: { shine?: boolean }) {
  const sunRef = useRef<HTMLDivElement>(null);
  const time = useRef(0);

  // дыхание солнца
  useAnimationFrame((t) => {
    time.current = t / 1000;
    if (sunRef.current) {
      const scale = 1 + Math.sin(time.current * 0.4) * 0.04;
      sunRef.current.style.transform = `scale(${scale})`;
      sunRef.current.style.filter = `brightness(${1 + Math.sin(time.current * 0.3) * 0.15})`;
    }
  });

  // сброс эффектов после озарения
  useEffect(() => {
    if (!shine) return;
    const timer = setTimeout(() => {
      if (sunRef.current) {
        sunRef.current.style.transform = "";
        sunRef.current.style.filter = "";
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [shine]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-[#ffe6d2] via-[#ffb9b9] to-[#fca57e]">
      {/* --- живое небо --- */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(to bottom, #ffe9d8 0%, #ffc4b8 40%, #ffa87c 90%)",
            "linear-gradient(to bottom, #ffd9c0 0%, #ffb6b6 40%, #ff9966 90%)",
            "linear-gradient(to bottom, #ffe9d8 0%, #ffc4b8 40%, #ffa87c 90%)",
          ],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* --- верхние облака --- */}
      <motion.div
        className="absolute top-0 left-0 w-[250%] h-[25%] bg-[url('https://svgshare.com/i/19hy.svg')] bg-repeat-x opacity-20 blur-[2px]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-[5%] left-0 w-[250%] h-[30%] bg-[url('https://svgshare.com/i/19hy.svg')] bg-repeat-x opacity-15 blur-sm"
        animate={{ x: ["-25%", "0%"] }}
        transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
      />

      {/* --- ореол цвета у верхнего края --- */}
      <div
        className="absolute top-0 left-0 w-full h-[30%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(255,220,240,0.4) 0%, rgba(255,210,220,0.1) 60%, transparent 100%)",
          mixBlendMode: "soft-light",
        }}
      />

      {/* --- следы самолётов --- */}
      {[
        { top: "10%", width: "120%", opacity: 0.25, blur: "blur-[1px]" },
        { top: "18%", width: "100%", opacity: 0.15, blur: "blur-[0.5px]" },
      ].map((trail, i) => (
        <motion.div
          key={i}
          className={`absolute left-[-20%] h-[2px] rounded-full bg-white ${trail.blur}`}
          style={{
            top: trail.top,
            width: trail.width,
            opacity: trail.opacity,
            boxShadow: "0 0 12px 2px rgba(255,255,255,0.3)",
          }}
          animate={{ x: ["-10%", "120%"], opacity: [trail.opacity, 0.05] }}
          transition={{
            duration: 90 + i * 40,
            repeat: Infinity,
            delay: i * 25,
            ease: "linear",
          }}
        />
      ))}

      {/* --- дальние горы --- */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1/2 bg-no-repeat bg-bottom opacity-60"
        style={{
          backgroundImage:
            "url('https://raw.githubusercontent.com/midudev/svg-illustrations/master/landscape/hills2.svg')",
          backgroundSize: "cover",
        }}
      />

      {/* --- солнце --- */}
      <div
        ref={sunRef}
        className="absolute left-1/2 bottom-[18%] -translate-x-1/2 w-56 h-56 rounded-full"
        style={{
          background:
            "radial-gradient(circle, #fff6c4 0%, #ffd395 60%, #ffa066 90%)",
          boxShadow:
            "0 0 100px 40px rgba(255,180,100,0.6), 0 0 200px 70px rgba(255,130,70,0.4)",
        }}
      />

      {/* 🌅 озарение экрана */}
      <AnimatePresence>
        {shine && (
          <motion.div
            key="sun-shine"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.8, 0.5, 0],
              scale: [1, 3.8, 7],
            }}
            transition={{ duration: 3.8, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none z-40"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,240,200,0.8) 0%, rgba(255,220,150,0.6) 35%, transparent 80%)",
              mixBlendMode: "screen",
            }}
          />
        )}
      </AnimatePresence>

      {/* --- тепловое дрожание --- */}
      <motion.div
        className="absolute left-1/2 bottom-[28%] -translate-x-1/2 w-[45%] h-[10%] blur-[6px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,210,170,0.3) 0%, rgba(255,170,120,0) 70%)",
          mixBlendMode: "overlay",
        }}
        animate={{
          scaleY: [1, 1.08, 1],
          opacity: [0.4, 0.6, 0.4],
          y: [0, -2, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* --- вода --- */}
      <motion.svg
        className="absolute bottom-0 left-0 w-full h-[45%]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 320"
        style={{ opacity: 0.85 }}
      >
        <motion.path
          fill="url(#waveGradient)"
          d="M0,240 C480,280 960,180 1440,240 L1440,320 L0,320 Z"
          animate={{
            d: [
              "M0,240 C480,280 960,180 1440,240 L1440,320 L0,320 Z",
              "M0,230 C480,260 960,200 1440,220 L1440,320 L0,320 Z",
              "M0,240 C480,280 960,180 1440,240 L1440,320 L0,320 Z",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe3c0" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#ffb78a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff8a55" stopOpacity="0.25" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* --- отражение неба --- */}
      <motion.div
        className="absolute bottom-[10%] left-0 w-full h-[35%]"
        style={{
          background:
            "linear-gradient(to top, rgba(255,180,120,0.35), rgba(255,200,150,0.15) 60%, rgba(255,230,200,0))",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* --- золотая дорожка --- */}
      <motion.div
        className="absolute left-1/2 bottom-[9%] -translate-x-1/2 w-[70%] h-[14%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,200,120,0.6) 0%, rgba(255,160,90,0) 80%)",
          filter: "blur(10px)",
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scaleY: [1, 1.1, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* --- птицы --- */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.svg
          key={i}
          className="absolute top-[10%] w-14 h-14 opacity-35"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            left: `${-30 - i * 15}%`,
            top: `${15 + i * 8}%`,
          }}
          animate={{
            x: ["-20vw", "110vw"],
            y: [0, Math.sin(i) * 6, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 60 + i * 10,
            repeat: Infinity,
            delay: i * 5,
            ease: "linear",
          }}
        >
          <path
            d="M10,60 Q40,35 70,60 Q55,45 40,60 Q25,45 10,60 Z"
            fill="rgba(40,40,40,0.5)"
          />
        </motion.svg>
      ))}

      {/* --- бликовые линии --- */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-[10%] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 60}px`,
            height: "2px",
            background: "rgba(255,255,255,0.5)",
            boxShadow: "0 0 10px 2px rgba(255,220,180,0.6)",
          }}
          animate={{
            y: [0, -5, 0],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* --- лёгкие частицы в верхнем воздухе --- */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] rounded-full bg-white opacity-40"
          style={{
            top: `${Math.random() * 30}%`,
            left: `${Math.random() * 100}%`,
            filter: "blur(1px)",
            mixBlendMode: "screen",
          }}
          animate={{
            y: ["0%", "-40%"],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* --- трава --- */}
      <motion.svg
        className="absolute bottom-0 left-0 w-full h-[15%] opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 320"
      >
        <path
          fill="rgba(50,50,50,0.4)"
          d="M0,320 C100,280 300,290 480,320 C660,310 960,280 1440,320 L1440,320 L0,320 Z"
        />
      </motion.svg>
    </div>
  );
}
