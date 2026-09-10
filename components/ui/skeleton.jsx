import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return <div className={cn("skeleton-wave rounded-md", className)} {...props} />;
}

export { Skeleton };
