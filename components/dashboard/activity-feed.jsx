"use client";

import { motion } from "framer-motion";
import { Eye, Sparkles, HeartHandshake, PencilLine, KeyRound, Upload } from "lucide-react";
import { RoleBadge } from "@/components/security/role-badge";
import { cn } from "@/lib/utils";

const CATEGORY_ICON = {
  view: Eye,
  ai: Sparkles,
  consent: HeartHandshake,
  update: PencilLine,
  auth: KeyRound,
  upload: Upload,
};

export function ActivityFeed({ items, showRoleBadge = true, className }) {
  return (
    <ol className={cn("relative space-y-0", className)} aria-label="Recent activity">
      {items.map((item, i) => {
        const Icon = CATEGORY_ICON[item.category] || Eye;
        const last = i === items.length - 1;
        return (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="relative flex gap-3 pb-4 last:pb-0"
          >
            {!last && <span className="absolute left-[13px] top-7 h-[calc(100%-24px)] w-px bg-slate-200" aria-hidden />}
            <span className="z-[1] mt-0.5 flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full bg-secondary text-slate-500 ring-1 ring-slate-200/60">
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] leading-snug">
                <span className="font-semibold">{item.actor}</span>{" "}
                <span className="text-slate-600">{item.action}</span>{" "}
                <span className="font-medium text-slate-700">{item.resource}</span>
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {showRoleBadge && <RoleBadge role={item.role} className="px-2 py-0 text-[9px]" />}
                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  {item.date === "Today" ? item.time : `${item.date} · ${item.time}`}
                </span>
              </div>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
