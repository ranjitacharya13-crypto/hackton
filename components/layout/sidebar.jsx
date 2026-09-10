"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, LogOut, ShieldCheck } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { BrandLogo } from "@/components/shared/brand-logo";
import { RoleSwitcher } from "@/components/layout/role-switcher";
import { SecurityIndicator } from "@/components/security/security-indicator";
import { initials, cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { roleConfig, openAI, mobileNavOpen, setMobileNavOpen } = useApp();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-slate-200/70 px-5">
        <Link href="/" aria-label="Lumina Health home" className="rounded-md">
          <BrandLogo />
        </Link>
      </div>

      <div className="px-4 pt-4">
        <RoleSwitcher />
      </div>

      <nav aria-label="Primary" className="mt-4 flex-1 space-y-0.5 overflow-y-auto px-3 pb-4 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {roleConfig.nav.map((item) => {
            const active = item.end ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            const isAI = item.href === "/assistant";
            return (
              <motion.div
                key={`${roleConfig.id}-${item.href}-${item.label}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    isAI && !active && "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                  )}
                >
                  <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-primary" : isAI ? "text-indigo-500" : "text-slate-400 group-hover:text-slate-600")} aria-hidden />
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId={`nav-dot-${item.href}`}
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                      aria-hidden
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </nav>

      <div className="space-y-3 border-t border-slate-200/70 p-4">
        <button
          onClick={() => openAI()}
          className="group flex w-full items-center gap-3 rounded-xl aurora-ink px-3.5 py-3 text-left text-white shadow-soft transition-transform hover:scale-[1.015] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400/30 to-teal-400/30 ring-1 ring-white/15">
            <Sparkles className="h-4 w-4 text-teal-200" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{roleConfig.ai.title}</span>
            <span className="block truncate text-[11px] text-slate-300">Ask about authorized records</span>
          </span>
          <span className="text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
        </button>

        <div className="flex items-center justify-between gap-2">
          <SecurityIndicator className="hidden xl:inline-flex" />
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden /> Sign out
          </Link>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
              roleConfig.accent.dot
            )}
            aria-hidden
          >
            {initials(roleConfig.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">{roleConfig.name}</p>
            <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-emerald-500" aria-hidden />
              {roleConfig.label} · verified
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[268px] border-r border-slate-200/70 bg-white lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 z-40 bg-ink-950/45 backdrop-blur-[2px] lg:hidden"
              aria-hidden
            />
            <motion.aside
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r bg-white shadow-panel lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
