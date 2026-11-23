import { TYPE_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TypeIcon({ type, className, withLabel = false }) {
  const config = TYPE_MAP[type] || TYPE_MAP.note;
  const Icon = config.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <Icon className="size-4" aria-hidden />
      {withLabel ? <span>{config.label}</span> : <span className="sr-only">{config.label}</span>}
    </span>
  );
}
