import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Wand2 } from "lucide-react";
import { DATA } from "../data";
import HeroScene from "./HeroScene";

export default function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      onMouseMove={(e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * -2;
        setMouse({ x, y });
      }}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
      className="relative flex flex-col justify-center items-center 
                 min-h-[calc(100svh-var(--header-h,64px))] 
                 pt-[var(--header-h,64px)] overflow-hidden"
      style={{ position: "relative" }}
    >
      {/* ===== 3D фон ===== */}
      <HeroScene mouse={mouse} />

      {/* ===== контент ===== */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative font-extrabold leading-tight tracking-tight text-[clamp(2.2rem,6vw,4rem)]"
        >
          Привет, я{" "}
          <span className="bg-gradient-to-r from-[var(--accent)] via-pink-400 to-fuchsia-500 bg-clip-text text-transparent">
            {DATA.name}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-4 text-[15px] md:text-[16px] max-w-xl mx-auto opacity-90 leading-relaxed"
        >
          {DATA.about ||
            "Я создаю интерфейсы, которые чувствуют, двигаются и живут."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <button
            onClick={() => go("contact")}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white bg-[var(--accent)] hover:bg-[color-mix(in_oklab,var(--accent),white_10%)] shadow-md transition-colors"
          >
            <Mail className="size-4" />
            Написать
          </button>

          <button
            onClick={() => go("projects")}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-[0_0_0_2px_var(--accent)] transition-all"
          >
            <Wand2 className="size-4" />
            Проекты
          </button>
        </motion.div>
      </div>
    </section>
  );
}
