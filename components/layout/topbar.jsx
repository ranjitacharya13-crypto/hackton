"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, Sparkles } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { PermissionBadge } from "@/components/security/permission-badge";
import { Button } from "@/components/ui/button";
import { getRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { role, roleConfig, openAI, setMobileNavOpen } = useApp();
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push("/records");
      setQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-secondary lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>

        <form onSubmit={submitSearch} role="search" className="relative hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search records, reports, medications…"
            aria-label="Search health records"
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/80 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </form>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden xl:block">
            <PermissionBadge level="AUDITED" />
          </span>
          <NotificationPanel />
          <Button
            onClick={() => openAI()}
            className="aurora-ink relative h-10 gap-2 rounded-lg px-3.5 text-white shadow-sm hover:opacity-95"
            aria-label={`Open ${roleConfig.ai.panelTitle}`}
          >
            <Sparkles className="h-4 w-4 text-teal-200" aria-hidden />
            <span className="hidden sm:inline">{getRole(role).ai.panelTitle}</span>
            <span className="sm:hidden">AI</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
