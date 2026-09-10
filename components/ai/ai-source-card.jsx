"use client";

import { motion } from "framer-motion";
import { FileText, Droplets, Pill, Activity, CalendarDays, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_ICON = {
  "Blood Test": Droplets,
  Medication: Pill,
  Vitals: Activity,
  Visit: CalendarDays,
  Report: FileText,
  System: Server,
};

export function AISourceCard({ source, index = 0, tone = "light" }) {
  const Icon = TYPE_ICON[source.type] || FileText;
  const light = tone === "light";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.3 }}
      className={cn(
        "rounded-lg border p-3",
        light ? "border-slate-200 bg-white" : "border-white/10 bg-white/[0.04]"
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            light ? "bg-secondary text-slate-600" : "bg-white/10 text-teal-200"
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("truncate text-[13px] font-semibold leading-tight", light ? "text-foreground" : "text-white")}>
            {source.label}
          </p>
          <p className={cn("text-[11px]", light ? "text-muted-foreground" : "text-slate-400")}>{source.date}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold",
            light ? "bg-teal-50 text-teal-700" : "bg-teal-400/15 text-teal-300"
          )}
        >
          {source.relevance}%
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100/80" aria-hidden>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${source.relevance}%` }}
          transition={{ delay: 0.2 + 0.08 * index, duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-indigo-500"
        />
      </div>
      <p className={cn("mt-1.5 text-[10px] font-medium uppercase tracking-wider", light ? "text-slate-400" : "text-slate-500")}>
        {source.relevance}% relevant
      </p>
    </motion.div>
  );
}
