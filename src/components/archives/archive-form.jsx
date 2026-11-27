"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Bell, Bookmark, Loader2, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/common/tag-input";
import { MetadataFields } from "@/components/archives/metadata-fields";
import { AttachmentUploader } from "@/components/archives/attachment-uploader";
import { useApi } from "@/hooks/use-api";
import { archiveService } from "@/services/archive.service";
import { taxonomyService } from "@/services/taxonomy.service";
import { ARCHIVE_TYPES, SUBSECTION_SECTION_LABELS } from "@/lib/constants";
import { cn, fromDateInput, toDateInput, toDateTimeLocal } from "@/lib/utils";

const schema = z.object({
  title: z.string().trim().min(1, "Give this item a title").max(200, "Keep the title under 200 characters"),
  description: z.string().max(2000, "Keep the description under 2000 characters").optional(),
  content: z.string().max(100000).optional(),
  type: z.enum(ARCHIVE_TYPES.map((type) => type.value)),
  category: z.string().optional(),
  sourceUrl: z.union([z.string().trim().url("Enter a valid URL"), z.literal("")]).optional(),
  tags: z.array(z.string()).max(20, "Use up to 20 tags").optional(),
  isFavorite: z.boolean().optional(),
  reminderEnabled: z.boolean().optional(),
  reminderAt: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  attachments: z.array(z.record(z.string(), z.unknown())).max(10).optional(),
});

const DATE_FIELDS = new Set(["memoryDate", "eventDate", "takenAt"]);
const NUMBER_FIELDS = new Set(["rating", "year"]);

function buildDefaults(archive, initialType, initialCategory) {
  const metadata = archive?.metadata || {};
  return {
    title: archive?.title || "",
    description: archive?.description || "",
    content: archive?.content || "",
    type: archive?.type || initialType || "note",
    category: archive?.category?.id || initialCategory || "",
    sourceUrl: archive?.sourceUrl || "",
    tags: archive?.tags?.map((tag) => tag.name) || [],
    isFavorite: archive?.isFavorite || false,
    reminderEnabled: Boolean(archive?.reminderAt),
    reminderAt: toDateTimeLocal(archive?.reminderAt),
    metadata: {
      ...metadata,
      memoryDate: toDateInput(metadata.memoryDate),
      eventDate: toDateInput(metadata.eventDate),
      takenAt: toDateInput(metadata.takenAt),
      rating: metadata.rating ?? "",
      year: metadata.year ?? "",
    },
    attachments: archive?.attachments || [],
  };
}

function cleanMetadata(type, metadata = {}) {
  const output = {};
  Object.entries(metadata).forEach(([key, value]) => {
    if (value === "" || value === null || value === undefined) return;
    if (DATE_FIELDS.has(key)) {
      output[key] = fromDateInput(value);
      return;
    }
    if (NUMBER_FIELDS.has(key)) {
      const number = Number(value);
      if (!Number.isNaN(number)) output[key] = number;
      return;
    }
    output[key] = value;
  });
  return output;
}

export function ArchiveForm({ archive = null, initialType = "note", initialCategory = "" }) {
  const router = useRouter();
  const isEdit = Boolean(archive);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: buildDefaults(archive, initialType, initialCategory),
  });

  const type = useWatch({ control, name: "type" });
  const attachments = useWatch({ control, name: "attachments" });
  const isFavorite = useWatch({ control, name: "isFavorite" });
  const reminderEnabled = useWatch({ control, name: "reminderEnabled" });

  const { data: categories } = useApi(() => taxonomyService.categories(), []);
  const { data: tags } = useApi(() => taxonomyService.tags(), []);

  function selectType(nextType) {
    if (nextType === type) return;
    setValue("type", nextType, { shouldDirty: true });
    setValue("metadata", {}, { shouldDirty: true });
  }

  async function onSubmit(values) {
    setSubmitError("");
    const payload = {
      title: values.title.trim(),
      description: values.description || "",
      content: values.content || "",
      type: values.type,
      category: values.category || null,
      sourceUrl: values.sourceUrl || "",
      tags: values.tags || [],
      attachments: values.attachments || [],
      isFavorite: Boolean(values.isFavorite),
      reminderAt: Boolean(values.reminderEnabled) && values.reminderAt ? new Date(values.reminderAt).toISOString() : null,
      metadata: cleanMetadata(values.type, values.metadata),
    };

    try {
      const saved = isEdit
        ? await archiveService.update(archive.id, payload)
        : await archiveService.create(payload);
      toast.success(isEdit ? "Archive item updated" : "Saved to your archive");
      router.push(`/archives/${saved.id}`);
    } catch (error) {
      setSubmitError(error.message || "Could not save this item");
      toast.error(error.message || "Could not save this item", {
        description: Array.isArray(error.details) ? error.details.map((detail) => detail.message).join(" · ") : undefined,
      });
    }
  }

  const typeConfig = ARCHIVE_TYPES.find((item) => item.value === type);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Button asChild variant="ghost" size="icon" className="mt-0.5 shrink-0">
            <Link href={isEdit ? `/archives/${archive.id}` : "/archives"} aria-label="Go back">
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {isEdit ? "Edit archive item" : "New archive item"}
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {isEdit ? archive.title : "Capture something worth keeping"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {typeConfig?.description || "Choose a type, then give it enough detail to find it again."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-12 sm:pl-0">
          <Button asChild type="button" variant="outline">
            <Link href={isEdit ? `/archives/${archive.id}` : "/archives"}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
            {isEdit ? "Save changes" : "Save to vault"}
          </Button>
        </div>
      </div>

      {submitError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{submitError}</div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">What are you saving?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {ARCHIVE_TYPES.map((option) => {
                  const active = type === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => selectType(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-xs transition",
                        active
                          ? "border-primary bg-primary/5 font-medium text-primary"
                          : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground"
                      )}
                    >
                      <option.icon className="size-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 pt-5">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder={
                    type === "movie" ? "The film you watched" : type === "book" ? "The book you read" : "A clear, memorable title"
                  }
                  className="text-base"
                  {...register("title")}
                />
                {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Short description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="A sentence or two to help future-you remember the context."
                  {...register("description")}
                />
                {errors.description ? <p className="text-xs text-destructive">{errors.description.message}</p> : null}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Notes & content</Label>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Markdown-friendly</span>
                </div>
                <Textarea
                  id="content"
                  rows={8}
                  placeholder="Write freely. Markdown is stored as-is."
                  className="font-mono text-[13px] leading-relaxed"
                  {...register("content")}
                />
              </div>

              <MetadataFields type={type} control={control} register={register} />

              <div className="space-y-1.5">
                <Label htmlFor="sourceUrl">Source URL</Label>
                <Input id="sourceUrl" placeholder="https://…" {...register("sourceUrl")} />
                {errors.sourceUrl ? <p className="text-xs text-destructive">{errors.sourceUrl.message}</p> : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name="attachments"
                render={({ field }) => <AttachmentUploader value={field.value || []} onChange={field.onChange} />}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">Organize</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select value={field.value || "none"} onValueChange={(value) => field.onChange(value === "none" ? "" : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Uncategorized</SelectItem>
                        {(categories || []).map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <span className="flex items-center gap-2">
                              <span className="size-2 rounded-full" style={{ backgroundColor: category.color }} />
                              {category.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {(() => {
                  const selectedCategoryName = (categories || []).find((category) => category.id === field.value)?.name;
                  return selectedCategoryName ? (
                    <p className="text-[11px] text-muted-foreground">
                      {`${SUBSECTION_SECTION_LABELS[selectedCategoryName] || "Archive"} / ${selectedCategoryName}`}
                    </p>
                  ) : null;
                })()}
                <p className="text-[11px] text-muted-foreground">
                  Manage categories in <Link href="/settings" className="underline underline-offset-2">settings</Link>.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>Tags</Label>
                <Controller
                  control={control}
                  name="tags"
                  render={({ field }) => (
                    <TagInput value={field.value || []} onChange={field.onChange} suggestions={tags || []} />
                  )}
                />
              </div>

              <Controller
                control={control}
                name="isFavorite"
                render={({ field }) => (
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-2">
                      <Bookmark className={cn("size-4", isFavorite ? "fill-current text-primary" : "text-muted-foreground")} />
                      <div>
                        <p className="text-sm font-medium">Favorite</p>
                        <p className="text-[11px] text-muted-foreground">Keep this close on the dashboard</p>
                      </div>
                    </div>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-base">
                <Bell className="size-4" /> Reminder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Controller
                control={control}
                name="reminderEnabled"
                render={({ field }) => (
                  <div className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div className="flex items-center gap-2">
                      <Bell className={cn("size-4", field.value ? "fill-current text-primary" : "text-muted-foreground")} />
                      <div>
                        <p className="text-sm font-medium">Set a reminder</p>
                        <p className="text-[11px] leading-relaxed text-muted-foreground">Optional. Creates an in-app reminder linked to this item.</p>
                      </div>
                    </div>
                    <Switch
                      checked={Boolean(field.value)}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (!checked) setValue("reminderAt", "", { shouldDirty: true });
                      }}
                    />
                  </div>
                )}
              />
              {reminderEnabled ? (
                <Controller
                  control={control}
                  name="reminderAt"
                  render={({ field }) => <Input type="datetime-local" {...field} />}
                />
              ) : (
                <p className="text-[11px] leading-relaxed text-muted-foreground">No reminder set. Enable “Set a reminder” to add one.</p>
              )}
            </CardContent>
          </Card>

          <div className="rounded-xl border border-border bg-sidebar p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-primary" /> A small nudge
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Give future-you enough context: why it mattered, where it came from, and what you want to do with it.
            </p>
            <Badge variant="outline" className="mt-3">
              {attachments?.length || 0} attachment{attachments?.length === 1 ? "" : "s"}
            </Badge>
          </div>
        </div>
      </div>
    </form>
  );
}
