import { CategoryExperience } from "@/components/archives/category-experience";

export const metadata = { title: "Knowledge" };

export default function KnowledgePage() {
  return (
    <CategoryExperience
      eyebrow="Knowledge"
      title="Knowledge"
      description="Class notes, research, books and resources — the things you are learning and want to keep thinking with."
      icon="book"
      categoryNames={["Learning", "Research"]}
      allowedTypes={["note", "link", "book", "document", "video"]}
      defaultNewType="note"
      emptyDescription="Start with a class note, a link you want to revisit, or a book on your reading list."
      quote="An investment in knowledge pays the best interest."
    />
  );
}
