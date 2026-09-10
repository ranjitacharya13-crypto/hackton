"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Droplets, Pill, Stethoscope, Activity, Sparkles, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PermissionBadge } from "@/components/security/permission-badge";
import { RECORD_TYPE_META } from "@/lib/data";
import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";

const TYPE_ICON = {
  report: FileText,
  prescription: Pill,
  lab: Droplets,
  visit: Stethoscope,
  vitals: Activity,
};

export function RecordCard({ record, index = 0 }) {
  const { openAI } = useApp();
  const meta = RECORD_TYPE_META[record.type];
  const Icon = TYPE_ICON[record.type];
  const href = record.reportId ? `/reports/${record.reportId}` : "/reports";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.32 }}
      whileHover={{ y: -3 }}
      className="group flex flex-col rounded-xl border bg-white p-4 shadow-soft transition-shadow hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg border", meta.color)}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <PermissionBadge level={record.access} withLabel={false} />
      </div>

      <p className="mt-3 text-sm font-semibold leading-snug">{record.title}</p>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{record.summary}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className={meta.color}>{meta.label}</Badge>
        <Badge variant="outline" className="text-slate-500">{record.status}</Badge>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-muted-foreground">
        <span>{record.date}</span>
        <span className="max-w-[45%] truncate">{record.provider}</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link
          href={href}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border bg-white text-xs font-semibold text-slate-700 transition-colors hover:bg-secondary"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden />
          View
        </Link>
        <button
          onClick={() => openAI(`Summarize my ${meta.label.toLowerCase()}: ${record.title}`)}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50/80 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Ask AI
        </button>
      </div>
    </motion.div>
  );
}
