"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getTemplateBySlug } from "@/lib/templates";
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
  Trash2,
  ChevronDown,
  Package,
  User,
  LayoutGrid,
  MoreVertical
} from "lucide-react";

interface Invitation {
  id?: string;
  template_slug: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  wedding_venue: string;
  status?: string;
  is_paid: boolean;
  payment_id?: string;
  order_id?: string;
  created_at?: string;
  rsvp_phone?: string;
}

interface RSVP {
  id: string;
  name?: string;
  guest_name?: string;
  attendance?: string;
  attendance_status?: string;
  guest_count: number;
  guest_contact?: string;
  phone?: string;
  email?: string;
  wishes?: string;
  message?: string;
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
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);
  const [isDeletingDraft, setIsDeletingDraft] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [openMenuSlug, setOpenMenuSlug] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown and actions overflow menu on outside click or touch
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(target)) {
        setShowProfileDropdown(false);
      }
      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpenMenuSlug(null);
      }
    };
    if (showProfileDropdown || openMenuSlug) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showProfileDropdown, openMenuSlug]);

  useEffect(() => {
    const isMockSupabase = !isSupabaseConfigured;
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

  const confirmDeleteDraft = async () => {
    if (!draftToDelete) return;
    setIsDeletingDraft(true);
    try {
      const isMockSupabase = !isSupabaseConfigured;
      const { data: { session } } = await supabase.auth.getSession();
      const token = isMockSupabase ? "mock-user-token" : session?.access_token || "";

      const res = await fetch(`/api/invitations/${draftToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        setInvitations((prev) => prev.filter((i) => i.slug !== draftToDelete));
      }
    } catch (err) {
      console.error("Error deleting invitation:", err);
    } finally {
      setIsDeletingDraft(false);
      setDraftToDelete(null);
    }
  };

  const handleSignOut = async () => {
    const isMockSupabase = !isSupabaseConfigured;
    if (isMockSupabase) {
      router.replace("/templates");
      return;
    }
    await supabase.auth.signOut();
    router.replace("/templates");
  };

  const handleCopyLink = (idOrSlug: string) => {
    const link = `${window.location.origin}/invite/${idOrSlug}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    setCopiedSlug(idOrSlug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleShareInvite = async (invite: Invitation) => {
    const targetId = invite.id || invite.slug;
    const link = `${window.location.origin}/invite/${targetId}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${invite.bride_name} & ${invite.groom_name}'s Wedding Invitation`,
          text: `You're cordially invited to celebrate the wedding of ${invite.bride_name} & ${invite.groom_name}!`,
          url: link,
        });
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") {
          return;
        }
      }
    }
    handleCopyLink(targetId);
  };

  const handleViewRsvps = async (invite: Invitation) => {
    setSelectedInviteForRsvps(invite);
    setLoadingRsvps(true);
    setRsvps([]);
    try {
      const isMockSupabase = !isSupabaseConfigured;
      const { data: { session } } = await supabase.auth.getSession();
      const token = isMockSupabase ? "mock-user-token" : session?.access_token || "";

      const res = await fetch(`/api/rsvps?slug=${invite.slug}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
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

  const handlePublish = async (slug: string) => {
    try {
      const isMockSupabase = !isSupabaseConfigured;
      const { data: { session } } = await supabase.auth.getSession();
      const token = isMockSupabase ? "mock-user-token" : session?.access_token || "";

      const res = await fetch(`/api/invitations/${slug}/publish`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        setInvitations((prev) =>
          prev.map((i) => (i.slug === slug ? { ...i, status: "published" } : i))
        );
      } else {
        const err = await res.json();
        alert(err.message || "Failed to publish invitation.");
      }
    } catch (err: any) {
      console.error("Publish error:", err);
      alert(err.message || "Error publishing invitation.");
    }
  };

  const handleUnpublish = async (slug: string) => {
    if (!window.confirm("Are you sure you want to unpublish this invitation? Guests will not be able to view it until you publish it again.")) return;
    try {
      const isMockSupabase = !isSupabaseConfigured;
      const { data: { session } } = await supabase.auth.getSession();
      const token = isMockSupabase ? "mock-user-token" : session?.access_token || "";

      const res = await fetch(`/api/invitations/${slug}/unpublish`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        setInvitations((prev) =>
          prev.map((i) => (i.slug === slug ? { ...i, status: "unpublished" } : i))
        );
      } else {
        const err = await res.json();
        alert(err.message || "Failed to unpublish invitation.");
      }
    } catch (err: any) {
      console.error("Unpublish error:", err);
      alert(err.message || "Error unpublishing invitation.");
    }
  };

  const handleExportCsv = (slug: string) => {
    const isMockSupabase = !isSupabaseConfigured;
    supabase.auth.getSession().then(({ data: { session } }) => {
      const token = isMockSupabase ? "mock-user-token" : session?.access_token || "";
      window.open(`/api/rsvps/export?slug=${slug}`, "_blank");
    });
  };

  const handleDeleteRsvpItem = async (rsvpId: string) => {
    if (!window.confirm("Are you sure you want to remove this RSVP entry?")) return;
    try {
      const isMockSupabase = !isSupabaseConfigured;
      const { data: { session } } = await supabase.auth.getSession();
      const token = isMockSupabase ? "mock-user-token" : session?.access_token || "";

      const res = await fetch(`/api/rsvps?id=${rsvpId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        setRsvps((prev) => prev.filter((r) => r.id !== rsvpId));
      }
    } catch (err) {
      console.error("Error deleting RSVP:", err);
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
      
      {/* Dashboard Header - Responsive with Top-Right Profile */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-zinc-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <img src="/logo.png" alt="Varnam" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-xs" />
            <span className="text-lg sm:text-2xl font-cinzel font-bold tracking-[0.18em] sm:tracking-[0.2em] bg-gradient-to-r from-[#b3811b] via-[#d4a325] to-[#9a6f14] bg-clip-text text-transparent">
              VARNAM
            </span>
          </Link>
          
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Profile Avatar & Interactive Dropdown Menu */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 min-h-[44px] min-w-[44px] p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-white border border-zinc-200 hover:border-[#b3811b] transition-all cursor-pointer shadow-xs group focus:outline-none focus:ring-2 focus:ring-[#eed57c]/40"
                aria-expanded={showProfileDropdown}
                aria-label="User Profile Menu"
              >
                {/* Avatar Initial with Gold Gradient */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#b3811b] via-[#d4a325] to-[#eed57c] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-zinc-800 max-w-[120px] truncate">
                  {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Account"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-800 transition-transform duration-200 ${showProfileDropdown ? "rotate-180" : ""}`} />
              </button>

              {/* Mobile Screen Backdrop */}
              {showProfileDropdown && (
                <div
                  className="fixed inset-0 z-40 sm:hidden bg-black/20 backdrop-blur-xs"
                  onClick={() => setShowProfileDropdown(false)}
                />
              )}

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-24px)] bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Profile Header Card */}
                  <div className="px-3 py-3 rounded-xl bg-gradient-to-br from-[#fffcf7] to-[#fcf8f0] border border-[#eed57c]/35 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#b3811b] via-[#d4a325] to-[#eed57c] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                        {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="min-w-0 flex-grow">
                        <p className="text-xs font-bold text-zinc-900 truncate">
                          {user?.user_metadata?.full_name || "Wedding Studio Owner"}
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Items */}
                  <div className="space-y-1">
                    {/* 1. Templates */}
                    <Link
                      href="/templates"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors text-left group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#916710] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Sparkles className="w-4 h-4 text-[#b3811b]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-800 group-hover:text-zinc-950">
                          Templates
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          Browse & explore wedding templates
                        </p>
                      </div>
                    </Link>

                    {/* 2. Orders */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        const el = document.getElementById("invitations-section");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors text-left group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-zinc-800 group-hover:text-zinc-950">
                            Orders
                          </p>
                          <span className="text-[10px] font-mono font-bold bg-zinc-100 text-zinc-700 px-1.5 py-0.2 rounded-full">
                            {invitations.length}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500">
                          Your active projects & drafts
                        </p>
                      </div>
                    </button>

                    {/* 3. Invoice & Billing */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setShowPaymentsModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100/80 transition-colors text-left group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Receipt className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-zinc-800 group-hover:text-zinc-950">
                            Invoice & Receipts
                          </p>
                          <span className="text-[10px] font-mono font-bold bg-zinc-100 text-zinc-700 px-1.5 py-0.2 rounded-full">
                            {payments.length}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500">
                          Billing history & payment receipts
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="my-1.5 h-px bg-zinc-100" />

                  {/* 4. Sign Out */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setShowSignOutConfirm(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-zinc-700 hover:text-red-700 transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <LogOut className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold">
                        Sign Out
                      </p>
                      <p className="text-[10px] text-zinc-400 group-hover:text-red-500">
                        Securely end current session
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-grow w-full">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6 mb-5 pb-5 sm:mb-8 sm:pb-6 border-b border-zinc-200">
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              MY STUDIO
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-normal">
              Your wedding invitations, all in one place.
            </p>
          </div>

          <Link
            href="/templates"
            className="inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs tracking-wider uppercase px-5 py-3 min-h-[44px] rounded-xl transition-all shadow-sm self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Invitation</span>
          </Link>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-xs tracking-wide leading-relaxed flex gap-2.5 rounded-2xl">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading invitations list */}
        <section id="invitations-section" className="scroll-mt-24">
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
                  className="bg-zinc-900 border border-zinc-900 text-white text-xs uppercase font-bold tracking-widest py-3.5 px-8 hover:bg-zinc-800 transition-colors rounded-xl cursor-pointer shadow-sm"
                >
                  Seed Demo Invitation
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Grid list of invitations */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {invitations.map((invite) => {
              const template = getTemplateBySlug(invite.template_slug);
              const templateName = template?.name || invite.template_slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
              const thumbnailUrl = template?.thumbnailUrl || `/images/${invite.template_slug}/hero.jpg`;

              const formattedDate = new Date(invite.wedding_date).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <div 
                  key={invite.slug}
                  className="group bg-white border border-zinc-200/90 rounded-[24px] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Zoomed & Cropped Template Preview Image Header (Like Template Page) */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950 border-b border-zinc-150">
                    <img
                      src={thumbnailUrl}
                      alt={templateName}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none will-change-transform"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/rose-classic/hero.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                    {/* Top Status Badge Overlay */}
                    <div className="absolute top-3.5 right-3.5 pointer-events-none">
                      {invite.is_paid ? (
                        <span className={`text-[10px] tracking-wider uppercase px-2.5 py-1 font-bold rounded-lg shadow-sm backdrop-blur-md ${
                          invite.status === "published"
                            ? "bg-emerald-950/85 text-emerald-300 border border-emerald-500/30"
                            : "bg-zinc-950/85 text-white border border-zinc-700"
                        }`}>
                          {invite.status === "published" ? "Published" : "Paid & Live"}
                        </span>
                      ) : (
                        <span className="bg-red-950/85 backdrop-blur-md text-red-200 border border-red-500/30 text-[10px] tracking-wider uppercase px-2.5 py-1 font-bold rounded-lg shadow-sm">
                          Draft (Unpaid)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between">
                    <div>
                      {/* h2 Template Name */}
                      <h2 className="text-xl sm:text-2xl font-bold font-serif text-zinc-900 tracking-wide uppercase text-center">
                        {templateName}
                      </h2>

                      {/* Bride & Groom Names and Date */}
                      <div className="text-center mt-2 space-y-1">
                        <p className="text-sm sm:text-base font-semibold text-zinc-800 uppercase tracking-wide">
                          {invite.bride_name} & {invite.groom_name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {formattedDate}
                        </p>
                        {invite.wedding_venue && (
                          <p className="text-xs text-zinc-400 line-clamp-1 max-w-xs mx-auto pt-0.5">
                            {invite.wedding_venue}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Reassurance note for unpaid drafts */}
                    {!invite.is_paid && (
                      <div className="mt-4 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs font-medium leading-relaxed text-center">
                        <Sparkles className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        <span>Your invitation is saved. Complete payment to publish it.</span>
                      </div>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="bg-zinc-50/80 border-t border-zinc-150 p-3.5 sm:p-4">
                    {invite.is_paid ? (
                      <div className="flex flex-col gap-2.5">
                        {/* 1. Share Invitation (Black Primary Action) */}
                        <button
                          type="button"
                          onClick={() => handleShareInvite(invite)}
                          className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-850 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                          {copiedSlug === (invite.id || invite.slug) ? (
                            <>
                              <ClipboardCheck className="w-4 h-4 text-white" />
                              <span>Invitation Link Copied!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-4 h-4" />
                              <span>Share Invitation</span>
                            </>
                          )}
                        </button>

                        {/* 2 & 3. Preview and Edit */}
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={`/invite/${invite.id || invite.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-[44px] flex items-center justify-center gap-1.5 sm:gap-2 bg-white hover:bg-zinc-50 active:scale-[0.99] border border-zinc-300 text-zinc-800 hover:text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-zinc-500" />
                            <span>Preview</span>
                          </a>

                          <Link
                            href={`/editor/${invite.template_slug}?edit=${invite.slug}`}
                            className="min-h-[44px] flex items-center justify-center gap-1.5 sm:gap-2 bg-white hover:bg-zinc-50 active:scale-[0.99] border border-zinc-300 text-zinc-800 hover:text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                          >
                            <Edit className="w-4 h-4 text-zinc-500" />
                            <span>Edit</span>
                          </Link>
                        </div>

                        {/* 4. Show RSVPs */}
                        <Link
                          href={`/dashboard/rsvps/${invite.slug}`}
                          className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 active:scale-[0.99] border border-zinc-300 text-zinc-800 hover:text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                        >
                          <Users className="w-4 h-4 text-zinc-500" />
                          <span>Show RSVPs</span>
                        </Link>

                        {/* Publish / Unpublish Toggle */}
                        {invite.status === "published" ? (
                          <button
                            type="button"
                            onClick={() => handleUnpublish(invite.slug)}
                            className="w-full min-h-[38px] flex items-center justify-center gap-1.5 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg font-medium text-[11px] tracking-wide transition-colors cursor-pointer mt-0.5"
                          >
                            Unpublish (Make Private)
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePublish(invite.slug)}
                            className="w-full min-h-[44px] flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer shadow-xs"
                          >
                            Publish & Make Live
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {/* 1. Primary Black Pay & Activate */}
                        <Link
                          href={`/editor/${invite.template_slug}?edit=${invite.slug}`}
                          className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-850 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay & Activate</span>
                        </Link>

                        {/* 2 & 3. Outlined Continue Editing + Three-dot Overflow Menu for Delete Draft */}
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/editor/${invite.template_slug}?edit=${invite.slug}`}
                            className="flex-1 min-h-[44px] flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 active:scale-[0.99] border border-zinc-300 text-zinc-800 hover:text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                          >
                            <Edit className="w-4 h-4 text-zinc-500" />
                            <span>Continue Editing</span>
                          </Link>

                          {/* Three-dot overflow menu for Delete Draft */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuSlug(openMenuSlug === invite.slug ? null : invite.slug);
                              }}
                              className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-white hover:bg-zinc-100 active:bg-zinc-200 border border-zinc-300 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                              aria-label="More draft options"
                              aria-haspopup="true"
                              aria-expanded={openMenuSlug === invite.slug}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openMenuSlug === invite.slug && (
                              <div 
                                ref={menuRef}
                                className="absolute right-0 bottom-full mb-2 w-44 bg-white border border-zinc-200 rounded-xl shadow-lg p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuSlug(null);
                                    setDraftToDelete(invite.slug);
                                  }}
                                  className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-left"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500 shrink-0" />
                                  <span>Delete Draft</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </section>
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
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-colors cursor-pointer text-base font-sans"
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
            <div className="p-4 border-t border-zinc-150 bg-zinc-50 rounded-b-[32px] flex items-center justify-between">
              {selectedInviteForRsvps && (
                <button
                  onClick={() => handleExportCsv(selectedInviteForRsvps.slug)}
                  className="min-h-[44px] px-4 py-2.5 bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-800 font-bold text-xs tracking-wider uppercase rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ClipboardCheck className="w-4 h-4 text-[#b3811b]" />
                  <span>Export CSV</span>
                </button>
              )}
              <button
                onClick={() => setSelectedInviteForRsvps(null)}
                className="min-h-[44px] px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-colors cursor-pointer flex items-center justify-center"
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
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-colors cursor-pointer text-base font-sans"
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
                className="min-h-[44px] px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-colors cursor-pointer flex items-center justify-center"
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
                className="min-h-[44px] px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs tracking-wider uppercase rounded-xl transition-colors cursor-pointer flex-1 font-sans flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSignOutConfirm(false);
                  handleSignOut();
                }}
                className="min-h-[44px] px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer flex-1 shadow-md font-sans flex items-center justify-center"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Draft Confirmation Modal */}
      {draftToDelete && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-150 p-6 rounded-[28px] w-full max-w-sm flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-sans text-lg font-bold text-zinc-900 text-center mb-1">
              DELETE DRAFT
            </h3>
            <p className="text-zinc-500 text-xs text-center mb-6 leading-relaxed font-sans">
              Are you sure you want to delete this draft invitation? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDraftToDelete(null)}
                disabled={isDeletingDraft}
                className="min-h-[44px] px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs tracking-wider uppercase rounded-xl transition-colors cursor-pointer flex-1 font-sans disabled:opacity-50 flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteDraft}
                disabled={isDeletingDraft}
                className="min-h-[44px] px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer flex-1 shadow-md font-sans disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isDeletingDraft ? "Deleting..." : "Delete"}
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
