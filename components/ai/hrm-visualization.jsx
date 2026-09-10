"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import { Layers, Filter, BrainCircuit, Lightbulb, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const LAYERS = [
  { id: "context", label: "High-Level Context", detail: "The full authorized record landscape", icon: Layers, tint: "from-sky-500/15 to-sky-500/5 text-sky-600", tintDark: "from-sky-400/20 to-sky-400/5 text-sky-300" },
  { id: "relevant", label: "Relevant Information", detail: "Narrowed to what the question needs", icon: Filter, tint: "from-teal-500/15 to-teal-500/5 text-teal-600", tintDark: "from-teal-400/20 to-teal-400/5 text-teal-300" },
  { id: "reasoning", label: "Reasoning Process", detail: "Hierarchical reasoning over the context", icon: BrainCircuit, tint: "from-indigo-500/15 to-indigo-500/5 text-indigo-600", tintDark: "from-indigo-400/20 to-indigo-400/5 text-indigo-300" },
  { id: "result", label: "Result", detail: "A role-specific, source-linked insight", icon: Lightbulb, tint: "from-amber-500/15 to-amber-500/5 text-amber-600", tintDark: "from-amber-400/20 to-amber-400/5 text-amber-300" },
];

/**
 * Conceptual Hierarchical Reasoning Model (HRM) visualization.
 * Shows coarse stages only — no hidden model reasoning is exposed.
 */
export function HRMVisualization({ tone = "light", activeLayer: controlled }) {
  const reduced = useReducedMotion();
  const [autoLayer, setAutoLayer] = React.useState(0);

  React.useEffect(() => {
    if (controlled !== undefined || reduced) return;
    const t = setInterval(() => setAutoLayer((v) => (v + 1) % LAYERS.length), 1800);
    return () => clearInterval(t);
  }, [controlled, reduced]);

  const active = controlled !== undefined ? controlled : autoLayer;

  return (
    <div className="space-y-0" role="img" aria-label="Hierarchical reasoning: high level context, relevant information, reasoning process, result">
      {LAYERS.map((layer, i) => {
        const Icon = layer.icon;
        const isActive = i === active;
        return (
          <React.Fragment key={layer.id}>
            {i > 0 && (
              <div className="flex justify-center py-1" aria-hidden>
                <motion.span
                  animate={{ opacity: isActive || i <= active ? 1 : 0.4 }}
                  transition={{ duration: 0.3 }}
                  className={tone === "light" ? "text-slate-300" : "text-white/25"}
                >
                  <ArrowDown className="h-4 w-4" />
                </motion.span>
              </div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.35 }}
              className={cn(
                "relative flex items-center gap-3.5 overflow-hidden rounded-xl border p-4 transition-all duration-500",
                tone === "light" ? "bg-white" : "bg-white/[0.03]",
                isActive
                  ? tone === "light"
                    ? "border-primary/30 shadow-glow"
                    : "border-teal-400/30 shadow-[0_0_32px_rgba(20,184,166,0.12)]"
                  : tone === "light"
                    ? "border-slate-200"
                    : "border-white/10"
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-500", layer.tint, tone !== "light" && layer.tintDark, isActive && "opacity-100")} aria-hidden />
              <span className={cn("relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br", layer.tint, tone !== "light" && layer.tintDark)}>
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="relative min-w-0 flex-1">
                <p className={cn("text-sm font-semibold", tone === "light" ? "text-foreground" : "text-white")}>{layer.label}</p>
                <p className={cn("text-xs", tone === "light" ? "text-muted-foreground" : "text-slate-400")}>{layer.detail}</p>
              </div>
              <span
                className={cn(
                  "relative h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300",
                  isActive ? "scale-100 bg-primary" : "scale-0"
                )}
                aria-hidden
              />
            </motion.div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
