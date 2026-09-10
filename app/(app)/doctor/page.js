"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Users, CalendarDays, FileText, AlertTriangle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionBadge } from "@/components/security/permission-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { PatientCard } from "@/components/dashboard/patient-card";
import { AppointmentCard } from "@/components/dashboard/appointment-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AIHeroCard } from "@/components/ai/ai-hero-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/components/providers/app-provider";
import { patients, appointments, reports } from "@/lib/data";
import { useGreeting } from "@/lib/use-greeting";

export default function DoctorDashboard() {
  const { auditLogs, openAI } = useApp();
  const greet = useGreeting();
  const todaysAppointments = [
    { id: "d1", title: "Follow-up — Maya Chen", doctor: "Dr. Amara Osei", department: "Cardiology", date: "Sep 10, 2026", day: 10, month: "Sep", time: "10:30", status: "Confirmed", mode: "In-person", location: "Suite 204" },
    { id: "d2", title: "New consult — Tomas Novak", doctor: "Dr. Amara Osei", department: "Cardiology", date: "Sep 10, 2026", day: 10, month: "Sep", time: "15:30", status: "Scheduled", mode: "In-person", location: "Suite 204" },
    { id: "d3", title: "Post-op review — Elena Rodrigues", doctor: "Dr. Amara Osei", department: "Cardiology", date: "Sep 10, 2026", day: 10, month: "Sep", time: "16:45", status: "Scheduled", mode: "Video", location: "Telehealth" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greet}, Dr. Osei`}
        description="Your assigned patients, today's schedule and pending results — scoped to consented records."
        badges={
          <>
            <PermissionBadge level="CONSENTED" />
            <PermissionBadge level="AUDITED" />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Users} label="Assigned patients" value="24" hint="+2 this week" tone="indigo" index={0} />
        <StatCard icon={CalendarDays} label="Today's appointments" value="8" hint="Next at 10:30" tone="teal" index={1} />
        <StatCard icon={FileText} label="Pending reports" value="5" hint="2 older than 48 h" tone="amber" index={2} />
        <StatCard icon={AlertTriangle} label="Patient alerts" value="2" hint="1 high priority" tone="rose" index={3} />
      </div>

      <AIHeroCard description="Summarize a patient's recent history, see what changed since the last visit, or pull the relevant reports — inside consented scope." />

      {/* Patients */}
      <section aria-labelledby="patients-heading">
        <div className="mb-3 flex items-center justify-between" id="patients">
          <h2 id="patients-heading" className="font-display text-lg font-bold">Assigned patients</h2>
          <Badge variant="outline" className="text-slate-500">6 of 24 shown</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {patients.map((p, i) => (
            <PatientCard key={p.id} patient={p} index={i} />
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-indigo-500" aria-hidden />
              Today&apos;s appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {todaysAppointments.map((a, i) => (
              <AppointmentCard key={a.id} appointment={a} index={i} compact />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-500" aria-hidden />
              Pending reports
            </CardTitle>
            <Badge variant="warning">5</Badge>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { title: "CRP — Jonah Whitfield", note: "Flagged high · awaits review", tone: "border-rose-100 bg-rose-50/40" },
              { title: "Lipid re-check — Maya Chen", note: "Collected 08:15 · processing", tone: "" },
              { title: "ECG strip — Elena Rodrigues", note: "Uploaded by ward", tone: "" },
            ].map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`rounded-xl border p-3 ${r.tone}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[13px] font-semibold">{r.title}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 shrink-0 gap-1 px-2 text-[11px]"
                    onClick={() => openAI("Show relevant reports")}
                  >
                    <Sparkles className="h-3 w-3" aria-hidden />
                    Ask AI
                  </Button>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{r.note}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent patient activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={auditLogs.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
