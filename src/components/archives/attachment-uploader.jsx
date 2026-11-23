/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Paperclip, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadService } from "@/services/upload.service";

function isImage(attachment) {
  return attachment.resourceType === "image" || /\.(png|jpe?g|webp|gif)$/i.test(attachment.url);
}

export function AttachmentUploader({ value = [], onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    if (value.length + files.length > 10) {
      toast.error("You can attach up to 10 files");
      return;
    }

    setUploading(true);
    const uploaded = [];
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 10 MB`);
        continue;
      }
      try {
        const result = await uploadService.upload(file);
        uploaded.push({
          url: result.url,
          publicId: result.publicId,
          resourceType: result.resourceType,
          format: result.format,
          bytes: result.bytes,
          originalName: result.originalName,
        });
      } catch (error) {
        toast.error(error.message || `Could not upload ${file.name}`);
      }
    }

    if (uploaded.length) {
      onChange([...value, ...uploaded]);
      toast.success(`${uploaded.length} file${uploaded.length === 1 ? "" : "s"} attached`);
    }
    setUploading(false);
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,text/plain"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
        {uploading ? "Uploading…" : "Attach images or documents"}
      </Button>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        JPEG, PNG, WebP, GIF, PDF or text · up to 10 MB each. Stored in Cloudinary, never inside MongoDB.
      </p>

      {value.length ? (
        <div className="space-y-2">
          {value.map((attachment, index) => (
            <div key={`${attachment.publicId || attachment.url}-${index}`} className="flex items-center gap-2 rounded-lg border border-border p-2">
              {isImage(attachment) ? (
                <img src={attachment.url} alt="" className="size-9 rounded object-cover" />
              ) : (
                <span className="flex size-9 items-center justify-center rounded bg-secondary text-muted-foreground">
                  <FileText className="size-4" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs">{attachment.originalName || attachment.url.split("/").pop()}</p>
                <p className="text-[10px] text-muted-foreground">
                  {attachment.bytes ? `${Math.round(attachment.bytes / 1024)} KB` : "Attached file"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Remove attachment"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 py-4 text-xs text-muted-foreground">
          <Paperclip className="size-3.5" /> No attachments yet
        </div>
      )}
    </div>
  );
}
