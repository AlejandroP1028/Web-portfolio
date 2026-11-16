import { notFound } from "next/navigation";
import ProjectPage from "@/components/learning/ProjectPage";
import { PROJECTS, bySlug } from "@/components/learning/projects";

export const generateStaticParams = () => PROJECTS.map((p) => ({ slug: p.slug }));

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = bySlug(params.slug);
  return { title: p ? `${p.title} | Alejandro Prado` : "Learning | Alejandro Prado", description: p?.line };
}

export default function Page({ params }: { params: { slug: string } }) {
  const p = bySlug(params.slug);
  if (!p) notFound();
  // keyed by project, so moving to the next one mounts a fresh page (its own transition state)
  return <ProjectPage key={p.slug} project={p} />;
}
