"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColorPicker } from "@/components/common/color-picker";
import { collectionService } from "@/services/collection.service";

const schema = z.object({
  name: z.string().trim().min(1, "Give the collection a name").max(80),
  description: z.string().max(500).optional(),
  color: z.string().optional(),
});

export function CollectionDialog({ open, onOpenChange, collection = null, onSaved }) {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", color: "#7C6A9C" },
  });

  useEffect(() => {
    if (!open) return;
    setServerError("");
    reset({
      name: collection?.name || "",
      description: collection?.description || "",
      color: collection?.color || "#7C6A9C",
    });
  }, [open, collection, reset]);

  async function onSubmit(values) {
    setServerError("");
    try {
      const saved = collection
        ? await collectionService.update(collection.id, values)
        : await collectionService.create(values);
      toast.success(collection ? "Collection updated" : "Collection created");
      onOpenChange(false);
      onSaved?.(saved);
    } catch (error) {
      setServerError(error.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{collection ? "Edit collection" : "New collection"}</DialogTitle>
          <DialogDescription>Group related things — films, notes, memories or resources.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError ? <p className="rounded-lg bg-destructive/5 p-2 text-sm text-destructive">{serverError}</p> : null}
          <div className="space-y-1.5">
            <Label htmlFor="collection-name">Name</Label>
            <Input id="collection-name" placeholder="e.g. Films that changed me" {...register("name")} />
            {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="collection-description">Description</Label>
            <Textarea id="collection-description" rows={3} placeholder="What belongs in this collection?" {...register("description")} />
          </div>
          <div className="space-y-1.5">
            <Label>Color</Label>
            <Controller
              control={control}
              name="color"
              render={({ field }) => <ColorPicker value={field.value} onChange={field.onChange} />}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              {collection ? "Save changes" : "Create collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
