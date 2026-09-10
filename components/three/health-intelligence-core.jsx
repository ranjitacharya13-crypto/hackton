"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const CoreScene = dynamic(() => import("./core-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center" aria-hidden>
      <span className="h-16 w-16 animate-pulse-dot rounded-full bg-gradient-to-br from-teal-400/30 to-indigo-500/30" />
    </div>
  ),
});

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * "Health Intelligence Core" — the product's signature 3D element.
 * Fragmented data nodes orbit a central AI core: FRAGMENTED DATA → CONNECTED INTELLIGENCE.
 * Renders nothing heavy on the server; honors prefers-reduced-motion.
 */
export function HealthIntelligenceCore({ className, showLabels = true, label = "3D visualization of health data sources connecting to a central AI core" }) {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = React.useState(false);
  const ref = React.useRef(null);

  /* Only mount the WebGL scene when it's near the viewport (keeps mobile light). */
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "120px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("relative h-full w-full", className)} role="img" aria-label={label}>
      {visible ? <CoreScene reduced={reduced} showLabels={showLabels} /> : null}
    </div>
  );
}
