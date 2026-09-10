"use client";

import * as React from "react";
import { ScanEye } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionBadge } from "@/components/security/permission-badge";
import { AuditTimeline } from "@/components/audit/audit-timeline";
import { EmptyState } from "@/components/shared/empty-state";
import { useApp } from "@/components/providers/app-provider";
import { ROLE_IDS, getRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

export default function AuditPage() {
  const { auditLogs, role } = useApp();
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");

  const filtered = auditLogs.filter((e) => {
    const matchesRole = roleFilter === "all" || e.role === roleFilter;
    const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;
    return matchesRole && matchesCategory;
  });

  const deniedCount = auditLogs.filter((e) => e.status === "denied").length;
  const aiCount = auditLogs.filter((e) => e.category === "ai").length;

  return (
    <div>
      <PageHeader
        title="Audit Activity"
        description="Every access, AI insight and consent change — timestamped, attributable and reviewable."
        badges={
          <>
            <PermissionBadge level="AUDITED" />
            <PermissionBadge level="ENCRYPTED" />
          </>
        }
      />

      {/* Summary strip */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          { label: "Events logged", value: auditLogs.length },
          { label: "AI insights generated", value: aiCount },
          { label: "Access denied by policy", value: deniedCount },
        ].map((s, i) => (
          <div key={s.label} className="rounded-xl border bg-white p-4 text-center shadow-soft">
            <p className="font-display text-2xl font-extrabold">{s.value}</p>
            <p className="mt-1 text-[11px] font-medium text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0 scrollbar-thin" role="tablist" aria-label="Filter by role">
          <FilterChip active={roleFilter === "all"} onClick={() => setRoleFilter("all")}>
            All roles
          </FilterChip>
          {ROLE_IDS.map((id) => (
            <FilterChip key={id} active={roleFilter === id} onClick={() => setRoleFilter(id)}>
              {getRole(id).label}
            </FilterChip>
          ))}
        </div>
        <div className="flex gap-1.5">
          {["all", "view", "ai", "consent", "update", "auth"].map((c) => (
            <FilterChip key={c} active={categoryFilter === c} onClick={() => setCategoryFilter(c)}>
              {c === "all" ? "All actions" : c}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-soft sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ScanEye className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h2 className="font-display text-base font-bold">Access timeline</h2>
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {auditLogs.length} events
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={ScanEye}
            title="No events match these filters"
            description="Try clearing the role or action filter."
          />
        ) : (
          <AuditTimeline entries={filtered} />
        )}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary bg-primary text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:bg-secondary/70"
      )}
    >
      {children}
    </button>
  );
}
