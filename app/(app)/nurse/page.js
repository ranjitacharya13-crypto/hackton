"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Users, Activity, ClipboardCheck, AlertTriangle, Check } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionBadge } from "@/components/security/permission-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { AIHeroCard } from "@/components/ai/ai-hero-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/components/providers/app-provider";
import { nurseTasks as initialTasks, nurseAlerts, observations, patients } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useGreeting } from "@/lib/use-greeting";

export default function NurseDashboard() {
  const { pushToast, addAudit, auditLogs } = useApp();
  const greet = useGreeting();
  const [tasks, setTasks] = React.useState(initialTasks);
  const [recorded, setRecorded] = React.useState({});

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const recordVitals = (patient) => {
    setRecorded((prev) => ({ ...prev, [patient.id]: true }));
    pushToast({ kind: "success", title: "Vitals recorded", body: `${patient.name} — values synced to the record (demo).` });
    addAudit({
      role: "nurse",
      actor: "Liam Torres",
      action: "recorded vitals",
      resource: `Vitals · ${patient.name}`,
      category: "update",
    });
  };

  const vitalsPending = patients.filter((p) => p.room !== "—");
  const priorityTone = { high: "danger", medium: "warning", low: "slate" };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greet}, Liam`}
        description="Ward 3 North — assigned patients, vitals to record, tasks and live observations."
        badges={
          <>
            <PermissionBadge level="ROLE RESTRICTED" />
            <PermissionBadge level="AUDITED" />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Users} label="Assigned patients" value="12" hint="Ward 3 North" tone="emerald" index={0} />
        <StatCard icon={Activity} label="Vitals to record" value={String(vitalsPending.filter((p) => !recorded[p.id]).length)} hint="2 before 11:00" tone="teal" index={1} />
        <StatCard icon={ClipboardCheck} label="Open tasks" value={String(tasks.filter((t) => !t.done).length)} hint={`${tasks.filter((t) => t.done).length} completed`} tone="indigo" index={2} />
        <StatCard icon={AlertTriangle} label="Patient alerts" value={String(nurseAlerts.length)} hint="1 high priority" tone="rose" index={3} />
      </div>

      <AIHeroCard description="Ask Care Intelligence which vitals are due, summarize patient alerts, or review today's task list." />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Vitals to record */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal-600" aria-hidden />
              Vitals to record
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {vitalsPending.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between gap-3 rounded-xl border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">Bed {p.room} · {p.condition}</p>
                </div>
                {recorded[p.id] ? (
                  <motion.span
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-600"
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    Recorded
                  </motion.span>
                ) : (
                  <Button size="sm" variant="outline" className="h-8 shrink-0 text-xs" onClick={() => recordVitals(p)}>
                    Record
                  </Button>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-indigo-500" aria-hidden />
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasks.map((t, i) => (
              <motion.label
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
                  t.done ? "bg-slate-50/70 opacity-70" : "hover:bg-secondary/50"
                )}
              >
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTask(t.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-teal-600"
                  aria-label={t.label}
                />
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-[13px] font-medium leading-snug", t.done && "line-through")}>
                    {t.label}
                  </span>
                  <span className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{t.due}</span>
                    <Badge variant={priorityTone[t.priority]} className="px-1.5 py-0 text-[9px]">
                      {t.priority}
                    </Badge>
                  </span>
                </span>
              </motion.label>
            ))}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500" aria-hidden />
              Patient alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {nurseAlerts.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={cn(
                  "rounded-xl border p-3.5",
                  a.level === "high" ? "border-rose-200 bg-rose-50/60" : "border-amber-200 bg-amber-50/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-bold">{a.patient}</p>
                  <Badge variant={a.level === "high" ? "danger" : "warning"} className="text-[9px]">
                    {a.level.toUpperCase()}
                  </Badge>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{a.note}</p>
              </motion.div>
            ))}

            <div className="rounded-xl border bg-slate-50/60 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Observations · this morning</p>
              <div className="mt-2 space-y-2.5">
                {observations.map((o) => (
                  <div key={o.id} className="text-xs">
                    <p className="font-semibold text-slate-700">
                      {o.patient} <span className="font-normal text-slate-400">· {o.time}</span>
                    </p>
                    <p className="mt-0.5 leading-relaxed text-muted-foreground">{o.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent ward activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={auditLogs.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
