/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  FolderHeart,
  Link2,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/common/error-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { AddToCollectionDialog } from "@/components/collections/add-to-collection-dialog";
import { useApi } from "@/hooks/use-api";
import { archiveService } from "@/services/archive.service";
import { SUBSECTION_SECTION_LABELS, TYPE_CHIPS, TYPE_MAP } from "@/lib/constants";
import { cn, formatDate, formatDateTime, relativeTime } from "@/lib/utils";

const META_LABELS = {
  author: "Author",
  status: "Status",
  rating: "Rating",
  notes: "Reading notes",
  genre: "Genre",
  director: "Director",
  year: "Year",
  review: "Personal review",
  priority: "Priority",
  memoryDate: "Memory date",
  eventDate: "Event date",
  takenAt: "Taken on",
  location: "Location",
  channel: "Channel",
  duration: "Duration",
};

const VALUE_LABELS = {
  "want-to-read": "Want to read",
  reading: "Reading",
  completed: "Completed",
  "to-watch": "To watch",
  watching: "Watching",
  watched: "Watched",
  draft: "Draft",
  exploring: "Exploring",
  implemented: "Implemented",
  archived: "Archived",
  low: "Low priority",
  medium: "Medium priority",
  high: "High priority",
};

function MetadataValue({ name, value }) {
  if (name === "rating") return <span>{value} / 5</span>;
  if (["memoryDate", "eventDate", "takenAt"].includes(name)) return <span>{formatDate(value)}</span>;
  if (name === "review" || name === "notes") {
    return <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{value}</p>;
  }
  return <span>{VALUE_LABELS[value] || String(value)}</span>;
}

export default function ArchiveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const { data: archive, loading, error, refresh, setData } = useApi(() => archiveService.get(id), [id]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);

  async function toggleFavorite() {
    try {
      const updated = await archiveService.toggleFavorite(archive.id);
      setData(updated);
      toast.success(updated.isFavorite ? "Added to favorites" : "Removed from favorites");
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Skeleton className="h-80" />
          <Skeleton className="h-56" />
        </div>
      </div>
    );
  }

  if (error) return <ErrorState error={error} onRetry={refresh} />;
  if (!archive) return null;

  const type = TYPE_MAP[archive.type] || TYPE_MAP.note;
  const Icon = type.icon;
  const metadataEntries = Object.entries(archive.metadata || {}).filter(([, value]) => value !== "" && value != null);
  const imageAttachments = (archive.attachments || []).filter(
    (attachment) => attachment.resourceType === "image" || /\.(png|jpe?g|webp|gif)$/i.test(attachment.url)
  );
  const fileAttachments = (archive.attachments || []).filter((attachment) => !imageAttachments.includes(attachment));
  const effectiveDate = archive.metadata?.memoryDate || archive.metadata?.eventDate;

  async function handleDelete() {
    try {
      await archiveService.remove(archive.id);
      toast.success("Archive item deleted");
      router.push("/archives");
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/archives">
            <ArrowLeft /> All archives
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleFavorite}>
            <Bookmark className={cn(archive.isFavorite && "fill-current text-primary")} />
            {archive.isFavorite ? "Favorited" : "Favorite"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCollectionOpen(true)}>
            <FolderHeart /> Add to collection
          </Button>
          <Button asChild size="sm">
            <Link href={`/archives/${archive.id}/edit`}>
              <Pencil /> Edit
            </Link>
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setDeleteOpen(true)} aria-label="Delete archive item">
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      </div>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", TYPE_CHIPS[archive.type])}>
            <Icon className="size-3.5" /> {type.label}
          </span>
          {archive.category ? (
            <Badge variant="outline">
              <span className="size-2 rounded-full" style={{ backgroundColor: archive.category.color }} />
              {archive.category.name}
            </Badge>
          ) : null}
          {archive.isFavorite ? <Badge variant="secondary">Favorite</Badge> : null}
        </div>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{archive.title}</h1>
        {archive.description ? <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">{archive.description}</p> : null}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" /> Saved {formatDate(archive.createdAt)}
          </span>
          {effectiveDate ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" /> {formatDate(effectiveDate)}
            </span>
          ) : null}
          {archive.reminderAt ? (
            <span className="inline-flex items-center gap-1.5 text-foreground">
              <Clock className="size-3.5" /> Reminder {formatDateTime(archive.reminderAt)}
            </span>
          ) : null}
        </div>
        {archive.tags?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {archive.tags.map((tag) => (
              <Link key={tag.id} href={`/archives?tag=${encodeURIComponent(tag.name)}`}>
                <Badge variant="outline" className="hover:bg-secondary">#{tag.name}</Badge>
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          {archive.content ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">{archive.content}</div>
              </CardContent>
            </Card>
          ) : null}

          {metadataEntries.length ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {metadataEntries.map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-0.5 border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:flex-row sm:gap-4">
                    <span className="w-36 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {META_LABELS[key] || key}
                    </span>
                    <div className="text-sm">
                      <MetadataValue name={key} value={value} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {imageAttachments.length ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base">Images</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {imageAttachments.map((attachment, index) => (
                  <a
                    key={`${attachment.url}-${index}`}
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-lg border border-border"
                  >
                    <img
                      src={attachment.url}
                      alt={attachment.originalName || "Archive attachment"}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </a>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {fileAttachments.length ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base">Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {fileAttachments.map((attachment, index) => (
                  <a
                    key={`${attachment.url}-${index}`}
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-border p-3 transition hover:bg-secondary/40"
                  >
                    <span className="flex size-9 items-center justify-center rounded bg-secondary text-muted-foreground">
                      <FileText className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{attachment.originalName || "Attached file"}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {attachment.bytes ? `${Math.round(attachment.bytes / 1024)} KB` : "Document"}
                      </p>
                    </div>
                    <ExternalLink className="size-4 text-muted-foreground" />
                  </a>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {!archive.content && !metadataEntries.length && !archive.attachments?.length ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                This item has no notes or attachments yet. Edit it to add more context.
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">At a glance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Type</span>
                <span>{type.label}</span>
              </div>
              <Separator />
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Category</span>
                <span>
                  {archive.category
                    ? `${SUBSECTION_SECTION_LABELS[archive.category.name] || "Archive"} / ${archive.category.name}`
                    : "Uncategorized"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Saved</span>
                <span>{formatDate(archive.createdAt)}</span>
              </div>
              <Separator />
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Updated</span>
                <span>{relativeTime(archive.updatedAt)}</span>
              </div>
              {archive.reminderAt ? (
                <>
                  <Separator />
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Reminder</span>
                    <span className="text-right">{formatDateTime(archive.reminderAt)}</span>
                  </div>
                </>
              ) : null}
              {archive.sourceUrl ? (
                <>
                  <Separator />
                  <a href={archive.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 text-primary hover:underline">
                    <span>Source</span>
                    <span className="inline-flex items-center gap-1 text-xs">
                      Open <Link2 className="size-3" />
                    </span>
                  </a>
                </>
              ) : null}
            </CardContent>
          </Card>

          {archive.metadata?.memoryDate || archive.metadata?.eventDate ? (
            <div className="rounded-xl border border-border bg-sidebar p-4 text-xs text-muted-foreground">
              Dated {formatDate(effectiveDate)} and grouped by that date in your timeline.
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => setCollectionOpen(true)}>
              <FolderHeart /> Add to collection
            </Button>
            <Button asChild variant="outline">
              <Link href={`/archives/${archive.id}/edit`}>
                <Pencil /> Edit this item
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this archive item?"
        description="The item, its reminder and its place in collections will be removed. Uploaded files stay in storage."
        onConfirm={handleDelete}
      />
      <AddToCollectionDialog archiveId={archive.id} open={collectionOpen} onOpenChange={setCollectionOpen} />
    </div>
  );
}
