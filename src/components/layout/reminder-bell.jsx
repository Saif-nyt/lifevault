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
const READ_KEY = "lifevault-read-reminders";

function readStoredIds(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function writeStoredIds(key, ids) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(ids)));
  } catch {
    // Storage can be unavailable (private mode); read state simply won't persist.
  }
}

export function ReminderBell() {
  const { data, loading, refresh } = useApi(() => reminderService.list({ completed: "false" }));
  const reminders = data || [];
  const due = reminders.filter((reminder) => new Date(reminder.remindAt).getTime() <= Date.now());
  const [readIds, setReadIds] = useState(() => readStoredIds(READ_KEY));

  useEffect(() => {
    if (!due.length) return;
    const notified = readStoredIds(NOTIFIED_KEY);
    const fresh = due.filter((reminder) => !notified.has(reminder.id));
    if (!fresh.length) return;

    fresh.forEach((reminder) => {
      toast.info(reminder.title, { description: `Reminder due ${relativeTime(reminder.remindAt)}` });
    });
    const nextNotified = new Set(notified);
    fresh.forEach((item) => nextNotified.add(item.id));
    writeStoredIds(NOTIFIED_KEY, nextNotified);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [due.length]);

  useEffect(() => {
    const timer = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unread = due.filter((reminder) => !readIds.has(reminder.id));

  function markRead(reminder) {
    if (!reminder || readIds.has(reminder.id)) return;
    const next = new Set(readIds);
    next.add(reminder.id);
    setReadIds(next);
    writeStoredIds(READ_KEY, next);
  }

  function markAllRead() {
    const pending = due.filter((reminder) => !readIds.has(reminder.id));
    if (!pending.length) return;
    const next = new Set(readIds);
    pending.forEach((reminder) => next.add(reminder.id));
    setReadIds(next);
    writeStoredIds(READ_KEY, next);
  }

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
          {unread.length ? (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-semibold text-destructive-foreground">
              {unread.length}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2.5">
          <p className="text-sm font-medium">Reminders</p>
          {unread.length ? <Badge variant="destructive">{unread.length} due</Badge> : null}
        </div>
        <DropdownMenuSeparator className="m-0" />
        {unread.length ? (
          <div className="px-2 pt-1">
            <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={markAllRead}>
              <Check /> Mark all as read
            </Button>
          </div>
        ) : null}
        <div className="max-h-80 overflow-y-auto p-1">
          {loading ? (
            <div className="flex items-center justify-center py-6 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
            </div>
          ) : unread.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No unread reminders.</p>
          ) : (
            unread.slice(0, 6).map((reminder) => {
              const isDue = new Date(reminder.remindAt).getTime() <= Date.now();
              return (
                <div key={reminder.id} className="flex items-start gap-2 rounded-xl p-2 transition-colors hover:bg-secondary/60">
                  <button
                    type="button"
                    onClick={() => markRead(reminder)}
                    className="flex min-w-0 flex-1 items-start gap-2 rounded-xl text-left transition-colors hover:bg-secondary/60"
                    aria-label={`Mark reminder "${reminder.title}" as read`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{reminder.title}</p>
                      <p className={isDue ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
                        {formatDateTime(reminder.remindAt)}
                      </p>
                    </div>
                  </button>
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
