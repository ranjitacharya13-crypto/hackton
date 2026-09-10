"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionBadge } from "@/components/security/permission-badge";
import { ConsentCard } from "@/components/consent/consent-card";
import { ConsentTimeline } from "@/components/consent/consent-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/components/providers/app-provider";
import { consentTimeline } from "@/lib/data";

export default function ConsentPage() {
  const { consents } = useApp();

  return (
    <div>
      <PageHeader
        title="Who Can Access Your Health Information?"
        description="You control every scope of access. Changes apply instantly, and every grant, revoke or view is written to the audit trail."
        badges={
          <>
            <PermissionBadge level="CONSENTED" />
            <PermissionBadge level="AUDITED" />
          </>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-900"
      >
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
        <p>
          <span className="font-bold">Consent is enforced at the interface level in this demo.</span> Toggle any access
          below, then switch roles from the sidebar to see what each party can — or cannot — see. Every change is
          audited.
        </p>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {consents.map((c, i) => (
            <ConsentCard key={c.id} consent={c} index={i} />
          ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Consent timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ConsentTimeline events={consentTimeline} />
            </CardContent>
          </Card>

          <div className="rounded-2xl aurora-ink p-5 text-white shadow-soft">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-300">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              Privacy by default
            </p>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-300">
              <li className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal-400" aria-hidden />
                New parties start with no access.
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal-400" aria-hidden />
                AI answers only use records inside your scope.
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal-400" aria-hidden />
                Revocation is immediate — nothing is cached.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
