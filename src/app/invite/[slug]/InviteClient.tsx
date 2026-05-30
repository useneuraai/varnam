"use client";

import { useState } from "react";
import { templatesMap } from "@/templates";
import { InvitationRecord } from "@/lib/db";
import MusicToggle from "@/components/animations/MusicToggle";
import DoorReveal from "@/components/animations/DoorReveal";
import { Calendar, MapPin, Send, MessageSquare, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InviteClient({ invitation }: { invitation: InvitationRecord }) {
  const [isDoorOpened, setIsDoorOpened] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [attendance, setAttendance] = useState("yes");
  const [wishes, setWishes] = useState("");
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpCompleted, setRsvpCompleted] = useState(false);

  const TemplateComponent = templatesMap[invitation.template_slug] || templatesMap["royal-tamil"];

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRsvp(true);
    
    // Simulate API call for RSVP
    setTimeout(() => {
      setIsSubmittingRsvp(false);
      setRsvpCompleted(true);
      setTimeout(() => {
        setShowRsvpModal(false);
        // Reset state
        setGuestName("");
        setGuestCount("1");
        setAttendance("yes");
        setWishes("");
        setRsvpCompleted(false);
      }, 3000);
    }, 1500);
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
    <div className="relative min-h-screen pb-24 template-container">
      {/* 3D Double Door Reveal Entrance */}
      {!isDoorOpened && (
        <DoorReveal
          brideName={invitation.bride_name}
          groomName={invitation.groom_name}
          templateSlug={invitation.template_slug}
          onOpen={() => setIsDoorOpened(true)}
        />
      )}

      {/* Template Component */}
      <TemplateComponent data={invitation} />

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

      {/* Dynamic Background Music - Only play after doors open */}
      {isDoorOpened && (
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
