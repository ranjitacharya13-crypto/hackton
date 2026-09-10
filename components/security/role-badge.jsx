"use client";

import { Badge } from "@/components/ui/badge";
import { getRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

export function RoleBadge({ role, className, showIcon = true }) {
  const config = getRole(role);
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={cn(config.accent.badge, "gap-1", className)}>
      {showIcon ? <Icon className="h-3 w-3" aria-hidden /> : null}
      {config.label}
    </Badge>
  );
}
