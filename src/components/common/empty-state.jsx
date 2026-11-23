import { Archive, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = Archive,
  title = "Nothing here yet",
  description = "Start capturing the things you want to remember.",
  actionLabel,
  actionHref,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center",
        className
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <Icon className="size-5" />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      {actionLabel ? (
        actionHref ? (
          <Button asChild className="mt-5" size="sm">
            <Link href={actionHref}>
              <Plus /> {actionLabel}
            </Link>
          </Button>
        ) : (
          <Button className="mt-5" size="sm" onClick={onAction}>
            <Plus /> {actionLabel}
          </Button>
        )
      ) : null}
    </div>
  );
}
