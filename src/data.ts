// src/data.ts

export type Project = {
  title: string;
  description: string;
  image: string;
  stack: string[];
  highlights?: string[];
  liveUrl?: string;
  repoUrl?: string;
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
      image: "/images/projects/lory-lct.jpg",
      stack: [
        "React", "TypeScript", "Tailwind", "UnoCSS",
        "MapLibre GL", "Mapbox GL", "Zustand", "Redux Toolkit",
        "IndexedDB", "Service Worker",
      ],
      highlights: [
        "Динамическая гексагональная сетка поверх тайлов",
        "Плагинная система мини-игр (ESM + manifest JSON)",
        "Он-прем карты, без публичных ключей; опционально 3D",
      ],
    },
    {
      title: "Lory-MPIT — «Умный помощник» (Drivee)",
      description:
        "Определение оптимальной рекомендованной цены бида для водителей для повышения выполняемости заказов и роста доходности.",
      image: "/images/projects/lory-mpit.jpg",
      stack: ["TypeScript", "React"],
      repoUrl: "https://github.com/ShiruiChan/mpit-2025-start",
    },
    {
      title: "Lory.Lab — сайт компании",
      description:
        "Продуктовая лаборатория и сервисная студия: интерфейсы, проверка гипотез, быстрые MVP и сопровождение.",
      image: "/images/projects/lory-lab.jpg",
      stack: ["Next.js", "React", "TypeScript"],
      liveUrl: "https://lory.vercel.app",
      repoUrl: "https://github.com/ShiruiChan/Lory.Lab",
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
