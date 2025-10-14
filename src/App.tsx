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

export default function App() {
  useEffect(() => {
    document.title = "Портфолио — Главная";
  }, []);

  return (
    <div className="min-h-dvh relative bg-gradient-to-b from-rose-800/30 to-rose-100/90 dark:from-slate-950 dark:to-slate-950 text-slate-800 dark:text-slate-100">
      <BackgroundDecor />
      <ScrollProgress />
      <FloatingBubbles />
      <PinkRibbons />
      <ConfettiRain density={28} />
      <KawaiiFrame />
      <GridTexture />
      <Header/>
      <main id="main" className="mx-auto max-w-6xl px-4 z-10 relative">
        <Hero />
        <Metrics />
        <Projects />
        <Skills />
        <Experience />
        <Testimonials />
        <About />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
