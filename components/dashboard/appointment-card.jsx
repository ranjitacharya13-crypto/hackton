"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Video, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS = {
  Confirmed: "success",
  Scheduled: "info",
  Completed: "slate",
  Cancelled: "danger",
};

export function AppointmentCard({ appointment, index = 0, compact = false }) {
  const a = appointment;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className={cn("flex gap-3.5 rounded-xl border bg-white p-4 shadow-soft", compact && "p-3.5")}
    >
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-teal-50 text-primary ring-1 ring-teal-100">
        <span className="text-[10px] font-bold uppercase leading-none">{a.month}</span>
        <span className="font-display text-lg font-bold leading-tight">{a.day}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold">{a.title}</p>
          <Badge variant={STATUS[a.status] || "secondary"} className="shrink-0">{a.status}</Badge>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {a.doctor} · {a.department}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {a.time}
          </span>
          <span className="inline-flex items-center gap-1">
            {a.mode === "Video" ? <Video className="h-3 w-3" aria-hidden /> : <MapPin className="h-3 w-3" aria-hidden />}
            {a.mode === "Video" ? "Telehealth visit" : a.location}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Building2 className="h-3 w-3" aria-hidden />
            {a.department}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
