"use client";

import { useParams } from "next/navigation";
import { ArchiveForm } from "@/components/archives/archive-form";
import { PageLoading } from "@/components/common/loading";
import { ErrorState } from "@/components/common/error-state";
import { useApi } from "@/hooks/use-api";
import { archiveService } from "@/services/archive.service";

export default function EditArchivePage() {
  const { id } = useParams();
  const { data: archive, loading, error, refresh } = useApi(() => archiveService.get(id), [id]);

  if (loading) return <PageLoading />;
  if (error) return <ErrorState error={error} onRetry={refresh} />;
  if (!archive) return null;

  return <ArchiveForm archive={archive} />;
}
