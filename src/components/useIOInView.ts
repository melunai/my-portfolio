import { useEffect, useRef, useState } from "react";

export type IOOpts = {
  /** когда true — после первого входа в зону больше не гасим */
  once?: boolean;
  /** смещение «окна» видимости; по умолчанию центр-биас */
  rootMargin?: string;
  /** массив порогов */
  threshold?: number | number[];
};

export function useIOInView<T extends HTMLElement>({
  once = true,
  rootMargin = "-35% 0px -50% 0px",
  threshold = [0, 0.1, 0.25, 0.5, 0.75, 1],
}: IOOpts = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      // без IO считаем видимым, чтобы контент не завис
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { root: null, rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView } as const;
}
