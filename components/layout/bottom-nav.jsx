"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";

const DATA_PAGES = ["/records", "/reports", "/vitals", "/medications"];

export function BottomNav() {
  const pathname = usePathname();
  const { roleConfig, openAI } = useApp();

  const dataNav =
    roleConfig.nav.find((n) => DATA_PAGES.includes(n.href)) || roleConfig.nav[1];
  const governanceNav =
    roleConfig.nav.find((n) => n.href === "/consent") || roleConfig.nav.find((n) => n.href === "/audit");

  const shortLabel = (label) => label.replace("Health ", "").split(" ")[0];

  const items = [
    { label: "Home", href: roleConfig.route, icon: roleConfig.icon, end: true },
    dataNav && { label: shortLabel(dataNav.label), href: dataNav.href, icon: dataNav.icon },
    { label: "ai" },
    governanceNav && { label: governanceNav.href === "/consent" ? "Consent" : "Audit", href: governanceNav.href, icon: governanceNav.icon },
    { label: "Settings", href: "/settings", icon: roleConfig.nav[roleConfig.nav.length - 1]?.icon },
  ].filter(Boolean);

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map((item) => {
          if (item.label === "ai") {
            return (
              <button
                key="ai"
                onClick={() => openAI()}
                aria-label={`Open ${roleConfig.ai.panelTitle}`}
                className="relative -mt-5 flex flex-col items-center focus-visible:outline-none"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full aurora-ink text-teal-200 shadow-lift ring-4 ring-white">
                  <Sparkles className="h-5 w-5" aria-hidden />
                </span>
                <span className="mt-1 text-[10px] font-semibold text-indigo-600">Ask AI</span>
              </button>
            );
          }
          const Icon = item.icon;
          if (!Icon) return null;
          const active = item.end ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors",
                active ? "text-primary" : "text-slate-500 hover:text-slate-800"
              )}
            >
              {active && (
                <motion.span
                  layoutId="bottomnav-dot"
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-primary"
                  aria-hidden
                />
              )}
              <Icon className="h-5 w-5" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
