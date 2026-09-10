"use client";

import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandLogo({ className, compact = false, dark = false }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl shadow-sm",
          "bg-gradient-to-br from-teal-500 via-teal-600 to-indigo-500"
        )}
      >
        <HeartPulse className="h-5 w-5 text-white" strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className={cn("font-display text-lg font-bold tracking-tight", dark ? "text-white" : "text-foreground")}>
          Lumina<span className={dark ? "text-teal-300" : "text-primary"}> Health</span>
        </span>
      )}
    </span>
  );
}
