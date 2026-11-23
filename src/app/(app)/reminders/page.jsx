"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CalendarClock, Check, CheckCircle2, MoreHorizontal, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { ReminderDialog } from "@/components/reminders/reminder-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApi } from "@/hooks/use-api";
import { reminderService } from "@/services/reminder.service";
import { cn, formatDateTime, relativeTime } from "@/lib/utils";

export default function RemindersPage() {
  const { data, loading, error, refresh } = useApi(() => reminderService.list(), []);
  const [tab, setTab] = useState("upcoming");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const reminders = data || [];
  const now = Date.now();
  const upcoming = reminders.filter((reminder) => !reminder.completed && new Date(reminder.remindAt).getTime() >= now);
  const overdue = reminders.filter((reminder) => !reminder.completed && new Date(reminder.remindAt).getTime() < now);
  const completed = reminders.filter((reminder) => reminder.completed);
  const visible = tab === "upcoming" ? [...overdue, ...upcoming] : tab === "completed" ? completed : reminders;

  async function toggleCompleted(reminder) {
    try {
      await reminderService.update(reminder.id, { completed: !reminder.completed });
      toast.success(reminder.completed ? "Reminder reopened" : "Reminder completed");
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete() {
    try {
      await reminderService.remove(deleting.id);
      toast.success("Reminder deleted");
      setDeleting(null);
      refresh();
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Follow-through"
        title="Reminders"
        description="A quiet nudge for the things you want to return to. Reminders are delivered in-app, never by email."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus /> New reminder
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Upcoming</p>
          <p className="mt-1 font-display text-2xl font-semibold">{upcoming.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Overdue</p>
          <p className="mt-1 font-display text-2xl font-semibold text-destructive">{overdue.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Completed</p>
          <p className="mt-1 font-display text-2xl font-semibold">{completed.length}</p>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming & overdue</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      {error ? <ErrorState error={error} onRetry={refresh} /> : null}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      ) : null}

      {!loading && data ? (
        visible.length ? (
          <div className="space-y-2">
            {visible.map((reminder) => {
              const isOverdue = !reminder.completed && new Date(reminder.remindAt).getTime() < now;
              return (
                <Card
                  key={reminder.id}
                  className={cn("flex items-start gap-3 p-4", isOverdue && "border-destructive/30 bg-destructive/[0.03]")}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
                      reminder.completed
                        ? "bg-secondary text-muted-foreground"
                        : isOverdue
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                    )}
                  >
                    {reminder.completed ? <CheckCircle2 className="size-4" /> : <Bell className="size-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={cn("font-medium", reminder.completed && "text-muted-foreground line-through")}>{reminder.title}</p>
                      {isOverdue ? <Badge variant="destructive">Overdue</Badge> : null}
                      {reminder.source === "archive" ? <Badge variant="outline">Linked to archive</Badge> : null}
                    </div>
                    {reminder.note ? <p className="mt-0.5 text-sm text-muted-foreground">{reminder.note}</p> : null}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDateTime(reminder.remindAt)} · {relativeTime(reminder.remindAt)}
                      {reminder.archive ? (
                        <>
                          {" · "}
                          <Link href={`/archives/${reminder.archive._id || reminder.archive}`} className="underline-offset-2 hover:underline">
                            {reminder.archive.title || "View linked item"}
                          </Link>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => toggleCompleted(reminder)} aria-label="Toggle completed">
                      {reminder.completed ? <RotateCcw className="size-3.5" /> : <Check className="size-3.5" />}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="Reminder actions">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            setEditing(reminder);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setDeleting(reminder)} className="text-destructive focus:text-destructive">
                          <Trash2 /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={CalendarClock}
            title={tab === "completed" ? "No completed reminders" : "No reminders here"}
            description={
              tab === "completed"
                ? "Completed reminders will collect here as you check things off."
                : "Set a reminder for something you want to return to. It will appear in the bell too."
            }
            actionLabel={tab === "completed" ? undefined : "Create a reminder"}
            onAction={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          />
        )
      ) : null}

      <ReminderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        reminder={editing}
        onSaved={() => {
          setEditing(null);
          refresh();
        }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete “${deleting?.title || "reminder"}”?`}
        description="The reminder will be removed. The archive item it links to is not affected."
        onConfirm={handleDelete}
      />
    </div>
  );
}
