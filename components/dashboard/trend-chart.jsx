"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from "recharts";

const AXIS_TICK = { fontSize: 10, fill: "#94a3b8" };

function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-white px-3 py-2 text-xs shadow-lift">
      <p className="mb-1 font-semibold text-slate-500">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-1.5 font-medium" style={{ color: p.color || p.stroke }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color || p.stroke }} aria-hidden />
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          {unit ? ` ${unit}` : ""}
        </p>
      ))}
    </div>
  );
}

/**
 * series: [{ key, name, color, type: "area"|"line"|"bar" }]
 * reference: {y1, y2, color} optional healthy band
 */
export function TrendChart({
  data,
  series,
  height = 220,
  unit,
  reference,
  xKey = "label",
  interval = "preserveStartEnd",
}) {
  const hasBars = series.some((s) => s.type === "bar");
  const Chart = hasBars ? BarChart : series.some((s) => s.type === "area") ? AreaChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <Chart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -14 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}-${s.color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 6" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey={xKey} tick={AXIS_TICK} tickLine={false} axisLine={false} interval={interval} minTickGap={24} />
        <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={44} domain={["auto", "auto"]} />
        <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: "#cbd5e1", strokeDasharray: "3 3" }} />
        {reference && (
          <ReferenceArea y1={reference.y1} y2={reference.y2} fill={reference.color || "#14b8a6"} fillOpacity={0.06} />
        )}
        {series.map((s) =>
          s.type === "bar" ? (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={22} />
          ) : s.type === "area" ? (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#grad-${s.key}-${s.color.replace("#", "")})`}
              dot={false}
              activeDot={{ r: 3.5, strokeWidth: 2 }}
              animationDuration={700}
            />
          ) : (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3.5, strokeWidth: 2 }}
              animationDuration={700}
            />
          )
        )}
      </Chart>
    </ResponsiveContainer>
  );
}
