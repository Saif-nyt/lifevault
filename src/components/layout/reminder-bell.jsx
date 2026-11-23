"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApi } from "@/hooks/use-api";
import { reminderService } from "@/services/reminder.service";
import { formatDateTime, relativeTime } from "@/lib/utils";

const NOTIFIED_KEY = "lifevault-notified-reminders";

function readNotified() {
  try {
    return JSON.parse(sessionStorage.getItem(NOTIFIED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function ReminderBell() {
  const { data, loading, refresh } = useApi(() => reminderService.list({ completed: "false" }));
  const reminders = data || [];
  const due = reminders.filter((reminder) => new Date(reminder.remindAt).getTime() <= Date.now());

  useEffect(() => {
    if (!due.length) return;
    const notified = readNotified();
    const fresh = due.filter((reminder) => !notified.includes(reminder.id));
    if (!fresh.length) return;

    fresh.forEach((reminder) => {
      toast.info(reminder.title, { description: `Reminder due ${relativeTime(reminder.remindAt)}` });
    });
    sessionStorage.setItem(NOTIFIED_KEY, JSON.stringify([...notified, ...fresh.map((item) => item.id)]));
  }, [due.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function complete(reminder) {
    try {
      await reminderService.update(reminder.id, { completed: true });
      toast.success("Reminder completed");
      refresh();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Reminders">
          <Bell />
          {due.length ? (
            <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-semibold text-destructive-foreground">
              {due.length}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2.5">
          <p className="text-sm font-medium">Reminders</p>
          {due.length ? <Badge variant="destructive">{due.length} due</Badge> : null}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-80 overflow-y-auto p-1">
          {loading ? (
            <div className="flex items-center justify-center py-6 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
            </div>
          ) : reminders.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No reminders yet.</p>
          ) : (
            reminders.slice(0, 6).map((reminder) => {
              const isDue = new Date(reminder.remindAt).getTime() <= Date.now();
              return (
                <div key={reminder.id} className="flex items-start gap-2 rounded-md p-2 hover:bg-secondary/60">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{reminder.title}</p>
                    <p className={isDue ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
                      {formatDateTime(reminder.remindAt)}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => complete(reminder)} aria-label="Complete reminder">
                    <Check className="size-3.5" />
                  </Button>
                </div>
              );
            })
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <a href="/reminders" className="block px-3 py-2.5 text-center text-xs text-muted-foreground hover:text-foreground">
          View all reminders
        </a>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { DropdownMenuLabel };
