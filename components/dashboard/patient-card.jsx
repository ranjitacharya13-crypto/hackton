"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronRight, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/components/providers/app-provider";
import { initials, cn } from "@/lib/utils";

const RISK = {
  low: { label: "Low risk", variant: "success" },
  moderate: { label: "Moderate", variant: "warning" },
  high: { label: "Attention", variant: "danger" },
};

const TREND = {
  improving: { label: "Improving", className: "text-emerald-600" },
  stable: { label: "Stable", className: "text-slate-500" },
  attention: { label: "Needs attention", className: "text-amber-600" },
};

export function PatientCard({ patient, index = 0 }) {
  const { openAI } = useApp();
  const risk = RISK[patient.risk];
  const trend = TREND[patient.trend];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="group rounded-xl border bg-white p-4 shadow-soft transition-shadow hover:shadow-lift"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500/15 to-indigo-500/15 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
          {initials(patient.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold">{patient.name}</p>
            <Badge variant={risk.variant} className="shrink-0">{risk.label}</Badge>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {patient.age} yrs · {patient.condition}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-lg bg-slate-50 px-2.5 py-2">
          <p className="text-slate-400">Last visit</p>
          <p className="mt-0.5 font-semibold text-slate-700">{patient.lastVisit}</p>
        </div>
        <div className="rounded-lg bg-slate-50 px-2.5 py-2">
          <p className="text-slate-400">Next appointment</p>
          <p className="mt-0.5 flex items-center gap-1 font-semibold text-slate-700">
            <CalendarDays className="h-3 w-3 text-slate-400" aria-hidden />
            {patient.nextAppt}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className={cn("text-[11px] font-semibold", trend.className)}>{trend.label}</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openAI(`Summarize ${patient.name.split(" ")[0]}'s recent history`)}
            className="inline-flex items-center gap-1 rounded-lg border border-indigo-100 bg-indigo-50/70 px-2.5 py-1.5 text-[11px] font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
          >
            <Sparkles className="h-3 w-3" aria-hidden />
            Ask AI
          </button>
          <button
            className="inline-flex items-center gap-0.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-slate-500 transition-colors hover:bg-secondary hover:text-slate-800"
            aria-label={`Open record for ${patient.name}`}
          >
            Open
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
