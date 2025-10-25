// src/data.ts

export type Project = {
  title: string;
  description: string;
  image?: string;       // для обратной совместимости
  images?: string[];    // несколько фото (cover берём из images[0])
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  period?: string;
  highlights?: string[];
  roles?: string[];
  metrics?: string[];
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  points: string[];
};

export type Metric = { label: string; value: string; hint?: string };

export type Testimonial = {
  name: string;
  title: string;
  quote: string;
  avatar?: string;
};

// ———————————————————————————————————————————————————————————
// 💼 Профиль / Контакты / Главная информация
// ———————————————————————————————————————————————————————————
export const DATA = {
  name: "Стручков Радислав Александрович",
  nick: "melunai",
  role: "Front-end разработчик",
  location: "Россия, Республика Саха (Якутия), Якутск",
  email: "seon.takago@gmail.com",
  telegram: "@melunai",
  github: "https://github.com/melunai",
  linkedin: "https://www.linkedin.com/in/melunai",
  cvUrl: "/cv.pdf",

  about:
    "Я занимаюсь разработкой интерфейсов с акцентом на архитектуру и производительность. " +
    "Создаю надёжные и масштабируемые веб-приложения, удобные в сопровождении и развитии. " +
    "Основные направления: разработка SPA, интеграция API, оптимизация фронтенда и проектирование UI-систем. " +
    "Работаю на результат — чтобы интерфейсы выглядели современно, быстро загружались и помогали бизнесу расти.",

  services: [
    "Разработка SPA на React/TypeScript",
    "Интеграция API (REST/GraphQL)",
    "Оптимизация производительности и DX",
    "Проектирование и поддержка UI-систем",
  ],

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

  projects: <Project[]>[
     {
      title: "Lory-LCT — модульная город-игра",
      description:
        "Платформа с двумя картами (реальная и личная), автогенерацией контента и интеграцией в мобильное приложение банка. " +
        "Игровая механика: сбор событий, развитие персональной карты, геймифицированное обучение финансовой грамотности.",
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
        "Динамическая гексагональная сетка поверх тайлов",
        "Плагинная система мини-игр (ESM + manifest JSON)",
        "Он-прем карты, без публичных ключей; опционально 3D",
      ],
      period: "2025",
      roles: ["Frontend", "Architect"],
    },
    {
      title: "Lory-MPIT — «Умный помощник» (Drivee)",
      description:
        "Определение оптимальной рекомендованной цены бида для водителей для повышения выполняемости заказов и роста доходности.",
      images: [
        "/images/mpit/mpit.png",

      ],
      image: "/images/mpit/mpit.png",
      stack: ["TypeScript", "React"],
      repoUrl: "https://github.com/ShiruiChan/mpit-2025-start",
      period: "2025",
      roles: ["Frontend"],
    },
    {
      title: "Lory.Lab — сайт компании",
      description:
        "Продуктовая лаборатория и сервисная студия: интерфейсы, проверка гипотез, быстрые MVP и сопровождение.",
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
      roles: ["Frontend", "Design", "UX"],
      highlights: [
        "Витрина продуктов и проектов компании",
        "Лёгкая архитектура на Next.js + App Router",
        "Использование модульных компонентов и анимаций",
      ],
    },
  ],
} as const;

// ———————————————————————————————————————————————————————————
// 🧩 Опыт работы
// ———————————————————————————————————————————————————————————
export const EXPERIENCE: ExperienceItem[] = [
  {
    company: "Lory.Lab",
    role: "Front-end разработчик / Руководитель интерфейсной части",
    period: "2023 — наст. время",
    points: [
      "Архитектура клиентских приложений (React/TypeScript), стандарты и паттерны разработки",
      "Проектирование и развитие UI-систем, библиотек компонентов и токенов",
      "Интеграция API (REST/GraphQL), согласование контрактов с бэкендом",
      "Оптимизация производительности (бандл, TTI, рендер) и DX",
      "Планирование фронтенд-работ, ревью кода, повышение скорости поставки",
    ],
  },
  {
    company: "Фриланс",
    role: "Front-end разработчик",
    period: "Параллельно",
    points: [
      "Разработка SPA под задачи заказчиков, адаптация под бизнес-ограничения",
      "Настройка интеграций (авторизация, платёжные и внешние сервисы)",
      "Оптимизация Lighthouse/UX-метрик, внедрение кеширования и офлайна",
      "Сопровождение и консультации, улучшение процессов поставки",
    ],
  },
];

// ———————————————————————————————————————————————————————————
// 📈 Ключевые результаты / метрики
// ———————————————————————————————————————————————————————————
export const METRICS: Metric[] = [
  {
    label: "Скорость загрузки (TTI)",
    value: "−35%",
    hint: "Сокращение времени до интерактивности за счёт оптимизации бандла и lazy-loading",
  },
  {
    label: "Производительность сборки",
    value: "×2",
    hint: "Ускорение Vite/CI-pipeline за счёт кэширования и пересборки только изменённых модулей",
  },
  {
    label: "UX-метрики",
    value: "+18%",
    hint: "Рост пользовательской активности после оптимизации сценариев и анимаций",
  },
  {
    label: "Кеш и офлайн-режим",
    value: "✓",
    hint: "Внедрён IndexedDB + Service Worker с устойчивостью к потере сети",
  },
];

// ———————————————————————————————————————————————————————————
// 💬 Отзывы
// ———————————————————————————————————————————————————————————
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Руководитель продукта",
    title: "финтех-платформа",
    quote:
      "Радислав быстро включился в проект, предложил структурное решение и помог упорядочить фронтенд-архитектуру. " +
      "Код чистый, задачи закрываются в срок, коммуникация всегда прозрачная.",
    avatar: "/images/avatars/client1.jpg",
  },
  {
    name: "Технический директор",
    title: "веб-студия",
    quote:
      "С Радиславом комфортно работать на уровне кода и процессов. Он системно подходит к организации фронта, " +
      "уделяет внимание производительности и масштабируемости. Надёжный специалист.",
    avatar: "/images/avatars/client2.jpg",
  },
  {
    name: "Клиент проекта",
    title: "малый бизнес, e-commerce",
    quote:
      "Проект выполнен качественно и с пониманием бизнес-целей. " +
      "Сайт стал работать быстрее, интерфейс — понятнее, а поддержка после сдачи всегда оперативная.",
    avatar: "/images/avatars/client3.jpg",
  },
];

export const skillMeta: Record<string, { emoji: string; gradFrom: string; gradTo: string; tone?: string }> = {
  TypeScript:    { emoji: "🟦", gradFrom: "from-blue-200",   gradTo: "to-blue-300",   tone: "#3178C6" },
  React:         { emoji: "⚛️", gradFrom: "from-cyan-200",   gradTo: "to-cyan-300",   tone: "#61DAFB" },
  Vite:          { emoji: "⚡",  gradFrom: "from-yellow-200", gradTo: "to-yellow-300", tone: "#FFC72C" },
  Tailwind:      { emoji: "🎨", gradFrom: "from-teal-200",    gradTo: "to-teal-300",   tone: "#06B6D4" },
  UnoCSS:        { emoji: "🎯", gradFrom: "from-indigo-200",  gradTo: "to-indigo-300", tone: "#5B5BD6" },
  JavaScript:    { emoji: "🟨", gradFrom: "from-yellow-200", gradTo: "to-yellow-300", tone: "#F7DF1E" },
  HTML:          { emoji: "🧱", gradFrom: "from-orange-200",  gradTo: "to-orange-300", tone: "#E34F26" },
  CSS:           { emoji: "🎨", gradFrom: "from-sky-200",     gradTo: "to-sky-300",    tone: "#2965F1" },
  Python:        { emoji: "🐍", gradFrom: "from-green-200",   gradTo: "to-green-300",  tone: "#3776AB" },
  SQL:           { emoji: "🗃️", gradFrom: "from-gray-200",   gradTo: "to-gray-300",   tone: "#73808C" },
  "MapLibre GL": { emoji: "🗺️", gradFrom: "from-lime-200",   gradTo: "to-lime-300",   tone: "#3FB950" },
  "Mapbox GL":   { emoji: "🌍", gradFrom: "from-blue-200",    gradTo: "to-blue-300",   tone: "#1DA1F2" },
  "Redux Toolkit":{emoji:"🧠", gradFrom: "from-purple-200",   gradTo: "to-purple-300", tone: "#764ABC" },
  Zustand:       { emoji: "🐻", gradFrom: "from-amber-200",   gradTo: "to-amber-300",  tone: "#825826" },
  IndexedDB:     { emoji: "🗄️", gradFrom: "from-slate-200",  gradTo: "to-slate-300",  tone: "#64748B" },
  "Service Worker":{emoji:"🔧", gradFrom:"from-zinc-200",     gradTo:"to-zinc-300",    tone: "#9CA3AF" },
};
