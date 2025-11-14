// src/data.ts

export type Locale = "ru" | "en";

export type LocalizedString = {
  ru: string;
  en: string;
};

export type Project = {
  title: LocalizedString;
  description: LocalizedString;
  image?: string; // для обратной совместимости
  images?: string[]; // несколько фото (cover берём из images[0])
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  period?: string;
  highlights?: LocalizedString[];
  roles?: LocalizedString[];
  metrics?: LocalizedString[];
};

export type ExperienceItem = {
  company: LocalizedString;
  role: LocalizedString;
  period: LocalizedString;
  points: LocalizedString[];
};

export type Metric = {
  label: LocalizedString;
  value: string;
  hint?: LocalizedString;
};

export type Testimonial = {
  name: LocalizedString;
  title: LocalizedString;
  quote: LocalizedString;
  avatar?: string;
};

// ———————————————————————————————————————————————————————————
// 💼 Профиль / Контакты / Главная информация
// ———————————————————————————————————————————————————————————

export const DATA = {
    name: {
    ru: "Стручков Радислав Александрович",
    en: "Struchkov Radislav Alexandrovich",
  } as LocalizedString,
  nick: "melunai",
  role: {
    ru: "Front-end разработчик",
    en: "Front-end developer",
  } as LocalizedString,
  location: {
    ru: "Россия, Республика Саха (Якутия), Якутск",
    en: "Yakutsk, Sakha Republic (Yakutia), Russia",
  } as LocalizedString,
  email: "seon.takago@gmail.com",
  telegram: "@melunai",
  github: "https://github.com/melunai",
  linkedin: "https://www.linkedin.com/in/melunai",
  cvUrl: "/cv.pdf",

  about: {
    ru:
      "Я занимаюсь разработкой интерфейсов с акцентом на архитектуру и производительность. " +
      "Создаю надёжные и масштабируемые веб-приложения, удобные в сопровождении и развитии. " +
      "Основные направления: разработка SPA, интеграция API, оптимизация фронтенда и проектирование UI-систем. " +
      "Работаю на результат — чтобы интерфейсы выглядели современно, быстро загружались и помогали бизнесу расти.",
    en:
      "I build interfaces with a focus on architecture and performance. " +
      "I create reliable, scalable web applications that are easy to maintain and evolve. " +
      "Core areas: SPA development, API integration, frontend performance tuning, and UI-system design. " +
      "I care about results — interfaces should look modern, load fast, and help the business grow.",
  } as LocalizedString,

  services: [
    {
      ru: "Разработка SPA на React/TypeScript",
      en: "SPA development with React/TypeScript",
    },
    {
      ru: "Интеграция API (REST/GraphQL)",
      en: "API integration (REST/GraphQL)",
    },
    {
      ru: "Оптимизация производительности и DX",
      en: "Performance and DX optimization",
    },
    {
      ru: "Проектирование и поддержка UI-систем",
      en: "Design and maintenance of UI systems",
    },
  ] as LocalizedString[],

  skills: [
    { name: "TypeScript", url: "https://www.typescriptlang.org" },
    { name: "React", url: "https://react.dev" },
    { name: "Vite", url: "https://vitejs.dev" },
    { name: "Tailwind", url: "https://tailwindcss.com" },
    { name: "UnoCSS", url: "https://unocss.dev" },
    { name: "JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { name: "HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { name: "CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    { name: "Python", url: "https://www.python.org" },
    { name: "SQL", url: "https://www.w3schools.com/sql/" },
    { name: "MapLibre GL", url: "https://maplibre.org" },
    { name: "Mapbox GL", url: "https://docs.mapbox.com/mapbox-gl-js" },
    { name: "Redux Toolkit", url: "https://redux-toolkit.js.org" },
    { name: "Zustand", url: "https://zustand.docs.pmnd.rs" },
    { name: "IndexedDB", url: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" },
    { name: "Service Worker", url: "https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API" },
  ],
} as const;

// ———————————————————————————————————————————————————————————
// 📂 Проекты
// ———————————————————————————————————————————————————————————

export const PROJECTS: Project[] = [
  {
    title: {
      ru: "Lory-LCT — модульная город-игра",
      en: "Lory-LCT — modular city game",
    },
    description: {
      ru:
        "Платформа с двумя картами (реальная и личная), автогенерацией контента и интеграцией в мобильное приложение банка. " +
        "Игровая механика: сбор событий, развитие персональной карты, геймифицированное обучение финансовой грамотности.",
      en:
        "A platform with two maps (real and personal), automatic content generation, and integration into a bank’s mobile app. " +
        "Core mechanics: collecting events, growing a personal map, and gamified financial literacy learning.",
    },
    images: [
      "/images/LoryLCT/lory-lct-1.webp",
      "/images/LoryLCT/lory-lct-2.webp",
      "/images/LoryLCT/lory-lct-3.webp",
    ],
    image: "/images/LoryLCT/lory-lct-1.webp",
    stack: [
      "React",
      "TypeScript",
      "Tailwind",
      "UnoCSS",
      "MapLibre GL",
      "Mapbox GL",
      "Zustand",
      "Redux Toolkit",
      "IndexedDB",
      "Service Worker",
    ],
    highlights: [
      {
        ru: "Динамическая гексагональная сетка поверх тайлов",
        en: "Dynamic hexagonal grid over map tiles",
      },
      {
        ru: "Плагинная система мини-игр (ESM + manifest JSON)",
        en: "Pluggable mini-game system (ESM + manifest JSON)",
      },
      {
        ru: "Он-прем карты, без публичных ключей; опционально 3D",
        en: "On-prem maps without public keys; optional 3D",
      },
    ],
    period: "2025",
    roles: [
      {
        ru: "Frontend",
        en: "Frontend",
      },
      {
        ru: "Архитектор",
        en: "Architect",
      },
    ],
  },
  {
    title: {
      ru: "Lory-MPIT — «Умный помощник» (Drivee)",
      en: "Lory-MPIT — “Smart assistant” (Drivee)",
    },
    description: {
      ru:
        "Определение оптимальной рекомендованной цены бида для водителей для повышения выполняемости заказов и роста доходности.",
      en:
        "Calculating optimal recommended bid prices for drivers to increase order completion and overall revenue.",
    },
    images: ["/images/mpit/mpit.png"],
    image: "/images/mpit/mpit.png",
    stack: ["TypeScript", "React"],
    repoUrl: "https://github.com/ShiruiChan/mpit-2025-start",
    period: "2025",
    roles: [
      {
        ru: "Frontend",
        en: "Frontend",
      },
    ],
  },
  {
    title: {
      ru: "Lory.Lab — сайт компании",
      en: "Lory.Lab — company website",
    },
    description: {
      ru:
        "Продуктовая лаборатория и сервисная студия: интерфейсы, проверка гипотез, быстрые MVP и сопровождение.",
      en:
        "Product lab and service studio: interfaces, hypothesis testing, rapid MVPs, and ongoing support.",
    },
    images: [
      "/images/LoryLab/lory-lab-1.webp",
      "/images/LoryLab/lory-lab-2.webp",
      "/images/LoryLab/lory-lab-3.webp",
      "/images/LoryLab/lory-lab-4.webp",
      "/images/LoryLab/lory-lab-5.webp",
      "/images/LoryLab/lory-lab-6.webp",
      "/images/LoryLab/lory-lab-7.webp",
      "/images/LoryLab/lory-lab-8.webp",
      "/images/LoryLab/lory-lab-9.webp",
      "/images/LoryLab/lory-lab-10.webp",
      "/images/LoryLab/lory-lab-11.webp",
      "/images/LoryLab/lory-lab-12.webp",
      "/images/LoryLab/lory-lab-13.webp",
    ],
    image: "/images/LoryLab/lory-lab-1.webp",
    stack: ["Next.js", "React", "TypeScript"],
    liveUrl: "https://lory.vercel.app",
    repoUrl: "https://github.com/ShiruiChan/Lory.Lab",
    period: "2025",
    roles: [
      {
        ru: "Frontend",
        en: "Frontend",
      },
      {
        ru: "Дизайн",
        en: "Design",
      },
      {
        ru: "UX",
        en: "UX",
      },
    ],
    highlights: [
      {
        ru: "Витрина продуктов и проектов компании",
        en: "Showcase of company products and projects",
      },
      {
        ru: "Лёгкая архитектура на Next.js + App Router",
        en: "Lean architecture on Next.js + App Router",
      },
      {
        ru: "Использование модульных компонентов и анимаций",
        en: "Use of modular components and animations",
      },
    ],
  },
] as const;

// ———————————————————————————————————————————————————————————
// 🧩 Опыт работы
// ———————————————————————————————————————————————————————————

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: {
      ru: "Lory.Lab",
      en: "Lory.Lab",
    },
    role: {
      ru: "Front-end разработчик / Руководитель интерфейсной части",
      en: "Front-end developer / Frontend lead",
    },
    period: {
      ru: "2023 — наст. время",
      en: "2023 — present",
    },
    points: [
      {
        ru:
          "Архитектура клиентских приложений (React/TypeScript), стандарты и паттерны разработки",
        en:
          "Client-side app architecture (React/TypeScript), development standards and patterns",
      },
      {
        ru:
          "Проектирование и развитие UI-систем, библиотек компонентов и токенов",
        en:
          "Design and evolution of UI systems, component libraries, and design tokens",
      },
      {
        ru:
          "Интеграция API (REST/GraphQL), согласование контрактов с бэкендом",
        en:
          "API integration (REST/GraphQL), aligning contracts with backend",
      },
      {
        ru:
          "Оптимизация производительности (бандл, TTI, рендер) и DX",
        en:
          "Performance optimization (bundle size, TTI, rendering) and DX",
      },
      {
        ru:
          "Планирование фронтенд-работ, ревью кода, повышение скорости поставки",
        en:
          "Planning frontend work, code review, improving delivery speed",
      },
    ],
  },
  {
    company: {
      ru: "Фриланс",
      en: "Freelance",
    },
    role: {
      ru: "Front-end разработчик",
      en: "Front-end developer",
    },
    period: {
      ru: "Параллельно",
      en: "In parallel",
    },
    points: [
      {
        ru:
          "Разработка SPA под задачи заказчиков, адаптация под бизнес-ограничения",
        en:
          "Building SPA solutions tailored to clients’ needs and business constraints",
      },
      {
        ru:
          "Настройка интеграций (авторизация, платёжные и внешние сервисы)",
        en:
          "Setting up integrations (auth, payment systems, external services)",
      },
      {
        ru:
          "Оптимизация Lighthouse/UX-метрик, внедрение кеширования и офлайна",
        en:
          "Improving Lighthouse/UX metrics, implementing caching and offline mode",
      },
      {
        ru:
          "Сопровождение и консультации, улучшение процессов поставки",
        en:
          "Maintenance, consulting, and improving delivery processes",
      },
    ],
  },
] as const;

// ———————————————————————————————————————————————————————————
// 📈 Ключевые результаты / метрики
// ———————————————————————————————————————————————————————————

export const METRICS: Metric[] = [
  {
    label: {
      ru: "Скорость загрузки (TTI)",
      en: "Load speed (TTI)",
    },
    value: "−35%",
    hint: {
      ru: "Сокращение времени до интерактивности за счёт оптимизации бандла и lazy-loading",
      en: "Reduced time to interactive via bundle optimization and lazy loading",
    },
  },
  {
    label: {
      ru: "Производительность сборки",
      en: "Build performance",
    },
    value: "×2",
    hint: {
      ru: "Ускорение Vite/CI-pipeline за счёт кэширования и пересборки только изменённых модулей",
      en: "2× faster Vite/CI pipeline using caching and rebuilding only changed modules",
    },
  },
  {
    label: {
      ru: "UX-метрики",
      en: "UX metrics",
    },
    value: "+18%",
    hint: {
      ru: "Рост пользовательской активности после оптимизации сценариев и анимаций",
      en: "User activity +18% after optimizing flows and animations",
    },
  },
  {
    label: {
      ru: "Кеш и офлайн-режим",
      en: "Cache & offline mode",
    },
    value: "✓",
    hint: {
      ru: "Внедрён IndexedDB + Service Worker с устойчивостью к потере сети",
      en: "IndexedDB + Service Worker implemented for resilience to network issues",
    },
  },
] as const;

// ———————————————————————————————————————————————————————————
// 💬 Отзывы
// ———————————————————————————————————————————————————————————

export const TESTIMONIALS: Testimonial[] = [
  {
    name: {
      ru: "Руководитель продукта",
      en: "Product lead",
    },
    title: {
      ru: "финтех-платформа",
      en: "fintech platform",
    },
    quote: {
      ru:
        "Радислав быстро включился в проект, предложил структурное решение и помог упорядочить фронтенд-архитектуру. " +
        "Код чистый, задачи закрываются в срок, коммуникация всегда прозрачная.",
      en:
        "Radislav ramped up quickly, proposed a structured solution and helped tidy up the frontend architecture. " +
        "The code is clean, tasks are delivered on time, communication is always transparent.",
    },
    avatar: "/images/avatars/client1.jpg",
  },
  {
    name: {
      ru: "Технический директор",
      en: "CTO",
    },
    title: {
      ru: "веб-студия",
      en: "web studio",
    },
    quote: {
      ru:
        "С Радиславом комфортно работать на уровне кода и процессов. Он системно подходит к организации фронта, " +
        "уделяет внимание производительности и масштабируемости. Надёжный специалист.",
      en:
        "Working with Radislav is comfortable both at the code and process level. He takes a systematic approach to structuring the frontend, " +
        "pays attention to performance and scalability. A reliable specialist.",
    },
    avatar: "/images/avatars/client2.jpg",
  },
  {
    name: {
      ru: "Клиент проекта",
      en: "Project client",
    },
    title: {
      ru: "малый бизнес, e-commerce",
      en: "small business, e-commerce",
    },
    quote: {
      ru:
        "Проект выполнен качественно и с пониманием бизнес-целей. " +
        "Сайт стал работать быстрее, интерфейс — понятнее, а поддержка после сдачи всегда оперативная.",
      en:
        "The project was delivered with quality and a clear understanding of business goals. " +
        "The site became faster, the interface clearer, and post-launch support is always prompt.",
    },
    avatar: "/images/avatars/client3.jpg",
  },
] as const;

// ———————————————————————————————————————————————————————————
// 🎯 Мета-информация о скиллах (для чипов)
// ———————————————————————————————————————————————————————————

export const skillMeta: Record<
  string,
  { emoji: string; gradFrom: string; gradTo: string; tone?: string }
> = {
  TypeScript: {
    emoji: "🟦",
    gradFrom: "from-sky-200",
    gradTo: "to-sky-400",
    tone: "var(--accent)",
  },
  React: {
    emoji: "⚛️",
    gradFrom: "from-cyan-200",
    gradTo: "to-cyan-400",
    tone: "#22d3ee",
  },
  Vite: {
    emoji: "⚡",
    gradFrom: "from-purple-200",
    gradTo: "to-amber-300",
    tone: "#facc15",
  },
  Tailwind: {
    emoji: "🌊",
    gradFrom: "from-cyan-200",
    gradTo: "to-sky-300",
    tone: "#22d3ee",
  },
  UnoCSS: {
    emoji: "🪄",
    gradFrom: "from-indigo-200",
    gradTo: "to-fuchsia-300",
    tone: "#a855f7",
  },
  JavaScript: {
    emoji: "🟨",
    gradFrom: "from-amber-200",
    gradTo: "to-amber-400",
    tone: "#facc15",
  },
  HTML: {
    emoji: "📄",
    gradFrom: "from-orange-200",
    gradTo: "to-rose-300",
    tone: "#fb923c",
  },
  CSS: {
    emoji: "🎨",
    gradFrom: "from-sky-200",
    gradTo: "to-blue-300",
    tone: "#38bdf8",
  },
  Python: {
    emoji: "🐍",
    gradFrom: "from-amber-200",
    gradTo: "to-sky-300",
    tone: "#22c55e",
  },
  SQL: {
    emoji: "🗄️",
    gradFrom: "from-slate-200",
    gradTo: "to-slate-400",
    tone: "#64748b",
  },
  "MapLibre GL": {
    emoji: "🗺️",
    gradFrom: "from-emerald-200",
    gradTo: "to-emerald-400",
    tone: "#22c55e",
  },
  "Mapbox GL": {
    emoji: "🧭",
    gradFrom: "from-teal-200",
    gradTo: "to-cyan-400",
    tone: "#14b8a6",
  },
  "Redux Toolkit": {
    emoji: "🌀",
    gradFrom: "from-violet-200",
    gradTo: "to-violet-400",
    tone: "#8b5cf6",
  },
  Zustand: {
    emoji: "🐻",
    gradFrom: "from-amber-100",
    gradTo: "to-amber-300",
    tone: "#f59e0b",
  },
  IndexedDB: {
    emoji: "💾",
    gradFrom: "from-slate-200",
    gradTo: "to-slate-400",
    tone: "#475569",
  },
  "Service Worker": {
    emoji: "📡",
    gradFrom: "from-indigo-200",
    gradTo: "to-indigo-400",
    tone: "#6366f1",
  },
} as const;
