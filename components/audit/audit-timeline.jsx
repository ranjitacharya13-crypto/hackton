"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { RoleBadge } from "@/components/security/role-badge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function StatusIcon({ status }) {
  if (status === "denied") return <XCircle className="h-4 w-4 text-rose-500" aria-label="Denied" />;
  if (status === "info") return <Info className="h-4 w-4 text-slate-400" aria-label="Info" />;
  return <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-label="Success" />;
}

export function AuditTimeline({ entries, dense = false }) {
  return (
    <ol className="relative" aria-label="Audit trail">
      {entries.map((entry, i) => {
        const last = i === entries.length - 1;
        const denied = entry.status === "denied";
        return (
          <motion.li
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.045, 0.5), duration: 0.3 }}
            className="relative flex gap-3.5 pb-1"
          >
            <div className="flex w-14 shrink-0 flex-col items-end pt-2.5">
              <span className="text-xs font-bold tabular-nums text-slate-700">{entry.time}</span>
              <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                {entry.date === "Today" ? "Today" : entry.date}
              </span>
            </div>

            <div className="relative flex flex-col items-center">
              <span
                className={cn(
                  "z-[1] mt-2.5 flex h-7 w-7 items-center justify-center rounded-full ring-1",
                  denied ? "bg-rose-50 ring-rose-100" : "bg-emerald-50 ring-emerald-100"
                )}
              >
                <StatusIcon status={entry.status} />
              </span>
              {!last && <span className="w-px flex-1 bg-slate-200" aria-hidden />}
            </div>

            <div
              className={cn(
                "mb-3 min-w-0 flex-1 rounded-xl border bg-white p-3.5 shadow-soft",
                denied && "border-rose-100 bg-rose-50/40"
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <RoleBadge role={entry.role} className="px-2 py-0 text-[9px]" />
                <span className="text-[11px] font-semibold text-slate-500">{entry.actor}</span>
                <span className="ml-auto">
                  <Badge variant={denied ? "danger" : entry.category === "ai" ? "indigo" : entry.category === "consent" ? "success" : "slate"} className="text-[9px]">
                    {entry.category.toUpperCase()}
                  </Badge>
                </span>
              </div>
              <p className="mt-2 text-sm leading-snug">
                <span className="font-semibold capitalize">{entry.action}</span>{" "}
                <span className="text-muted-foreground">—</span>{" "}
                <span className="font-medium text-slate-700">{entry.resource}</span>
              </p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
