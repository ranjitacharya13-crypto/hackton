"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Stethoscope, Pill, FlaskConical, Telescope, Clock, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/components/providers/app-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ICONS = {
  doctor: Stethoscope,
  pharmacy: Pill,
  laboratory: FlaskConical,
  research: Telescope,
};

export function ConsentCard({ consent, index = 0 }) {
  const { setConsentStatus } = useApp();
  const [manageOpen, setManageOpen] = React.useState(false);
  const Icon = ICONS[consent.id] || Stethoscope;
  const enabled = consent.status !== "denied";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className={cn("rounded-xl border bg-white p-5 shadow-soft transition-colors", !enabled && "bg-slate-50/60")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
              enabled ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400"
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-bold">{consent.title}</p>
            <p className="text-xs text-muted-foreground">{consent.who}</p>
          </div>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={(v) => setConsentStatus(consent.id, v ? "granted" : "denied")}
          aria-label={`Toggle access for ${consent.title}`}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <Badge variant={enabled ? "success" : "slate"}>{consent.scope}</Badge>
        {consent.scopeItems.map((s) => (
          <Badge key={s} variant="outline" className="text-slate-500">{s}</Badge>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{consent.detail}</p>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
        <Clock className="h-3 w-3" aria-hidden />
        {enabled ? `Granted ${consent.grantedAt} · last access ${consent.lastAccess}` : "No access has ever been granted"}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
        <Button
          size="sm"
          variant={enabled ? "outline" : "default"}
          className="h-8 text-xs"
          disabled={enabled && consent.status === "granted" && consent.scope === "Access Granted"}
          onClick={() => setConsentStatus(consent.id, "granted")}
        >
          Grant
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          disabled={!enabled}
          onClick={() => setConsentStatus(consent.id, "denied")}
        >
          Revoke
        </Button>
        <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setManageOpen(true)}>
          Manage
          <ChevronRight className="h-3 w-3" aria-hidden />
        </Button>
      </div>

      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage {consent.title} access</DialogTitle>
            <DialogDescription>
              Choose the level of access {consent.who} holds over your health information. Changes take effect
              immediately and are recorded in the audit log.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {[
              { id: "granted", label: "Full access", desc: "All records relevant to their role" },
              { id: "limited", label: "Limited access", desc: "Only the data categories listed above" },
              { id: "denied", label: "No access", desc: "Nothing is visible to this party" },
            ].map((opt) => (
              <label
                key={opt.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-colors",
                  consent.status === opt.id ? "border-primary/40 bg-teal-50/50" : "hover:bg-secondary/60"
                )}
              >
                <span>
                  <span className="block text-sm font-semibold">{opt.label}</span>
                  <span className="block text-xs text-muted-foreground">{opt.desc}</span>
                </span>
                <input
                  type="radio"
                  name={`consent-${consent.id}`}
                  className="h-4 w-4 accent-teal-600"
                  checked={consent.status === opt.id}
                  onChange={() => setConsentStatus(consent.id, opt.id)}
                />
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setManageOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
