"use client";

import { cn } from "@/lib/utils";

export const COLOR_PRESETS = [
  "#4F7CAC",
  "#5E8C61",
  "#B5838D",
  "#7C6A9C",
  "#C08552",
  "#D4A373",
  "#6B9080",
  "#457B9D",
  "#8A7CA8",
  "#7A7A7A",
];

export function ColorPicker({ value = "#7A7A7A", onChange, className }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {COLOR_PRESETS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          aria-label={`Use color ${color}`}
          className={cn(
            "size-7 rounded-full border-2 transition-transform hover:scale-110",
            value.toLowerCase() === color.toLowerCase() ? "border-foreground" : "border-transparent"
          )}
          style={{ backgroundColor: color }}
        />
      ))}
      <label className="relative size-7 cursor-pointer overflow-hidden rounded-full border border-border bg-secondary">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="absolute -left-2 -top-2 size-12 cursor-pointer"
          aria-label="Custom color"
        />
      </label>
    </div>
  );
}
