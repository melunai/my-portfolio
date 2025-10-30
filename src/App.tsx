import { useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Metrics from "./components/Metrics";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Testimonials from "./components/Testimonials";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BackgroundDecor from "./components/BackgroundDecor";
import ScrollProgress from "./components/ScrollProgress";
import FloatingBubbles from "./components/FloatingBubbles";
import { GridTexture } from "./components/GridTexture";
import KawaiiFrame from "./components/KawaiiFrame";
import ConfettiRain from "./components/ConfettiRain";
import PinkRibbons from "./components/PinkRibbons";
import { DATA } from "./data";
import WorkflowStages from "./components/WorkflowStages";

import { LiveModeProvider, LiveModeToggle, useLiveMode } from "./components/LiveMode";

function AppInner() {
  const { live } = useLiveMode();

  useEffect(() => {
    document.title = `${DATA.nick} — портфолио`;
  }, []);

  return (
    <div
      className={[
        "min-h-dvh relative text-slate-800 dark:text-slate-100 live-container theme-colors overflow-x-clip",
        // базовый фон остаётся, но при live он переопределится CSS-анимацией
        "bg-gradient-to-b from-rose-800/30 to-rose-100/90 dark:from-slate-950 dark:to-slate-950",
        live ? "is-live" : "",
      ].join(" ")}
        style={{ background: "linear-gradient(to bottom, var(--bg-grad-from), var(--bg-grad-to))",  color: "var(--text)",}}
        
    >
      {/* Декор и фон — теперь ShaderBg сверху и явно виден */}
      <BackgroundDecor />

      <ScrollProgress />
      {/* В live режиме пузырей больше и они быстрее (через пропсы) */}
      <FloatingBubbles live={live} />

      <PinkRibbons />
      {/* В live — больше конфетти */}
      <ConfettiRain density={live ? 48 : 28} />
      <KawaiiFrame />
      <GridTexture />

      <Header />
      <main
  id="main"
  className="
    relative z-10
    mx-auto w-full px-6
    max-w-[1600px]
    sm:px-8 md:px-10
  "
>

        <Hero />
        <Metrics />
        <Projects />
        <Skills />
        <WorkflowStages />
        <Experience />
        <Testimonials />
        <About />
        <Contact />
        <Footer />
      </main>

      {/* Фиксируем Live Mode тумблер поверх */}
      <LiveModeToggle />
    </div>
  );
}

export default function App() {
  return (
    <LiveModeProvider>
      <AppInner />
    </LiveModeProvider>
  );
}
