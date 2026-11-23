"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FolderHeart, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { CardGridSkeleton } from "@/components/common/loading";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { CollectionDialog } from "@/components/collections/collection-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApi } from "@/hooks/use-api";
import { collectionService } from "@/services/collection.service";
import { formatDate } from "@/lib/utils";

export default function CollectionsPage() {
  const { data, loading, error, refresh } = useApi(() => collectionService.list(), []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const collections = data || [];

  async function handleDelete() {
    try {
      await collectionService.remove(deleting.id);
      toast.success("Collection deleted");
      setDeleting(null);
      refresh();
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Curated groups"
        title="Collections"
        description="Small, intentional groupings inside your archive — a shelf rather than a category."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus /> New collection
          </Button>
        }
      />

      {error ? <ErrorState error={error} onRetry={refresh} /> : null}
      {loading ? <CardGridSkeleton count={6} /> : null}

      {!loading && data ? (
        collections.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection) => (
              <Card key={collection.id} className="group relative overflow-hidden">
                <div className="h-1.5 w-full" style={{ backgroundColor: collection.color }} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="flex size-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${collection.color}20`, color: collection.color }}
                    >
                      <FolderHeart className="size-4" />
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="Collection actions">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            setEditing(collection);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => setDeleting(collection)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h2 className="mt-4 font-display text-xl font-semibold">
                    <Link href={`/collections/${collection.id}`} className="after:absolute after:inset-0 after:content-['']">
                      {collection.name}
                    </Link>
                  </h2>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {collection.description || "A quiet shelf in your archive."}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-xs text-muted-foreground">
                    <Badge variant="outline">{collection.itemCount} items</Badge>
                    <span>Updated {formatDate(collection.updatedAt)}</span>
                  </div>
                </div>
              </Card>
            ))}

            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
              className="flex min-h-44 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm text-muted-foreground transition hover:border-foreground/30 hover:text-foreground"
            >
              <Plus className="size-5" />
              Create another collection
            </button>
          </div>
        ) : (
          <EmptyState
            icon={FolderHeart}
            title="No collections yet"
            description="Collections are for the groupings that matter to you: favorite films, university notes, travel memories."
            actionLabel="Create a collection"
            onAction={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          />
        )
      ) : null}

      {collections.length ? (
        <div className="flex items-center justify-between rounded-xl border border-border bg-sidebar p-4 text-sm">
          <p className="text-muted-foreground">Looking for something specific?</p>
          <Button asChild variant="ghost" size="sm">
            <Link href="/archives">
              Browse all archives <ArrowRight />
            </Link>
          </Button>
        </div>
      ) : null}

      <CollectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        collection={editing}
        onSaved={() => {
          setEditing(null);
          refresh();
        }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete “${deleting?.name || "collection"}”?`}
        description="The collection will be deleted. The archive items inside it will not be removed."
        onConfirm={handleDelete}
      />
    </div>
  );
}
