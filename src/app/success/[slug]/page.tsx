import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Copy, ExternalLink, Share2 } from "lucide-react";
import { getInvitationBySlug } from "@/lib/db";
import GoldParticles from "@/components/animations/GoldParticles";
import CopyButton from "./CopyButton"; // Client component helper for copy actions

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function SuccessPage({ params }: PageProps) {
  // Await params for compatibility with Next.js 15
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    notFound();
  }

  // Construct absolute URL (will use placeholder in SSR, updated client-side)
  const inviteUrl = `/invite/${slug}`;
  const whatsappText = `You are cordially invited to the wedding of ${invitation.bride_name} & ${invitation.groom_name}. Please view our cinematic digital invitation here: `;

  return (
    <div className="relative min-h-screen bg-[#080708] text-[#fbf6df] flex flex-col items-center justify-center p-6 overflow-hidden">
      <GoldParticles count={30} />

      <div className="max-w-xl w-full glass-card border border-gold-500/20 p-8 md:p-12 text-center relative z-20 shadow-2xl rounded-none">
        {/* Animated Checkmark */}
        <div className="w-20 h-20 rounded-full border border-gold-400/30 flex items-center justify-center mb-6 mx-auto bg-gold-950/20">
          <CheckCircle2 className="w-10 h-10 text-gold-400 stroke-[1.5]" />
        </div>

        <h1 className="font-cinzel text-2xl md:text-3xl font-bold tracking-widest text-gold-400 mb-2">
          TRANSACTION COMPLETE
        </h1>
        <p className="font-serif text-xs md:text-sm text-gold-200/60 tracking-wider uppercase mb-8">
          Your cinematic invitation is live
        </p>

        {/* Couple names display */}
        <div className="border-t border-b border-gold-600/10 py-6 mb-8">
          <p className="font-serif text-xs text-gold-200/50 uppercase tracking-widest mb-1">DESIGN PREPARATION FOR</p>
          <p className="font-cinzel text-xl text-gold-300 font-bold tracking-wider">
            {invitation.bride_name} &amp; {invitation.groom_name}
          </p>
        </div>

        {/* Share Link Box */}
        <div className="bg-black/60 border border-gold-500/20 p-4 mb-8 flex flex-col gap-2 relative">
          <span className="font-montserrat text-[9px] tracking-widest text-gold-400/60 uppercase text-left">
            PUBLIC LINK
          </span>
          <div className="flex items-center justify-between gap-4 font-mono text-xs text-gold-200 truncate select-all">
            <span className="truncate pr-4">/invite/{slug}</span>
            <CopyButton slug={slug} />
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              whatsappText + `https://varnam.wedding/invite/${slug}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-montserrat font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            WHATSAPP SHARE
          </a>

          <Link
            href={inviteUrl}
            target="_blank"
            className="flex-1 py-3.5 border border-gold-400/30 text-gold-300 hover:text-gold-100 hover:border-gold-400 font-montserrat text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 bg-black/40"
          >
            <ExternalLink className="w-4 h-4" />
            VIEW LIVE CARD
          </Link>
        </div>

        <div className="mt-8 border-t border-gold-600/10 pt-6">
          <Link
            href="/"
            className="font-montserrat text-[10px] tracking-widest text-gold-300/60 hover:text-gold-400 transition-colors uppercase"
          >
            RETURN TO HOMEPAGE
          </Link>
        </div>
      </div>
    </div>
  );
}
