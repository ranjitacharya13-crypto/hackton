"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { HeartPulse, Gauge, Droplet, Scale, Moon, Footprints, TrendingUp, TrendingDown } from "lucide-react";
import { mulberry32, cn } from "@/lib/utils";

const ICONS = {
  heart: HeartPulse,
  gauge: Gauge,
  droplet: Droplet,
  scale: Scale,
  moon: Moon,
  footprints: Footprints,
};

function sparkData(seed) {
  const rnd = mulberry32(seed);
  let v = 50;
  return Array.from({ length: 12 }, () => {
    v += (rnd() - 0.5) * 14;
    return { v: Math.max(8, v) };
  });
}

export function HealthMetricCard({ metric, index = 0 }) {
  const Icon = ICONS[metric.icon] || HeartPulse;
  const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
  const statusTone =
    metric.status === "good"
      ? "text-emerald-600 bg-emerald-50"
      : metric.status === "watch"
        ? "text-amber-600 bg-amber-50"
        : "text-teal-600 bg-teal-50";
  const data = sparkData(metric.sparkSeed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="group rounded-xl border bg-white p-4 shadow-soft transition-shadow hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", statusTone)}>
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
            metric.trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-sky-50 text-sky-600"
          )}
        >
          <TrendIcon className="h-3 w-3" aria-hidden />
          {metric.trend === "up" ? "UP" : "DOWN"}
        </span>
      </div>

      <p className="mt-3 text-xs font-medium text-muted-foreground">{metric.label}</p>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <span className="font-display text-[22px] font-bold leading-none tracking-tight">{metric.value}</span>
        {metric.unit ? <span className="text-[11px] font-medium text-muted-foreground">{metric.unit}</span> : null}
      </div>

      <div className="mt-2 h-9" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`spark-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke="#0d9488"
              strokeWidth={1.8}
              fill={`url(#spark-${metric.id})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
        <span>prev {metric.previous}</span>
        <span>{metric.updated}</span>
      </div>
    </motion.div>
  );
}
