"use client";

import { motion } from "framer-motion";
import { HeartHandshake, ShieldMinus, Eye, LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_META = {
  granted: { icon: HeartHandshake, className: "bg-teal-50 text-teal-600 ring-teal-100" },
  limited: { icon: LockKeyhole, className: "bg-amber-50 text-amber-600 ring-amber-100" },
  denied: { icon: ShieldMinus, className: "bg-rose-50 text-rose-600 ring-rose-100" },
  reviewed: { icon: Eye, className: "bg-slate-100 text-slate-500 ring-slate-200" },
};

export function ConsentTimeline({ events }) {
  return (
    <ol className="relative" aria-label="Consent history">
      {events.map((e, i) => {
        const meta = TYPE_META[e.type] || TYPE_META.reviewed;
        const Icon = meta.icon;
        const last = i === events.length - 1;
        return (
          <motion.li
            key={e.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="relative flex gap-3.5 pb-5 last:pb-0"
          >
            {!last && <span className="absolute left-[15px] top-8 h-[calc(100%-28px)] w-px bg-slate-200" aria-hidden />}
            <span className={cn("z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1", meta.className)}>
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm leading-snug text-slate-700">{e.event}</p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">{e.date}</p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
