// TODO: Individual resort detail page — stats, terrain map, lifts, dining, lodging nearby, ski school, reviews
import { resorts } from "@/data";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return resorts.map((r) => ({ slug: r.slug }));
}

export default function ResortDetailPage({ params }: { params: { slug: string } }) {
  return <main><p>Resort detail: {params.slug}</p></main>;
}
