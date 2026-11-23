"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reminderService } from "@/services/reminder.service";
import { toDateTimeLocal } from "@/lib/utils";

const schema = z.object({
  title: z.string().trim().min(1, "Give the reminder a title").max(200),
  note: z.string().max(1000).optional(),
  remindAt: z.string().min(1, "Choose a date and time"),
});

export function ReminderDialog({ open, onOpenChange, reminder = null, onSaved }) {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { title: "", note: "", remindAt: "" } });

  useEffect(() => {
    if (!open) return;
    setServerError("");
    reset({
      title: reminder?.title || "",
      note: reminder?.note || "",
      remindAt: toDateTimeLocal(reminder?.remindAt) || toDateTimeLocal(new Date(Date.now() + 60 * 60 * 1000)),
    });
  }, [open, reminder, reset]);

  async function onSubmit(values) {
    setServerError("");
    const payload = {
      title: values.title.trim(),
      note: values.note || "",
      remindAt: new Date(values.remindAt).toISOString(),
    };
    try {
      if (reminder) await reminderService.update(reminder.id, payload);
      else await reminderService.create(payload);
      toast.success(reminder ? "Reminder updated" : "Reminder created");
      onOpenChange(false);
      onSaved?.();
    } catch (error) {
      setServerError(error.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{reminder ? "Edit reminder" : "New reminder"}</DialogTitle>
          <DialogDescription>
            Reminders are shown inside LifeVault and in the notification bell. No email or push is sent.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError ? <p className="rounded-lg bg-destructive/5 p-2 text-sm text-destructive">{serverError}</p> : null}
          <div className="space-y-1.5">
            <Label htmlFor="reminder-title">Title</Label>
            <Input id="reminder-title" placeholder="What should future-you remember?" {...register("title")} />
            {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reminder-at">Date & time</Label>
            <Input id="reminder-at" type="datetime-local" {...register("remindAt")} />
            {errors.remindAt ? <p className="text-xs text-destructive">{errors.remindAt.message}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reminder-note">Note</Label>
            <Textarea id="reminder-note" rows={3} placeholder="Optional context…" {...register("note")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              {reminder ? "Save changes" : "Create reminder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
