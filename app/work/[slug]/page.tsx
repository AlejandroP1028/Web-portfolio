import { notFound } from "next/navigation";
import ProjectPage from "@/components/learning/ProjectPage";
import { WORK, bySlug } from "@/components/learning/projects";

export const generateStaticParams = () => WORK.map((p) => ({ slug: p.slug }));

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = bySlug(params.slug, "work");
  return { title: p ? `${p.title} | Alejandro Prado` : "Work | Alejandro Prado", description: p?.line };
}

export default function Page({ params }: { params: { slug: string } }) {
  const p = bySlug(params.slug, "work");
  if (!p) notFound();
  return <ProjectPage key={p.slug} project={p} side="work" />;
}
