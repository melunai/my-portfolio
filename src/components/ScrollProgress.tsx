import { useEffect, useState } from 'react';

/**
 * Тонкая полоса прогресса прокрутки вверху страницы.
 * Подкрашена переменными темы (--accent / --accent-600).
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const value = total > 0 ? (doc.scrollTop / total) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, value)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        insetInlineStart: 0,
        insetBlockStart: 0,
        height: 3,
        width: `${progress}%`,
        zIndex: 60,
        background: `linear-gradient(
          90deg,
          var(--accent) 0%,
          color-mix(in oklab, var(--accent), white 12%) 50%,
          var(--accent-600) 100%
        )`,
        transition: 'width .1s ease-out',
      }}
    />
  );
}
