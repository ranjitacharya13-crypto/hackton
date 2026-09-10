"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck, KeyRound, ShieldAlert, Check, X } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionBadge } from "@/components/security/permission-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { AIHeroCard } from "@/components/ai/ai-hero-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { RoleBadge } from "@/components/security/role-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/components/providers/app-provider";
import { adminUsers, accessRequests as initialRequests, securityEvents, genAdminSeries, genRoleDistribution } from "@/lib/data";
import { useGreeting } from "@/lib/use-greeting";

export default function AdminDashboard() {
  const { pushToast, addAudit } = useApp();
  const greet = useGreeting();
  const [requests, setRequests] = React.useState(initialRequests);
  const weekly = genAdminSeries();
  const roles = genRoleDistribution();
  const maxRole = Math.max(...roles.map((r) => r.value));

  const decide = (id, approve) => {
    const req = requests.find((r) => r.id === id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
    pushToast({
      kind: approve ? "success" : "warning",
      title: approve ? "Access granted" : "Access denied",
      body: `${req?.requester} · ${req?.resource}`,
    });
    addAudit({
      role: "admin",
      actor: "Priya Nair",
      action: approve ? "approved access request" : "denied access request",
      resource: req?.resource || "Access queue",
      category: "consent",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greet}, Priya`}
        description="Platform governance — users, roles, access requests and security posture."
        badges={
          <>
            <PermissionBadge level="AUDITED" />
            <PermissionBadge level="ENCRYPTED" />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Users} label="Total users" value="1,588" hint="+38 this week" tone="rose" index={0} />
        <StatCard icon={ShieldCheck} label="Active roles" value="5" hint="All policies current" tone="teal" index={1} />
        <StatCard icon={KeyRound} label="Access requests" value={String(requests.length)} hint="Pending review" tone="amber" index={2} />
        <StatCard icon={ShieldAlert} label="Security events · 7d" value="12" hint="1 high severity" tone="indigo" index={3} />
      </div>

      <AIHeroCard description="Ask System Intelligence about recent activity, unusual access patterns or pending requests — always anonymized." />

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Sign-ins & access requests · this week</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={weekly}
              xKey="day"
              series={[
                { key: "signins", name: "Sign-ins", color: "#0d9488", type: "bar" },
                { key: "requests", name: "Access requests", color: "#6366f1", type: "line" },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Users by role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {roles.map((r, i) => (
              <motion.div key={r.role} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">{r.role}</span>
                  <span className="font-bold tabular-nums">{r.value.toLocaleString()}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.value / maxRole) * 100}%` }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: r.color, opacity: 0.9 }}
                    aria-hidden
                  />
                </div>
              </motion.div>
            ))}
            <p className="pt-1 text-[11px] text-muted-foreground">Distribution across the demo tenant.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Access requests */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-amber-500" aria-hidden />
              Access requests
              <Badge variant="warning" className="ml-auto">{requests.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {requests.length === 0 && (
              <p className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">
                Queue clear — no pending requests. 🎉
              </p>
            )}
            {requests.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border p-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-bold">{r.requester}</p>
                  <RoleBadge role={r.role === "research" ? "admin" : r.role} showIcon={false} className="px-2 py-0 text-[9px]" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.resource}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {r.reason} · {r.requested}
                </p>
                {r.risk === "denied-by-consent" && (
                  <Badge variant="danger" className="mt-2 text-[9px]">BLOCKED BY PATIENT CONSENT</Badge>
                )}
                {r.risk === "restricted" && (
                  <Badge variant="warning" className="mt-2 text-[9px]">RESTRICTED RECORD</Badge>
                )}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button size="sm" className="h-7 gap-1 text-[11px]" onClick={() => decide(r.id, true)}>
                    <Check className="h-3 w-3" aria-hidden />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 gap-1 text-[11px] text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => decide(r.id, false)}>
                    <X className="h-3 w-3" aria-hidden />
                    Deny
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Security events */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-500" aria-hidden />
              Security events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {securityEvents.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 rounded-xl border p-3"
              >
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    e.severity === "high" ? "bg-rose-50 text-rose-500" : e.severity === "medium" ? "bg-amber-50 text-amber-500" : "bg-sky-50 text-sky-500"
                  }`}
                >
                  <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-snug">{e.event}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{e.actor} · {e.time}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Users */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {adminUsers.map((u, i) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-xl border p-2.5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-slate-600">
                  {u.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{u.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{u.email}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <RoleBadge role={u.role} showIcon={false} className="px-1.5 py-0 text-[8px]" />
                  <span className="text-[9px] text-slate-400">{u.lastActive}</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
