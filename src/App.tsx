import { useEffect, useState } from "react";
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

export default function App() {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) { root.classList.add("dark"); localStorage.setItem("theme", "dark"); }
    else { root.classList.remove("dark"); localStorage.setItem("theme", "light"); }
  }, [dark]);

  useEffect(() => { document.title = "Портфолио — Главная"; }, []);

  return (
    <div className="min-h-dvh relative bg-gradient-to-b from-white to-slate-100 dark:from-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100">
      <BackgroundDecor />
      <ScrollProgress />
      <Header dark={dark} toggleDark={() => setDark((v) => !v)} />
      <main id="main" className="mx-auto max-w-6xl px-4">
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
