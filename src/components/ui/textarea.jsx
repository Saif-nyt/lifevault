import { cn } from "@/lib/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "glass-control flex min-h-24 w-full rounded-2xl border px-3.5 py-2 text-sm text-foreground shadow-inner shadow-black/5 transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
