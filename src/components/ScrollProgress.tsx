import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY;
      const h = document.body.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, Math.max(0, (s / h) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
      <div
        className="h-full transition-[width] rounded-r-full"
        style={{
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, #f472b6 0%, #ec4899 50%, #db2777 100%)", // rose-400 -> pink-500 -> rose-600
        }}
      />
    </div>
  );
}
