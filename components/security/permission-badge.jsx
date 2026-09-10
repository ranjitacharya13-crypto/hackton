"use client";

import { ShieldCheck, Lock, HeartHandshake, UserCog, ScanEye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STYLES = {
  AUTHORIZED: { icon: ShieldCheck, className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  PRIVATE: { icon: Lock, className: "border-slate-200 bg-slate-100 text-slate-600" },
  CONSENTED: { icon: HeartHandshake, className: "border-teal-200 bg-teal-50 text-teal-700" },
  "ROLE RESTRICTED": { icon: UserCog, className: "border-amber-200 bg-amber-50 text-amber-700" },
  AUDITED: { icon: ScanEye, className: "border-indigo-200 bg-indigo-50 text-indigo-700" },
  ENCRYPTED: { icon: Lock, className: "border-sky-200 bg-sky-50 text-sky-700" },
};

export function PermissionBadge({ level = "AUTHORIZED", className, withLabel = true }) {
  const meta = STYLES[level] || STYLES.AUTHORIZED;
  const Icon = meta.icon;
  return (
    <Badge variant="outline" className={cn(meta.className, "gap-1 font-semibold uppercase tracking-wider", className)}>
      <Icon className="h-3 w-3" aria-hidden />
      {withLabel ? level : null}
    </Badge>
  );
}
