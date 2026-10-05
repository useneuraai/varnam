"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Heart, X, ChevronRight } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import LiveTemplatePreview from "@/components/LiveTemplatePreview";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["All", "Classic (₹999)", "Premium (₹1,199)"];

export default function GalleryClient() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";
    if (isMockSupabase) {
      setUser({ email: "demo.user@varnam.com" });
      return;
    }
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory.includes("Classic") && tpl.price === 999) ||
      (selectedCategory.includes("Premium") && tpl.price === 1199);

    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-white text-zinc-800 flex flex-col selection:bg-gold-200 selection:text-black">
        
        {/* Premium Header */}
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="text-2xl font-black tracking-widest text-zinc-900">
              VARNAM
            </Link>
            <span className="hidden sm:inline text-[11px] tracking-widest text-zinc-400 font-bold uppercase">
              DESIGN TEMPLATES
            </span>
            {mounted && user ? (
              <Link href="/dashboard" className="text-[11px] tracking-widest text-[#b3811b] hover:text-[#c59b27] transition-colors font-bold uppercase">
                MY STUDIO
              </Link>
            ) : mounted ? (
              <Link href="/login" className="text-[11px] tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors font-bold uppercase">
                SIGN IN
              </Link>
            ) : (
              <div className="w-14 h-4 bg-zinc-100 rounded animate-pulse" />
            )}
          </div>
        </header>

        <main className="flex-grow">
        {/* Hero Intro Header */}
        <section className="relative overflow-hidden bg-white px-6 pb-12 pt-20 text-zinc-800 text-center">
          <div className="relative mx-auto w-full max-w-4xl flex flex-col items-center">
            <nav className="flex items-center justify-center gap-2 text-[10px] tracking-wider text-zinc-400 uppercase font-bold mb-8">
              <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-55" />
              <span className="text-zinc-900">Templates</span>
            </nav>
            
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600">
              {TEMPLATES.length} handcrafted designs
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-zinc-900 tracking-tight max-w-3xl">
              Beautiful invitations your guests will remember
            </h1>
            <p className="mt-5 max-w-xl text-zinc-500 text-sm leading-relaxed font-normal">
              Choose from curated templates with cinematic animations, music, RSVP, maps, and photo galleries — all shareable via one link.
            </p>

          </div>
        </section>

        {/* Sticky Filter Controls Panel */}
        <section className="sticky top-20 z-30 border-b border-zinc-100 bg-white/95 px-6 py-4 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            
            {/* Categories Pill Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 rounded-xl px-4 py-2 text-xs transition-all duration-200 font-bold uppercase tracking-wider ${
                      active
                        ? "bg-zinc-900 text-white shadow-sm"
                        : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 border border-zinc-200/60"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search query field */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search templates by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-zinc-200 text-zinc-800 placeholder-zinc-400 text-xs px-10 py-2.5 focus:border-zinc-900 focus:outline-none transition-colors rounded-xl shadow-none"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Gallery Cards Section */}
        <div className="max-w-7xl mx-auto px-6 py-12 w-full relative z-10">
          
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-20 border border-zinc-100 bg-white rounded-[24px] shadow-sm">
              <Heart className="w-12 h-12 text-zinc-300 stroke-[1.25] mx-auto mb-4" />
              <p className="text-zinc-500 italic text-base">
                No templates found matching your search.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-6 px-6 py-3 bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold tracking-widest uppercase transition-colors rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredTemplates.map((tpl) => (
                  <motion.div
                    layout
                    key={tpl.slug}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group relative flex flex-col bg-white rounded-[24px] overflow-hidden border border-zinc-150 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(179,129,27,0.08)] hover:border-[#eed57c]/60 transition-all duration-500"
                  >
                    {/* Thumbnail Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50 border-b border-zinc-100">
                      <LiveTemplatePreview slug={tpl.slug} autoScroll={false} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                      
                      <span className="absolute top-4 right-4 bg-zinc-950/85 backdrop-blur-md text-[#eed57c] text-[10px] tracking-widest uppercase px-3 py-1 font-bold rounded-lg shadow-sm pointer-events-none">
                        {tpl.price === 1199 ? "PREMIUM" : "CLASSIC"}
                      </span>
                    </div>

                    {/* Body details */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 suppressHydrationWarning className="text-xl text-zinc-900 font-bold font-serif tracking-wide mb-2">
                        {tpl.name}
                      </h2>
                      <p suppressHydrationWarning className="text-sm text-zinc-600 leading-relaxed mb-6 flex-grow font-normal line-clamp-2">
                        {tpl.description}
                      </p>

                      <div className="flex flex-col gap-4 border-t border-zinc-100 pt-4 mt-auto">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold">
                            {tpl.price === 1199 ? "Premium License" : "Classic License"}
                          </span>
                          <span className="text-lg text-zinc-950 font-extrabold font-serif">₹{tpl.price}</span>
                        </div>
                        
                        <div className="flex flex-col gap-2 w-full">
                          <Link
                            href={`/editor/${tpl.slug}`}
                            className="w-full bg-zinc-950 hover:bg-[#b3811b] text-white text-xs font-bold tracking-widest uppercase py-3.5 transition-all duration-300 border border-zinc-900 hover:border-[#b3811b] rounded-xl flex items-center justify-center min-h-[44px] shadow-sm"
                          >
                            Customize Template
                          </Link>
                          <Link
                            href={`/templates/${tpl.slug}`}
                            className="w-full text-xs tracking-widest uppercase font-bold text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-800 bg-white transition-all duration-300 py-3.5 rounded-xl flex items-center justify-center min-h-[44px]"
                            aria-label={`Preview ${tpl.name} template`}
                          >
                            Live Preview
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-8 px-6 border-t border-zinc-100 bg-white z-10 text-center flex flex-col items-center justify-center gap-2">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Varnam Wedding Invites. All rights reserved.
          </p>
        </footer>
      </div>
  );
}
