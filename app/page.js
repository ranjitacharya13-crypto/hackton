"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  ScanEye,
  Database,
  Filter,
  Network,
  BrainCircuit,
  Lightbulb,
  FolderHeart,
  Stethoscope,
  ClipboardList,
  FlaskConical,
  Pill,
  Users,
  Sparkles,
  Lock,
} from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PermissionBadge } from "@/components/security/permission-badge";
import { SecurityIndicator } from "@/components/security/security-indicator";
import { HealthIntelligenceCore } from "@/components/three/health-intelligence-core";
import { ROLE_IDS, getRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

const WORKFLOW = [
  {
    id: "data",
    label: "Health Data",
    icon: Database,
    title: "Fragmented data, unified",
    text: "Records, lab results, medications, vitals and appointments usually live in different portals, papers and apps. Lumina connects them into one consented experience.",
  },
  {
    id: "permission",
    label: "Permission Check",
    icon: ShieldCheck,
    title: "Consent comes first",
    text: "Before anything is retrieved, the request passes role and consent checks. If a party has no access, nothing is shown — and the attempt is audited.",
  },
  {
    id: "records",
    label: "Relevant Records",
    icon: Filter,
    title: "Only what's needed",
    text: "The system selects the smallest set of authorized records likely to answer the question — nothing more is ever pulled into context.",
  },
  {
    id: "rag",
    label: "RAG",
    icon: Network,
    title: "Retrieval-Augmented Generation",
    text: "Retrieves the relevant information from the available records. Every answer is grounded in sources you can inspect, with relevance shown openly.",
  },
  {
    id: "hrm",
    label: "HRM",
    icon: BrainCircuit,
    title: "Hierarchical Reasoning Model",
    text: "Provides the reasoning layer for the retrieved information — moving from high-level context to a focused, role-appropriate result.",
  },
  {
    id: "insight",
    label: "AI Insight",
    icon: Lightbulb,
    title: "Role-specific insight",
    text: "The final answer is shaped for the viewer — personal for patients, clinical for doctors, medication-scoped for pharmacists. Informational, never diagnostic.",
  },
];

export default function LandingPage() {
  const [activeStep, setActiveStep] = React.useState(3);

  return (
    <div className="min-h-dvh bg-background">
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="grid-fade pointer-events-none absolute inset-0" aria-hidden />
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-24 lg:pt-20">
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <SecurityIndicator label="Consent-scoped · Role-aware · Fully audited" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[56px]"
            >
              Your Health Data,{" "}
              <span className="bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
                Connected.
              </span>
              <br />
              Your Intelligence,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent">
                Personalized.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Bring your health records, reports, medications, vitals and appointments together in one secure
              experience.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" className="rounded-xl">
                <Link href="/roles">
                  Explore Platform
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-9 flex flex-wrap items-center gap-2"
              aria-label="Data sources connected by the platform"
            >
              {["Medical Records", "Lab Reports", "Medications", "Vitals", "Appointments"].map((label, i) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.08 }}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-teal-500 to-indigo-500" aria-hidden />
                  {label}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* 3D Health Intelligence Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-3xl aurora-ink shadow-panel lg:max-w-[520px]"
          >
            <div className="grid-fade-dark pointer-events-none absolute inset-0" aria-hidden />
            <HealthIntelligenceCore className="absolute inset-0" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
              <div className="rounded-xl border border-white/10 bg-ink-900/70 px-3 py-2 backdrop-blur-md">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-300">
                  <Sparkles className="h-3 w-3" aria-hidden />
                  Health Intelligence Core
                </p>
                <p className="mt-0.5 text-[11px] text-slate-300">Fragmented data → connected intelligence</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* METRICS STRIP */}
      <section className="border-y bg-white">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
          {[
            { value: "5+", label: "Connected data sources" },
            { value: "6", label: "Role-aware workspaces" },
            { value: "100%", label: "Access events audited" },
            { value: "RAG + HRM", label: "Intelligence pipeline" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="text-center lg:text-left"
            >
              <p className="font-display text-2xl font-extrabold tracking-tight text-foreground">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* INNOVATION WORKFLOW */}
      <section id="how-it-works" className="relative overflow-hidden py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4 border-indigo-200 bg-indigo-50 text-indigo-700">
              <Network className="h-3 w-3" aria-hidden />
              CONCEPTUAL PIPELINE
            </Badge>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              From Health Data to{" "}
              <span className="bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
                Health Intelligence
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Click each stage to explore how fragmented information becomes a role-specific, consented insight.
            </p>
          </div>

          {/* Step rail */}
          <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0" role="tablist" aria-label="Intelligence pipeline stages">
            {WORKFLOW.map((step, i) => {
              const Icon = step.icon;
              const active = activeStep === i;
              return (
                <React.Fragment key={step.id}>
                  <button
                    role="tab"
                    aria-selected={active}
                    aria-controls="workflow-detail"
                    onClick={() => setActiveStep(i)}
                    className={cn(
                      "group relative flex flex-col items-center gap-2.5 rounded-xl px-2 py-4 text-center transition-all lg:rounded-none lg:bg-transparent",
                      active ? "bg-white shadow-lift ring-1 ring-primary/15 lg:shadow-none lg:ring-0" : "hover:bg-white/70"
                    )}
                  >
                    <motion.span
                      animate={active ? { scale: 1.08 } : { scale: 1 }}
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors",
                        active
                          ? "border-primary/30 bg-gradient-to-br from-teal-500 to-indigo-500 text-white shadow-glow"
                          : "border-slate-200 bg-white text-slate-400 group-hover:text-slate-600"
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </motion.span>
                    <span className={cn("text-xs font-bold leading-tight", active ? "text-foreground" : "text-muted-foreground")}>
                      {step.label}
                    </span>
                    {i < WORKFLOW.length - 1 && (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute -right-2.5 top-9 hidden text-lg lg:block",
                          active ? "text-primary" : "text-slate-300"
                        )}
                      >
                        →
                      </span>
                    )}
                    {i === 2 && (
                      <span aria-hidden className="absolute -bottom-1 left-1/2 hidden -translate-x-1/2 text-lg text-slate-300 sm:block lg:hidden">
                        ↓
                      </span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* Detail panel */}
          <div id="workflow-detail" role="tabpanel" className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mx-auto grid max-w-4xl items-center gap-6 rounded-2xl border bg-white p-6 shadow-soft sm:p-8 lg:grid-cols-[auto_1fr_auto]"
              >
                <span className="hidden h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-500 text-white shadow-glow sm:flex">
                  {React.createElement(WORKFLOW[activeStep].icon, { className: "h-7 w-7", "aria-hidden": true })}
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                    Stage {activeStep + 1} of {WORKFLOW.length}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold">{WORKFLOW[activeStep].title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{WORKFLOW[activeStep].text}</p>
                </div>
                <div className="flex gap-2 lg:flex-col">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveStep((v) => Math.max(0, v - 1))}
                    disabled={activeStep === 0}
                    aria-label="Previous stage"
                  >
                    ←
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveStep((v) => Math.min(WORKFLOW.length - 1, v + 1))}
                    disabled={activeStep === WORKFLOW.length - 1}
                    aria-label="Next stage"
                  >
                    →
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ROLE-BASED SYSTEM */}
      <section className="border-y bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4 border-teal-200 bg-teal-50 text-teal-700">
              <Users className="h-3 w-3" aria-hidden />
              ROLE-BASED ACCESS
            </Badge>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              One platform. <span className="text-primary">Six perspectives.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              The interface, the data and the AI all adapt to who is asking — patient, clinician or administrator.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROLE_IDS.map((id, i) => {
              const r = getRole(id);
              const Icon = r.icon;
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border bg-background p-5 shadow-soft transition-shadow hover:shadow-lift"
                >
                  <div className="flex items-center justify-between">
                    <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl text-white", r.accent.dot)}>
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <PermissionBadge level={id === "patient" ? "PRIVATE" : "ROLE RESTRICTED"} />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold">{r.label}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.subtitle}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-[11px] font-semibold text-slate-600">
                    <Sparkles className="h-3 w-3 text-indigo-500" aria-hidden />
                    {r.ai.title}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Button asChild size="lg" className="rounded-xl">
              <Link href="/roles">
                Choose a role to explore
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <Badge variant="outline" className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-700">
              <Lock className="h-3 w-3" aria-hidden />
              PRIVACY BY DESIGN
            </Badge>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Consent is the interface.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              You decide who sees what — doctors, pharmacies, laboratories or research. Every grant, revoke and view is
              timestamped in an audit trail you can read.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                { icon: HeartHandshake, text: "Granular consent: full, limited or no access per party" },
                { icon: ScanEye, text: "Every access event is recorded and reviewable" },
                { icon: ShieldCheck, text: "AI answers only from records inside the consent scope" },
              ].map((f, i) => (
                <motion.li
                  key={f.text}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 text-sm font-medium text-slate-700"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <f.icon className="h-4 w-4" aria-hidden />
                  </span>
                  {f.text}
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border bg-white p-6 shadow-lift"
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-sm font-bold">Who can access your health information?</p>
              <PermissionBadge level="CONSENTED" />
            </div>
            <div className="mt-4 space-y-2.5">
              {[
                { who: "Dr. Amara Osei · Doctor", state: "Access granted", on: true, tone: "text-emerald-600" },
                { who: "Lumina Pharmacy", state: "Medication only", on: true, tone: "text-teal-600" },
                { who: "CityLab Diagnostics", state: "Reports only", on: true, tone: "text-teal-600" },
                { who: "Research programs", state: "No access", on: false, tone: "text-slate-400" },
              ].map((row) => (
                <div key={row.who} className="flex items-center justify-between rounded-xl border px-3.5 py-3">
                  <div>
                    <p className="text-[13px] font-semibold">{row.who}</p>
                    <p className={cn("text-[11px] font-medium", row.tone)}>{row.state}</p>
                  </div>
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-6 w-11 items-center rounded-full p-0.5 transition-colors",
                      row.on ? "justify-end bg-primary" : "justify-start bg-slate-200"
                    )}
                  >
                    <span className="h-5 w-5 rounded-full bg-white shadow" />
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ScanEye className="h-3.5 w-3.5" aria-hidden />
                14 access events logged this week
              </span>
              <Link href="/login" className="font-semibold text-primary hover:underline">
                View audit trail →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl aurora-ink px-6 py-14 text-center text-white shadow-panel sm:px-12">
            <div className="grid-fade-dark pointer-events-none absolute inset-0" aria-hidden />
            <FolderHeart className="mx-auto h-10 w-10 text-teal-300" aria-hidden />
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              See the whole demo in two minutes.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              Explore the patient space, ask the AI what changed, grant consent, then switch to the doctor view — all on
              mock data.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-xl bg-white text-ink-900 hover:bg-slate-100">
                <Link href="/roles">
                  Explore Platform
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl border-white/25 bg-transparent text-white hover:bg-white/10">
                <Link href="/login">Sign in to the demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

function LandingNav() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-all",
        scrolled ? "border-slate-200/80 bg-white/85 backdrop-blur-md" : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Lumina Health home">
          <BrandLogo />
        </Link>
        <nav aria-label="Landing navigation" className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
          <Link href="/roles" className="transition-colors hover:text-foreground">Roles</Link>
          <Link href="/login" className="transition-colors hover:text-foreground">Security</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/roles">
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <BrandLogo />
        <p className="text-center text-xs text-muted-foreground">
          Frontend prototype with mock data · AI responses are conceptual and not medical advice.
        </p>
        <div className="flex items-center gap-2">
          <PermissionBadge level="ENCRYPTED" />
          <PermissionBadge level="AUDITED" />
        </div>
      </div>
    </footer>
  );
}
