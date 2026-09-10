"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionBadge } from "@/components/security/permission-badge";
import { MedicationCard } from "@/components/dashboard/medication-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { medications } from "@/lib/data";

const MONTHS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

function monthIndex(dateStr) {
  const d = new Date(dateStr);
  const map = { Mar: 0, Apr: 1, May: 2, Jun: 3, Jul: 4, Aug: 5, Sep: 6, Oct: 7, Nov: 8 };
  return map[MONTHS[d.getMonth()]] ?? 6;
}

export default function MedicationsPage() {
  const timeline = medications.map((m) => {
    const start = monthIndex(m.start);
    const end = m.end ? monthIndex(m.end) : MONTHS.length - 1;
    return { ...m, start, end };
  });

  return (
    <div>
      <PageHeader
        title="Medications"
        description="Active prescriptions, history and adherence — the pharmacy sees this scope only when you consent."
        badges={<PermissionBadge level="CONSENTED" />}
      />

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({medications.filter((m) => m.status === "active").length})</TabsTrigger>
          <TabsTrigger value="paused">Paused ({medications.filter((m) => m.status === "paused").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({medications.filter((m) => m.status === "completed").length})</TabsTrigger>
        </TabsList>

        {["active", "paused", "completed"].map((status) => (
          <TabsContent key={status} value={status}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {medications
                .filter((m) => m.status === status)
                .map((m, i) => (
                  <MedicationCard key={m.id} medication={m} index={i} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Timeline */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Medication timeline · 2026</CardTitle>
          <p className="text-xs text-muted-foreground">When each medication was active across the year.</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto scrollbar-thin">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-[140px_1fr] gap-3">
                <span />
                <div className="grid grid-cols-9 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {MONTHS.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
              <div className="mt-2 space-y-2">
                {timeline.map((m, i) => {
                  const total = MONTHS.length;
                  const left = (m.start / total) * 100;
                  const width = Math.max(((m.end - m.start + 1) / total) * 100, 6);
                  const tone =
                    m.status === "active"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-500"
                      : m.status === "paused"
                        ? "bg-gradient-to-r from-amber-400 to-amber-500"
                        : "bg-slate-300";
                  return (
                    <div key={m.id} className="grid grid-cols-[140px_1fr] items-center gap-3">
                      <span className="truncate text-xs font-semibold text-slate-600">
                        {m.name} {m.dosage}
                      </span>
                      <div className="relative h-6 rounded-lg bg-slate-100/80">
                        {Array.from({ length: 8 }).map((_, gi) => (
                          <span
                            key={gi}
                            className="absolute inset-y-0 w-px bg-white"
                            style={{ left: `${((gi + 1) / 9) * 100}%` }}
                            aria-hidden
                          />
                        ))}
                        <motion.span
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: `${width}%`, opacity: 1 }}
                          transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                          className={`absolute top-1 h-4 rounded-md shadow-sm ${tone}`}
                          style={{ left: `${left}%` }}
                          role="img"
                          aria-label={`${m.name} from ${m.start} to ${m.end}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
