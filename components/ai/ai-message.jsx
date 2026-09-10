"use client";

import { motion } from "framer-motion";
import { Sparkles, Info } from "lucide-react";
import { AISourceCard } from "@/components/ai/ai-source-card";
import { PipelineDisclosure } from "@/components/ai/ai-pipeline";

export function AIOrb({ size = "md", className = "" }) {
  const sizes = { sm: "h-6 w-6", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <span className={`relative inline-flex shrink-0 ${sizes[size]} ${className}`} aria-hidden>
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 via-indigo-400 to-indigo-600 opacity-90" />
      <span className="absolute inset-[3px] rounded-full bg-gradient-to-br from-ink-800 to-ink-950" />
      <span className="absolute inset-0 flex items-center justify-center">
        <Sparkles className="h-3.5 w-3.5 text-teal-300" />
      </span>
    </span>
  );
}

export function AIMessage({ message, roleConfig, tone = "light" }) {
  const light = tone === "light";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2.5">
        <AIOrb size="sm" />
        <span className={`text-xs font-bold ${light ? "text-foreground" : "text-white"}`}>
          {roleConfig.ai.panelTitle}
        </span>
        <span className={`text-[10px] ${light ? "text-slate-400" : "text-slate-500"}`}>{message.time}</span>
      </div>

      {/* Main answer */}
      <p className={`text-sm leading-relaxed ${light ? "text-slate-700" : "text-slate-200"}`}>{message.text}</p>

      {/* Records used */}
      {message.sources?.length > 0 && (
        <div className={`rounded-xl border p-3 ${light ? "border-slate-200 bg-slate-50/60" : "border-white/10 bg-white/[0.03]"}`}>
          <div className="mb-2 flex items-center justify-between">
            <p className={`text-[11px] font-bold uppercase tracking-wider ${light ? "text-slate-500" : "text-slate-400"}`}>
              Sources used · {message.recordsUsed ?? message.sources.length}
            </p>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${light ? "bg-emerald-50 text-emerald-700" : "bg-emerald-400/10 text-emerald-300"}`}>
              <span className="h-1 w-1 rounded-full bg-emerald-500" aria-hidden />
              CONSENTED SCOPE
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {message.sources.map((s, i) => (
              <AISourceCard key={s.label} source={s} index={i} tone={tone} />
            ))}
          </div>
        </div>
      )}

      {/* Context */}
      {message.context && (
        <div className={`flex gap-2 rounded-lg px-3 py-2.5 text-xs leading-relaxed ${light ? "bg-indigo-50/70 text-indigo-900/80" : "bg-indigo-400/10 text-indigo-200/90"}`}>
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <p>
            <span className="font-semibold">Context · </span>
            {message.context}
          </p>
        </div>
      )}

      {/* Pipeline disclosure */}
      {message.pipeline && <PipelineDisclosure pipeline={message.pipeline} tone={tone} />}

      {/* Safety note */}
      {message.safety && (
        <div className={`flex gap-2 rounded-lg border px-3 py-2.5 text-xs leading-relaxed ${light ? "border-amber-200 bg-amber-50 text-amber-900/90" : "border-amber-400/25 bg-amber-400/10 text-amber-200/90"}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" />
          </svg>
          <p>
            <span className="font-semibold">Safety note · </span>
            {message.safety}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export function ThinkingIndicator({ stage, tone = "light" }) {
  const light = tone === "light";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="flex items-center gap-3"
      role="status"
      aria-live="polite"
    >
      <AIOrb size="sm" />
      <div className="space-y-1.5">
        <div className="flex gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2 }}
              className={`h-1.5 w-1.5 rounded-full ${light ? "bg-indigo-400" : "bg-teal-300"}`}
            />
          ))}
        </div>
        <motion.p
          key={stage}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-[11px] font-medium ${light ? "text-muted-foreground" : "text-slate-400"}`}
        >
          {stage}
        </motion.p>
      </div>
    </motion.div>
  );
}
