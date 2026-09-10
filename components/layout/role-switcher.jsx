"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronsUpDown, ShieldCheck } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { ROLE_IDS, getRole } from "@/lib/roles";
import { cn, initials } from "@/lib/utils";

export function RoleSwitcher({ compact = false }) {
  const { role, setRole } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const config = getRole(role);
  const Icon = config.icon;

  const switchTo = React.useCallback(
    (id) => {
      if (id === role) return;
      setRole(id);
      const target = getRole(id);
      const appPages = ["/patient", "/doctor", "/nurse", "/laboratory", "/pharmacist", "/admin"];
      if (appPages.includes(pathname)) {
        router.push(target.route);
      } else {
        router.push(target.route);
      }
    },
    [role, setRole, router, pathname]
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label={`Switch role, current role ${config.label}`}
          className={cn(
            "group flex w-full items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-2.5 text-left shadow-sm transition-all hover:border-slate-300 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            compact && "w-auto"
          )}
        >
          <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white", config.accent.dot)} aria-hidden>
            <Icon className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Viewing as
            </span>
            <span className="block truncate text-sm font-semibold leading-tight">{config.label}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-y-0.5" aria-hidden />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-[70] min-w-[260px] overflow-hidden rounded-xl border bg-white p-1.5 shadow-lift animate-in fade-in-0 zoom-in-95"
        >
          <p className="flex items-center gap-1.5 px-2.5 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-emerald-500" aria-hidden />
            Role-based workspace
          </p>
          {ROLE_IDS.map((id) => {
            const r = getRole(id);
            const RIcon = r.icon;
            const active = id === role;
            return (
              <DropdownMenu.Item
                key={id}
                onSelect={() => switchTo(id)}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-secondary",
                  active && "bg-secondary/60"
                )}
              >
                <span className={cn("flex h-7 w-7 items-center justify-center rounded-md text-white", r.accent.dot)} aria-hidden>
                  <RIcon className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1 font-medium">{r.label}</span>
                {active ? <Check className="h-4 w-4 text-primary" aria-label="Current role" /> : null}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
