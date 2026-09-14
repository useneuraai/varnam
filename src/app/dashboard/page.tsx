"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  LogOut, 
  Plus, 
  Edit, 
  ExternalLink, 
  Share2, 
  Users, 
  Calendar, 
  MapPin, 
  Sparkles,
  ClipboardCheck,
  ChevronRight,
  ArrowRight,
  Heart,
  MessageSquare,
  AlertCircle,
  CreditCard,
  Receipt,
  Trash2
} from "lucide-react";

interface Invitation {
  id?: string;
  template_slug: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  wedding_venue: string;
  is_paid: boolean;
  payment_id?: string;
  order_id?: string;
  created_at?: string;
  rsvp_phone?: string;
}

interface RSVP {
  id: string;
  name: string;
  attendance: string;
  guest_count: number;
  wishes: string;
  created_at: string;
}

interface Payment {
  id: string;
  invitation_id?: string;
  invitation_slug?: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  amount: number;
  currency?: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Payments State
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);

  // RSVP Modal State
  const [selectedInviteForRsvps, setSelectedInviteForRsvps] = useState<Invitation | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loadingRsvps, setLoadingRsvps] = useState(false);
  
  // Share tooltip state
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  useEffect(() => {
    const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";
    if (isMockSupabase) {
      setUser({ id: "mock-user-123", email: "demo.user@varnam.com" });
      setLoadingAuth(false);
      fetchInvitations("mock-user-123", true);
      fetchPayments("mock-user-123", true);
      return;
    }

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchInvitations(session.access_token, false);
        fetchPayments(session.access_token, false);
      } else {
        router.replace("/login?redirectTo=/dashboard");
      }
      setLoadingAuth(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchInvitations(session.access_token, false);
        fetchPayments(session.access_token, false);
      } else {
        setUser(null);
        router.replace("/login?redirectTo=/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const fetchInvitations = async (tokenOrId: string, isMock: boolean) => {
    setLoadingInvites(true);
    setError(null);
    try {
      let res;
      if (isMock) {
        res = await fetch("/api/invitations/user", {
          headers: {
            "Authorization": `Bearer mock-user-token`
          }
        });
      } else {
        res = await fetch("/api/invitations/user", {
          headers: {
            "Authorization": `Bearer ${tokenOrId}`
          }
        });
      }

      if (!res.ok) {
        throw new Error("Failed to load your invitations");
      }

      const data = await res.json();
      setInvitations(data.invitations || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoadingInvites(false);
    }
  };

  const fetchPayments = async (tokenOrId: string, isMock: boolean) => {
    setLoadingPayments(true);
    try {
      const res = await fetch("/api/payments/user", {
        headers: {
          "Authorization": isMock ? "Bearer mock-user-token" : `Bearer ${tokenOrId}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error("Error loading user payments:", err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleDeleteInvite = async (slug: string) => {
    if (!window.confirm("Are you sure you want to delete this draft invitation?")) return;
    try {
      const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";
      const { data: { session } } = await supabase.auth.getSession();
      const token = isMockSupabase ? "mock-user-token" : session?.access_token || "";

      const res = await fetch(`/api/invitations/${slug}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        setInvitations((prev) => prev.filter((i) => i.slug !== slug));
      }
    } catch (err) {
      console.error("Error deleting invitation:", err);
    }
  };

  const handleSignOut = async () => {
    const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";
    if (isMockSupabase) {
      router.replace("/templates");
      return;
    }
    await supabase.auth.signOut();
    router.replace("/templates");
  };

  const handleCopyLink = (idOrSlug: string) => {
    const link = `${window.location.origin}/invite/${idOrSlug}`;
    navigator.clipboard.writeText(link);
    setCopiedSlug(idOrSlug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleViewRsvps = async (invite: Invitation) => {
    setSelectedInviteForRsvps(invite);
    setLoadingRsvps(true);
    setRsvps([]);
    try {
      const res = await fetch(`/api/rsvps?slug=${invite.slug}`);
      if (!res.ok) {
        throw new Error("Failed to load RSVPs");
      }
      const data = await res.json();
      setRsvps(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRsvps(false);
    }
  };

  const handleSeedDemoInvite = async () => {
    setLoadingInvites(true);
    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: "order_mock_demo123",
          razorpay_payment_id: "pay_mock_demo123",
          razorpay_signature: "sig_mock",
          templateSlug: "luxury-floral",
          userId: user?.id,
          formData: {
            bride_name: "Priya",
            groom_name: "Rahul",
            wedding_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            wedding_venue: "The Grand Ballroom, ITC Grand Chola, Chennai",
            rsvp_phone: "+91 98765 43210",
            custom_message: "We invite you to share our joy as we exchange our wedding vows.",
            family_names: "Sharma & Kapoor Families"
          }
        })
      });
      if (res.ok) {
        fetchInvitations("mock-user-123", true);
        fetchPayments("mock-user-123", true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInvites(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f3efe9] flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#b3811b] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#8a725d] font-bold animate-pulse">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f3efe9] font-sans text-neutral-800 flex flex-col selection:bg-gold-200 selection:text-black">
      
      {/* Dashboard Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-150">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-sans text-2xl font-black tracking-widest text-zinc-900">
            VARNAM
          </Link>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPaymentsModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-zinc-200 hover:border-zinc-900 bg-white rounded-full text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-zinc-900 transition-all cursor-pointer shadow-none"
            >
              <Receipt className="w-3.5 h-3.5 text-[#b3811b]" />
              <span className="hidden sm:inline">Billing & Receipts</span>
              <span className="text-[10px] bg-zinc-100 text-zinc-700 px-1.5 py-0.2 rounded-full font-mono font-bold">
                {payments.length}
              </span>
            </button>
            <span className="hidden md:inline text-xs text-zinc-500 font-medium">
              Signed in as: <strong className="text-zinc-800">{user?.email}</strong>
            </span>
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-zinc-900 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-grow w-full">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 pb-8 border-b border-zinc-200">
          <div>
            <h1 className="font-sans text-3xl font-bold tracking-tight text-zinc-900">
              MY STUDIO
            </h1>
            <p className="text-sm text-zinc-500 mt-1.5 font-normal">
              Manage your published invitations, track guest RSVPs, and edit event schedules.
            </p>
          </div>

          <Link
            href="/templates"
            className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs tracking-wider uppercase px-6 py-3.5 rounded-xl transition-all shadow-sm self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New invitation
          </Link>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-xs tracking-wide leading-relaxed flex gap-2.5 rounded-2xl">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading invitations list */}
        {loadingInvites ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-8 h-8 border-3 border-[#b3811b] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-widest text-[#8a725d] font-bold">
              Fetching invitations...
            </p>
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-20 bg-white border border-zinc-150 rounded-2xl shadow-sm max-w-2xl mx-auto">
            <Heart className="w-12 h-12 text-zinc-300 stroke-[1.2] mx-auto mb-4" />
            <h3 className="font-sans text-lg font-bold text-zinc-900 mb-2">
              No Invitations Found
            </h3>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed mb-8">
              You haven't created any digital wedding invitations yet. Select a luxury design from our templates to begin.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-6">
              <Link
                href="/templates"
                className="bg-zinc-900 text-white text-xs uppercase font-bold tracking-widest py-3.5 px-8 hover:bg-zinc-800 transition-colors shadow-sm rounded-xl"
              >
                Browse Templates
              </Link>
              {user?.email === "demo.user@varnam.com" && (
                <button
                  onClick={handleSeedDemoInvite}
                  className="bg-[#fffcf9] border border-[#eed57c] text-[#b3811b] text-xs uppercase font-bold tracking-widest py-3.5 px-8 hover:bg-[#fff9f2] transition-colors rounded-xl cursor-pointer"
                >
                  Seed Demo Invitation
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Grid list of invitations */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {invitations.map((invite) => {
              const formattedDate = new Date(invite.wedding_date).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <div 
                  key={invite.slug}
                  className="bg-white border border-zinc-150 rounded-2xl overflow-hidden shadow-none transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-[#FBF3DB] border border-[#eed57c]/40 text-[#956400] text-[9px] tracking-widest uppercase px-3 py-1 font-bold rounded-lg">
                        {invite.template_slug.replace("-", " ")}
                      </span>
                      {invite.is_paid ? (
                        <span className="bg-[#EDF3EC] text-[#346538] border border-emerald-100 text-[9px] tracking-widest uppercase px-3 py-1 font-bold rounded-lg">
                          Paid & Live
                        </span>
                      ) : (
                        <span className="bg-[#FDEBEC] text-[#9F2F2D] border border-red-150 text-[9px] tracking-widest uppercase px-3 py-1 font-bold rounded-lg animate-pulse">
                          Draft (Unpaid)
                        </span>
                      )}
                    </div>

                    {/* Couple Names */}
                    <h3 className="font-sans text-xl font-bold text-zinc-900 tracking-tight mb-4 uppercase">
                      {invite.bride_name} & {invite.groom_name}
                    </h3>

                    {/* Event summary details */}
                    <div className="space-y-3 pt-2 border-t border-zinc-100">
                      <div className="flex gap-2.5 items-start text-xs text-zinc-600">
                        <Calendar className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-zinc-800">Date & Time</p>
                          <p className="text-zinc-500 mt-0.5">{formattedDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2.5 items-start text-xs text-zinc-600">
                        <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-zinc-800">Venue</p>
                          <p className="text-zinc-500 mt-0.5 line-clamp-2">{invite.wedding_venue}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="bg-zinc-50 border-t border-zinc-150 p-4">
                    {invite.is_paid ? (
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/editor/${invite.template_slug}?edit=${invite.slug}`}
                          className="flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 hover:text-zinc-900 py-2.5 rounded-xl font-bold text-[10px] tracking-wider uppercase transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5 text-zinc-500" />
                          Edit Details
                        </Link>

                        <button
                          onClick={() => handleViewRsvps(invite)}
                          className="flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 hover:text-zinc-900 py-2.5 rounded-xl font-bold text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5 text-zinc-500" />
                          View RSVPs
                        </button>

                        <a
                          href={`/invite/${invite.id || invite.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-xl font-bold text-[10px] tracking-wider uppercase transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-300" />
                          Live Invite
                        </a>

                        <button
                          onClick={() => handleCopyLink(invite.id || invite.slug)}
                          className="flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 hover:text-zinc-900 py-2.5 rounded-xl font-bold text-[10px] tracking-wider uppercase transition-colors cursor-pointer relative"
                        >
                          {copiedSlug === (invite.id || invite.slug) ? (
                            <>
                              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5 text-zinc-500" />
                              Share Link
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={`/editor/${invite.template_slug}?edit=${invite.slug}`}
                            className="flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 hover:text-zinc-900 py-2.5 rounded-xl font-bold text-[10px] tracking-wider uppercase transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5 text-zinc-500" />
                            Continue Edit
                          </Link>

                          <Link
                            href={`/editor/${invite.template_slug}?edit=${invite.slug}`}
                            className="flex items-center justify-center gap-2 bg-[#b3811b] hover:bg-[#9a6f14] text-white py-2.5 rounded-xl font-bold text-[10px] tracking-wider uppercase transition-colors shadow-sm"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Pay & Activate
                          </Link>
                        </div>
                        <button
                          onClick={() => handleDeleteInvite(invite.slug)}
                          className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-red-50 border border-zinc-200 hover:border-red-200 text-zinc-500 hover:text-red-600 py-2 rounded-xl font-bold text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete Draft
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* RSVP Modal Overlay */}
      {selectedInviteForRsvps && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-150 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-sm relative animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-150 flex items-center justify-between">
              <div>
                <span className="font-sans text-[10px] tracking-widest text-[#b3811b] font-bold block mb-1">
                  RSVP RESPONSES
                </span>
                <h3 className="font-sans text-lg font-bold text-zinc-900 uppercase">
                  {selectedInviteForRsvps.bride_name} & {selectedInviteForRsvps.groom_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInviteForRsvps(null)}
                className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-colors cursor-pointer text-sm font-sans"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-grow">
              {loadingRsvps ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-6 h-6 border-2 border-[#b3811b] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Loading RSVPs...</p>
                </div>
              ) : rsvps.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-10 h-10 text-zinc-300 stroke-[1.2] mx-auto mb-3" />
                  <p className="text-zinc-500 text-xs italic">No RSVP responses received for this invitation yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Summary Bar */}
                  <div className="grid grid-cols-3 gap-3 bg-[#fafaf9] border border-zinc-150 p-4 rounded-2xl mb-6 text-center">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Total Responses</span>
                      <strong className="text-lg text-zinc-950 block mt-1">{rsvps.length}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Attending</span>
                      <strong className="text-lg text-emerald-700 block mt-1">
                        {rsvps.filter(r => r.attendance === "yes").reduce((acc, curr) => acc + curr.guest_count, 0)} guests
                      </strong>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Declined</span>
                      <strong className="text-lg text-red-650 block mt-1">
                        {rsvps.filter(r => r.attendance === "no").length} responses
                      </strong>
                    </div>
                  </div>

                  {/* List of responses */}
                  <div className="space-y-3">
                    {rsvps.map((rsvp) => {
                      const attending = rsvp.attendance === "yes";
                      return (
                        <div 
                          key={rsvp.id}
                          className="border border-zinc-150 p-4 rounded-xl flex flex-col sm:flex-row justify-between gap-4"
                        >
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-zinc-900 truncate uppercase">
                                {rsvp.name}
                              </h4>
                              <span className={`text-[8px] tracking-wider uppercase px-2 py-0.5 font-bold rounded-lg ${
                                attending 
                                  ? "bg-[#EDF3EC] text-[#346538] border border-emerald-100" 
                                  : "bg-[#FDEBEC] text-[#9F2F2D] border border-red-100"
                              }`}>
                                {attending ? `Attending (${rsvp.guest_count} guests)` : "Declined"}
                              </span>
                            </div>
                            
                            {rsvp.wishes && (
                              <p className="text-xs text-zinc-500 italic mt-2 bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                                "{rsvp.wishes}"
                              </p>
                            )}
                          </div>

                          <div className="text-[10px] text-zinc-400 shrink-0 font-medium sm:text-right mt-1 sm:mt-0">
                            {new Date(rsvp.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-150 bg-zinc-50 rounded-b-[32px] flex justify-end">
              <button
                onClick={() => setSelectedInviteForRsvps(null)}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[10px] tracking-wider uppercase rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Billing & Receipts Modal */}
      {showPaymentsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-150 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-sm relative animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-150 flex items-center justify-between">
              <div>
                <span className="font-sans text-[10px] tracking-widest text-[#b3811b] font-bold block mb-1">
                  BILLING & TRANSACTIONS
                </span>
                <h3 className="font-sans text-lg font-bold text-zinc-900 uppercase">
                  Payment History & Receipts
                </h3>
              </div>
              <button
                onClick={() => setShowPaymentsModal(false)}
                className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-colors cursor-pointer text-sm font-sans"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-grow">
              {loadingPayments ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-6 h-6 border-2 border-[#b3811b] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Loading payment receipts...</p>
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="w-10 h-10 text-zinc-300 stroke-[1.2] mx-auto mb-3" />
                  <p className="text-zinc-500 text-xs italic">No payment transactions found for your account yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-[#fafaf9] border border-zinc-150 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Total Paid Licenses</span>
                      <strong className="text-lg text-zinc-950 block mt-0.5">{payments.length}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Total Spend</span>
                      <strong className="text-lg text-[#b3811b] block mt-0.5">
                        ₹{payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {payments.map((pay) => (
                      <div
                        key={pay.id}
                        className="border border-zinc-150 p-4 rounded-xl flex flex-col sm:flex-row justify-between gap-3 bg-white"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-zinc-900 font-mono">
                              ₹{Number(pay.amount).toLocaleString()}
                            </span>
                            <span className="bg-[#EDF3EC] text-[#346538] border border-emerald-100 text-[8px] tracking-wider uppercase px-2 py-0.5 font-bold rounded-lg">
                              {pay.status || "captured"}
                            </span>
                            {pay.invitation_slug && (
                              <span className="text-[9px] text-zinc-500 font-medium">
                                • Slug: <span className="font-mono text-zinc-800">{pay.invitation_slug}</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-400 font-mono">
                            Order: {pay.razorpay_order_id}
                          </p>
                          {pay.razorpay_payment_id && (
                            <p className="text-[10px] text-zinc-400 font-mono">
                              Payment Ref: {pay.razorpay_payment_id}
                            </p>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-400 shrink-0 sm:text-right">
                          {new Date(pay.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-150 bg-zinc-50 rounded-b-[32px] flex justify-end">
              <button
                onClick={() => setShowPaymentsModal(false)}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[10px] tracking-wider uppercase rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-150 p-6 rounded-[28px] w-full max-w-sm flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h3 className="font-sans text-lg font-bold text-zinc-900 text-center mb-2">
              SIGN OUT
            </h3>
            <p className="text-zinc-500 text-xs text-center mb-6 leading-relaxed font-sans">
              Are you sure you want to sign out from your studio workspace?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[10px] tracking-wider uppercase rounded-xl transition-colors cursor-pointer flex-1 font-sans"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSignOutConfirm(false);
                  handleSignOut();
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] tracking-wider uppercase rounded-xl transition-all cursor-pointer flex-1 shadow-md font-sans"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-10 px-6 border-t border-zinc-150 bg-white text-center mt-auto">
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} Varnam Wedding Invites. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
