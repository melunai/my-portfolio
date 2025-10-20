import { useEffect, useRef } from "react";

export default function ShaderBg() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = ref.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    const draw = () => {
      const t = (performance.now() - start) / 1000;
      const W = canvas.width / dpr, H = canvas.height / dpr;

      // background gradient
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, getCssVar("--bg"));
      g.addColorStop(1, toAlpha(getCssVar("--decor-glow"), 0.6));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // waves
      const cx = mouse.current.x * W;
      const cy = mouse.current.y * H;
      for (let i = 0; i < 3; i++) {
        const amp = 18 + i * 10;
        const freq = 0.004 + i * 0.0025;
        const speed = 0.6 + i * 0.3;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
          const y = H * 0.35 + Math.sin(x * freq + t * speed) * amp + (cy - H * 0.5) * 0.08;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.lineWidth = 1.5 + i;
        ctx.strokeStyle = withOpacity(getCssVar("--accent"), 0.25 - i * 0.06);
        ctx.stroke();
      }

      // soft orb
      // soft orb following cursor (меньше радиус)
    const orb = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.08);

      orb.addColorStop(0, toAlpha(getCssVar("--glow"), 0.35));
      orb.addColorStop(1, toAlpha(getCssVar("--glow"), 0));
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = orb;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = (e.clientX - rect.left) / rect.width;
      mouse.current.y = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden />;
}

function getCssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#000";
}
function toAlpha(hexOrCss: string, a: number) {
  if (hexOrCss.startsWith("rgb")) return hexOrCss.replace(/\d?\.\d+\)$/, a + ")");
  return hexToRgba(hexOrCss, a);
}
function withOpacity(hexOrCss: string, a: number) { return toAlpha(hexOrCss, a); }
function hexToRgba(hex: string, a: number) {
  const c = hex.replace("#", "");
  const full = c.length === 3 ? c.split("").map(x=>x+x).join("") : c;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
