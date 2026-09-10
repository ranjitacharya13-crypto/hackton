"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/app-provider";

/** Convenience route that lands on the current role's dashboard. */
export default function DashboardRedirect() {
  const router = useRouter();
  const { roleConfig } = useApp();

  React.useEffect(() => {
    router.replace(roleConfig.route);
  }, [router, roleConfig.route]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status">
      <span className="h-10 w-10 animate-pulse-dot rounded-full bg-gradient-to-br from-teal-400 to-indigo-500" aria-hidden />
      <span className="sr-only">Opening your workspace…</span>
    </div>
  );
}
