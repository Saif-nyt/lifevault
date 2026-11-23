import { CategoryExperience } from "@/components/archives/category-experience";

export const metadata = { title: "Entertainment" };

export default function EntertainmentPage() {
  return (
    <CategoryExperience
      eyebrow="Entertainment"
      title="Entertainment"
      description="Films, shows, books and videos you have watched, want to watch, or never want to forget."
      icon="film"
      categoryNames={["Entertainment"]}
      allowedTypes={["movie", "book", "video"]}
      defaultNewType="movie"
      emptyDescription="Add a film you loved or a book you want to read. Ratings and reviews live with the item."
      quote="Stories are how we practice being human."
    />
  );
}
