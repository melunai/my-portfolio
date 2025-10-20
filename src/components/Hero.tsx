import { Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import Chip from "./Chip";
import { DATA } from "../data";

export default function Hero() {
  return (
    <section className="pt-16 md:pt-24" id="home">
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="md:col-span-2 relative group"
          onMouseMove={(e) => {
            const t = e.currentTarget as HTMLDivElement;
            const r = t.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            t.style.setProperty("--px", px.toFixed(3));
            t.style.setProperty("--py", py.toFixed(3));
          }}
        >
          <h1
            className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight will-change-transform"
            style={{
              transform:
                "translate3d(calc(var(--px,0)*6px), calc(var(--py,0)*-4px), 0)",
            }}
          >
            Привет, я {DATA.name} —<br />
            <span className="text-slate-500">{DATA.role}</span>
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300 md:text-lg">
            {DATA.about}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-glow-pink"
              style={{
                background:
                  "linear-gradient(90deg,#f472b6 0%,#ec4899 50%,#db2777 100%)",
              }}
            >
              Смотреть проекты
            </a>
            {DATA.cvUrl && (
              <a
                href={DATA.cvUrl}
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm border-rose-200/60 dark:border-rose-100/10 bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10"
                download
              >
                Резюме (PDF)
              </a>
            )}

            <a
              href="/me.vcf"
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm border-rose-200/60 dark:border-rose-100/10 bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10"
            >
              vCard
            </a>
          </div>
        </motion.div>

        <GlassCard className="p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-medium">Быстрые факты</h3>
            <div className="text-sm opacity-80 flex items-center gap-2">
              <MapPin className="size-4" /> {DATA.location}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {DATA.skills.slice(0, 6).map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
          <a
            href={`mailto:${DATA.email}`}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl w-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-3 text-sm font-medium"
          >
            <Mail className="size-4" /> Написать мне
          </a>
        </GlassCard>
      </div>
    </section>
  );
}
