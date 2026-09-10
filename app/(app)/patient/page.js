"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, ChevronRight, Pill, CalendarDays, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionBadge } from "@/components/security/permission-badge";
import { SecurityIndicator } from "@/components/security/security-indicator";
import { HealthMetricCard } from "@/components/dashboard/health-metric-card";
import { AIHeroCard } from "@/components/ai/ai-hero-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { AppointmentCard } from "@/components/dashboard/appointment-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/components/providers/app-provider";
import { healthMetrics, getVitalSeries, reports, medications, appointments, RECORD_TYPE_META } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useGreeting } from "@/lib/use-greeting";

export default function PatientDashboard() {
  const { auditLogs, openAI } = useApp();
  const greet = useGreeting();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greet}, Maya`}
        description="Here is your connected health picture for today — records, vitals and insights in one place."
        badges={
          <>
            <SecurityIndicator label="All views consented & audited" />
            <PermissionBadge level="PRIVATE" />
          </>
        }
      />

      {/* Health metric cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {healthMetrics.map((m, i) => (
          <HealthMetricCard key={m.id} metric={m} index={i} />
        ))}
      </div>

      {/* AI hero */}
      <AIHeroCard description="Ask questions about your authorized health records. Answers show their sources, consent scope and how they were generated." />

      {/* Charts + appointment */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Vital trends</CardTitle>
              <Badge variant="outline" className="text-slate-500">Last 30 days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bp">
              <TabsList className="mb-2 flex w-full sm:w-auto">
                <TabsTrigger value="bp" className="flex-1 sm:flex-none">Blood Pressure</TabsTrigger>
                <TabsTrigger value="glucose" className="flex-1 sm:flex-none">Glucose</TabsTrigger>
                <TabsTrigger value="hr" className="flex-1 sm:flex-none">Heart Rate</TabsTrigger>
                <TabsTrigger value="weight" className="flex-1 sm:flex-none">Weight</TabsTrigger>
              </TabsList>
              <TabsContent value="bp">
                <TrendChart
                  data={getVitalSeries("bloodPressure", "30D")}
                  series={[
                    { key: "systolic", name: "Systolic", color: "#0d9488", type: "line" },
                    { key: "diastolic", name: "Diastolic", color: "#38bdf8", type: "line" },
                  ]}
                  unit="mmHg"
                  reference={{ y1: 90, y2: 120, color: "#14b8a6" }}
                />
              </TabsContent>
              <TabsContent value="glucose">
                <TrendChart
                  data={getVitalSeries("glucose", "30D")}
                  series={[{ key: "value", name: "Glucose", color: "#6366f1", type: "area" }]}
                  unit="mg/dL"
                  reference={{ y1: 70, y2: 100, color: "#6366f1" }}
                />
              </TabsContent>
              <TabsContent value="hr">
                <TrendChart
                  data={getVitalSeries("heartRate", "30D")}
                  series={[{ key: "value", name: "Heart rate", color: "#f43f5e", type: "line" }]}
                  unit="bpm"
                  reference={{ y1: 60, y2: 90, color: "#f43f5e" }}
                />
              </TabsContent>
              <TabsContent value="weight">
                <TrendChart
                  data={getVitalSeries("weight", "30D")}
                  series={[{ key: "value", name: "Weight", color: "#f59e0b", type: "area" }]}
                  unit="kg"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
                Upcoming appointment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointments.slice(0, 2).map((a, i) => (
                <AppointmentCard key={a.id} appointment={a} index={i} compact />
              ))}
              <Link
                href="/appointments"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                View all appointments
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reports / meds / activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" aria-hidden />
              Recent reports
            </CardTitle>
            <Link href="/reports" className="text-xs font-bold text-primary hover:underline">
              See all
            </Link>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {reports.slice(0, 3).map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <Link
                  href={`/reports/${r.id}`}
                  className="group flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-primary/30 hover:bg-teal-50/40"
                >
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border", RECORD_TYPE_META[r.id === "r1" ? "lab" : "report"].color)}>
                    <FileText className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">{r.title}</span>
                    <span className="block text-[11px] text-muted-foreground">{r.date} · {r.provider}</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openAI(`Summarize my latest report`);
                    }}
                    aria-label={`Ask AI about ${r.title}`}
                    className="rounded-lg border border-indigo-100 bg-indigo-50 p-2 text-indigo-600 opacity-90 transition-colors hover:bg-indigo-100"
                  >
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </Link>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-4 w-4 text-amber-500" aria-hidden />
              Medication overview
            </CardTitle>
            <Link href="/medications" className="text-xs font-bold text-primary hover:underline">
              See all
            </Link>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {medications.filter((m) => m.status === "active").map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="rounded-xl border p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold">{m.name} {m.dosage}</p>
                  <Badge variant="success" className="text-[9px]">{m.adherence}%</Badge>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{m.frequency} · refill {m.refill}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100" aria-hidden>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.adherence}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                  />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle>Recent activity</CardTitle>
            <Link href="/audit" className="text-xs font-bold text-primary hover:underline">
              Audit log
            </Link>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={auditLogs.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
