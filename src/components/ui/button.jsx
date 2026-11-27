import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:translate-y-px hover:-translate-y-px [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-[#548BFF] to-[#7C5CFF] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_16px_36px_-18px_rgba(84,139,255,0.55)] hover:from-[#5C8DFF] hover:to-[#8B6CFF] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.32),0_20px_44px_-18px_rgba(91,111,255,0.65)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        outline:
          "border border-border/70 bg-card/50 text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-md hover:bg-secondary/60",
        ghost: "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        success: "bg-success/15 text-success hover:bg-success/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 rounded-2xl px-4 py-2",
        sm: "h-9 rounded-xl px-3 text-xs",
        lg: "h-11 rounded-2xl px-6",
        icon: "h-11 w-11 rounded-2xl",
        "icon-sm": "h-8 w-8 rounded-xl",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
