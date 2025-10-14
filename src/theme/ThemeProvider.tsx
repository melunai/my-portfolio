// src/theme/ThemeProvider.tsx
import { useEffect, type PropsWithChildren } from 'react';
import { getInitialTheme, applyTheme } from './tStore';

export default function ThemeProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    // инициализируем сразу после монтирования
    applyTheme(getInitialTheme());
    // реакция на системную смену темы (необязательно)
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const saved = localStorage.getItem('theme');
      if (!saved) applyTheme(mq.matches ? 'dark' : 'light');
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return <>{children}</>;
}