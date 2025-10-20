import { useEffect, useState } from 'react';
import { toggleTheme } from '../theme/tStore';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => obs.disconnect();
  }, []);

  return (
    <button
      type="button"
      aria-label="Сменить тему"
      onClick={() => toggleTheme()}
      style={{
        padding: '8px 12px',
        borderRadius: 12,
        border: '1px solid var(--btn-border)',
        background: 'var(--btn-bg)',
        color: 'var(--btn-fg)',
        cursor: 'pointer',
      }}
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
