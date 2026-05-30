"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Heart, X, ChevronRight } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";

const CATEGORIES = [
  "All",
  "Wedding",
  "Birthday",
  "Baby Shower",
  "Anniversary",
  "Corporate"
];

const RELIGIONS = ["All", "Hindu", "Muslim", "Christian", "Secular"];
const LANGUAGES = ["All", "English", "Tamil/English", "English/Urdu"];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedReligion, setSelectedReligion] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesCategory =
      selectedCategory === "All" ||
      tpl.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      tpl.description.toLowerCase().includes(selectedCategory.toLowerCase());
    
    const matchesReligion =
      selectedReligion === "All" ||
      tpl.religion.toLowerCase() === selectedReligion.toLowerCase();

    const matchesLanguage =
      selectedLanguage === "All" ||
      tpl.language.toLowerCase() === selectedLanguage.toLowerCase();

    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesReligion && matchesLanguage && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-[#1c1a17] font-sans flex flex-col selection:bg-gold-200 selection:text-black">
        
        {/* Premium Header */}
        <header className="sticky top-0 z-40 w-full bg-[#faf6f0]/85 backdrop-blur-xl border-b border-gold-500/10">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="font-cinzel text-2xl font-extrabold tracking-widest bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 bg-clip-text text-transparent">
              VARNAM
            </Link>
            <span className="hidden sm:inline font-montserrat text-[10px] tracking-[0.3em] text-gold-600 font-bold uppercase">
              DESIGN TEMPLATES
            </span>
            <Link href="/" className="font-montserrat text-xs tracking-widest text-[#5d5548] hover:text-gold-600 transition-colors font-bold uppercase">
              BACK TO HOME
            </Link>
          </div>
        </header>

        {/* Hero Intro Header */}
        <section className="relative overflow-hidden bg-[#faf6f0] px-6 pb-16 pt-20 text-[#1c1a17] text-center border-b border-gold-500/10">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(194,163,83,0.1),transparent_55%)]" />
          </div>

          <div className="relative mx-auto w-full max-w-4xl flex flex-col items-center">
            <nav className="flex items-center justify-center gap-2 font-montserrat text-[10px] tracking-wider text-[#9a9590] uppercase font-bold mb-8">
              <Link href="/" className="hover:text-gold-600 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-55" />
              <span className="text-gold-600">Templates</span>
            </nav>
            
            <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.25em] text-gold-600">
              {TEMPLATES.length} handcrafted designs
            </p>
            <h1 className="mt-4 font-cinzel text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#1c1a17] uppercase tracking-wide">
              Beautiful invitations your guests will remember
            </h1>
            <p className="mt-5 max-w-xl font-serif text-sm leading-relaxed text-[#5d5548]">
              Choose from curated templates with cinematic animations, music, RSVP, maps, and photo galleries — all shareable via one link.
            </p>
          </div>
        </section>

        {/* Sticky Filter Controls Panel */}
        <section className="sticky top-20 z-30 border-b border-gold-500/10 bg-[#faf8f5]/90 px-6 py-4 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            
            {/* Categories Pill Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 rounded-full px-4 py-1.5 font-montserrat text-[11px] transition-all duration-200 font-bold uppercase tracking-wider ${
                      active
                        ? "bg-[#1c1a17] text-white shadow-sm"
                        : "bg-white text-[#6b6660] hover:bg-gold-500/5 hover:text-[#1c1a17] border border-gold-500/10"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search & Combobox Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] items-center gap-3 w-full lg:max-w-2xl">
              {/* Search query field */}
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gold-500/15 text-[#1c1a17] placeholder-[#9a9590] text-xs font-montserrat px-10 py-2.5 focus:border-gold-600 focus:outline-none transition-colors rounded-full shadow-sm"
                />
                <Search className="w-3.5 h-3.5 text-[#9a9590] absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9a9590] hover:text-[#1c1a17]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Religion Selector */}
              <div className="relative">
                <select
                  value={selectedReligion}
                  onChange={(e) => setSelectedReligion(e.target.value)}
                  className="w-full bg-white border border-gold-500/15 text-[#342c25] text-xs font-montserrat px-3.5 py-2.5 focus:border-gold-600 focus:outline-none rounded-full shadow-sm appearance-none pr-8 cursor-pointer uppercase tracking-wider font-bold"
                >
                  <option value="All">All Religions</option>
                  {RELIGIONS.filter(r => r !== "All").map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9a9590] pointer-events-none font-bold text-[8px] font-sans">▼</div>
              </div>

              {/* Language Selector */}
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-white border border-gold-500/15 text-[#342c25] text-xs font-montserrat px-3.5 py-2.5 focus:border-gold-600 focus:outline-none rounded-full shadow-sm appearance-none pr-8 cursor-pointer uppercase tracking-wider font-bold"
                >
                  <option value="All">All Languages</option>
                  {LANGUAGES.filter(l => l !== "All").map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9a9590] pointer-events-none font-bold text-[8px] font-sans">▼</div>
              </div>

            </div>

          </div>
        </section>

        {/* Gallery Cards Section */}
        <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow relative z-10">
          
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-20 border border-gold-500/10 bg-white rounded-2xl shadow-sm">
              <Heart className="w-12 h-12 text-gold-500/40 stroke-[1.25] mx-auto mb-4" />
              <p className="font-serif text-[#6b6660] italic text-base">
                No templates found matching your active filter criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedReligion("All");
                  setSelectedLanguage("All");
                  setSearchQuery("");
                }}
                className="mt-6 px-6 py-3 bg-[#1c1a17] text-white hover:bg-gold-600 hover:text-black font-montserrat text-[10px] font-bold tracking-widest uppercase transition-colors rounded-full"
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
                    className="group relative flex flex-col bg-white border border-gold-500/10 rounded-2xl overflow-hidden shadow-md shadow-gold-500/5 transition-all duration-300 hover:shadow-2xl hover:border-gold-500/35"
                  >
                    {/* Thumbnail Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tpl.thumbnailUrl}
                        alt={tpl.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1c1a17]/80 via-transparent to-transparent" />
                      
                      <span className="absolute top-4 left-4 bg-white/95 text-[#1c1a17] text-[9px] tracking-widest uppercase px-3 py-1 font-montserrat font-bold shadow-sm rounded-full">
                        {tpl.religion}
                      </span>

                      <span className="absolute top-4 right-4 bg-black/50 text-white text-[9px] tracking-widest uppercase px-3 py-1 font-montserrat font-bold backdrop-blur-sm rounded-full">
                        {tpl.category}
                      </span>
                    </div>

                    {/* Body details */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                        <span className="font-montserrat text-[9px] tracking-widest text-[#9a9590] uppercase font-bold">
                          {tpl.language}
                        </span>
                      </div>

                      <h2 className="font-cinzel text-xl text-[#1c1a17] font-bold tracking-wide uppercase mb-2">
                        {tpl.name}
                      </h2>
                      <p className="font-serif text-xs text-[#6b6660] leading-relaxed mb-6 flex-grow">
                        {tpl.description}
                      </p>

                      <div className="flex items-center justify-between border-t border-gold-500/10 pt-4 mt-auto">
                        <span className="font-cinzel text-base text-gold-700 font-extrabold">
                          ₹{tpl.price}
                        </span>
                        <div className="flex gap-2">
                          <Link
                            href={`/templates/${tpl.slug}`}
                            className="text-[9px] tracking-widest uppercase font-montserrat text-[#5d5548] hover:text-gold-600 transition-colors px-3 py-2 font-bold"
                          >
                            PREVIEW
                          </Link>
                          <Link
                            href={`/editor/${tpl.slug}`}
                            className="bg-gold-600 text-black text-[9px] tracking-widest uppercase font-montserrat font-bold px-3.5 py-2 hover:bg-gold-500 transition-colors shadow-sm rounded-md"
                          >
                            USE TEMPLATE
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <footer className="w-full py-10 px-6 border-t border-gold-500/15 bg-white z-10 text-center">
          <p className="font-serif text-xs text-[#6b6660]">
            © {new Date().getFullYear()} Varnam Wedding Invites. All rights reserved.
          </p>
        </footer>
      </div>
  );
}
