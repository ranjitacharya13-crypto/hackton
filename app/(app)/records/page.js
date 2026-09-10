"use client";

import * as React from "react";
import { Search, FolderHeart } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionBadge } from "@/components/security/permission-badge";
import { RecordCard } from "@/components/records/record-card";
import { EmptyState } from "@/components/shared/empty-state";
import { healthRecords } from "@/lib/data";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "report", label: "Reports" },
  { id: "prescription", label: "Prescriptions" },
  { id: "lab", label: "Lab Results" },
  { id: "visit", label: "Visits" },
  { id: "vitals", label: "Vitals" },
];

export default function RecordsPage() {
  const [filter, setFilter] = React.useState("all");
  const [query, setQuery] = React.useState("");

  const filtered = healthRecords.filter((r) => {
    const matchesFilter = filter === "all" || r.type === filter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.provider.toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  return (
    <div>
      <PageHeader
        title="Health Records"
        description="Every record connected to your health space — filter, search, view, or ask the AI about any of them."
        badges={
          <>
            <PermissionBadge level="ENCRYPTED" />
            <PermissionBadge level="AUDITED" />
          </>
        }
      />

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 scrollbar-thin" role="tablist" aria-label="Filter records by type">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                filter === f.id
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-secondary/60"
              )}
            >
              {f.label}
              <span className="ml-1.5 text-[10px] opacity-70">
                {f.id === "all" ? healthRecords.length : healthRecords.filter((r) => r.type === f.id).length}
              </span>
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search records…"
            aria-label="Search records"
            className="h-9 w-full rounded-lg border bg-white pl-9 pr-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderHeart}
          title="No records match"
          description="Try a different filter or clear your search."
        />
      ) : (
        <div key={`${filter}-${query}`} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r, i) => (
            <RecordCard key={r.id} record={r} index={Math.min(i, 8)} />
          ))}
        </div>
      )}

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        Record access follows your consent settings —{" "}
        <span className="font-semibold text-slate-500">View</span> opens the document,{" "}
        <span className="font-semibold text-slate-500">Ask AI</span> grounds an answer in that record.
      </p>
    </div>
  );
}
