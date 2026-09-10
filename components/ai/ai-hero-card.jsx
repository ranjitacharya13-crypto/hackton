"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { AIOrb } from "@/components/ai/ai-message";

/**
 * The large dashboard card that launches the role-aware AI panel.
 */
export function AIHeroCard({ description = "Ask questions about your authorized health records." }) {
  const { roleConfig, openAI } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl aurora-ink p-6 text-white shadow-lift sm:p-7"
    >
      <div className="grid-fade-dark pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-400/10 blur-3xl" aria-hidden />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex items-start gap-4 lg:flex-1">
          <AIOrb size="lg" className="mt-1 animate-float" />
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Health Intelligence
            </p>
            <h2 className="mt-1.5 font-display text-xl font-bold leading-tight sm:text-2xl">
              {roleConfig.ai.title}
            </h2>
            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-300">{description}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
              Answers are scoped by consent and recorded in the audit log
            </p>
          </div>
        </div>

        <div className="shrink-0 space-y-2 lg:w-[300px]">
          {roleConfig.ai.suggestions.slice(0, 3).map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              onClick={() => openAI(s)}
              className="group flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-left text-[13px] font-medium text-slate-100 backdrop-blur-sm transition-all hover:border-teal-400/40 hover:bg-teal-400/10"
            >
              <span className="min-w-0 truncate">{s}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-500 transition-all group-hover:translate-x-0.5 group-hover:text-teal-300" aria-hidden />
            </motion.button>
          ))}
          <button
            onClick={() => openAI()}
            className="w-full rounded-xl bg-gradient-to-r from-teal-400 to-indigo-500 px-4 py-2.5 text-sm font-bold text-ink-950 shadow-sm transition-transform hover:scale-[1.015] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
          >
            Open {roleConfig.ai.panelTitle}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
