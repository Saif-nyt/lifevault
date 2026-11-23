import { CategoryExperience } from "@/components/archives/category-experience";

export const metadata = { title: "Memories" };

export default function MemoriesPage() {
  return (
    <CategoryExperience
      eyebrow="Memories"
      title="Memories"
      description="Moments, places and people. The personal history that is easy to lose and worth keeping."
      icon="compass"
      categoryNames={["Memories"]}
      allowedTypes={["memory", "image", "event", "video"]}
      defaultNewType="memory"
      emptyDescription="Write down a moment, add a photo, or record a date you never want to forget."
      quote="We are what we remember, and what we choose to keep."
    />
  );
}
