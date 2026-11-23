"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, FolderHeart, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApi } from "@/hooks/use-api";
import { collectionService } from "@/services/collection.service";

export function AddToCollectionDialog({ archiveId, open, onOpenChange }) {
  const { data, loading, refresh } = useApi(() => collectionService.list(), [open]);
  const [busyId, setBusyId] = useState(null);

  async function toggle(collection) {
    const contains = (collection.items || []).some((itemId) => String(itemId) === String(archiveId));
    setBusyId(collection.id);
    try {
      if (contains) {
        await collectionService.removeItem(collection.id, archiveId);
        toast.success(`Removed from ${collection.name}`);
      } else {
        await collectionService.addItem(collection.id, archiveId);
        toast.success(`Added to ${collection.name}`);
      }
      refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to a collection</DialogTitle>
          <DialogDescription>Group this item with related things in your archive.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : (data || []).length ? (
          <div className="space-y-2">
            {data.map((collection) => {
              const contains = (collection.items || []).some((itemId) => String(itemId) === String(archiveId));
              return (
                <div key={collection.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: collection.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{collection.name}</p>
                    <p className="text-[11px] text-muted-foreground">{collection.itemCount} items</p>
                  </div>
                  <Button
                    size="sm"
                    variant={contains ? "secondary" : "outline"}
                    onClick={() => toggle(collection)}
                    disabled={busyId === collection.id}
                  >
                    {busyId === collection.id ? (
                      <Loader2 className="animate-spin" />
                    ) : contains ? (
                      <Check />
                    ) : (
                      <Plus />
                    )}
                    {contains ? "In collection" : "Add"}
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <FolderHeart className="mx-auto size-5 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">No collections yet.</p>
            <Button asChild size="sm" className="mt-3">
              <Link href="/collections">Create a collection</Link>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
