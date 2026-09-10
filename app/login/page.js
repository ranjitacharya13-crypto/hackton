"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Fingerprint, KeyRound, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PermissionBadge } from "@/components/security/permission-badge";
import { HealthIntelligenceCore } from "@/components/three/health-intelligence-core";
import { useApp } from "@/components/providers/app-provider";

export default function LoginPage() {
  const router = useRouter();
  const { pushToast } = useApp();
  const [email, setEmail] = React.useState("maya.chen@example.com");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      pushToast({ kind: "success", title: "Signed in", body: "Welcome back — this demo accepts any credentials." });
      router.push("/roles");
    }, 900);
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      {/* Left: brand + form */}
      <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-16">
        <Link href="/" aria-label="Back to home" className="w-fit rounded-md">
          <BrandLogo />
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your personal health space. Every session is consent-scoped and audited.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button type="button" className="text-xs font-semibold text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-xl" disabled={loading}>
                {loading ? "Verifying…" : "Continue"}
                {!loading && <ArrowRight className="h-4 w-4" aria-hidden />}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              <span className="h-px flex-1 bg-border" aria-hidden />
              or continue with
              <span className="h-px flex-1 bg-border" aria-hidden />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-11 rounded-xl" onClick={submit} type="button">
                <Fingerprint className="h-4 w-4 text-teal-600" aria-hidden />
                Passkey
              </Button>
              <Button variant="outline" className="h-11 rounded-xl" onClick={submit} type="button">
                <KeyRound className="h-4 w-4 text-indigo-600" aria-hidden />
                Hospital SSO
              </Button>
            </div>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
              Demo prototype — any credentials will work. No real data is processed.
            </p>
          </motion.div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          New here?{" "}
          <Link href="/roles" className="font-semibold text-primary hover:underline">
            Explore the platform first
          </Link>
        </p>
      </div>

      {/* Right: 3D visual */}
      <div className="relative hidden overflow-hidden aurora-ink lg:block">
        <div className="grid-fade-dark absolute inset-0" aria-hidden />
        <HealthIntelligenceCore className="absolute inset-0" showLabels />
        <div className="absolute inset-x-0 bottom-0 p-10">
          <div className="max-w-md rounded-2xl border border-white/10 bg-ink-900/70 p-5 backdrop-blur-md">
            <p className="font-display text-lg font-bold text-white">One identity. Every role protected.</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
              Patients, clinicians, laboratories, pharmacies and administrators each get a workspace limited to what
              consent allows.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <PermissionBadge level="AUTHORIZED" className="border-white/15 bg-white/5 text-teal-200" />
              <PermissionBadge level="CONSENTED" className="border-white/15 bg-white/5 text-teal-200" />
              <PermissionBadge level="AUDITED" className="border-white/15 bg-white/5 text-indigo-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
