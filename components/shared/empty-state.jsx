import { Inbox } from "lucide-react";

export function EmptyState({ icon: Icon = Inbox, title = "Nothing here yet", description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-white/60 px-6 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
      </div>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      {description ? <p className="mt-1 max-w-xs text-xs text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
