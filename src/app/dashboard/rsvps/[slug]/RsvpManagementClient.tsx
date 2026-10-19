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
  MessageSquare,
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

type FilterStatus = "all" | "attending" | "declined";

export default function RsvpManagementClient({ slug }: { slug: string }) {
  // State
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [rsvps, setRsvps] = useState<RsvpRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  // Deletion state
  const [rsvpToDelete, setRsvpToDelete] = useState<RsvpRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch real invitation and RSVPs from Supabase/database
  const fetchData = async () => {
    setLoading(true);
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
      setRsvps(Array.isArray(rsvpData) ? rsvpData : []);
    } catch (err: any) {
      console.error("Error loading RSVPs:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

    for (const r of rsvps) {
      const status = getNormalizedStatus(r);
      if (status === "attending") {
        attendingResponses += 1;
        totalAttendingGuests += Math.max(1, Number(r.guest_count) || 1);
      } else if (status === "not_attending") {
        declinedResponses += 1;
      }
    }

    return {
      totalResponses,
      attendingResponses,
      totalAttendingGuests,
      declinedResponses,
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
      }

      const query = searchQuery.trim().toLowerCase();
      let matchesSearch = true;
      if (query) {
        const guestName = (rsvp.guest_name || rsvp.name || "").toLowerCase();
        const message = (rsvp.wishes || rsvp.message || "").toLowerCase();
        matchesSearch = guestName.includes(query) || message.includes(query);
      }

      return matchesStatus && matchesSearch;
    });
  }, [rsvps, activeFilter, searchQuery]);

  // PDF Export (Clean & Minimal)
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
        `Total: ${metrics.totalResponses} • Attending: ${metrics.totalAttendingGuests} guests (${metrics.attendingResponses} confirmed) • Declined: ${metrics.declinedResponses}`,
        40,
        94
      );

      const rows = filteredRsvps.map((rsvp, idx) => {
        const status = getNormalizedStatus(rsvp);
        const guestName = (rsvp.guest_name || rsvp.name || "Guest").toUpperCase();
        const count = Math.max(1, Number(rsvp.guest_count) || 1);
        const statusText =
          status === "attending"
            ? `ATTENDING (${count} ${count === 1 ? "GUEST" : "GUESTS"})`
            : status === "not_attending"
            ? "DECLINED"
            : "PENDING";
        const wishes = rsvp.wishes || rsvp.message || "—";

        return [String(idx + 1), guestName, statusText, wishes];
      });

      autoTable(doc, {
        head: [["#", "GUEST NAME", "ATTENDANCE", "MESSAGE"]],
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
          1: { cellWidth: 130, fontStyle: "bold" },
          2: { cellWidth: 110 },
          3: { cellWidth: 250 },
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

      setRsvps((prev) => prev.filter((r) => r.id !== rsvpToDelete.id));
      setRsvpToDelete(null);
    } catch (err: any) {
      console.error("Delete RSVP error:", err);
      alert(err.message || "Could not delete RSVP.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy Link
  const handleCopyLink = () => {
    const url = `${window.location.origin}/invite/${slug}`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800 selection:bg-zinc-200">
      
      {/* Header - Matching Dashboard Design Principles */}
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
            <button
              type="button"
              onClick={handleCopyLink}
              className="min-h-[40px] px-3.5 sm:px-4 flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Copied</span>
                </>
              ) : (
                <span>Share Link</span>
              )}
            </button>

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

      {/* Main Container - Airy & Spacious with Dashboard Typography */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 w-full">
        
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-950 rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
              Fetching RSVPs...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
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

        {/* Loaded View */}
        {!loading && !error && (
          <div className="space-y-8 sm:space-y-10">
            
            {/* Heading Section - Matches Dashboard "MY STUDIO" Header */}
            <div className="pb-5 sm:pb-6 border-b border-zinc-200">
              <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 uppercase">
                Guest RSVPs
              </h1>

              <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-normal">
                {invitation ? `${invitation.bride_name} & ${invitation.groom_name}` : "Wedding Invitation"}
              </p>

              {/* Minimal summary line with white space */}
              <div className="flex items-center gap-3 text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-150 font-medium">
                <span>{metrics.totalResponses} {metrics.totalResponses === 1 ? "response" : "responses"}</span>
                <span>•</span>
                <span>{metrics.totalAttendingGuests} {metrics.totalAttendingGuests === 1 ? "guest" : "guests"} attending</span>
                {metrics.declinedResponses > 0 && (
                  <>
                    <span>•</span>
                    <span>{metrics.declinedResponses} declined</span>
                  </>
                )}
              </div>
            </div>

            {/* Filter Tabs & Search (Only shown if RSVPs exist) */}
            {rsvps.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Clean text filter tabs */}
                <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setActiveFilter("all")}
                    className={`cursor-pointer pb-1 transition-colors ${
                      activeFilter === "all"
                        ? "text-zinc-950 border-b-2 border-zinc-950"
                        : "text-zinc-400 hover:text-zinc-700"
                    }`}
                  >
                    All ({metrics.totalResponses})
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFilter("attending")}
                    className={`cursor-pointer pb-1 transition-colors ${
                      activeFilter === "attending"
                        ? "text-zinc-950 border-b-2 border-zinc-950"
                        : "text-zinc-400 hover:text-zinc-700"
                    }`}
                  >
                    Attending ({metrics.attendingResponses})
                  </button>

                  {metrics.declinedResponses > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveFilter("declined")}
                      className={`cursor-pointer pb-1 transition-colors ${
                        activeFilter === "declined"
                          ? "text-zinc-950 border-b-2 border-zinc-950"
                          : "text-zinc-400 hover:text-zinc-700"
                      }`}
                    >
                      Declined ({metrics.declinedResponses})
                    </button>
                  )}
                </div>

                {/* Subtle search input */}
                {rsvps.length > 2 && (
                  <div className="relative w-full sm:w-56">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-0 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-6 pr-6 py-1 text-xs text-zinc-900 placeholder:text-zinc-400 border-b border-zinc-200 focus:border-zinc-900 outline-none bg-transparent transition-colors font-sans"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* Guest List: ONLY Name, Attending, Message with generous white space */}
            <div>
              
              {/* Empty state (matches dashboard style) */}
              {rsvps.length === 0 && (
                <div className="text-center py-20 bg-white border border-zinc-200 rounded-2xl max-w-xl mx-auto p-8 sm:p-12">
                  <MessageSquare className="w-10 h-10 text-zinc-300 stroke-[1.2] mx-auto mb-3" />
                  <h3 className="font-sans text-base sm:text-lg font-bold text-zinc-900 mb-1.5 uppercase">
                    No RSVPs Received Yet
                  </h3>
                  <p className="text-zinc-500 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed mb-6 font-normal">
                    Share your wedding invitation link to collect guest responses.
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="min-h-[44px] px-6 inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-white" /> : null}
                    <span>{copiedLink ? "Link Copied" : "Copy Invitation Link"}</span>
                  </button>
                </div>
              )}

              {/* Empty filter results */}
              {rsvps.length > 0 && filteredRsvps.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-xs sm:text-sm text-zinc-500 font-normal">
                    No matching responses found.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter("all");
                    }}
                    className="text-xs font-bold uppercase tracking-wider text-zinc-900 underline underline-offset-4 mt-3 cursor-pointer"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* Minimal Guest Entries */}
              {filteredRsvps.map((rsvp) => {
                const status = getNormalizedStatus(rsvp);
                const guestName = rsvp.guest_name || rsvp.name || "Guest";
                const count = Math.max(1, Number(rsvp.guest_count) || 1);
                const wishes = rsvp.wishes || rsvp.message;

                return (
                  <div
                    key={rsvp.id}
                    className="py-6 sm:py-8 border-b border-zinc-150 first:border-t flex items-start justify-between gap-4 group"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      
                      {/* Name & Attending Status */}
                      <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
                        <h3 className="font-sans font-bold text-sm sm:text-base text-zinc-900 uppercase tracking-wide">
                          {guestName}
                        </h3>

                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                          {status === "attending" ? (
                            `Attending (${count} ${count === 1 ? "guest" : "guests"})`
                          ) : status === "not_attending" ? (
                            "Declined"
                          ) : (
                            "Pending"
                          )}
                        </span>
                      </div>

                      {/* Guest Message */}
                      {wishes && (
                        <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed mt-1.5">
                          "{wishes}"
                        </p>
                      )}

                    </div>

                    {/* Subtle delete action */}
                    <button
                      type="button"
                      onClick={() => setRsvpToDelete(rsvp)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-900 p-2 transition-all cursor-pointer"
                      title="Delete RSVP"
                      aria-label="Delete RSVP"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

            </div>

          </div>
        )}

      </main>

      {/* Delete Confirmation Dialog */}
      {rsvpToDelete && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6"
          onClick={() => setRsvpToDelete(null)}
        >
          <div 
            className="bg-white border border-zinc-200 rounded-2xl w-full max-w-sm p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-sans text-sm font-bold text-zinc-900 uppercase tracking-wide mb-1.5">
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
