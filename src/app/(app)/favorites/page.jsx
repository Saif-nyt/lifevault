"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { ArchiveGrid } from "@/components/archives/archive-card";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { CardGridSkeleton } from "@/components/common/loading";
import { Pagination } from "@/components/common/pagination";
import { useApi } from "@/hooks/use-api";
import { archiveService } from "@/services/archive.service";

export default function FavoritesPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error, refresh } = useApi(
    () => archiveService.list({ favorite: "true", limit: 12, page, sort: "updated" }),
    [page]
  );

  async function handleFavorite(item) {
    try {
      await archiveService.toggleFavorite(item.id);
      toast.success("Removed from favorites");
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Kept close"
        title="Favorites"
        description="The pieces of your archive you return to most — a small shelf of what matters."
      />

      {error ? <ErrorState error={error} onRetry={refresh} /> : null}
      {loading ? <CardGridSkeleton count={6} /> : null}

      {!loading && data ? (
        data.items.length ? (
          <>
            <ArchiveGrid items={data.items} onFavorite={handleFavorite} />
            <Pagination meta={data.meta} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState
            icon={Bookmark}
            title="No favorites yet"
            description="Tap the bookmark on any archive item to keep it close. Favorites appear here and on your dashboard."
            actionLabel="Browse your archive"
            actionHref="/archives"
          />
        )
      ) : null}
    </div>
  );
}
