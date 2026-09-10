"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileUp, ScanSearch, FileCheck2, CheckCircle2 } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";

const STAGES = [
  { id: "upload", label: "Uploading", icon: FileUp, duration: 1300 },
  { id: "reading", label: "Reading document", icon: ScanSearch, duration: 1500 },
  { id: "extracting", label: "Extracting fields", icon: ScanSearch, duration: 1600 },
  { id: "ready", label: "Ready for verification", icon: FileCheck2, duration: 600 },
];

/** Frontend-only simulated document upload pipeline. */
export function UploadDropzone() {
  const { pushToast, addAudit } = useApp();
  const [state, setState] = React.useState("idle"); // idle | processing | done
  const [stageIdx, setStageIdx] = React.useState(0);
  const timers = React.useRef([]);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const start = () => {
    if (state === "processing") return;
    setState("processing");
    setStageIdx(0);
    let acc = 0;
    STAGES.forEach((s, i) => {
      acc += s.duration;
      timers.current.push(
        setTimeout(() => {
          setStageIdx(i + 1);
          if (i === STAGES.length - 1) {
            setState("done");
            pushToast({
              kind: "success",
              title: "Report ready for verification",
              body: "Lipid Panel — Maya Chen was processed (frontend simulation).",
            });
            addAudit({
              role: "laboratory",
              actor: "Sara Kim",
              action: "uploaded",
              resource: "Lipid Panel — re-check",
              category: "upload",
            });
          }
        }, acc)
      );
    });
  };

  return (
    <div>
      <button
        onClick={start}
        disabled={state === "processing"}
        aria-label="Upload a lab report (simulated)"
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          state === "processing"
            ? "cursor-wait border-violet-300 bg-violet-50/50"
            : "border-slate-300 bg-slate-50/60 hover:border-violet-400 hover:bg-violet-50/40"
        )}
      >
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <UploadCloud className="h-6 w-6" aria-hidden />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-700">Drop a lab report to process</p>
              <p className="mt-1 text-xs text-muted-foreground">
                or click to browse — the pipeline below is a frontend simulation
              </p>
            </motion.div>
          )}
          {state === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" aria-hidden />
              </span>
              <p className="mt-3 text-sm font-semibold text-emerald-700">Document processed successfully</p>
              <p className="mt-1 text-xs text-muted-foreground">Fields extracted and attached to the patient record</p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Pipeline stages */}
      <div className="mt-4 grid grid-cols-4 gap-2" aria-label="Processing stages">
        {STAGES.map((s, i) => {
          const active = state === "processing" && stageIdx === i;
          const complete = stageIdx > i || state === "done";
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex flex-col items-center gap-1.5 text-center">
              <motion.span
                animate={active ? { scale: [1, 1.12, 1] } : {}}
                transition={active ? { duration: 0.9, repeat: Infinity } : {}}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
                  complete
                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                    : active
                      ? "border-violet-300 bg-violet-100 text-violet-600"
                      : "border-slate-200 bg-white text-slate-300"
                )}
              >
                {complete ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : <Icon className="h-4 w-4" aria-hidden />}
              </motion.span>
              <span
                className={cn(
                  "text-[10px] font-semibold leading-tight",
                  complete ? "text-emerald-600" : active ? "text-violet-600" : "text-slate-400"
                )}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {state === "done" && (
        <button
          onClick={() => {
            setState("idle");
            setStageIdx(0);
          }}
          className="mt-3 w-full rounded-lg border py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-secondary"
        >
          Process another document
        </button>
      )}
    </div>
  );
}
