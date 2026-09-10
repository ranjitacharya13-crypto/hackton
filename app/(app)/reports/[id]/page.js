"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, CalendarDays, Building2, Stethoscope, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PermissionBadge } from "@/components/security/permission-badge";
import { useApp } from "@/components/providers/app-provider";
import { reports } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function ReportViewerPage() {
  const params = useParams();
  const { openAI } = useApp();
  const report = reports.find((r) => r.id === params?.id) || reports[0];

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" aria-label="Back to reports">
            <Link href="/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">{report.title}</h1>
            <p className="text-xs text-muted-foreground">
              {report.date} · {report.provider}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PermissionBadge level={report.access} />
          <Badge variant="outline" className="text-slate-500">{report.status}</Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Document preview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border bg-white p-2 shadow-soft sm:p-3"
        >
          <div className="rounded-xl bg-slate-50/80 p-5 sm:p-8">
            {/* Mock document */}
            <article aria-label={`Document preview: ${report.title}`} className="mx-auto max-w-[560px] rounded-lg border bg-white p-6 shadow-sm sm:p-8">
              <header className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    {report.provider}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-bold">{report.title}</h2>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 ring-1 ring-teal-100">
                  <FileText className="h-4 w-4" aria-hidden />
                </span>
              </header>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                <div>
                  <dt className="text-slate-400">Patient</dt>
                  <dd className="mt-0.5 font-semibold">Maya Chen</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Date</dt>
                  <dd className="mt-0.5 font-semibold">{report.date}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Ordered by</dt>
                  <dd className="mt-0.5 font-semibold">{report.orderedBy}</dd>
                </div>
              </dl>

              <div className="mt-5 space-y-2.5">
                {report.highlights.map((h) => (
                  <p key={h} className="flex gap-2 text-[13px] leading-relaxed text-slate-600">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-teal-500" aria-hidden />
                    {h}
                  </p>
                ))}
              </div>

              {/* Extracted values table inside document */}
              <table className="mt-6 w-full text-left text-xs">
                <thead>
                  <tr className="border-y border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="py-2 font-semibold">Analyte</th>
                    <th className="py-2 font-semibold">Result</th>
                    <th className="py-2 text-right font-semibold">Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {report.extracted.map((row) => (
                    <tr key={row.label} className="border-b border-slate-50 last:border-0">
                      <td className="py-2 font-medium text-slate-700">{row.label}</td>
                      <td className="py-2 tabular-nums">{row.value}</td>
                      <td className="py-2 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                            row.flag === "Normal"
                              ? "bg-emerald-50 text-emerald-600"
                              : row.flag === "—"
                                ? "bg-slate-100 text-slate-500"
                                : row.flag === "Watch"
                                  ? "bg-sky-50 text-sky-600"
                                  : "bg-amber-50 text-amber-600"
                          )}
                        >
                          {row.flag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <footer className="mt-6 border-t border-slate-100 pt-3 text-[10px] text-slate-400">
                Electronically verified · Ref {report.id.toUpperCase()}-2026-0{report.title.length % 9} · This is a mock document for demonstration.
              </footer>
            </article>
          </div>
        </motion.div>

        {/* Summary + extracted info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="space-y-4"
        >
          <div className="rounded-2xl aurora-ink p-5 text-white shadow-soft">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              AI Summary
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">{report.summary}</p>
            <Button
              onClick={() => openAI(`Summarize my ${report.title.toLowerCase()}`)}
              className="mt-4 w-full gap-2 rounded-xl bg-white text-ink-900 hover:bg-slate-100"
            >
              <Sparkles className="h-4 w-4 text-indigo-500" aria-hidden />
              Ask Health Intelligence
            </Button>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-soft">
            <h3 className="font-display text-sm font-bold">Extracted information</h3>
            <div className="mt-3 space-y-2.5">
              {report.extracted.map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  className="flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm"
                >
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-bold tabular-nums">{row.value}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                Issued {report.date}
              </p>
              <p className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                {report.provider}
              </p>
              <p className="flex items-center gap-2">
                <Stethoscope className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                Ordered by {report.orderedBy}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-4">
              {report.tags.map((t) => (
                <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs leading-relaxed text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p>
              This report is only visible to roles inside your consent scope. Every view is recorded in the audit
              trail.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
