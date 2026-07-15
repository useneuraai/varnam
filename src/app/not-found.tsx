import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080708] text-[#fbf6df] flex flex-col items-center justify-center p-6 text-center select-none border-4 border-double border-gold-600/20 relative">
      {/* Corner Ornaments */}
      <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-[#d4a325]/30" />
      <div className="absolute top-4 right-4 w-10 h-10 border-t border-r border-[#d4a325]/30" />
      <div className="absolute bottom-4 left-4 w-10 h-10 border-b border-l border-[#d4a325]/30" />
      <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r border-[#d4a325]/30" />

      <div className="w-16 h-16 rounded-full border border-[#d4a325]/30 flex items-center justify-center mb-6 mx-auto">
        <span className="font-cinzel text-xl text-[#d4a325]">404</span>
      </div>

      <h1 className="font-cinzel text-3xl font-bold tracking-widest text-[#d4a325] mb-4">
        INVITATION NOT FOUND
      </h1>
      <p className="font-serif text-sm text-[#fbf6df]/60 max-w-sm leading-relaxed mb-8">
        This link might have expired, or the wedding hosting license is currently inactive. Please check the spelling or verify the link with the hosts.
      </p>
      
      <Link href="/" className="px-8 py-3.5 bg-zinc-950 border border-[#d4a325]/30 text-[#d4a325] hover:text-[#e5b73b] hover:border-[#e5b73b] transition-all text-xs tracking-widest font-bold uppercase rounded-xl">
        CREATE YOUR OWN WEDDING INVITE
      </Link>
    </div>
  );
}
