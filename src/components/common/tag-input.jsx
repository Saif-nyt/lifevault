"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TagInput({ value = [], onChange, placeholder = "Add a tag and press Enter", suggestions = [], className }) {
  const [draft, setDraft] = useState("");

  function addTag(raw) {
    const name = raw.trim().replace(/^#/, "");
    if (!name) return;
    const exists = value.some((tag) => String(tag).toLowerCase() === name.toLowerCase());
    if (!exists && value.length < 20) onChange([...value, name]);
    setDraft("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(draft);
      return;
    }
    if (event.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  const available = suggestions
    .map((tag) => (typeof tag === "object" ? tag.name : tag))
    .filter((name) => !value.some((tag) => String(tag).toLowerCase() === name.toLowerCase()))
    .slice(0, 6);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="glass-control flex min-h-10 flex-wrap items-center gap-1.5 rounded-2xl px-2 py-1.5 shadow-inner shadow-black/5 focus-within:ring-2 focus-within:ring-ring/40">
        {value.map((tag) => {
          const name = typeof tag === "object" ? tag.name : tag;
          return (
            <Badge key={name} variant="secondary" className="gap-1 py-1">
              {name}
              <button
                type="button"
                onClick={() => onChange(value.filter((entry) => entry !== tag))}
                className="rounded-full p-0.5 hover:bg-background/60"
                aria-label={`Remove ${name}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          );
        })}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => draft && addTag(draft)}
          placeholder={value.length ? "" : placeholder}
          className="h-7 min-w-24 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground/70"
        />
      </div>
      {available.length ? (
        <div className="flex flex-wrap gap-1.5">
          {available.map((name) => (
            <button key={name} type="button" onClick={() => addTag(name)} className="text-xs text-muted-foreground hover:text-foreground">
              + {name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
