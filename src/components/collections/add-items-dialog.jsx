"use client";

import { useState } from "react";
import { Check, Loader2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApi, useDebouncedValue } from "@/hooks/use-api";
import { archiveService } from "@/services/archive.service";
import { collectionService } from "@/services/collection.service";
import { TYPE_CHIPS, TYPE_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AddItemsDialog({ collection, open, onOpenChange, onChanged }) {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, 300);
  const [busyId, setBusyId] = useState(null);
  const [added, setAdded] = useState([]);

  const { data, loading, refresh } = useApi(async () => {
    if (!open) return { items: [] };
    const result = await archiveService.list({ q: debounced || undefined, limit: 12, sort: "newest" });
    return result;
  }, [open, debounced]);

  const existing = new Set([...(collection.items || []).map((item) => String(item.id)), ...added]);

  async function add(item) {
    setBusyId(item.id);
    try {
      await collectionService.addItem(collection.id, item.id);
      toast.success(`Added “${item.title}”`);
      setAdded((current) => [...current, String(item.id)]);
      onChanged?.();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add items</DialogTitle>
          <DialogDescription>Search your archive and add anything to “{collection.name}”.</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, tag or content…"
            className="pl-9"
            autoFocus
          />
        </div>

        <div className="max-h-80 space-y-2 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : (data?.items || []).length ? (
            data.items.map((item) => {
              const type = TYPE_MAP[item.type] || TYPE_MAP.note;
              const Icon = type.icon;
              const isIn = existing.has(String(item.id));
              return (
                <div key={item.id} className="glass flex items-center gap-3 rounded-2xl p-2.5">
                  <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-md", TYPE_CHIPS[item.type])}>
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {type.label}
                      {item.category ? ` · ${item.category.name}` : ""}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={isIn ? "secondary" : "outline"}
                    disabled={isIn || busyId === item.id}
                    onClick={() => add(item)}
                  >
                    {busyId === item.id ? <Loader2 className="animate-spin" /> : isIn ? <Check /> : <Plus />}
                    {isIn ? "Added" : "Add"}
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No archive items found.
              <Button variant="link" size="sm" onClick={refresh} className="ml-1">
                Refresh
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <Badge variant="outline">{added.length} added this session</Badge>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
