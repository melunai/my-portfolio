type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';

export const getInitialTheme = (): Theme => {
  // (1) приоритет — сохранённое значение
  const saved = (localStorage.getItem(THEME_KEY) as Theme | null);
  if (saved === 'light' || saved === 'dark') return saved;
  // (2) системная настройка
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement; // <html>
  root.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  // обновим meta theme-color (цвет адресной строки на мобилках)
  const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (meta) meta.content = getComputedStyle(root).getPropertyValue('--bg').trim();
};

export const toggleTheme = () => {
  const next: Theme = (document.documentElement.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
  applyTheme(next);
};
