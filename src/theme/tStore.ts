export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

export function getInitialTheme(): Theme {
  const saved = (typeof localStorage !== 'undefined'
    ? (localStorage.getItem(STORAGE_KEY) as Theme | null)
    : null);
  if (saved === 'light' || saved === 'dark') return saved;

  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches;

  return prefersDark ? 'dark' : 'light';
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
}

export function setTheme(theme: Theme) {
  applyTheme(theme);
}

export function toggleTheme() {
  const current =
    (document.documentElement.getAttribute('data-theme') as Theme) ||
    getInitialTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}
