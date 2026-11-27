"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArchiveForm } from "@/components/archives/archive-form";
import { PageLoading } from "@/components/common/loading";
import { ARCHIVE_TYPES } from "@/lib/constants";

function NewArchiveContent() {
  const searchParams = useSearchParams();
  const requestedType = searchParams.get("type");
  const initialType = ARCHIVE_TYPES.some((type) => type.value === requestedType) ? requestedType : "note";
  const initialCategory = searchParams.get("category") || "";
  return <ArchiveForm initialType={initialType} initialCategory={initialCategory} />;
}

export default function NewArchivePage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <NewArchiveContent />
    </Suspense>
  );
}
