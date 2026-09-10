"use client";

import { motion } from "framer-motion";
import { Sparkles, Network, BrainCircuit, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionBadge } from "@/components/security/permission-badge";
import { AIOrb } from "@/components/ai/ai-message";
import { RAGFlow } from "@/components/ai/rag-flow";
import { HRMVisualization } from "@/components/ai/hrm-visualization";
import { AIPipeline } from "@/components/ai/ai-pipeline";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/components/providers/app-provider";
import { getMockResponse } from "@/lib/ai-engine";

export default function AssistantPage() {
  const { roleConfig, openAI } = useApp();
  const demo = getMockResponse(roleConfig.id, "What changed recently?");

  return (
    <div className="space-y-6">
      <PageHeader
        title={roleConfig.ai.title}
        description="The intelligence layer of Lumina Health — grounded in authorized records, scoped by consent, and explained at every step."
        badges={
          <>
            <PermissionBadge level="AUTHORIZED" />
            <PermissionBadge level="CONSENTED" />
            <PermissionBadge level="AUDITED" />
          </>
        }
      >
        <Button onClick={() => openAI()} className="gap-2 aurora-ink text-white hover:opacity-95">
          <Sparkles className="h-4 w-4 text-teal-200" aria-hidden />
          Open {roleConfig.ai.panelTitle}
        </Button>
      </PageHeader>

      {/* Intro card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl aurora-ink p-6 text-white shadow-lift sm:p-8"
      >
        <div className="grid-fade-dark pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <AIOrb size="lg" className="animate-float" />
            <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight">
              From fragmented records to one trusted answer.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              When you ask a question, the platform checks consent, retrieves only the relevant authorized records
              (RAG), reasons over them hierarchically (HRM), and composes an insight shaped for your role. Below is the
              conceptual walkthrough — the live panel runs the full experience.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {roleConfig.ai.suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => openAI(s)}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-200"
                >
                  {s}
                  <ArrowRight className="h-3 w-3 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-300" aria-hidden />
                </button>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <AIPipeline pipeline={demo.pipeline} tone="dark" />
          </div>
        </div>
      </motion.div>

      {/* RAG + HRM */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-4 w-4 text-indigo-500" aria-hidden />
              Retrieval-Augmented Generation
            </CardTitle>
            <CardDescription>
              A visual explanation of RAG: relevant authorized records are retrieved and assembled into context before
              any answer is written. Relevance scores are illustrative.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RAGFlow sources={demo.sources} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-indigo-500" aria-hidden />
              Hierarchical Reasoning
            </CardTitle>
            <CardDescription>
              The conceptual shape of HRM reasoning — from high-level context to a focused result. Hidden model
              reasoning and chain-of-thought are never displayed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HRMVisualization />
          </CardContent>
        </Card>
      </div>

      {/* Sample answer */}
      <Card>
        <CardHeader>
          <CardTitle>Example · “{roleConfig.ai.suggestions[0]}”</CardTitle>
          <CardDescription>What a complete answer looks like: main answer, sources, context and a safety note.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3 rounded-xl border bg-slate-50/50 p-4">
            <p className="text-sm leading-relaxed text-slate-700">{demo.answer}</p>
            <div className="rounded-lg bg-indigo-50/70 px-3 py-2.5 text-xs leading-relaxed text-indigo-900/80">
              <span className="font-semibold">Context · </span>
              {demo.context}
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-900/90">
              <span className="font-semibold">Safety note · </span>
              {demo.safety}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sources used</p>
            {demo.sources.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border bg-white p-3 shadow-soft"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{s.label}</span>
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700">
                    {s.relevance}%
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{s.date}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100" aria-hidden>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.relevance}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-indigo-500"
                  />
                </div>
              </motion.div>
            ))}
            <Button onClick={() => openAI(roleConfig.ai.suggestions[0])} variant="outline" className="w-full gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" aria-hidden />
              Try it live
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
