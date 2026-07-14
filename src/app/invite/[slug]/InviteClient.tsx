"use client";

import { useState, useEffect } from "react";
import { templatesMap } from "@/templates";
import { InvitationRecord } from "@/lib/db";
import MusicToggle from "@/components/animations/MusicToggle";
import DoorReveal from "@/components/animations/DoorReveal";
import { Calendar, MapPin, Send, MessageSquare, Check, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TEMPLATES } from "@/lib/templates";

export default function InviteClient({ invitation }: { invitation: InvitationRecord }) {
  const [isDoorOpened, setIsDoorOpened] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [attendance, setAttendance] = useState("yes");
  const [wishes, setWishes] = useState("");
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpCompleted, setRsvpCompleted] = useState(false);

  // States for active template selection and guest wishes board
  const [activeTemplateSlug, setActiveTemplateSlug] = useState(invitation.template_slug);
  const [showTemplateSwitcher, setShowTemplateSwitcher] = useState(false);
  const [wishesList, setWishesList] = useState<any[]>([]);
  const [isLoadingWishes, setIsLoadingWishes] = useState(false);

  const TemplateComponent = templatesMap[activeTemplateSlug] || templatesMap["royal-tamil"];

  // Archived checking (5 days after event completes)
  const isArchived = new Date() > new Date(new Date(invitation.wedding_date).getTime() + 5 * 24 * 60 * 60 * 1000);

  const fetchWishes = async () => {
    try {
      setIsLoadingWishes(true);
      const res = await fetch(`/api/rsvps?slug=${invitation.slug}`);
      if (res.ok) {
        const data = await res.json();
        setWishesList(data);
      }
    } catch (err) {
      console.error("Error fetching wishes:", err);
    } finally {
      setIsLoadingWishes(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, [invitation.slug]);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRsvp(true);
    
    try {
      const res = await fetch("/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationSlug: invitation.slug,
          name: guestName,
          attendance,
          guestCount: Number(guestCount) || 1,
          wishes: wishes || "",
        }),
      });

      if (res.ok) {
        setRsvpCompleted(true);
        fetchWishes(); // reload board
        setTimeout(() => {
          setShowRsvpModal(false);
          // Reset state
          setGuestName("");
          setGuestCount("1");
          setAttendance("yes");
          setWishes("");
          setRsvpCompleted(false);
        }, 3000);
      } else {
        alert("Failed to submit RSVP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting RSVP. Please try again.");
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const handleCalendarAdd = () => {
    try {
      const date = new Date(invitation.wedding_date);
      const title = `Wedding: ${invitation.bride_name} & ${invitation.groom_name}`;
      const location = invitation.wedding_venue;
      
      const startTime = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const endDate = new Date(date.getTime() + 3 * 60 * 60 * 1000); // 3 hours duration
      const endTime = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
      
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title
      )}&dates=${startTime}/${endTime}&details=Cinematic+wedding+invitation+announcement.&location=${encodeURIComponent(
        location
      )}`;
      
      window.open(gcalUrl, "_blank");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative min-h-screen pb-24 template-container bg-black text-[#fbf6df]">
      {/* Archived / Locked Banner */}
      {isArchived && (
        <div className="bg-zinc-950/90 border-b border-gold-500/20 py-2.5 px-4 text-center sticky top-0 z-50 backdrop-blur-md">
          <span className="font-montserrat text-[10px] tracking-widest text-gold-400 uppercase font-bold flex items-center justify-center gap-1.5">
            ✦ Archived Invitation (License Exhausted) ✦
          </span>
        </div>
      )}

      {/* 3D Double Door Reveal Entrance */}
      {!isDoorOpened && (
        <DoorReveal
          brideName={invitation.bride_name}
          groomName={invitation.groom_name}
          templateSlug={activeTemplateSlug}
          onOpen={() => setIsDoorOpened(true)}
        />
      )}

      {/* Template Component */}
      <TemplateComponent data={invitation as any} />

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md glass-panel border border-gold-500/20 px-4 py-3 flex items-center justify-between shadow-[0_15px_30px_rgba(0,0,0,0.8)] rounded-none">
        {/* RSVP Button */}
        <button
          onClick={() => setShowRsvpModal(true)}
          className="flex-1 flex flex-col items-center gap-1 text-gold-300 hover:text-gold-200 transition-colors py-1 cursor-pointer"
        >
          <MessageSquare className="w-5 h-5 text-gold-400" />
          <span className="font-montserrat text-[9px] tracking-widest uppercase font-bold">RSVP NOW</span>
        </button>

        <div className="w-[1px] h-8 bg-gold-600/20" />

        {/* Add to Calendar */}
        <button
          onClick={handleCalendarAdd}
          className="flex-1 flex flex-col items-center gap-1 text-gold-300 hover:text-gold-200 transition-colors py-1 cursor-pointer"
        >
          <Calendar className="w-5 h-5 text-gold-400" />
          <span className="font-montserrat text-[9px] tracking-widest uppercase font-bold">CALENDAR</span>
        </button>

        <div className="w-[1px] h-8 bg-gold-600/20" />

        {/* Google Maps directions */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            invitation.wedding_venue
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center gap-1 text-gold-300 hover:text-gold-200 transition-colors py-1 text-center"
        >
          <MapPin className="w-5 h-5 text-gold-400" />
          <span className="font-montserrat text-[9px] tracking-widest uppercase font-bold">DIRECTIONS</span>
        </a>
      </div>

      {/* Guest Wishes Board Section */}
      {isDoorOpened && (
        <div className="max-w-4xl mx-auto py-16 px-6 text-center border-t border-gold-600/20 relative z-10 bg-black/60 backdrop-blur-md mb-20">
          <span className="font-serif text-[10px] tracking-[0.25em] text-gold-400 uppercase block">GUEST WISHES BOARD</span>
          <h2 className="font-cinzel text-2xl md:text-3xl text-gold-300 tracking-wider uppercase mt-2 mb-6">Blessings & Prayers</h2>
          <div className="h-[2px] w-12 bg-gold-500 mx-auto mb-10 rounded-full" />

          {isLoadingWishes ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mb-2" />
              <span className="text-[10px] tracking-widest text-gold-400/60 uppercase">Loading Wishes...</span>
            </div>
          ) : wishesList.length === 0 ? (
            <p className="font-serif text-sm italic text-gold-200/50 max-w-md mx-auto leading-relaxed py-6 border border-gold-500/10 bg-black/20 rounded-md">
              No blessings have been written yet. Be the first to leave a warm message for the couple!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gold-600/30">
              {wishesList.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="glass-card p-5 border border-gold-500/10 text-left bg-black/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-gold-500/10">
                      <span className="font-cinzel text-xs font-bold text-gold-300 uppercase tracking-wide truncate max-w-[70%]">
                        {item.name}
                      </span>
                      <span className="px-1.5 py-0.5 bg-gold-500/10 border border-gold-500/20 text-gold-400 font-montserrat text-[7px] tracking-widest uppercase font-bold">
                        {item.attendance === "yes" ? "ATTENDING" : "DECLINED"}
                      </span>
                    </div>
                    <p className="font-serif text-xs text-gold-100/80 leading-relaxed italic whitespace-pre-line mb-4">
                      "{item.wishes || "Wishing you both a lifetime of happiness!"}"
                    </p>
                  </div>
                  <span className="text-[8px] text-gold-500/40 font-montserrat text-right block">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }) : "Just now"}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating Template Switcher (Access to all templates for paid invites) */}
      {isDoorOpened && invitation.is_paid && (
        <div className="fixed bottom-24 left-6 z-50">
          <button
            onClick={() => setShowTemplateSwitcher(!showTemplateSwitcher)}
            className="w-12 h-12 bg-zinc-950 border border-gold-500/40 text-gold-400 hover:text-gold-300 hover:border-gold-400 flex items-center justify-center shadow-lg transition-all rounded-full cursor-pointer hover:scale-105"
            title="Switch Template Design"
          >
            <Sparkles className="w-5 h-5 text-gold-400" />
          </button>

          <AnimatePresence>
            {showTemplateSwitcher && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-16 left-0 bg-[#0a0a0b] border border-gold-500/20 p-4 shadow-2xl rounded-2xl w-60 max-h-72 overflow-y-auto flex flex-col gap-2 scrollbar-none"
              >
                <div className="border-b border-gold-500/10 pb-2 mb-1">
                  <span className="font-cinzel text-[9px] tracking-widest text-gold-400 uppercase font-bold block">
                    Choose Theme Design
                  </span>
                  <span className="font-serif text-[8px] text-gold-200/40">
                    Switch dynamic templates on the fly
                  </span>
                </div>
                {TEMPLATES.map((tpl) => {
                  const active = activeTemplateSlug === tpl.slug;
                  return (
                    <button
                      key={tpl.slug}
                      onClick={() => {
                        setActiveTemplateSlug(tpl.slug);
                        setShowTemplateSwitcher(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-montserrat tracking-wider uppercase transition-all flex items-center justify-between cursor-pointer ${
                        active
                          ? "bg-gold-500/10 text-gold-300 font-bold border border-gold-500/20 rounded-md"
                          : "text-neutral-400 hover:text-gold-200 hover:bg-neutral-900 rounded-md"
                      }`}
                    >
                      <span className="truncate">{tpl.name.replace(/[^a-zA-Z\s]/g, "")}</span>
                      {active && <span className="text-[8px] text-gold-400">●</span>}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Dynamic Background Music - Only play after doors open */}
      {isDoorOpened && invitation.music_enabled !== "no" && (
        <MusicToggle audioUrl={invitation.music_url} autoPlay={true} />
      )}

      {/* RSVP Modal Overlay */}
      <AnimatePresence>
        {showRsvpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-[#0a0a0b] border border-gold-500/20 p-6 shadow-2xl relative rounded-none max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-4 right-4 text-gold-400 hover:text-gold-200 cursor-pointer"
                aria-label="Close RSVP form"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <span className="font-serif text-[10px] tracking-[0.2em] text-gold-400 uppercase">RSVP SUBMISSION</span>
                <h3 className="font-cinzel text-xl text-gold-300 font-bold tracking-wide mt-1 uppercase">Will You Attend?</h3>
                <div className="h-[1px] w-20 bg-[#eed57c]/30 mx-auto mt-2" />
              </div>

              {rsvpCompleted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full border border-green-500/30 bg-green-950/20 flex items-center justify-center mb-4">
                    <Check className="w-7 h-7 text-green-400" />
                  </div>
                  <h4 className="font-cinzel text-base text-gold-300 font-bold uppercase tracking-wider mb-2">
                    RSVP Registered
                  </h4>
                  <p className="font-serif text-xs text-gold-200/60 leading-relaxed max-w-xs">
                    Thank you! Your response and prayers have been registered successfully. We look forward to seeing you.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  {/* Guest Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="rsvp-name" className="font-montserrat text-[9px] tracking-widest uppercase text-gold-300/80">
                      Your Name
                    </label>
                    <input
                      id="rsvp-name"
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-black/60 border border-gold-500/20 text-[#fbf6df] px-4 py-3 text-xs tracking-wider focus:border-gold-500/60 focus:outline-none placeholder-gold-300/10 rounded-none"
                    />
                  </div>

                  {/* Attendance Choice */}
                  <div className="flex flex-col gap-1.5">
                    <span className="font-montserrat text-[9px] tracking-widest uppercase text-gold-300/80 mb-1">
                      Are you attending?
                    </span>
                    <div className="flex gap-4">
                      <label className="flex-1 flex items-center justify-center gap-2 border border-gold-500/25 p-3 font-montserrat text-[10px] tracking-widest uppercase cursor-pointer hover:border-gold-400 transition-colors">
                        <input
                          type="radio"
                          name="attendance"
                          value="yes"
                          checked={attendance === "yes"}
                          onChange={() => setAttendance("yes")}
                          className="accent-gold-500"
                        />
                        YES, ATTENDING
                      </label>
                      <label className="flex-1 flex items-center justify-center gap-2 border border-gold-500/25 p-3 font-montserrat text-[10px] tracking-widest uppercase cursor-pointer hover:border-gold-400 transition-colors">
                        <input
                          type="radio"
                          name="attendance"
                          value="no"
                          checked={attendance === "no"}
                          onChange={() => setAttendance("no")}
                          className="accent-gold-500"
                        />
                        DECLINE
                      </label>
                    </div>
                  </div>

                  {/* Guest Count (only if attending) */}
                  {attendance === "yes" && (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="rsvp-count" className="font-montserrat text-[9px] tracking-widest uppercase text-gold-300/80">
                        Total Guests Attending
                      </label>
                      <select
                        id="rsvp-count"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="w-full bg-black border border-gold-500/20 text-gold-300 text-xs tracking-wider px-3 py-3 focus:border-gold-500/60 focus:outline-none"
                      >
                        <option value="1" className="bg-[#080708] text-[#fbf6df]">1 Guest</option>
                        <option value="2" className="bg-[#080708] text-[#fbf6df]">2 Guests</option>
                        <option value="3" className="bg-[#080708] text-[#fbf6df]">3 Guests</option>
                        <option value="4" className="bg-[#080708] text-[#fbf6df]">4 Guests</option>
                        <option value="5" className="bg-[#080708] text-[#fbf6df]">5 Guests</option>
                      </select>
                    </div>
                  )}

                  {/* Message of blessings */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="rsvp-wishes" className="font-montserrat text-[9px] tracking-widest uppercase text-gold-300/80">
                      Blessings & Warm Wishes
                    </label>
                    <textarea
                      id="rsvp-wishes"
                      rows={3}
                      value={wishes}
                      onChange={(e) => setWishes(e.target.value)}
                      placeholder="Wishing you a lifetime of joy and happiness!"
                      className="w-full bg-black/60 border border-gold-500/20 text-[#fbf6df] px-4 py-3 text-xs tracking-wider focus:border-gold-500/60 focus:outline-none placeholder-gold-300/10 rounded-none resize-none"
                    />
                  </div>

                  {/* Submit RSVP */}
                  <button
                    type="submit"
                    disabled={isSubmittingRsvp}
                    className="w-full mt-4 py-3.5 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-500 hover:to-gold-600 disabled:from-gold-800 disabled:to-gold-900 disabled:text-gold-400/50 text-black font-montserrat font-bold text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSubmittingRsvp ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        SUBMITTING...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        SUBMIT RSVP
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
