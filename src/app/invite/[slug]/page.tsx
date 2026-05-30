import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/lib/db";
import InviteClient from "./InviteClient";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function InvitePage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    return (
      <div className="min-h-screen bg-[#080708] text-[#fbf6df] flex flex-col items-center justify-center p-6 text-center select-none border-4 border-double border-gold-600/20">
        {/* Ornate border accents */}
        <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-gold-400 opacity-45" />
        <div className="absolute top-4 right-4 w-10 h-10 border-t border-r border-gold-400 opacity-45" />
        <div className="absolute bottom-4 left-4 w-10 h-10 border-b border-l border-gold-400 opacity-45" />
        <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r border-gold-400 opacity-45" />

        <div className="w-16 h-16 rounded-full border border-gold-400/40 flex items-center justify-center mb-6 mx-auto">
          <span className="font-cinzel text-xl text-gold-300">ॐ</span>
        </div>

        <h1 className="font-cinzel text-3xl font-bold tracking-widest text-gold-400 mb-2">
          SACRED ANNOUNCEMENT
        </h1>
        <p className="font-serif text-sm text-gold-200/60 max-w-sm leading-relaxed mb-6">
          This invitation has not been registered yet or is currently under verification. Please check back shortly.
        </p>
      </div>
    );
  }

  return <InviteClient invitation={invitation} />;
}
