import { CategoryExperience } from "@/components/archives/category-experience";

export const metadata = { title: "Ideas" };

export default function IdeasPage() {
  return (
    <CategoryExperience
      eyebrow="Ideas"
      title="Ideas"
      description="Business thoughts, experiments and half-formed sparks. Track them from draft to something real."
      icon="idea"
      categoryNames={["Ideas", "Business"]}
      allowedTypes={["idea"]}
      defaultNewType="idea"
      emptyDescription="Capture the thought before it disappears. Status and priority help you decide what to explore next."
      quote="An idea kept is an idea that can become something."
    />
  );
}
