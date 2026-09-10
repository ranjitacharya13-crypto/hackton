"use client";

import { motion } from "framer-motion";

export function PageHeader({ title, description, children, badges }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">{title}</h1>
        {description ? <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
        {badges ? <div className="mt-3 flex flex-wrap items-center gap-2">{badges}</div> : null}
      </div>
      {children ? <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div> : null}
    </motion.div>
  );
}
