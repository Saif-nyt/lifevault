"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FolderHeart, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { CollectionDialog } from "@/components/collections/collection-dialog";
import { AddItemsDialog } from "@/components/collections/add-items-dialog";
import { useApi } from "@/hooks/use-api";
import { collectionService } from "@/services/collection.service";
import { TYPE_CHIPS, TYPE_MAP } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";

export default function CollectionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: collection, loading, error, refresh } = useApi(() => collectionService.get(id), [id]);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function removeItem(item) {
    try {
      await collectionService.removeItem(collection.id, item.id);
      toast.success(`Removed “${item.title}” from the collection`);
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete() {
    try {
      await collectionService.remove(collection.id);
      toast.success("Collection deleted");
      router.push("/collections");
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-64" />
      </div>
    );
  }
  if (error) return <ErrorState error={error} onRetry={refresh} />;
  if (!collection) return null;

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/collections">
          <ArrowLeft /> All collections
        </Link>
      </Button>

      <div className="glass relative overflow-hidden rounded-3xl border border-border/60 p-6 sm:p-8">
        <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: collection.color }} />
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span
                className="flex size-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${collection.color}20`, color: collection.color }}
              >
                <FolderHeart className="size-4" />
              </span>
              <Badge variant="outline">{collection.itemCount} items</Badge>
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{collection.name}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {collection.description || "A curated shelf inside your archive."}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Created {formatDate(collection.createdAt)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil /> Edit
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setDeleteOpen(true)} aria-label="Delete collection">
              <Trash2 className="text-destructive" />
            </Button>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus /> Add items
            </Button>
          </div>
        </div>
      </div>

      {collection.items.length ? (
        <div className="space-y-2">
          {collection.items.map((item) => {
            const type = TYPE_MAP[item.type] || TYPE_MAP.note;
            const Icon = type.icon;
            return (
              <Card key={item.id} className="relative flex items-center gap-3 p-3.5">
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", TYPE_CHIPS[item.type])}>
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/archives/${item.id}`}
                    className="block truncate text-sm font-medium after:absolute after:inset-0 after:content-['']"
                  >
                    {item.title}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {type.label}
                    {item.category ? ` · ${item.category.name}` : ""}
                    {item.tags?.length ? ` · #${item.tags.map((tag) => tag.name).join(" #")}` : ""}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeItem(item)}
                  aria-label={`Remove ${item.title}`}
                  className="relative z-10"
                >
                  <X className="size-3.5" />
                </Button>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FolderHeart}
          title="This collection is empty"
          description="Add archive items to build this shelf. You can always remove them later."
          actionLabel="Add items"
          onAction={() => setAddOpen(true)}
        />
      )}

      <CollectionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        collection={collection}
        onSaved={refresh}
      />
      <AddItemsDialog
        collection={collection}
        open={addOpen}
        onOpenChange={setAddOpen}
        onChanged={refresh}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete “${collection.name}”?`}
        description="The collection will be deleted. The archive items inside it will stay in your vault."
        onConfirm={handleDelete}
      />
    </div>
  );
}
