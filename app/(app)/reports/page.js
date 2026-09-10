"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, ChevronRight, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionBadge } from "@/components/security/permission-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/components/providers/app-provider";
import { reports } from "@/lib/data";

export default function ReportsPage() {
  const { openAI } = useApp();

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Clinical and laboratory reports attached to your record — open any report for the full viewer with extracted information."
        badges={<PermissionBadge level="CONSENTED" />}
      />

      <div className="grid gap-3 md:grid-cols-2">
        {reports.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
          >
            <Card className="h-full transition-shadow hover:shadow-lift">
              <CardContent className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                    <FileText className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="flex gap-1.5">
                    <Badge variant="outline" className="text-slate-500">{r.status}</Badge>
                    <PermissionBadge level={r.access} withLabel={false} />
                  </div>
                </div>
                <h2 className="mt-3 font-display text-base font-bold">{r.title}</h2>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{r.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3.5 text-[11px] text-muted-foreground">
                  <span>{r.date}</span>
                  <span className="max-w-[50%] truncate">{r.provider}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="sm" className="h-9 text-xs">
                    <Link href={`/reports/${r.id}`}>
                      Open report
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="h-9 gap-1.5 border border-indigo-100 bg-indigo-50 text-xs text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800"
                    onClick={() => openAI(`Summarize my ${r.title.toLowerCase()}`)}
                  >
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    Ask AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
