"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark, LayoutGrid, List, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { ArchiveGrid, ArchiveListItem } from "@/components/archives/archive-card";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { CardGridSkeleton } from "@/components/common/loading";
import { Pagination } from "@/components/common/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApi, useDebouncedValue } from "@/hooks/use-api";
import { archiveService } from "@/services/archive.service";
import { taxonomyService } from "@/services/taxonomy.service";
import { ARCHIVE_TYPES, SUBSECTION_SECTION_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" },
  { value: "updated", label: "Recently updated" },
];

function ArchivesContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    type: searchParams.get("type") || "",
    category: searchParams.get("category") || "",
    tag: searchParams.get("tag") || "",
    favorite: searchParams.get("favorite") === "true" ? "true" : "",
    sort: searchParams.get("sort") || "newest",
  });
  const [page, setPage] = useState(1);
  const [view, setView] = useState("grid");
  const debouncedQuery = useDebouncedValue(filters.q, 300);

  const { data: categories } = useApi(() => taxonomyService.categories(), []);
  const { data: tags } = useApi(() => taxonomyService.tags(), []);

  const { data, loading, error, refresh } = useApi(
    () =>
      archiveService.list({
        page,
        limit: 12,
        q: debouncedQuery || undefined,
        type: filters.type || undefined,
        category: filters.category || undefined,
        tag: filters.tag || undefined,
        favorite: filters.favorite || undefined,
        sort: filters.sort,
      }),
    [debouncedQuery, filters.type, filters.category, filters.tag, filters.favorite, filters.sort, page]
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, filters.type, filters.category, filters.tag, filters.favorite, filters.sort]);

  const activeFilters =
    Boolean(filters.q) + Boolean(filters.type) + Boolean(filters.category) + Boolean(filters.tag) + Boolean(filters.favorite);
  const activeCategory = filters.category ? categories?.find((category) => category.id === filters.category) : null;

  function update(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function clearFilters() {
    setFilters({ q: "", type: "", category: "", tag: "", favorite: "", sort: "newest" });
  }

  async function handleFavorite(item) {
    try {
      await archiveService.toggleFavorite(item.id);
      toast.success(item.isFavorite ? "Removed from favorites" : "Saved to favorites");
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Archive"
        title={activeCategory ? `${SUBSECTION_SECTION_LABELS[activeCategory.name] || "Archive"} / ${activeCategory.name}` : "All archives"}
        description={
          activeCategory
            ? `Everything saved under ${activeCategory.name}.`
            : "Every note, memory, link and idea you have saved — searchable, filterable and yours."
        }
        actions={
          <Button asChild>
            <Link href={filters.category ? `/archives/new?category=${filters.category}` : "/archives/new"}>
              <Plus /> New item
            </Link>
          </Button>
        }
      />

      <div className="glass rounded-2xl p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.q}
              onChange={(event) => update("q", event.target.value)}
              placeholder="Search titles, descriptions, content, tags…"
              className="pl-9"
            />
            {filters.q ? (
              <button
                type="button"
                onClick={() => update("q", "")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-auto">
            <Select value={filters.type || "all"} onValueChange={(value) => update("type", value === "all" ? "" : value)}>
              <SelectTrigger className="min-w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {ARCHIVE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.category || "all"} onValueChange={(value) => update("category", value === "all" ? "" : value)}>
              <SelectTrigger className="min-w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {(categories || []).map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.tag || "all"} onValueChange={(value) => update("tag", value === "all" ? "" : value)}>
              <SelectTrigger className="min-w-28">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
                {(tags || []).map((tag) => (
                  <SelectItem key={tag.id} value={tag.name}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sort} onValueChange={(value) => update("sort", value)}>
              <SelectTrigger className="min-w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((sort) => (
                  <SelectItem key={sort.value} value={sort.value}>
                    {sort.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/70 pt-3">
          <Button
            type="button"
            size="sm"
            variant={filters.favorite ? "default" : "outline"}
            onClick={() => update("favorite", filters.favorite ? "" : "true")}
          >
            <Bookmark className={cn(filters.favorite && "fill-current")} /> Favorites only
          </Button>
          {activeFilters ? (
            <Button type="button" size="sm" variant="ghost" onClick={clearFilters}>
              <X /> Clear filters
            </Button>
          ) : null}
          <span className="ml-auto hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
            <SlidersHorizontal className="size-3" /> {activeFilters || 0} filter{activeFilters === 1 ? "" : "s"}
          </span>
          <div className="flex rounded-2xl border border-border/60 bg-secondary/40 p-0.5 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={cn("rounded-xl p-1.5", view === "grid" ? "bg-card shadow-sm" : "text-muted-foreground")}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn("rounded-md p-1.5", view === "list" ? "bg-secondary" : "text-muted-foreground")}
              aria-label="List view"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {!loading && data?.meta ? (
        <p className="text-xs text-muted-foreground">
          {data.meta.total} item{data.meta.total === 1 ? "" : "s"}
          {filters.q ? ` matching “${filters.q}”` : ""}
        </p>
      ) : null}

      {error ? <ErrorState error={error} onRetry={refresh} /> : null}

      {loading ? <CardGridSkeleton count={6} /> : null}

      {!loading && data ? (
        data.items.length ? (
          <>
            {view === "grid" ? (
              <ArchiveGrid items={data.items} onFavorite={handleFavorite} />
            ) : (
              <div className="space-y-2">
                {data.items.map((item) => (
                  <ArchiveListItem key={item.id} item={item} onFavorite={handleFavorite} />
                ))}
              </div>
            )}
            <Pagination meta={data.meta} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState
            icon={Search}
            title={activeFilters ? "No matches in your archive" : "Your archive is empty"}
            description={
              activeFilters
                ? "Try a different search or clear a filter to widen the results."
                : "Save your first note, memory or link and it will appear here."
            }
            actionLabel={activeFilters ? undefined : "Capture something"}
            actionHref={activeFilters ? undefined : "/archives/new"}
            onAction={clearFilters}
          />
        )
      ) : null}

      {activeFilters ? (
        <div className="flex flex-wrap gap-1.5">
          {filters.type ? <Badge variant="secondary">{filters.type}</Badge> : null}
          {filters.category ? (
            <Badge variant="secondary">{categories?.find((category) => category.id === filters.category)?.name || "Category"}</Badge>
          ) : null}
          {filters.tag ? <Badge variant="secondary">#{filters.tag}</Badge> : null}
          {filters.favorite ? <Badge variant="secondary">Favorites</Badge> : null}
        </div>
      ) : null}
    </div>
  );
}

export default function ArchivesPage() {
  return (
    <Suspense fallback={<CardGridSkeleton count={6} />}>
      <ArchivesContent />
    </Suspense>
  );
}
