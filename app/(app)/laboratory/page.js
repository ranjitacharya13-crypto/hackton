"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FlaskConical, FileCheck2, ShieldAlert, Timer, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionBadge } from "@/components/security/permission-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { AIHeroCard } from "@/components/ai/ai-hero-card";
import { UploadDropzone } from "@/components/records/upload-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/components/providers/app-provider";
import { labQueue, labResults } from "@/lib/data";
import { useGreeting } from "@/lib/use-greeting";

export default function LaboratoryDashboard() {
  const { pushToast, addAudit } = useApp();
  const greet = useGreeting();
  const [verified, setVerified] = React.useState({});
  const [queue, setQueue] = React.useState(labQueue);

  const verify = (r) => {
    setVerified((prev) => ({ ...prev, [r.id]: true }));
    pushToast({ kind: "success", title: "Report verified", body: `${r.test} — ${r.patient} released to the record.` });
    addAudit({
      role: "laboratory",
      actor: "Sara Kim",
      action: "verified",
      resource: `${r.test} — ${r.patient}`,
      category: "update",
    });
  };

  const startProcessing = (id) => {
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: "Processing" } : q)));
    pushToast({ kind: "info", title: "Sample moved to processing", body: "Instrument queue updated (demo)." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greet}, Sara`}
        description="Sample queue, report processing and verification at CityLab Diagnostics."
        badges={
          <>
            <PermissionBadge level="CONSENTED" />
            <PermissionBadge level="AUDITED" />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Timer} label="Pending tests" value={String(queue.filter((q) => q.status === "Pending").length)} hint="2 urgent" tone="violet" index={0} />
        <StatCard icon={FlaskConical} label="In processing" value={String(queue.filter((q) => q.status === "Processing").length)} hint="Avg TAT 42 min" tone="indigo" index={1} />
        <StatCard icon={FileCheck2} label="Verified today" value="12" hint="+3 vs yesterday" tone="emerald" index={2} />
        <StatCard icon={ShieldAlert} label="Flagged results" value="1" hint="CRP above range" tone="rose" index={3} />
      </div>

      <AIHeroCard description="Ask Diagnostic Intelligence about recent report changes, verification queues or flagged results." />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Upload + processing simulation */}
        <Card>
          <CardHeader>
            <CardTitle>Process a new report</CardTitle>
            <p className="text-xs text-muted-foreground">
              Simulated pipeline: Uploading → Reading → Extracting → Ready. Frontend only.
            </p>
          </CardHeader>
          <CardContent>
            <UploadDropzone />
          </CardContent>
        </Card>

        {/* Pending tests */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-violet-500" aria-hidden />
              Pending tests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {queue.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between gap-3 rounded-xl border p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold">{q.test}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {q.patient} · collected {q.collected}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={q.priority === "urgent" ? "danger" : "slate"} className="text-[9px]">
                    {q.priority.toUpperCase()}
                  </Badge>
                  {q.status === "Pending" ? (
                    <Button size="sm" variant="outline" className="h-7 px-2.5 text-[11px]" onClick={() => startProcessing(q.id)}>
                      Process
                    </Button>
                  ) : (
                    <Badge variant="violet" className="text-[9px]">PROCESSING</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent results */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="pb-2 pr-4 font-semibold">Test</th>
                  <th className="pb-2 pr-4 font-semibold">Patient</th>
                  <th className="pb-2 pr-4 font-semibold">Value</th>
                  <th className="pb-2 pr-4 font-semibold">Flag</th>
                  <th className="pb-2 font-semibold text-right">Verification</th>
                </tr>
              </thead>
              <tbody>
                {labResults.map((r) => {
                  const isVerified = verified[r.id] || r.verified;
                  return (
                    <tr key={r.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 pr-4 font-semibold">{r.test}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{r.patient}</td>
                      <td className="py-3 pr-4 font-medium tabular-nums">{r.value}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={r.flag === "Normal" ? "success" : "danger"}>{r.flag}</Badge>
                      </td>
                      <td className="py-3 text-right">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" aria-hidden />
                            Verified
                          </span>
                        ) : (
                          <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => verify(r)}>
                            Verify now
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
