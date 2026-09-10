"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Pill, PackageCheck, AlertTriangle, RotateCcw, History } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionBadge } from "@/components/security/permission-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { AIHeroCard } from "@/components/ai/ai-hero-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/components/providers/app-provider";
import { prescriptionsQueue, medicationChanges } from "@/lib/data";
import { useGreeting } from "@/lib/use-greeting";

const STATUS_VARIANT = {
  Ready: "success",
  Dispensing: "info",
  "Pending review": "warning",
  Dispensed: "slate",
};

export default function PharmacistDashboard() {
  const { pushToast, addAudit } = useApp();
  const greet = useGreeting();
  const [queue, setQueue] = React.useState(prescriptionsQueue);

  const dispense = (id) => {
    setQueue((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        pushToast({ kind: "success", title: "Dispensed", body: `${q.medication} · ${q.patient} — logged to audit trail.` });
        addAudit({
          role: "pharmacist",
          actor: "Omar Haddad",
          action: "dispensed",
          resource: `${q.medication} · ${q.quantity}`,
          category: "update",
        });
        return { ...q, status: "Dispensed" };
      })
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greet}, Omar`}
        description="Prescriptions, dispensing status and medication changes — medication scope only."
        badges={
          <>
            <PermissionBadge level="CONSENTED" />
            <PermissionBadge level="ROLE RESTRICTED" />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Pill} label="Active prescriptions" value="128" hint="Across all patients" tone="amber" index={0} />
        <StatCard icon={PackageCheck} label="Ready for dispensing" value={String(queue.filter((q) => q.status === "Ready").length)} hint="Queue below" tone="emerald" index={1} />
        <StatCard icon={AlertTriangle} label="Interaction alerts" value="1" hint="Amlodipine review" tone="rose" index={2} />
        <StatCard icon={RotateCcw} label="Refills due · 7 days" value="9" hint="Auto-notifications on" tone="indigo" index={3} />
      </div>

      <AIHeroCard description="Ask Medication Intelligence about recent changes, refill alerts or the dispensing queue — medication scope only." />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Dispensing queue */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-emerald-500" aria-hidden />
              Active prescriptions — dispensing queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {queue.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border p-3.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold">{q.medication}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {q.patient} · {q.prescriber} · {q.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_VARIANT[q.status]}>{q.status}</Badge>
                    {(q.status === "Ready" || q.status === "Dispensing") && (
                      <Button size="sm" className="h-7 text-[11px]" onClick={() => dispense(q.id)}>
                        Dispense
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-2.5 flex items-center gap-2 text-[10px] text-slate-400">
                  <span>Written {q.written}</span>
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100" aria-hidden>
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-500"
                      style={{ width: q.status === "Dispensed" ? "100%" : q.status === "Ready" ? "66%" : q.status === "Dispensing" ? "85%" : "30%" }}
                    />
                  </span>
                  <span>{q.status === "Dispensed" ? "Complete" : q.status === "Pending review" ? "Review" : "Filling"}</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Medication changes + history */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <History className="h-4 w-4 text-amber-500" aria-hidden />
                Recent medication changes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {medicationChanges.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="relative flex gap-3 pb-4 last:pb-0"
                >
                  {i < medicationChanges.length - 1 && (
                    <span className="absolute left-[7px] top-4 h-full w-px bg-slate-200" aria-hidden />
                  )}
                  <span
                    className={`z-[1] mt-1 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ${
                      c.kind === "renewal" ? "bg-emerald-400 ring-emerald-100" : c.kind === "pause" ? "bg-amber-400 ring-amber-100" : "bg-sky-400 ring-sky-100"
                    }`}
                    aria-hidden
                  />
                  <div>
                    <p className="text-xs leading-snug text-slate-700">{c.text}</p>
                    <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">{c.date}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Dispensing status · today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Dispensed", value: 34, total: 48, tone: "bg-emerald-500" },
                { label: "In preparation", value: 9, total: 48, tone: "bg-sky-500" },
                { label: "Awaiting stock", value: 5, total: 48, tone: "bg-amber-500" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">{row.label}</span>
                    <span className="font-bold tabular-nums">{row.value}/{row.total}</span>
                  </div>
                  <Progress value={(row.value / row.total) * 100} className="h-1.5" indicatorClassName={row.tone} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
