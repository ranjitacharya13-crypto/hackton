"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function StatCard({ icon: Icon, label, value, hint, tone = "default", index = 0, className }) {
  const tones = {
    default: "bg-secondary text-slate-600",
    teal: "bg-teal-50 text-teal-600",
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" }}
      className={cn("rounded-xl border bg-white p-4 shadow-soft", className)}
    >
      <div className="flex items-center gap-3">
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", tones[tone] || tones.default)}>
          {Icon && <Icon className="h-5 w-5" aria-hidden />}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
          <p className="font-display text-xl font-bold leading-tight tracking-tight">{value}</p>
        </div>
      </div>
      {hint ? <p className="mt-2.5 text-[11px] text-muted-foreground">{hint}</p> : null}
    </motion.div>
  );
}
