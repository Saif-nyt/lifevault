"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, Compass, Film, Lightbulb, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { ArchiveGrid } from "@/components/archives/archive-card";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { CardGridSkeleton } from "@/components/common/loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/use-api";
import { archiveService } from "@/services/archive.service";
import { taxonomyService } from "@/services/taxonomy.service";
import { ARCHIVE_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS = { book: BookOpen, compass: Compass, film: Film, idea: Lightbulb };

export function CategoryExperience({
  eyebrow,
  title,
  description,
  icon,
  categoryNames,
  allowedTypes,
  defaultNewType = "note",
  emptyDescription = "Save something in this part of your life and it will appear here.",
  quote,
}) {
  const Icon = ICONS[icon];
  const [typeFilter, setTypeFilter] = useState("");
  const key = categoryNames.join("|");

  const { data, loading, error, refresh } = useApi(async () => {
    const categories = await taxonomyService.categories();
    const matched = categories.filter((category) =>
      categoryNames.some((name) => name.toLowerCase() === category.name.toLowerCase())
    );

    if (!matched.length) return { categories: [], items: [], total: 0 };

    const results = await Promise.all(
      matched.map((category) => archiveService.list({ category: category.id, limit: 24, sort: "newest" }))
    );
    const seen = new Set();
    const items = results
      .flatMap((result) => result.items)
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });

    return { categories: matched, items, total: items.length };
  }, [key]);

  async function handleFavorite(item) {
    try {
      await archiveService.toggleFavorite(item.id);
      toast.success(item.isFavorite ? "Removed from favorites" : "Saved to favorites");
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const availableTypes = allowedTypes ? ARCHIVE_TYPES.filter((type) => allowedTypes.includes(type.value)) : ARCHIVE_TYPES;
  const items = data?.items || [];
  const visible = typeFilter ? items.filter((item) => item.type === typeFilter) : items;
  const firstCategory = data?.categories?.[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={
          <span className="inline-flex items-center gap-3">
            {Icon ? <Icon className="size-8 text-primary" /> : null}
            {title}
          </span>
        }
        description={description}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/archives">
                All archives <ArrowRight />
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/archives/new?type=${defaultNewType}`}>
                <Plus /> New {ARCHIVE_TYPES.find((type) => type.value === defaultNewType)?.label.toLowerCase() || "item"}
              </Link>
            </Button>
          </>
        }
      />

      {firstCategory ? (
        <div
          className="relative overflow-hidden rounded-xl border border-border p-5"
          style={{ backgroundColor: `${firstCategory.color}14` }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {data.categories.map((category) => category.name).join(" · ")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {items.length} item{items.length === 1 ? "" : "s"} in this part of your archive.
              </p>
            </div>
            {data.categories.length > 1 ? (
              <div className="flex flex-wrap gap-1.5">
                {data.categories.map((category) => (
                  <Link key={category.id} href={`/archives?category=${category.id}`}>
                    <Badge variant="outline" className="bg-card/70">
                      <span className="size-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                      {category.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link href={`/archives?category=${firstCategory.id}`}>
                  View filtered <ArrowRight />
                </Link>
              </Button>
            )}
          </div>
          {quote ? <p className="mt-4 max-w-2xl font-display text-xl italic text-foreground/70">“{quote}”</p> : null}
        </div>
      ) : null}

      {items.length ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTypeFilter("")}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition",
              !typeFilter ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            All ({items.length})
          </button>
          {availableTypes.map((type) => {
            const count = items.filter((item) => item.type === type.value).length;
            if (!count) return null;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setTypeFilter(type.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition",
                  typeFilter === type.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {type.label} ({count})
              </button>
            );
          })}
        </div>
      ) : null}

      {error ? <ErrorState error={error} onRetry={refresh} /> : null}

      {loading ? <CardGridSkeleton count={6} /> : null}

      {!loading && data ? (
        visible.length ? (
          <ArchiveGrid items={visible} onFavorite={handleFavorite} />
        ) : (
          <EmptyState
            icon={Sparkles}
            title={items.length ? "No items of this type yet" : "This room is still empty"}
            description={items.length ? "Choose another filter or add something new." : emptyDescription}
            actionLabel={`Add to ${title}`}
            actionHref={`/archives/new?type=${defaultNewType}`}
          />
        )
      ) : null}
    </div>
  );
}
