"use client";

import { motion } from "framer-motion";
import { Pill } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const STATUS = {
  active: { label: "Active", variant: "success" },
  paused: { label: "Paused", variant: "warning" },
  completed: { label: "Completed", variant: "slate" },
};

export function MedicationCard({ medication, index = 0, showAdherence = true }) {
  const m = medication;
  const status = STATUS[m.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className={cn("rounded-xl border bg-white p-4 shadow-soft", m.status !== "active" && "opacity-75")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Pill className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">{m.name}</p>
            <p className="text-xs text-muted-foreground">{m.purpose} · {m.prescriber}</p>
          </div>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
        <div className="rounded-lg bg-slate-50 px-2 py-1.5">
          <p className="text-slate-400">Dosage</p>
          <p className="mt-0.5 font-semibold text-slate-700">{m.dosage}</p>
        </div>
        <div className="rounded-lg bg-slate-50 px-2 py-1.5">
          <p className="text-slate-400">Frequency</p>
          <p className="mt-0.5 font-semibold text-slate-700">{m.frequency}</p>
        </div>
        <div className="rounded-lg bg-slate-50 px-2 py-1.5">
          <p className="text-slate-400">Refill</p>
          <p className="mt-0.5 font-semibold text-slate-700">{m.refill}</p>
        </div>
      </div>

      {showAdherence && m.status === "active" && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Adherence</span>
            <span className="font-semibold text-emerald-600">{m.adherence}%</span>
          </div>
          <Progress value={m.adherence} className="h-1.5" indicatorClassName="bg-gradient-to-r from-teal-500 to-emerald-500" />
        </div>
      )}
    </motion.div>
  );
}
