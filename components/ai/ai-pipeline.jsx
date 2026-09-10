"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FolderSearch, Network, BrainCircuit, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const STEP_ICONS = {
  permission: ShieldCheck,
  retrieval: FolderSearch,
  rag: Network,
  hrm: BrainCircuit,
  insight: Sparkles,
};

/**
 * High-level conceptual pipeline. Intentionally does NOT expose any
 * chain-of-thought — only coarse, user-facing stages.
 */
export function AIPipeline({ pipeline, tone = "light", animate = true }) {
  return (
    <ol className="relative space-y-0" aria-label="How this answer was generated">
      {pipeline.map((step, i) => {
        const Icon = STEP_ICONS[step.id] || Sparkles;
        const last = i === pipeline.length - 1;
        return (
          <motion.li
            key={step.id}
            initial={animate ? { opacity: 0, x: -8 } : false}
            whileInView={animate ? { opacity: 1, x: 0 } : undefined}
            viewport={{ once: true }}
            animate={animate ? undefined : { opacity: 1 }}
            transition={{ delay: i * 0.12, duration: 0.35 }}
            className="relative flex gap-3 pb-4 last:pb-0"
          >
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-30px)] w-px",
                  tone === "light" ? "bg-slate-200" : "bg-white/10"
                )}
              />
            )}
            <motion.span
              initial={animate ? { scale: 0.5, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1",
                tone === "light"
                  ? "bg-teal-50 text-teal-600 ring-teal-100"
                  : "bg-white/10 text-teal-300 ring-white/15"
              )}
              aria-hidden
            >
              <Icon className="h-4 w-4" />
            </motion.span>
            <div className="min-w-0 pt-1">
              <p className={cn("text-[13px] font-semibold leading-tight", tone === "light" ? "text-foreground" : "text-white")}>
                {step.label}
              </p>
              <p className={cn("mt-0.5 text-xs leading-snug", tone === "light" ? "text-muted-foreground" : "text-slate-400")}>
                {step.detail}
              </p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}

export function PipelineDisclosure({ pipeline, tone = "light" }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={cn("overflow-hidden rounded-lg border", tone === "light" ? "border-slate-200" : "border-white/10")}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-xs font-semibold transition-colors",
          tone === "light" ? "bg-slate-50 text-slate-700 hover:bg-slate-100" : "bg-white/5 text-slate-200 hover:bg-white/10"
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <BrainCircuit className="h-3.5 w-3.5 text-indigo-400" aria-hidden />
          How this answer was generated
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className={cn("p-3.5", tone === "light" ? "bg-white" : "bg-transparent")}>
            <AIPipeline pipeline={pipeline} tone={tone} />
          </div>
        </div>
      </div>
    </div>
  );
}
