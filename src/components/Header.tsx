import { Github, Linkedin, Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { DATA } from "../data";

type Props = { dark: boolean; toggleDark: () => void };

export default function Header({ dark, toggleDark }: Props) {
  const [open, setOpen] = useState(false);
  const nav = [
    { id: "home", label: "Главная" },
    { id: "metrics", label: "Цифры" },
    { id: "projects", label: "Проекты" },
    { id: "skills", label: "Навыки" },
    { id: "experience", label: "Опыт" },
    { id: "testimonials", label: "Отзывы" },
    { id: "about", label: "Обо мне" },
    { id: "contact", label: "Контакты" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-900/60 border-b border-rose-200/40 dark:border-rose-100/10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <a href="#home" className="font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
              {DATA.name.split(" ")[0]}
            </span>
            <span className="text-rose-400">♡</span>
          </a>

          <nav className="hidden md:flex gap-6 text-sm">
            {nav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="opacity-80 hover:opacity-100 hover:text-rose-500 transition-colors"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href={DATA.github} target="_blank" rel="noreferrer" className="opacity-80 hover:opacity-100" aria-label="GitHub">
              <Github className="size-5" />
            </a>
            <a href={DATA.linkedin} target="_blank" rel="noreferrer" className="opacity-80 hover:opacity-100" aria-label="LinkedIn">
              <Linkedin className="size-5" />
            </a>
            <button
              onClick={toggleDark}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1 text-sm border bg-white/70 dark:bg-white/5 border-rose-200/50 dark:border-rose-100/10 hover:bg-white/90 dark:hover:bg-white/10"
            >
              {dark ? (<><Sun className="size-4" /><span className="hidden sm:inline">Светлая</span></>) : (<><Moon className="size-4" /><span className="hidden sm:inline">Тёмная</span></>)}
            </button>
            <button className="md:hidden inline-flex items-center rounded-xl border border-rose-200/50 dark:border-rose-100/10 p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-3">
            <nav className="flex flex-col gap-2 text-sm">
              {nav.map((n) => (
                <a key={n.id} href={`#${n.id}`} className="rounded-lg px-3 py-2 hover:bg-rose-50/80 dark:hover:bg-white/10" onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
