"use client";

import { motion } from "framer-motion";
import { Database, Network } from "lucide-react";
import { AISourceCard } from "@/components/ai/ai-source-card";

/**
 * Visual explanation of Retrieval-Augmented Generation:
 * authorized source records flow into a single retrieved context.
 * Conceptual only — animated connection lines are decorative.
 */
export function RAGFlow({ sources, tone = "light" }) {
  const light = tone === "light";
  const xs = [16.66, 50, 83.33];

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${light ? "bg-indigo-50 text-indigo-600" : "bg-white/10 text-indigo-300"}`}>
          <Database className="h-3.5 w-3.5" aria-hidden />
        </span>
        <div>
          <p className={`text-sm font-semibold ${light ? "text-foreground" : "text-white"}`}>Retrieved Context</p>
          <p className={`text-[11px] ${light ? "text-muted-foreground" : "text-slate-400"}`}>
            Records ranked by relevance to the question
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="grid gap-3 sm:grid-cols-3">
          {sources.slice(0, 3).map((s, i) => (
            <AISourceCard key={s.label} source={s} index={i} tone={tone} />
          ))}
        </div>

        {/* Animated connection lines (decorative) */}
        <div className="relative mx-auto h-14 max-w-xl" aria-hidden>
          <svg viewBox="0 0 300 56" preserveAspectRatio="none" className="h-full w-full">
            {xs.map((x, i) => (
              <motion.path
                key={i}
                d={`M ${x * 3} 2 C ${x * 3} 30, 150 26, 150 54`}
                fill="none"
                stroke={light ? "#6366f1" : "#818cf8"}
                strokeWidth="1.5"
                strokeDasharray="4 5"
                className="animate-dash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                transition={{ delay: 0.3 + i * 0.15 }}
              />
            ))}
            <motion.circle
              cx="150"
              cy="54"
              r="3.5"
              fill={light ? "#6366f1" : "#a5b4fc"}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className={`mx-auto flex max-w-xl items-center gap-3 rounded-xl border p-3.5 ${
            light ? "border-indigo-200 bg-indigo-50/60" : "border-indigo-400/25 bg-indigo-400/10"
          }`}
        >
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${light ? "bg-indigo-100 text-indigo-600" : "bg-indigo-400/20 text-indigo-300"}`}>
            <Network className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className={`text-[13px] font-semibold ${light ? "text-indigo-900" : "text-indigo-200"}`}>
              Context assembled from {sources.length} authorized records
            </p>
            <p className={`text-xs leading-snug ${light ? "text-indigo-700/70" : "text-indigo-200/70"}`}>
              Only records inside your consent scope are retrievable. Relevance scores are illustrative.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
