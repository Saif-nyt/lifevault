"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApi } from "@/hooks/use-api";
import { archiveService } from "@/services/archive.service";
import { ARCHIVE_TYPES, TYPE_CHIPS, TYPE_MAP } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function effectiveDate(item) {
  return item.metadata?.memoryDate || item.metadata?.eventDate || item.createdAt;
}

function groupItems(items, monthly) {
  const groups = new Map();
  items.forEach((item) => {
    const date = new Date(effectiveDate(item));
    const key = monthly
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      : date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  return Array.from(groups.entries());
}

export default function TimelinePage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState("all");
  const [dateField, setDateField] = useState("createdAt");
  const [type, setType] = useState("all");

  const { data, loading, error, refresh } = useApi(
    () =>
      archiveService.timeline({
        year,
        month: month === "all" ? undefined : month,
        dateField,
        type: type === "all" ? undefined : type,
      }),
    [year, month, dateField, type]
  );

  const items = data?.items || [];
  const years = data?.availableYears?.length ? data.availableYears : [currentYear];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Chronology"
        title="Timeline"
        description="Your archive in time — grouped by when it was saved, or by the memory date it carries."
        actions={
          <Button asChild>
            <Link href="/archives/new">
              <Plus /> New item
            </Link>
          </Button>
        }
      />

      <div className="glass flex flex-col gap-3 rounded-3xl p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" onClick={() => setYear((value) => value - 1)} aria-label="Previous year">
            <ChevronLeft />
          </Button>
          <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((availableYear) => (
                <SelectItem key={availableYear} value={String(availableYear)}>
                  {availableYear}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon-sm" onClick={() => setYear((value) => value + 1)} aria-label="Next year">
            <ChevronRight />
          </Button>

          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All months</SelectItem>
              {MONTHS.map((name, index) => (
                <SelectItem key={name} value={String(index + 1)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {ARCHIVE_TYPES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-muted p-1 text-xs">
          <button
            type="button"
            onClick={() => setDateField("createdAt")}
            className={cn("rounded-md px-3 py-1.5 transition", dateField === "createdAt" ? "bg-card font-medium shadow-sm" : "text-muted-foreground")}
          >
            Saved date
          </button>
          <button
            type="button"
            onClick={() => setDateField("memoryDate")}
            className={cn("rounded-md px-3 py-1.5 transition", dateField === "memoryDate" ? "bg-card font-medium shadow-sm" : "text-muted-foreground")}
          >
            Memory date
          </button>
        </div>
      </div>

      {error ? <ErrorState error={error} onRetry={refresh} /> : null}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      ) : null}

      {!loading && data ? (
        items.length ? (
          <div className="relative space-y-8 pl-4 sm:pl-6">
            <div className="absolute bottom-0 left-0 top-2 w-px bg-border sm:left-2" />
            {groupItems(items, month !== "all").map(([label, group]) => (
              <section key={label} className="relative">
                <div className="absolute -left-4 top-1.5 size-3 rounded-full border-2 border-background bg-primary sm:-left-5" />
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-xl font-semibold">{label}</h2>
                  <Badge variant="outline">{group.length}</Badge>
                </div>
                <div className="mt-4 space-y-2">
                  {group.map((item) => {
                    const type = TYPE_MAP[item.type] || TYPE_MAP.note;
                    const Icon = type.icon;
                    return (
                      <Link
                        key={item.id}
                        href={`/archives/${item.id}`}
                        className="glass flex items-start gap-3 rounded-2xl p-3.5 transition duration-300 hover:border-primary/25"
                      >
                        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", TYPE_CHIPS[item.type])}>
                          <Icon className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{item.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {formatDate(effectiveDate(item))}
                            {item.category ? ` · ${item.category.name}` : ""}
                            {item.description ? ` · ${item.description}` : ""}
                          </p>
                        </div>
                        <span className="hidden text-xs text-muted-foreground sm:block">{type.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarDays}
            title="Nothing on the timeline for this period"
            description="Try another year or month, switch the date type, or add something new to your archive."
            actionLabel="Add an item"
            actionHref="/archives/new"
          />
        )
      ) : null}
    </div>
  );
}
