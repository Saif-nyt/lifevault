"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/common/color-picker";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApi } from "@/hooks/use-api";
import { taxonomyService } from "@/services/taxonomy.service";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryManager() {
  const { data, loading, refresh } = useApi(() => taxonomyService.categories(), []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#7A7A7A");
  const [busy, setBusy] = useState(false);

  const categories = data || [];

  function openCreate() {
    setEditing(null);
    setName("");
    setColor("#7A7A7A");
    setDialogOpen(true);
  }

  function openEdit(category) {
    setEditing(category);
    setName(category.name);
    setColor(category.color);
    setDialogOpen(true);
  }

  async function save(event) {
    event.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      if (editing) await taxonomyService.updateCategory(editing.id, { name: name.trim(), color });
      else await taxonomyService.createCategory({ name: name.trim(), color });
      toast.success(editing ? "Category updated" : "Category created");
      setDialogOpen(false);
      refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    try {
      await taxonomyService.deleteCategory(deleting.id);
      toast.success("Category deleted");
      setDeleting(null);
      refresh();
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }

  if (loading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{categories.length} categories</p>
          <p className="text-xs text-muted-foreground">Renaming a category keeps its archive items attached.</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus /> New category
        </Button>
      </div>

      <div className="divide-y divide-border rounded-lg border border-border">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-3 p-3">
            <span className="size-3 rounded-full" style={{ backgroundColor: category.color }} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{category.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {category.itemCount} item{category.itemCount === 1 ? "" : "s"}
              </p>
            </div>
            {category.isDefault ? <Badge variant="outline">Default</Badge> : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${category.name}`}>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => openEdit(category)}>
                  <Pencil /> Rename or recolor
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setDeleting(category)} className="text-destructive focus:text-destructive">
                  <Trash2 /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "New category"}</DialogTitle>
            <DialogDescription>Categories are personal to your account and can be recolored anytime.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="category-name">Name</Label>
              <Input id="category-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={40} autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>Color</Label>
              <ColorPicker value={color} onChange={setColor} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={busy}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy || !name.trim()}>
                {editing ? "Save changes" : "Create category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete “${deleting?.name || "category"}”?`}
        description={`${deleting?.itemCount || 0} item(s) will become uncategorized. They will not be deleted.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export function TagManager() {
  const { data, loading, refresh } = useApi(() => taxonomyService.tags(), []);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const tags = data || [];

  async function create(event) {
    event.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      await taxonomyService.createTag(name.trim());
      setName("");
      toast.success("Tag created");
      refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    try {
      await taxonomyService.deleteTag(deleting.id);
      toast.success("Tag deleted");
      setDeleting(null);
      refresh();
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }

  if (loading) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="space-y-4">
      <form onSubmit={create} className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="New tag name" className="pl-9" maxLength={30} />
        </div>
        <Button type="submit" disabled={busy || !name.trim()}>
          Add tag
        </Button>
      </form>

      {tags.length ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag.id} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
              #{tag.name}
              <span className="text-muted-foreground">{tag.itemCount}</span>
              <button
                type="button"
                onClick={() => setDeleting(tag)}
                className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
                aria-label={`Delete ${tag.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No tags yet. Tags can also be created while saving an archive item.
        </p>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete tag “${deleting?.name || ""}”?`}
        description="The tag will be removed from every archive item that uses it. The items themselves stay."
        onConfirm={handleDelete}
      />
    </div>
  );
}
