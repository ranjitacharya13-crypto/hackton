"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { PermissionBadge } from "@/components/security/permission-badge";
import { useApp } from "@/components/providers/app-provider";
import { ROLE_IDS, getRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { setRole } = useApp();

  const choose = (id) => {
    setRole(id);
    router.push(getRole(id).route);
  };

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Back to home" className="rounded-md">
            <BrandLogo />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] px-4 py-12 sm:px-6 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-2xl text-center"
        >
          <PermissionBadge level="ROLE RESTRICTED" className="mb-4" />
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Who is signing in today?
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            The platform adapts its dashboard, records and AI assistant to each role — with consent and audit built in.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROLE_IDS.map((id, i) => {
            const r = getRole(id);
            const Icon = r.icon;
            return (
              <motion.button
                key={id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.4 }}
                whileHover={{ y: -5 }}
                onClick={() => choose(id)}
                aria-label={`Continue as ${r.label}`}
                className="group relative overflow-hidden rounded-2xl border bg-white p-5 text-left shadow-soft transition-shadow hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div
                  className={cn(
                    "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20",
                    r.accent.dot
                  )}
                  aria-hidden
                />
                <div className="flex items-center justify-between">
                  <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm", r.accent.dot)}>
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" aria-hidden />
                    Consented scope
                  </span>
                </div>
                <h2 className="mt-4 font-display text-lg font-bold">{r.label}</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.subtitle}</p>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600">
                  <Sparkles className="h-3 w-3" aria-hidden />
                  {r.ai.title}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  Continue as {r.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </motion.button>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          This is a frontend demonstration. Roles can be switched at any time from the sidebar.
        </p>
      </main>
    </div>
  );
}
