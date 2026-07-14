import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/lib/db";
import SuccessClient from "./SuccessClient";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function SuccessPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    notFound();
  }

  const serialized = {
    bride_name: invitation.bride_name,
    groom_name: invitation.groom_name,
    template_slug: invitation.template_slug,
    slug: invitation.slug,
  };

  return <SuccessClient invitation={serialized} />;
}
