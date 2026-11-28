"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArchiveForm } from "@/components/archives/archive-form";
import { PageLoading } from "@/components/common/loading";
import { ARCHIVE_TYPES, getSubcategoryMeta } from "@/lib/constants";

function NewArchiveContent() {
  const searchParams = useSearchParams();
  const requestedType = searchParams.get("type");
  const initialType = ARCHIVE_TYPES.some((type) => type.value === requestedType) ? requestedType : "note";
  const initialCategory = searchParams.get("category") || "";
  const requestedSubcategory = searchParams.get("subcategory");
  const initialSubcategory = getSubcategoryMeta(requestedSubcategory) ? requestedSubcategory : "";
  return (
    <ArchiveForm
      initialType={initialType}
      initialCategory={initialCategory}
      initialSubcategory={initialSubcategory}
    />
  );
}

export default function NewArchivePage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <NewArchiveContent />
    </Suspense>
  );
}