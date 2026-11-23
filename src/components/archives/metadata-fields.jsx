"use client";

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BOOK_STATUS, IDEA_PRIORITY, IDEA_STATUS, MOVIE_STATUS } from "@/lib/constants";

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function SelectField({ control, name, options, placeholder }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select value={field.value || ""} onValueChange={field.onChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

export function MetadataFields({ type, control, register }) {
  if (!type) return null;

  if (type === "memory") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Memory date" hint="When did this moment happen?">
          <Input type="date" {...register("metadata.memoryDate")} />
        </Field>
        <Field label="Location">
          <Input placeholder="Where were you?" {...register("metadata.location")} />
        </Field>
      </div>
    );
  }

  if (type === "event") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Event date">
          <Input type="date" {...register("metadata.eventDate")} />
        </Field>
        <Field label="Location">
          <Input placeholder="Where does it happen?" {...register("metadata.location")} />
        </Field>
      </div>
    );
  }

  if (type === "image") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Taken on">
          <Input type="date" {...register("metadata.takenAt")} />
        </Field>
        <Field label="Location">
          <Input placeholder="Where was this taken?" {...register("metadata.location")} />
        </Field>
      </div>
    );
  }

  if (type === "video") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Channel or creator">
          <Input placeholder="e.g. Kurzgesagt" {...register("metadata.channel")} />
        </Field>
        <Field label="Duration">
          <Input placeholder="e.g. 18 min" {...register("metadata.duration")} />
        </Field>
      </div>
    );
  }

  if (type === "book") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Author">
          <Input placeholder="Who wrote it?" {...register("metadata.author")} />
        </Field>
        <Field label="Reading status">
          <SelectField control={control} name="metadata.status" options={BOOK_STATUS} placeholder="Choose status" />
        </Field>
        <Field label="Your rating" hint="0 to 5, decimals allowed">
          <Input type="number" step="0.5" min="0" max="5" {...register("metadata.rating")} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Reading notes">
            <Textarea rows={4} placeholder="Ideas, quotes, thoughts…" {...register("metadata.notes")} />
          </Field>
        </div>
      </div>
    );
  }

  if (type === "movie") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Genre">
          <Input placeholder="Drama, sci-fi…" {...register("metadata.genre")} />
        </Field>
        <Field label="Director">
          <Input placeholder="Who directed it?" {...register("metadata.director")} />
        </Field>
        <Field label="Year">
          <Input type="number" min="1880" max="2200" {...register("metadata.year")} />
        </Field>
        <Field label="Watch status">
          <SelectField control={control} name="metadata.status" options={MOVIE_STATUS} placeholder="Choose status" />
        </Field>
        <Field label="Your rating" hint="0 to 5, decimals allowed">
          <Input type="number" step="0.5" min="0" max="5" {...register("metadata.rating")} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Personal review">
            <Textarea rows={4} placeholder="What did you think?" {...register("metadata.review")} />
          </Field>
        </div>
      </div>
    );
  }

  if (type === "idea") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Priority">
          <SelectField control={control} name="metadata.priority" options={IDEA_PRIORITY} placeholder="Choose priority" />
        </Field>
        <Field label="Status">
          <SelectField control={control} name="metadata.status" options={IDEA_STATUS} placeholder="Choose status" />
        </Field>
      </div>
    );
  }

  return null;
}
