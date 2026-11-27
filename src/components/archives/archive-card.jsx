/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Bookmark, Clock, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_TO_SECTION, SECTION_ACCENTS, TYPE_CHIPS, TYPE_MAP } from "@/lib/constants";
import { cn, formatDate, truncate } from "@/lib/utils";

export function ArchiveCard({ item, onFavorite, compact = false }) {
  const type = TYPE_MAP[item.type] || TYPE_MAP.note;
  const Icon = type.icon;
  const image = item.attachments?.find(
    (attachment) => attachment.resourceType === "image" || /\.(png|jpe?g|webp|gif)$/i.test(attachment.url)
  );
  const memoryDate = item.metadata?.memoryDate || item.metadata?.eventDate;
  const sectionId = item.category?.name ? CATEGORY_TO_SECTION[item.category.name] : null;
  const accent = sectionId ? SECTION_ACCENTS[sectionId] : null;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_24px_60px_-44px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_30px_70px_-44px_var(--glow)]">
      {image && !compact ? (
        <div className="h-36 w-full overflow-hidden bg-muted">
          <img src={image.url} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", TYPE_CHIPS[item.type])}>
            <Icon className="size-3.5" />
            {type.label}
          </span>
          {onFavorite ? (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onFavorite(item);
              }}
              aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
              className={cn(
                "rounded-lg p-1.5 transition-colors hover:bg-secondary",
                item.isFavorite ? "text-primary" : "text-muted-foreground/60"
              )}
            >
              <Bookmark className={cn("size-4", item.isFavorite && "fill-current")} />
            </button>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display text-lg font-semibold leading-snug">
            <Link href={`/archives/${item.id}`} className="outline-none after:absolute after:inset-0 after:content-['']">
              {item.title}
            </Link>
          </h3>
          {item.description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{truncate(item.description, compact ? 90 : 150)}</p>
          ) : null}
        </div>

        {item.category ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full" style={{ backgroundColor: accent?.hex || item.category.color }} />
            {item.category.name}
          </div>
        ) : null}

        {item.tags?.length ? (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id || tag.name} variant="outline" className="px-1.5 py-0 text-[10px]">
                {tag.name}
              </Badge>
            ))}
            {item.tags.length > 3 ? <span className="text-[10px] text-muted-foreground">+{item.tags.length - 3}</span> : null}
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {formatDate(memoryDate || item.createdAt)}
          </span>
          {item.attachments?.length ? (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="size-3" /> {item.attachments.length}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ArchiveGrid({ items, onFavorite, compact = false, className }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {items.map((item) => (
        <ArchiveCard key={item.id} item={item} onFavorite={onFavorite} compact={compact} />
      ))}
    </div>
  );
}

export function ArchiveListItem({ item, onFavorite }) {
  const type = TYPE_MAP[item.type] || TYPE_MAP.note;
  const Icon = type.icon;
  return (
    <article className="group relative flex items-center gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_18px_44px_-36px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 hover:border-primary/30">
      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", TYPE_CHIPS[item.type])}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <Link href={`/archives/${item.id}`} className="block truncate font-medium after:absolute after:inset-0 after:content-['']">
          {item.title}
        </Link>
        <p className="truncate text-xs text-muted-foreground">
          {type.label} · {formatDate(item.createdAt)}
          {item.category ? ` · ${item.category.name}` : ""}
        </p>
      </div>
      {onFavorite ? (
        <Button variant="ghost" size="icon-sm" onClick={() => onFavorite(item)} aria-label="Toggle favorite">
          <Bookmark className={cn("size-4", item.isFavorite && "fill-current text-primary")} />
        </Button>
      ) : null}
    </article>
  );
}
