"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Pill, Sparkles, ShieldCheck, Bell } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";

const KIND_ICON = {
  lab: FlaskConical,
  medication: Pill,
  ai: Sparkles,
  consent: ShieldCheck,
};

export function NotificationPanel() {
  const { notifications, markAllNotificationsRead } = useApp();
  const [open, setOpen] = React.useState(false);
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          aria-label={`Notifications, ${unread} unread`}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-slate-500 transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Bell className="h-[19px] w-[19px]" aria-hidden />
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white"
            >
              {unread}
            </motion.span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-[60] w-[min(92vw,360px)] overflow-hidden rounded-xl border bg-white shadow-lift animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={markAllNotificationsRead}>
              Mark all read
            </Button>
          </div>
          <div className="max-h-[380px] overflow-y-auto scrollbar-thin">
            <AnimatePresence initial={false}>
              {notifications.map((n, i) => {
                const Icon = KIND_ICON[n.kind] || Bell;
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex gap-3 border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50/70"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-slate-500">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold leading-tight">{n.title}</p>
                        {n.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                      </div>
                      <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{n.body}</p>
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">{n.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
