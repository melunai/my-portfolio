export type Project = {
  title: string;
  description: string;
  stack: string[];
  image: string;
  liveUrl?: string;
  repoUrl?: string;
  highlights?: string[];
};

export type SiteData = {
  name: string;
  role: string;
  location: string;
  about: string;
  email: string;
  github: string;
  linkedin: string;
  cvUrl: string;
  skills: string[];
  projects: Project[];
};

export const DATA: SiteData = {
  name: "Имя Фамилия",
  role: "Frontend / Full-Stack Developer",
  location: "🗺️ Berlin, Germany",
  about:
    "Краткое интро в 1–2 предложения: ваш фокус, сильные стороны и то, что вам интересно делать.",
  email: "you@example.com",
  github: "https://github.com/yourname",
  linkedin: "https://www.linkedin.com/in/yourname/",
  cvUrl: "/cv.pdf",
  skills: [
    "JavaScript","TypeScript","React","Next.js","Node.js","Express",
    "PostgreSQL","TailwindCSS","Framer Motion","Git","REST / GraphQL","CI/CD"
  ],
  projects: [
    {
      title: "Проект №1 — Демо-приложение",
      description:
        "Коротко: какую проблему решает проект, какие технологии использованы, что сделали лично вы.",
      stack: ["React","Vite","Tailwind"],
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1470&auto=format&fit=crop",
      liveUrl: "https://example.com",
      repoUrl: "https://github.com/yourname/project1",
      highlights: ["SSR/ISR (если есть)","Легковесная архитектура","Тесты + CI"]
    },
    {
      title: "Проект №2 — Панель аналитики",
      description:
        "Интерактивные графики, фильтры, авторизация. Опишите вклад: разработал архитектуру фильтров.",
      stack: ["Next.js","Node","PostgreSQL"],
      image: "https://images.unsplash.com/photo-1551281044-8c5e042273ae?q=80&w=1470&auto=format&fit=crop",
      liveUrl: "https://example.com",
      repoUrl: "https://github.com/yourname/project2",
      highlights: ["SSR","Быстрый поиск","Роли пользователей"]
    },
    {
      title: "Проект №3 — Дизайн-система",
      description:
        "Набор UI-компонентов и токенов. Опишите, как вы поддерживали консистентность и автоматизацию.",
      stack: ["Storybook","Tailwind","Vite"],
      image: "https://images.unsplash.com/photo-1587620931276-d97f425f62b9?q=80&w=1470&auto=format&fit=crop",
      liveUrl: "https://example.com",
      repoUrl: "https://github.com/yourname/project3",
      highlights: ["Атомарный подход","Документация","Снапшот-тесты"]
    }
  ]
};

/* Доп. данные для «дорогих» секций */
export type Metric = { label: string; value: string; hint?: string; };
export type Experience = { company: string; role: string; period: string; points: string[]; };
export type Testimonial = { name: string; title: string; avatar?: string; quote: string; };

export const METRICS: Metric[] = [
  { label: "В проде проектов", value: "12+", hint: "pet + коммерческие" },
  { label: "Ускорение TTFB", value: "−120ms" },
  { label: "Рост конверсии", value: "+18%", hint: "AB-тесты" },
  { label: "Код-ревью/мес", value: "40+" }
];

export const EXPERIENCE: Experience[] = [
  {
    company: "Acme Corp",
    role: "Frontend Engineer",
    period: "2023 — наст.",
    points: [
      "Дизайн-система на Tailwind + Storybook (120+ токенов)",
      "SSR/ISR на Next.js, SEO + LCP < 1.8s",
      "CI/CD (GitHub Actions, Preview Envs)"
    ]
  },
  {
    company: "Globex",
    role: "Full-Stack Dev",
    period: "2021 — 2023",
    points: [
      "Дашборды на React + PostgreSQL, кеширование",
      "Роли/права, аудит логов, мониторинг"
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Анна Петрова",
    title: "PM, Acme",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
    quote: "За счёт продуманной архитектуры мы сократили время вывода фич в 2 раза."
  },
  {
    name: "Илья Смирнов",
    title: "CTO, Globex",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&auto=format&fit=crop",
    quote: "Надежный инженер: аккуратный код, понятные PR, документация."
  }
];
