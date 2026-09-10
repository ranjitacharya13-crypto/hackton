"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function SecurityIndicator({ label = "End-to-end consent · every access audited", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50/70 px-2.5 py-1 text-[11px] font-medium text-emerald-700",
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-emerald-500" />
      </span>
      <Lock className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}
