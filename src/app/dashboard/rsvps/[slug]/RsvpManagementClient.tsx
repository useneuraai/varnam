"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { RsvpRecord } from "@/lib/db";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ArrowLeft,
  FileDown,
  Trash2,
  Check,
  Search,
  X,
  ChevronRight,
  MessageSquare,
  Phone,
  Utensils,
  ExternalLink,
} from "lucide-react";

interface InvitationData {
  id?: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  wedding_date?: string;
  wedding_venue?: string;
  template_slug?: string;
  title?: string;
  is_paid?: boolean;
  status?: string;
  user_id?: string;
}

type FilterStatus = "all" | "attending" | "declined" | "pending";

const STORAGE_KEY_RSVP_PREFIX = "varnam_cached_rsvps_";
const STORAGE_KEY_INV_PREFIX = "varnam_cached_inv_";

export default function RsvpManagementClient({ slug }: { slug: string }) {
  const [mounted, setMounted] = useState(false);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [rsvps, setRsvps] = useState<RsvpRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  // Selected RSVP detail view & Deletion state
  const [selectedRsvp, setSelectedRsvp] = useState<RsvpRecord | null>(null);
  const [rsvpToDelete, setRsvpToDelete] = useState<RsvpRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch real invitation and RSVPs from Supabase / database
  const fetchData = async () => {
    setError(null);

    try {
      const isMock = !isSupabaseConfigured;
      let token = "mock-user-token";

      if (!isMock) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setError("You must be logged in to view RSVPs.");
          setLoading(false);
          return;
        }
        token = session.access_token;
      }

      // 1. Fetch Invitation details
      const invRes = await fetch(`/api/invitations/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!invRes.ok) {
        if (invRes.status === 401) {
          setError("Session expired. Please log in.");
          return;
        }
        if (invRes.status === 403) {
          setError("Access restricted: You do not own this invitation's RSVPs.");
          return;
        }
        throw new Error("Invitation not found");
      }

      const invData = await invRes.json();
      setInvitation(invData);
      try {
        localStorage.setItem(STORAGE_KEY_INV_PREFIX + slug, JSON.stringify(invData));
      } catch {}

      // 2. Fetch RSVPs based on template/invitation identifier
      const rsvpRes = await fetch(`/api/rsvps?slug=${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!rsvpRes.ok) {
        if (rsvpRes.status === 403) {
          setError("Access restricted: You do not own this invitation's RSVPs.");
          return;
        }
        throw new Error("Failed to load RSVP records");
      }

      const rsvpData = await rsvpRes.json();
      const realRsvps = Array.isArray(rsvpData) ? rsvpData : [];
      setRsvps(realRsvps);
      try {
        localStorage.setItem(STORAGE_KEY_RSVP_PREFIX + slug, JSON.stringify(realRsvps));
      } catch {}
    } catch (err: any) {
      console.error("Error loading RSVPs:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    try {
      const cachedRsvps = localStorage.getItem(STORAGE_KEY_RSVP_PREFIX + slug);
      if (cachedRsvps) {
        const parsed = JSON.parse(cachedRsvps);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRsvps(parsed);
          setLoading(false);
        }
      }
      const cachedInv = localStorage.getItem(STORAGE_KEY_INV_PREFIX + slug);
      if (cachedInv) {
        setInvitation(JSON.parse(cachedInv));
      }
    } catch {}

    fetchData();
  }, [slug]);

  // Normalized Status Helper
  const getNormalizedStatus = (rsvp: RsvpRecord): "attending" | "not_attending" | "undecided" => {
    if (rsvp.attendance_status) {
      if (rsvp.attendance_status === "attending") return "attending";
      if (rsvp.attendance_status === "not_attending") return "not_attending";
      return "undecided";
    }
    if (rsvp.attendance === "yes") return "attending";
    if (rsvp.attendance === "no") return "not_attending";
    return "undecided";
  };

  // Metrics from real submitted RSVP records
  const metrics = useMemo(() => {
    const totalResponses = rsvps.length;
    let attendingResponses = 0;
    let totalAttendingGuests = 0;
    let declinedResponses = 0;
    let pendingResponses = 0;

    for (const r of rsvps) {
      const status = getNormalizedStatus(r);
      if (status === "attending") {
        attendingResponses += 1;
        totalAttendingGuests += Math.max(1, Number(r.guest_count) || 1);
      } else if (status === "not_attending") {
        declinedResponses += 1;
      } else {
        pendingResponses += 1;
      }
    }

    return {
      totalResponses,
      attendingResponses,
      totalAttendingGuests,
      declinedResponses,
      pendingResponses,
    };
  }, [rsvps]);

  // Combined Search and Filter
  const filteredRsvps = useMemo(() => {
    return rsvps.filter((rsvp) => {
      const status = getNormalizedStatus(rsvp);

      let matchesStatus = true;
      if (activeFilter === "attending") {
        matchesStatus = status === "attending";
      } else if (activeFilter === "declined") {
        matchesStatus = status === "not_attending";
      } else if (activeFilter === "pending") {
        matchesStatus = status === "undecided";
      }

      const query = searchQuery.trim().toLowerCase();
      let matchesSearch = true;
      if (query) {
        const guestName = (rsvp.guest_name || rsvp.name || "").toLowerCase();
        const contact = (rsvp.guest_contact || rsvp.phone || rsvp.email || "").toLowerCase();
        const message = (rsvp.wishes || rsvp.message || "").toLowerCase();
        matchesSearch = guestName.includes(query) || contact.includes(query) || message.includes(query);
      }

      return matchesStatus && matchesSearch;
    });
  }, [rsvps, activeFilter, searchQuery]);

  // PDF Export
  const handleExportPdf = () => {
    if (rsvps.length === 0) return;
    setIsExporting(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(24, 24, 27);
      doc.text("GUEST RSVPS", 40, 50);

      const coupleNames = invitation
        ? `${invitation.bride_name} & ${invitation.groom_name}`
        : "Wedding Invitation";
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(113, 113, 122);
      doc.text(coupleNames, 40, 68);

      doc.setDrawColor(228, 228, 231);
      doc.setLineWidth(0.5);
      doc.line(40, 78, 555, 78);

      doc.setFontSize(8.5);
      doc.setTextColor(113, 113, 122);
      doc.text(
        `Total: ${metrics.totalResponses} • Attending: ${metrics.attendingResponses} (${metrics.totalAttendingGuests} guests) • Not Attending: ${metrics.declinedResponses} • Awaiting: ${metrics.pendingResponses}`,
        40,
        94
      );

      const rows = filteredRsvps.map((rsvp, idx) => {
        const status = getNormalizedStatus(rsvp);
        const guestName = rsvp.guest_name || rsvp.name || "Guest";
        const count = Math.max(1, Number(rsvp.guest_count) || 1);
        const contact = rsvp.guest_contact || rsvp.phone || rsvp.email || "—";
        const statusText =
          status === "attending"
            ? `Attending (${count})`
            : status === "not_attending"
            ? "Not attending"
            : "Awaiting response";
        const wishes = rsvp.wishes || rsvp.message || "—";

        return [String(idx + 1), guestName, contact, statusText, wishes];
      });

      autoTable(doc, {
        head: [["#", "GUEST NAME", "PHONE / CONTACT", "STATUS", "MESSAGE"]],
        body: rows,
        startY: 108,
        margin: { left: 40, right: 40 },
        theme: "plain",
        styles: {
          font: "helvetica",
          fontSize: 8.5,
          cellPadding: 7,
          textColor: [24, 24, 27],
          lineColor: [244, 244, 245],
          lineWidth: 0.5,
        },
        headStyles: {
          textColor: [113, 113, 122],
          fontStyle: "bold",
          fontSize: 8,
        },
        columnStyles: {
          0: { cellWidth: 24 },
          1: { cellWidth: 120, fontStyle: "bold" },
          2: { cellWidth: 90 },
          3: { cellWidth: 95 },
          4: { cellWidth: 185 },
        },
      });

      doc.save(`RSVPs_${invitation?.slug || slug}.pdf`);
    } catch (err: any) {
      console.error("PDF export error:", err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  // Delete RSVP Handler
  const handleDeleteRsvp = async () => {
    if (!rsvpToDelete || !rsvpToDelete.id) return;
    setIsDeleting(true);

    try {
      const isMock = !isSupabaseConfigured;
      let token = "mock-user-token";
      if (!isMock) {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token || "";
      }

      const res = await fetch(`/api/rsvps?id=${rsvpToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to delete RSVP record.");
      }

      setRsvps((prev) => {
        const updated = prev.filter((r) => r.id !== rsvpToDelete.id);
        try {
          localStorage.setItem(STORAGE_KEY_RSVP_PREFIX + slug, JSON.stringify(updated));
        } catch {}
        return updated;
      });
      if (selectedRsvp?.id === rsvpToDelete.id) {
        setSelectedRsvp(null);
      }
      setRsvpToDelete(null);
    } catch (err: any) {
      console.error("Delete RSVP error:", err);
      alert(err.message || "Could not delete RSVP.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Date Formatter
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800 selection:bg-zinc-200">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-600" />
            <span>My Studio</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {rsvps.length > 0 && (
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExporting}
                className="min-h-[40px] px-3.5 sm:px-4 flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-zinc-600" />
                <span>{isExporting ? "Exporting..." : "Export PDF"}</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        
        {/* Loading skeleton when not mounted or no cache exists */}
        {(!mounted || (loading && rsvps.length === 0)) && (
          <div className="space-y-6 sm:space-y-8 animate-pulse">
            <div>
              <div className="h-8 bg-zinc-200/80 rounded-xl w-64 mb-2" />
              <div className="h-4 bg-zinc-200/60 rounded-lg w-80" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl p-5 sm:p-6 bg-zinc-100/80 h-24" />
              ))}
            </div>
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 h-64" />
          </div>
        )}

        {/* Error */}
        {mounted && !loading && error && (
          <div className="py-20 text-center max-w-sm mx-auto">
            <p className="text-sm font-semibold text-zinc-900 mb-2">{error}</p>
            <Link
              href="/dashboard"
              className="text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 underline underline-offset-4"
            >
              Back to My Studio
            </Link>
          </div>
        )}

        {/* Loaded View (Immediate when cached or loaded) */}
        {mounted && (!loading || rsvps.length > 0) && !error && (
          <div className="space-y-6 sm:space-y-8">
            
            {/* Title Section (Matching User's Reference Image 2) */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                Your guests, at a glance.
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-normal">
                Keep track of who's joining your celebration.
              </p>
            </div>

            {/* 4 Summary Metric Cards (Matching User's Reference Image 2) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Card 1: Total responses */}
              <div className="rounded-2xl p-5 sm:p-6 bg-[#fbf9f5] border border-black/[0.04]">
                <span className="text-xs sm:text-sm text-zinc-600 font-normal block mb-1">
                  Total responses
                </span>
                <strong className="text-2xl sm:text-3xl font-bold text-zinc-950 block">
                  {metrics.totalResponses}
                </strong>
              </div>

              {/* Card 2: Attending */}
              <div className="rounded-2xl p-5 sm:p-6 bg-[#edf5ed] border border-black/[0.04]">
                <span className="text-xs sm:text-sm text-[#2d6034] font-normal block mb-1">
                  Attending
                </span>
                <strong className="text-2xl sm:text-3xl font-bold text-[#22542a] block">
                  {metrics.attendingResponses}
                </strong>
              </div>

              {/* Card 3: Not attending */}
              <div className="rounded-2xl p-5 sm:p-6 bg-[#fdf2f2] border border-black/[0.04]">
                <span className="text-xs sm:text-sm text-[#842b2b] font-normal block mb-1">
                  Not attending
                </span>
                <strong className="text-2xl sm:text-3xl font-bold text-[#802828] block">
                  {metrics.declinedResponses}
                </strong>
              </div>

              {/* Card 4: Awaiting response */}
              <div className="rounded-2xl p-5 sm:p-6 bg-[#f5f4fb] border border-black/[0.04]">
                <span className="text-xs sm:text-sm text-[#4a3e72] font-normal block mb-1">
                  Awaiting response
                </span>
                <strong className="text-2xl sm:text-3xl font-bold text-[#433668] block">
                  {metrics.pendingResponses}
                </strong>
              </div>

            </div>

            {/* Card Container for Search, Filters, and Guest List (Matching User's Reference Image 1) */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl shadow-2xs overflow-hidden">
              
              {/* Search Option (Matching Image 1) */}
              <div className="relative px-5 py-4">
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search guest name or phone"
                    className="w-full text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none bg-transparent"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Divider below search */}
              <div className="h-px bg-zinc-200/80 w-full" />

              {/* Filter Chips (Matching Image 1) */}
              <div className="px-5 py-3.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeFilter === "all"
                      ? "bg-zinc-950 text-white"
                      : "bg-[#f5f2eb] hover:bg-[#ede8df] text-zinc-800"
                  }`}
                >
                  All ({metrics.totalResponses})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilter("attending")}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeFilter === "attending"
                      ? "bg-zinc-950 text-white font-semibold"
                      : "bg-[#f5f2eb] hover:bg-[#ede8df] text-zinc-800"
                  }`}
                >
                  Attending ({metrics.attendingResponses})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilter("declined")}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeFilter === "declined"
                      ? "bg-zinc-950 text-white font-semibold"
                      : "bg-[#f5f2eb] hover:bg-[#ede8df] text-zinc-800"
                  }`}
                >
                  Declined ({metrics.declinedResponses})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilter("pending")}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeFilter === "pending"
                      ? "bg-zinc-950 text-white font-semibold"
                      : "bg-[#f5f2eb] hover:bg-[#ede8df] text-zinc-800"
                  }`}
                >
                  Pending ({metrics.pendingResponses})
                </button>
              </div>

              {/* Divider below filter chips */}
              <div className="h-px bg-zinc-200/80 w-full" />

              {/* Guest Rows Container (Matching Image 1) */}
              <div>
                
                {/* Empty State */}
                {rsvps.length === 0 && (
                  <div className="text-center py-16 sm:py-20 px-4">
                    <MessageSquare className="w-10 h-10 text-zinc-300 stroke-[1.2] mx-auto mb-3" />
                    <h3 className="text-base font-bold text-zinc-900 mb-1">
                      No RSVPs Received Yet
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed mb-6 font-normal">
                      Once guests submit the RSVP form on your wedding invitation, their responses will appear here.
                    </p>
                    <a
                      href={`/invite/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[40px] px-5 inline-flex items-center justify-center gap-1.5 border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                    >
                      <span>Submit An RSVP</span>
                    </a>
                  </div>
                )}

                {/* Filter Empty State */}
                {rsvps.length > 0 && filteredRsvps.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-xs sm:text-sm text-zinc-500 font-normal">
                      No matching guests found.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveFilter("all");
                      }}
                      className="text-xs font-bold uppercase tracking-wider text-zinc-900 underline underline-offset-4 mt-2.5 cursor-pointer"
                    >
                      Clear search & filters
                    </button>
                  </div>
                )}

                {/* Populated Rows (Matching Image 1) */}
                <div className="divide-y divide-zinc-200/80">
                  {filteredRsvps.map((rsvp) => {
                    const status = getNormalizedStatus(rsvp);
                    const guestName = rsvp.guest_name || rsvp.name || "Guest";
                    const count = Math.max(1, Number(rsvp.guest_count) || 1);
                    const contact = rsvp.guest_contact || rsvp.phone || rsvp.email;
                    const wishes = rsvp.wishes || rsvp.message;
                    const initial = guestName.charAt(0).toUpperCase();

                    return (
                      <div
                        key={rsvp.id}
                        onClick={() => setSelectedRsvp(rsvp)}
                        className="px-5 py-4 flex items-center justify-between gap-3 hover:bg-zinc-50/70 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          
                          {/* Circular Avatar with Initial (Matching Image 1) */}
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#e8decb] text-[#5c4a2a] font-semibold flex items-center justify-center text-sm sm:text-base shrink-0">
                            {initial}
                          </div>

                          <div className="min-w-0 flex-1">
                            
                            {/* Guest Name */}
                            <h3 className="font-bold text-sm sm:text-base text-zinc-900 truncate">
                              {guestName}
                            </h3>

                            {/* Subtext: 2 guests · 98765 43210 */}
                            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 font-normal">
                              {status === "attending"
                                ? `${count} ${count === 1 ? "guest" : "guests"}`
                                : "1 response"}
                              {contact ? ` · ${contact}` : ""}
                            </p>

                            {/* Status Line */}
                            {status === "attending" && (
                              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#1f6b3b] mt-0.5">
                                <svg className="w-3.5 h-3.5 text-[#1f6b3b] shrink-0" viewBox="0 0 16 16" fill="none">
                                  <circle cx="8" cy="8" r="6.75" stroke="currentColor" strokeWidth="1.5" />
                                  <path d="M5 8.2L7 10.2L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>Attending</span>
                              </div>
                            )}

                            {status === "undecided" && (
                              <div className="text-xs sm:text-sm font-medium text-[#433668] mt-0.5">
                                Awaiting response
                              </div>
                            )}

                            {status === "not_attending" && (
                              <div className="text-xs sm:text-sm font-medium text-[#802828] mt-0.5">
                                Not attending
                              </div>
                            )}

                            {/* Guest Wishes/Message if available */}
                            {wishes && (
                              <p className="text-xs text-zinc-600 italic mt-1 line-clamp-1">
                                "{wishes}"
                              </p>
                            )}

                          </div>
                        </div>

                        {/* Chevron Icon (Matching Image 1) */}
                        <div className="shrink-0 text-zinc-400 group-hover:text-zinc-700 transition-colors pl-2">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Guest Response Detail Modal */}
      {selectedRsvp && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedRsvp(null)}
        >
          <div 
            className="bg-white border border-zinc-200 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-zinc-150 flex items-start justify-between bg-zinc-50/60">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <div className="w-10 h-10 rounded-full bg-[#e8decb] text-[#5c4a2a] font-semibold flex items-center justify-center text-sm shrink-0">
                  {(selectedRsvp.guest_name || selectedRsvp.name || "G").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-950 truncate">
                    {selectedRsvp.guest_name || selectedRsvp.name || "Guest"}
                  </h3>
                  <div className="text-xs text-zinc-500">
                    {formatDateTime(selectedRsvp.created_at)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRsvp(null)}
                className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              
              {/* Status and Party size */}
              <div className="grid grid-cols-2 gap-3 bg-zinc-50 p-4 rounded-xl border border-zinc-150">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block mb-1">
                    RSVP Status
                  </span>
                  {(() => {
                    const status = getNormalizedStatus(selectedRsvp);
                    if (status === "attending") {
                      return (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <Check className="w-3.5 h-3.5" />
                          Attending
                        </span>
                      );
                    }
                    if (status === "not_attending") {
                      return (
                        <span className="text-xs font-semibold text-rose-700">
                          Not attending
                        </span>
                      );
                    }
                    return (
                      <span className="text-xs font-semibold text-[#433668]">
                        Awaiting response
                      </span>
                    );
                  })()}
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block mb-1">
                    Party Size
                  </span>
                  <strong className="text-sm font-bold text-zinc-900 block">
                    {getNormalizedStatus(selectedRsvp) === "attending"
                      ? `${Math.max(1, Number(selectedRsvp.guest_count) || 1)} Guests`
                      : "Declined"}
                  </strong>
                </div>
              </div>

              {/* Contact Information */}
              {(selectedRsvp.guest_contact || selectedRsvp.phone || selectedRsvp.email) && (
                <div className="border border-zinc-150 rounded-xl p-4">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block mb-1">
                    Phone / Contact
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-zinc-900 font-semibold text-xs sm:text-sm">
                      {selectedRsvp.guest_contact || selectedRsvp.phone || selectedRsvp.email}
                    </span>
                    <a
                      href={`tel:${selectedRsvp.guest_contact || selectedRsvp.phone}`}
                      className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      Call
                    </a>
                  </div>
                </div>
              )}

              {/* Dietary Preferences */}
              {selectedRsvp.dietary_preferences && (
                <div className="border border-zinc-150 rounded-xl p-4">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block mb-1 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-zinc-400" />
                    Dietary Preferences
                  </span>
                  <span className="text-zinc-800 font-medium">
                    {selectedRsvp.dietary_preferences}
                  </span>
                </div>
              )}

              {/* Wedding Blessings & Message */}
              {(selectedRsvp.wishes || selectedRsvp.message) && (
                <div className="border border-zinc-150 rounded-xl p-4 bg-zinc-50/50">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block mb-2">
                    Blessings & Wishes
                  </span>
                  <blockquote className="italic text-zinc-800 text-xs sm:text-sm leading-relaxed border-l-2 border-zinc-300 pl-3 py-0.5">
                    "{selectedRsvp.wishes || selectedRsvp.message}"
                  </blockquote>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 pb-6 sm:pb-5 border-t border-zinc-150 bg-zinc-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setRsvpToDelete(selectedRsvp)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>Delete RSVP</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRsvp(null)}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer min-h-[44px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {rsvpToDelete && (
        <div 
          className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6"
          onClick={() => setRsvpToDelete(null)}
        >
          <div 
            className="bg-white border border-zinc-200 rounded-2xl w-full max-w-sm p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wide mb-1.5">
              Delete Response?
            </h4>
            
            <p className="text-xs text-zinc-500 leading-relaxed mb-6 font-normal">
              Are you sure you want to delete the RSVP from {rsvpToDelete.guest_name || rsvpToDelete.name || "this guest"}?
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRsvpToDelete(null)}
                disabled={isDeleting}
                className="min-h-[44px] flex items-center justify-center rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteRsvp}
                disabled={isDeleting}
                className="min-h-[44px] flex items-center justify-center rounded-xl bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
