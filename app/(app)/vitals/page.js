"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Activity, HeartPulse, Gauge, Droplet, Scale, Moon, Footprints } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionBadge } from "@/components/security/permission-badge";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getVitalSeries } from "@/lib/data";
import { cn } from "@/lib/utils";

const RANGES = ["7D", "30D", "90D", "1Y"];

const CHARTS = [
  {
    id: "bloodPressure",
    title: "Blood Pressure",
    icon: Gauge,
    unit: "mmHg",
    tone: "text-teal-600 bg-teal-50",
    stat: "118/76",
    statLabel: "latest",
    series: (range) => ({
      data: getVitalSeries("bloodPressure", range),
      series: [
        { key: "systolic", name: "Systolic", color: "#0d9488", type: "line" },
        { key: "diastolic", name: "Diastolic", color: "#38bdf8", type: "line" },
      ],
      reference: { y1: 90, y2: 120, color: "#14b8a6" },
    }),
  },
  {
    id: "glucose",
    title: "Blood Glucose",
    icon: Droplet,
    unit: "mg/dL",
    tone: "text-indigo-600 bg-indigo-50",
    stat: "94",
    statLabel: "mg/dL avg",
    series: (range) => ({
      data: getVitalSeries("glucose", range),
      series: [{ key: "value", name: "Glucose", color: "#6366f1", type: "area" }],
      reference: { y1: 70, y2: 100, color: "#6366f1" },
    }),
  },
  {
    id: "heartRate",
    title: "Heart Rate",
    icon: HeartPulse,
    unit: "bpm",
    tone: "text-rose-600 bg-rose-50",
    stat: "72",
    statLabel: "resting bpm",
    series: (range) => ({
      data: getVitalSeries("heartRate", range),
      series: [{ key: "value", name: "Heart rate", color: "#f43f5e", type: "line" }],
      reference: { y1: 60, y2: 90, color: "#f43f5e" },
    }),
  },
  {
    id: "weight",
    title: "Weight",
    icon: Scale,
    unit: "kg",
    tone: "text-amber-600 bg-amber-50",
    stat: "68.4",
    statLabel: "kg current",
    series: (range) => ({
      data: getVitalSeries("weight", range),
      series: [{ key: "value", name: "Weight", color: "#f59e0b", type: "area" }],
    }),
  },
  {
    id: "sleep",
    title: "Sleep",
    icon: Moon,
    unit: "hours",
    tone: "text-violet-600 bg-violet-50",
    stat: "7.2h",
    statLabel: "avg / night",
    series: (range) => ({
      data: getVitalSeries("sleep", range),
      series: [{ key: "value", name: "Sleep", color: "#8b5cf6", type: "bar" }],
    }),
  },
  {
    id: "activity",
    title: "Activity",
    icon: Footprints,
    unit: "steps",
    tone: "text-emerald-600 bg-emerald-50",
    stat: "8.4k",
    statLabel: "avg steps",
    series: (range) => ({
      data: getVitalSeries("activity", range),
      series: [{ key: "value", name: "Steps", color: "#10b981", type: "bar" }],
    }),
  },
];

export default function VitalsPage() {
  const [range, setRange] = React.useState("30D");

  return (
    <div>
      <PageHeader
        title="Vitals"
        description="Connected wearable and spot measurements — trends across blood pressure, glucose, heart rate, weight, sleep and activity."
        badges={
          <>
            <PermissionBadge level="PRIVATE" />
            <PermissionBadge level="CONSENTED" />
          </>
        }
      >
        <div className="inline-flex rounded-lg border bg-white p-1 shadow-sm" role="tablist" aria-label="Time range">
          {RANGES.map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={range === r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-xs font-bold transition-colors",
                range === r ? "bg-primary text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-2">
        {CHARTS.map((chart, i) => {
          const Icon = chart.icon;
          const cfg = chart.series(range);
          return (
            <motion.div
              key={`${chart.id}-${range}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <Card>
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-1">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", chart.tone)}>
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    {chart.title}
                  </CardTitle>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold leading-none">{chart.stat}</p>
                    <p className="text-[10px] text-muted-foreground">{chart.statLabel}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <TrendChart
                    data={cfg.data}
                    series={cfg.series}
                    reference={cfg.reference}
                    unit={chart.unit}
                    height={200}
                    interval={range === "90D" ? Math.ceil(cfg.data.length / 8) : "preserveStartEnd"}
                  />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center">
        <Badge variant="outline" className="gap-1.5 text-slate-500">
          <Activity className="h-3.5 w-3.5 text-teal-500" aria-hidden />
          Synced from connected wearable · last sync 25 min ago
        </Badge>
      </div>
    </div>
  );
}
