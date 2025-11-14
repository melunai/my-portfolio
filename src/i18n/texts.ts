export type Lang = "ru" | "en";

export const TEXTS = {
  ru: {
    common: {
      nav: {
        home: "Главная",
        projects: "Проекты",
        skills: "Навыки",
        experience: "Опыт",
        workflow: "Этапы работы",
        testimonials: "Отзывы",
        about: "Обо мне",
        contact: "Контакты",
      },
      btn: { demo: "Демо", code: "Код", more: "Подробнее" },
    },

    hero: {
      title: "Твоя идея заслуживает сияния",
      subtitle:
        "Создаю визуально точные и эмоциональные интерфейсы — с вниманием к деталям.",
      ctaProjects: "Мои проекты",
      ctaContact: "Связаться",
    },

    // 👇 новый блок для HeroFront
    heroFront: {
      darkTitle: "Ощути тепло Солнца",
      lightTitle: "Поймай сияние вдохновения",
      darkSubtitle:
        "Позволь энергии света направить твой путь в коде. Яркие идеи начинаются здесь.",
      lightSubtitle:
        "Лёгкость, цвет и движение — твой путь в создании красоты.",
      cta: "Продолжить",
    },

    sections: {
      projects: {
        title: "Проекты",
        lead: "Участие в проектах и вклад в них",

        // добавлено для слайдера и фильтров
        sliderAria: "Полка с проектами",
        prev: "Предыдущий проект",
        next: "Следующий проект",
        dotsAria: "Навигация по проектам",
        toProject: "К проекту",
        openProject: "Открыть проект",
        filters: {
          all: "Все",
        },
      },

      skills: {
        title: "Навыки и инструменты",
        lead: "Инструменты и стек, которыми я реально пользуюсь в работе.",
      },

      experience: {
        title: "Опыт",
        lead: "Где я приносил пользу и за что отвечал.",
      },

      workflow: {
        title: "Этапы работы",
        lead: "Минимальный шум, максимум прозрачности — от старта до релиза.",
        stages: [
          {
            title: "Знакомство",
            text: "Короткий созвон/переписка: цели, стиль, ожидания.",
          },
          {
            title: "Брифирование",
            text: "Собираю вводные, структуру и визуальное направление.",
          },
          {
            title: "Правки",
            text: "Итеративно улучшаем, быстро согласовываем детали.",
          },
          {
            title: "Итог",
            text: "Финализирую, передаю материалы и помогаю с запуском.",
          },
        ],
      },

      testimonials: {
        title: "Отзывы",
        lead: "Что говорят коллеги и партнёры.",
        prev: "Предыдущий отзыв",
        next: "Следующий отзыв",
      },

      about: {
        title: "Обо мне",
        bodyIntroA: "Меня зовут",
        bodyIntroB: "Я создаю современные и масштабируемые интерфейсы.",
        bodyOpen: "Открыт к партнёрствам и новым проектам.",
        bodyBase: "Базируюсь в",
        contacts: "Контакты",
      },

      contact: {
        title: "Связаться со мной",
        lead:
          "Есть идея или задача? Напишите — вернусь с предложениями, сроками и аккуратной сметой.",
        email: "Email",
        telegram: "Telegram",
        messageLabel: "Опишите задачу (минимум 20 символов)",
        consent:
          "Согласен на обработку персональных данных для ответа на заявку.",
        submit: "Отправить заявку",
        sending: "Отправка…",
        sentOk: "Готово! Я получил заявку ✨",
        sentFail: (email: string) => `Ошибка отправки. Напишите на ${email}.`,
        msgCounter: "символов",
        footnote:
          "* Можно указать только email или только Telegram — достаточно одного способа связи.",
        errors: {
          needOne: "Укажите email или Telegram",
          emailBad: "Некорректный email",
          tgBad: "Некорректный @ник",
          tooShort: "Минимум 20 символов",
          tooLong: "Максимум 2000 символов",
          needConsent: "Нужно согласие на обработку данных",
        },
      },

      metrics: {
        title: "Сильные цифры",
        lead:
          "Ключевые показатели, которые я улучшал в проектах. Без воды — только то, что влияет на продукт.",
      },
    },

    footer: {
      privacy: "Политика",
      impressum: "Импрессум",
      views: "Просмотры на этом устройстве",
      backToTop: "Наверх",
      role: "Front-end разработка.",
      toggleLang: "Переключить язык",
    },
  },

  en: {
    common: {
      nav: {
        home: "Home",
        projects: "Projects",
        skills: "Skills",
        experience: "Experience",
        workflow: "Workflow",
        testimonials: "Testimonials",
        about: "About",
        contact: "Contact",
      },
      btn: { demo: "Demo", code: "Code", more: "Details" },
    },

    hero: {
      title: "Your idea deserves to shine",
      subtitle:
        "I craft visually precise, emotional interfaces — with attention to detail.",
      ctaProjects: "My Projects",
      ctaContact: "Contact",
    },

    // 👇 новый блок для HeroFront
    heroFront: {
      darkTitle: "Feel the warmth of the Sun",
      lightTitle: "Catch the spark of inspiration",
      darkSubtitle:
        "Let the energy of light guide your path in code. Bright ideas start here.",
      lightSubtitle:
        "Lightness, color and motion — your way to creating beauty.",
      cta: "Continue",
    },

    sections: {
      projects: {
        title: "Projects",
        lead: "Projects I contributed to and my impact",

        // added for slider & filters
        sliderAria: "Projects shelf",
        prev: "Previous project",
        next: "Next project",
        dotsAria: "Projects navigation",
        toProject: "Go to project",
        openProject: "Open project",
        filters: {
          all: "All",
        },
      },

      skills: {
        title: "Skills & tools",
        lead: "The stack and tools I actually use at work.",
      },

      experience: {
        title: "Experience",
        lead: "Where I created value and what I was responsible for.",
      },

      workflow: {
        title: "Workflow",
        lead: "Minimum noise, maximum clarity — from start to release.",
        stages: [
          {
            title: "Kickoff",
            text: "Short call/chat: goals, style, expectations.",
          },
          {
            title: "Briefing",
            text: "Gather inputs, structure, and visual direction.",
          },
          {
            title: "Iterations",
            text: "Iterate fast, align on details.",
          },
          {
            title: "Finish",
            text: "Finalize, handover, and help launch.",
          },
        ],
      },

      testimonials: {
        title: "Testimonials",
        lead: "What colleagues and partners say.",
        prev: "Previous testimonial",
        next: "Next testimonial",
      },

      about: {
        title: "About",
        bodyIntroA: "My name is",
        bodyIntroB: "I build modern, scalable interfaces.",
        bodyOpen: "Open to partnerships and new projects.",
        bodyBase: "Based in",
        contacts: "Contacts",
      },

      contact: {
        title: "Get in touch",
        lead:
          "Have an idea or task? Message me — I’ll reply with options, timeline and a clean estimate.",
        email: "Email",
        telegram: "Telegram",
        messageLabel: "Describe your task (min 20 chars)",
        consent: "I agree to data processing to respond to this request.",
        submit: "Send",
        sending: "Sending…",
        sentOk: "Done! I received your message ✨",
        sentFail: (email: string) => `Sending failed. Please write to ${email}.`,
        msgCounter: "chars",
        footnote:
          "* You may specify only email or only Telegram — one contact is enough.",
        errors: {
          needOne: "Provide email or Telegram",
          emailBad: "Invalid email",
          tgBad: "Invalid @handle",
          tooShort: "At least 20 characters",
          tooLong: "Max 2000 characters",
          needConsent: "Consent required",
        },
      },

      metrics: {
        title: "Key metrics",
        lead:
          "The product metrics I improved. No fluff — only what impacts the product.",
      },
    },

    footer: {
      privacy: "Privacy",
      impressum: "Impressum",
      views: "Views on this device",
      backToTop: "Top",
      role: "Front-end development.",
      toggleLang: "Toggle language",
    },
  },
} as const;
