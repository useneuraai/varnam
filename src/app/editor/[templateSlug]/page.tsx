"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useState, useRef, useMemo, Suspense } from "react";
import {
  ArrowLeft,
  CreditCard,
  Heart,
  Sparkles,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Music,
  MapPin,
  Calendar,
  Smartphone,
  Tablet,
  Monitor,
  Trash2,
  Plus,
  Eye,
  Clock,
  Sparkle,
  Check,
  Save
} from "lucide-react";
import { getTemplateBySlug, getDefaultTemplateData, getEmptyTemplateData, TemplateData, parseTimelineEvents, TimelineEvent } from "@/lib/templates";
import { templatesMap } from "@/templates";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { loadRazorpayScript } from "@/lib/loadRazorpay";
import dynamic from "next/dynamic";

const InteractiveMapPicker = dynamic(() => import("@/components/InteractiveMapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 sm:h-80 rounded-2xl bg-zinc-100 border border-zinc-200 animate-pulse flex flex-col items-center justify-center gap-2 text-xs text-zinc-400 font-medium">
      <div className="w-6 h-6 border-2 border-zinc-300 border-t-[#b3811b] rounded-full animate-spin" />
      <span>Loading Interactive Venue Map...</span>
    </div>
  )
});

const MUSIC_PRESETS = [
  { label: "Default Template Melody", value: "" },
  { label: "Classical Wedding Shehnai", value: "https://archive.org/download/r-12356661-1632393571-2601/04.%20Kajri%20-%20Dadra%20Taal.mp3" },
  { label: "Traditional Indian Sitar & Violin", value: "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3" },
  { label: "Elegant Classical Strings (Canon in D)", value: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3" },
  { label: "Romantic Piano (Clair de Lune)", value: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Debussy_-_Clair_de_Lune.mp3" }
];

const SLIDESHOW_PRESETS = [
  { label: "Default Couple Set", value: "" },
  { label: "Curated Indian Couple Set", value: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&q=80&w=600, https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600" },
  { label: "Minimalist Wedding Set", value: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600, https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600" }
];

function extractTemplateData(invitation: any, templateSlug: string): TemplateData {
  const defaults = getDefaultTemplateData(templateSlug);
  if (!invitation) return getEmptyTemplateData(templateSlug);

  const chain: Record<string, any>[] = [];
  let curr = invitation;
  while (curr && typeof curr === "object") {
    chain.unshift(curr);
    curr = curr.content_json;
  }

  const merged: Record<string, any> = {};
  for (const obj of chain) {
    for (const [k, v] of Object.entries(obj)) {
      if (k !== "content_json" && k !== "id" && k !== "slug" && k !== "user_id" && v !== undefined && v !== null && v !== "") {
        merged[k] = v;
      }
    }
  }

  return {
    ...defaults,
    ...merged,
    bride_name: merged.bride_name !== undefined ? String(merged.bride_name) : "",
    groom_name: merged.groom_name !== undefined ? String(merged.groom_name) : "",
    wedding_date: merged.wedding_date !== undefined ? String(merged.wedding_date) : "",
    wedding_venue: merged.wedding_venue !== undefined ? String(merged.wedding_venue) : "",
    quote: merged.quote !== undefined ? String(merged.quote) : "",
    family_names: merged.family_names !== undefined ? String(merged.family_names) : "",
    rsvp_phone: merged.rsvp_phone !== undefined ? String(merged.rsvp_phone) : "",
    custom_message: merged.custom_message !== undefined ? String(merged.custom_message) : "",
    music_url: merged.music_url || defaults.music_url,
    bg_image_url: "",
    slideshow_images: merged.slideshow_images !== undefined ? merged.slideshow_images : defaults.slideshow_images,
    dress_code: merged.dress_code !== undefined ? String(merged.dress_code) : "",
    transport_info: merged.transport_info !== undefined ? String(merged.transport_info) : "",
    scratch_enabled: merged.scratch_enabled !== undefined ? merged.scratch_enabled : defaults.scratch_enabled,
    sangeet_enabled: merged.sangeet_enabled !== undefined ? merged.sangeet_enabled : false,
    sangeet_date: merged.sangeet_date || "",
    sangeet_venue: merged.sangeet_venue !== undefined ? String(merged.sangeet_venue) : "",
    reception_date: merged.reception_date || "",
    reception_venue: merged.reception_venue !== undefined ? String(merged.reception_venue) : "",
    wedding_events: merged.wedding_events !== undefined ? String(merged.wedding_events) : "",
    gmap_coordinates: merged.gmap_coordinates !== undefined ? String(merged.gmap_coordinates) : "",
  };
}

function EditorPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams?.get("edit");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  const templateSlug = typeof params?.templateSlug === "string" ? params.templateSlug : "";
  const template = getTemplateBySlug(templateSlug);

  const [formData, setFormData] = useState<TemplateData | null>(null);
  const [isDraftLoaded, setIsDraftLoaded] = useState<boolean>(!editSlug);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftSlug, setDraftSlug] = useState<string | null>(editSlug || null);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "error" | "offline">("saved");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [conflictNotice, setConflictNotice] = useState<string | null>(null);
  const [currentRevision, setCurrentRevision] = useState<number>(1);
  const [activeMobileView, setActiveMobileView] = useState<"form" | "preview">("form");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingDraft, setIsDeletingDraft] = useState(false);
  const isDraftDeletedRef = useRef<boolean>(false);

  const isAutosavingRef = useRef<boolean>(false);
  const pendingSaveRef = useRef<boolean>(false);
  const hasUnsavedChangesRef = useRef<boolean>(false);
  const currentRevisionRef = useRef<number>(1);
  currentRevisionRef.current = currentRevision;
  const formDataRef = useRef<TemplateData | null>(formData);
  formDataRef.current = formData;

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === "live-preview") {
              setActiveMobileView("preview");
            } else if (entry.target.id === "editor-form") {
              setActiveMobileView("form");
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    const formEl = document.getElementById("editor-form");
    const previewEl = document.getElementById("live-preview");

    if (formEl) observer.observe(formEl);
    if (previewEl) observer.observe(previewEl);

    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";
    if (isMockSupabase) {
      setUser({ id: "mock-user-123", email: "mockuser@example.com" });
      setLoadingAuth(false);
      return;
    }

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        router.push(`/login?redirectTo=/editor/${templateSlug}${editSlug ? `?edit=${editSlug}` : ""}`);
      }
      setLoadingAuth(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
        router.push(`/login?redirectTo=/editor/${templateSlug}${editSlug ? `?edit=${editSlug}` : ""}`);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [templateSlug, editSlug, router]);
  
  // Wizard steps state
  const initialStepParam = searchParams?.get("step");
  const initialStep = initialStepParam ? Math.min(Math.max(parseInt(initialStepParam, 10) || 1, 1), 4) : 1;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [stepError, setStepError] = useState<string | null>(null);

  // Live preview device switcher state
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "tablet" | "desktop">("mobile");

  // Enforce mobile preview only on mobile screen widths (< 768px)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setPreviewDevice("mobile");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Template defaults and preview fallback data
  const templateDefaults = useMemo(() => getDefaultTemplateData(templateSlug), [templateSlug]);

  const previewData: TemplateData = useMemo(() => {
    if (!formData) return templateDefaults;
    return {
      ...templateDefaults,
      ...formData,
      bride_name: formData.bride_name?.trim() ? formData.bride_name : templateDefaults.bride_name,
      groom_name: formData.groom_name?.trim() ? formData.groom_name : templateDefaults.groom_name,
      wedding_date: formData.wedding_date?.trim() ? formData.wedding_date : templateDefaults.wedding_date,
      wedding_venue: formData.wedding_venue?.trim() ? formData.wedding_venue : templateDefaults.wedding_venue,
      reception_date: formData.reception_date?.trim() ? formData.reception_date : templateDefaults.reception_date,
      reception_venue: formData.reception_venue?.trim() ? formData.reception_venue : templateDefaults.reception_venue,
      family_names: formData.family_names?.trim() ? formData.family_names : templateDefaults.family_names,
      quote: formData.quote?.trim() ? formData.quote : templateDefaults.quote,
      custom_message: formData.custom_message?.trim() ? formData.custom_message : templateDefaults.custom_message,
      rsvp_phone: formData.rsvp_phone?.trim() ? formData.rsvp_phone : templateDefaults.rsvp_phone,
      gmap_coordinates: formData.gmap_coordinates?.trim() ? formData.gmap_coordinates : templateDefaults.gmap_coordinates,
      wedding_events: formData.wedding_events?.trim() ? formData.wedding_events : templateDefaults.wedding_events,
    };
  }, [formData, templateDefaults]);

  // Asset selection mode overrides: "preset" | "upload" | "url"
  const [musicMode, setMusicMode] = useState("preset");
  const [slideshowMode, setSlideshowMode] = useState("preset");

  // Helper to adjust labels for religion categories (e.g., Nikah/Valima/Mehndi for Muslim template)
  const getAdjustedFieldLabel = (fieldId: string, defaultLabel: string): string => {
    const isMuslim = templateSlug === "elegant-muslim" || template?.religion?.toLowerCase() === "muslim";
    if (!isMuslim) return defaultLabel;

    switch (fieldId) {
      case "wedding_date":
        return "Nikah Date & Time";
      case "wedding_venue":
        return "Nikah Venue";
      case "quote":
        return "Quranic Verse / Quote";
      case "sangeet_enabled":
        return "Include Mehndi Event?";
      case "sangeet_date":
        return "Mehndi Date & Time";
      case "sangeet_venue":
        return "Mehndi Venue";
      case "reception_date":
        return "Valima Date & Time";
      case "reception_venue":
        return "Valima Venue";
      default:
        return defaultLabel
          .replace(/Wedding/g, "Nikah")
          .replace(/Sangeet/g, "Mehndi")
          .replace(/Reception/g, "Valima");
    }
  };

  const getAdjustedFieldPlaceholder = (fieldId: string, defaultPlaceholder: string): string => {
    const isMuslim = templateSlug === "elegant-muslim" || template?.religion?.toLowerCase() === "muslim";
    if (!isMuslim) return defaultPlaceholder;

    switch (fieldId) {
      case "wedding_venue":
        return "E.g. Grand Plaza Banquet Hall, Chennai";
      case "sangeet_venue":
        return "E.g. Sapphire Banquet Hall, Chennai";
      case "reception_venue":
        return "E.g. Crescent Palace Lawns, Chennai";
      default:
        return defaultPlaceholder
          .replace(/Wedding/g, "Nikah")
          .replace(/Sangeet/g, "Mehndi")
          .replace(/Reception/g, "Valima");
    }
  };

  // Proactive authentication header resolution with automatic token refresh
  const getAuthHeaders = async (forceRefresh = false): Promise<Record<string, string>> => {
    if (!isSupabaseConfigured) {
      return {
        "Content-Type": "application/json",
        "Authorization": "Bearer mock-user-token",
      };
    }

    try {
      let { data: { session } } = await supabase.auth.getSession();
      const expiresAt = session?.expires_at ? session.expires_at * 1000 : 0;
      const isExpiringSoon = expiresAt > 0 && expiresAt - Date.now() < 60000;

      if (!session || forceRefresh || isExpiringSoon) {
        const { data: refreshed, error } = await supabase.auth.refreshSession();
        if (!error && refreshed?.session) {
          session = refreshed.session;
          if (refreshed.session.user) {
            setUser(refreshed.session.user);
          }
        }
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      return headers;
    } catch (err) {
      console.warn("Error resolving auth headers:", err);
      return { "Content-Type": "application/json" };
    }
  };

  // Authenticated fetch wrapper that retries once on 401 using a fresh session token
  const authenticatedFetch = async (url: string, init?: RequestInit): Promise<Response> => {
    const defaultHeaders = await getAuthHeaders();
    const headers = { ...defaultHeaders, ...(init?.headers as Record<string, string> || {}) };
    let res = await fetch(url, { ...init, headers });

    if (res.status === 401 && isSupabaseConfigured) {
      console.warn("Received 401 Unauthorized, refreshing Supabase session and retrying...");
      const refreshedHeaders = await getAuthHeaders(true);
      if (refreshedHeaders["Authorization"]) {
        const retryHeaders = { ...headers, ...refreshedHeaders };
        res = await fetch(url, { ...init, headers: retryHeaders });
      }
    }

    return res;
  };

  // Initialize form with defaults or fetch existing for editing
  useEffect(() => {
    if (loadingAuth || !templateSlug) return;

    if (editSlug) {
      setIsSubmitting(true);
      (async () => {
        try {
          const res = await authenticatedFetch(`/api/invitations/${editSlug}`);

          // Session expired or unauthenticated: redirect to login preserving edit parameter
          if (res.status === 401) {
            console.warn("Unauthorized to view draft (401). Preserving draft URL and redirecting.");
            const currentPath = window.location.pathname + window.location.search;
            router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
            return;
          }

          if (res.status === 404) {
            console.warn("Invitation slug not found (404), initializing as new draft.");
            setIsEditMode(false);
            setDraftSlug(null);
            const newUrl = window.location.pathname;
            window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
            const emptyData = getEmptyTemplateData(templateSlug);
            setFormData(emptyData);
            setIsDraftLoaded(true);
            return;
          }

          if (res.status === 403) {
            const errData = await res.json().catch(() => ({}));
            if (errData.message?.includes("archived")) {
              setIsArchived(true);
              setError("This invitation is archived (license exhausted) and cannot be edited.");
            } else {
              console.warn("Draft ownership mismatch, initializing a personal copy.");
              setError("This draft belongs to another user. Initializing a personal draft for you.");
              setIsEditMode(false);
              setDraftSlug(null);
              const newUrl = window.location.pathname;
              window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
              const emptyData = getEmptyTemplateData(templateSlug);
              setFormData(emptyData);
              setIsDraftLoaded(true);
              return;
            }
          }

          if (!res.ok) throw new Error("Could not find invitation to edit.");
          const data = await res.json();

          // Ensure user resumes draft with the correct template
          if (data.template_slug && data.template_slug !== templateSlug) {
            router.replace(`/editor/${data.template_slug}?edit=${editSlug}`);
            return;
          }

          const resolvedData = extractTemplateData(data, templateSlug);

          // Restore local backup if newer than server copy
          try {
            const localSaved = localStorage.getItem(`varnam_draft_${editSlug}`);
            if (localSaved) {
              const parsedLocal = JSON.parse(localSaved);
              if (parsedLocal?.formData && parsedLocal?.savedAt) {
                const localDate = new Date(parsedLocal.savedAt).getTime();
                const serverDate = data.updated_at ? new Date(data.updated_at).getTime() : 0;
                if (localDate > serverDate) {
                  console.info("Restoring latest local changes for slug:", editSlug);
                  Object.assign(resolvedData, parsedLocal.formData);
                }
              }
            }
          } catch {}

          setFormData(resolvedData);
          setDraftSlug(editSlug);
          const isPaid = Boolean(data && data.is_paid);
          setIsEditMode(isPaid);
          if (typeof data.revision === "number") {
            setCurrentRevision(data.revision);
            currentRevisionRef.current = data.revision;
          }
          setIsDraftLoaded(true);

          // Check if archived only for paid & published invitations
          if (data && data.is_paid && data.status === "published" && data.wedding_date) {
            const now = new Date();
            const eventDate = new Date(data.wedding_date);
            if (!isNaN(eventDate.getTime())) {
              const archiveLimit = new Date(eventDate.getTime() + 5 * 24 * 60 * 60 * 1000);
              if (now > archiveLimit) {
                setIsArchived(true);
                setError("This invitation is archived (license exhausted) and cannot be edited.");
              }
            }
          }
        } catch (err: any) {
          console.error("Error loading invitation draft:", err);
          setError(err.message || "Failed to load invitation.");
          const emptyData = getEmptyTemplateData(templateSlug);
          setFormData(emptyData);
          setIsDraftLoaded(true);
        } finally {
          setIsSubmitting(false);
        }
      })();
    } else {
      const emptyData = getEmptyTemplateData(templateSlug);
      setFormData(emptyData);
      setIsDraftLoaded(true);
    }
  }, [templateSlug, editSlug, loadingAuth]);

  // Flush uncommitted changes on page exit / visibility change / pagehide using keepalive fetch
  useEffect(() => {
    if (typeof window === "undefined") return;

    const flushOnExit = () => {
      const activeSlug = editSlug || draftSlug;
      const currentData = formDataRef.current;
      if (!activeSlug || !currentData || !hasUnsavedChangesRef.current) return;

      try {
        localStorage.setItem(`varnam_draft_${activeSlug}`, JSON.stringify({
          formData: currentData,
          revision: currentRevisionRef.current,
          savedAt: new Date().toISOString(),
        }));

        const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";
        const authHeader = isMockSupabase ? "Bearer mock-user-token" : "";
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (authHeader) headers["Authorization"] = authHeader;

        const payload = isEditMode
          ? JSON.stringify({ formData: currentData, revision: currentRevisionRef.current })
          : JSON.stringify({
              slug: activeSlug,
              templateSlug: templateSlug,
              formData: currentData,
              revision: currentRevisionRef.current,
            });

        const targetUrl = isEditMode ? `/api/invitations/${activeSlug}` : "/api/invitations/draft";
        fetch(targetUrl, {
          method: isEditMode ? "PUT" : "POST",
          headers,
          body: payload,
          keepalive: true,
        }).catch(() => {});
      } catch {}
    };

    const handleBeforeUnload = () => {
      if (hasUnsavedChangesRef.current) {
        flushOnExit();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && hasUnsavedChangesRef.current) {
        flushOnExit();
      }
    };

    const handlePageHide = () => {
      if (hasUnsavedChangesRef.current) {
        flushOnExit();
      }
    };

    const handleOnline = () => {
      setSaveStatus("saving");
      if (formDataRef.current) {
        pendingSaveRef.current = true;
        flushSave();
      }
    };

    const handleOffline = () => {
      setSaveStatus("offline");
      const activeSlug = editSlug || draftSlug;
      if (activeSlug && formDataRef.current) {
        try {
          localStorage.setItem(`varnam_draft_${activeSlug}`, JSON.stringify({
            formData: formDataRef.current,
            revision: currentRevisionRef.current,
            savedAt: new Date().toISOString(),
          }));
        } catch {}
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [editSlug, draftSlug, templateSlug, isEditMode]);

  const flushSave = async (force: boolean = false) => {
    if (!user || isArchived || !isDraftLoaded || isDraftDeletedRef.current) return;
    const currentData = formDataRef.current;
    if (!currentData || (!currentData.bride_name && !currentData.groom_name && !currentData.wedding_venue)) {
      return;
    }

    if (isAutosavingRef.current && !force) {
      pendingSaveRef.current = true;
      return;
    }

    try {
      isAutosavingRef.current = true;
      setIsAutosaving(true);
      setSaveStatus("saving");
      setSaveError(null);

      let activeSlug = editSlug || draftSlug;
      if (!activeSlug) {
        const randomStr = Math.random().toString(36).substring(2, 9);
        activeSlug = randomStr;
        setDraftSlug(activeSlug);
        
        const newUrl = `${window.location.pathname}?edit=${activeSlug}`;
        window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
      } else if (!draftSlug || draftSlug !== activeSlug) {
        setDraftSlug(activeSlug);
      }

      // Save immediate local snapshot
      try {
        localStorage.setItem(`varnam_draft_${activeSlug}`, JSON.stringify({
          formData: currentData,
          revision: currentRevisionRef.current,
          savedAt: new Date().toISOString(),
        }));
      } catch {}

      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setSaveStatus("offline");
        return;
      }

      const payloadRevision = currentRevisionRef.current;

      let res: Response;
      if (isEditMode && activeSlug) {
        res = await authenticatedFetch(`/api/invitations/${activeSlug}`, {
          method: "PUT",
          body: JSON.stringify({ formData: currentData, revision: payloadRevision }),
        });
      } else {
        res = await authenticatedFetch("/api/invitations/draft", {
          method: "POST",
          body: JSON.stringify({
            slug: activeSlug,
            templateSlug: templateSlug,
            formData: currentData,
            revision: payloadRevision,
          }),
        });
      }

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (typeof data.revision === "number") {
          currentRevisionRef.current = data.revision;
          setCurrentRevision(data.revision);
        }
        setSaveStatus("saved");
        setSaveError(null);
        hasUnsavedChangesRef.current = false;
      } else if (res.status === 409) {
        const conflict = await res.json().catch(() => ({}));
        const serverRev = conflict.serverRevision || (payloadRevision + 1);
        currentRevisionRef.current = serverRev;
        setCurrentRevision(serverRev);

        setConflictNotice("Newer changes detected from another session. Your latest edits were preserved and synced.");
        setTimeout(() => setConflictNotice(null), 5000);
        pendingSaveRef.current = true;
      } else if (res.status === 401) {
        setSaveStatus("error");
        setSaveError("Session expired. Please sign in to save.");
      } else if (res.status === 403) {
        const errData = await res.json().catch(() => ({}));
        if (errData.message?.includes("archived")) {
          setIsArchived(true);
          setSaveStatus("error");
          setSaveError("This invitation is archived and cannot be edited.");
        } else {
          // Ownership mismatch: fork to a new slug for the current user so work is not lost!
          const randomStr = Math.random().toString(36).substring(2, 9);
          setDraftSlug(randomStr);
          const newUrl = `${window.location.pathname}?edit=${randomStr}`;
          window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
          pendingSaveRef.current = true;
          setConflictNotice("Forked to a personal draft for your account.");
          setTimeout(() => setConflictNotice(null), 5000);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setSaveStatus("error");
        setSaveError(errData.message || "Failed to save draft.");
      }
    } catch (err: any) {
      console.error("Autosave error:", err);
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setSaveStatus("offline");
      } else {
        setSaveStatus("error");
        setSaveError(err.message || "Network error while saving.");
      }
    } finally {
      isAutosavingRef.current = false;
      setIsAutosaving(false);
      // Serialized retry if user continued typing while save was in flight
      if (pendingSaveRef.current) {
        pendingSaveRef.current = false;
        flushSave();
      }
    }
  };

  // Debounced autosave to database (500–1000ms debounce per spec)
  useEffect(() => {
    if (!user || !formData || isArchived || !isDraftLoaded || isDraftDeletedRef.current) return;

    if (!formData.bride_name && !formData.groom_name && !formData.wedding_venue) {
      return;
    }

    const timer = setTimeout(() => {
      flushSave();
    }, 800);

    return () => clearTimeout(timer);
  }, [formData, user, templateSlug, isArchived, isDraftLoaded, isEditMode, editSlug, draftSlug]);

  // Load Google Maps script dynamically (only if API key is present)

  if (!template) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-zinc-900 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-cinzel text-3xl font-bold tracking-widest text-zinc-900 mb-4">Template Not Found</h1>
        <p className="text-sm text-zinc-500 mb-6">The template you are trying to customize does not exist.</p>
        <Link href="/templates" className="px-6 py-2.5 bg-zinc-950 text-white font-montserrat text-xs tracking-widest font-bold rounded-xl">
          RETURN TO GALLERY
        </Link>
      </div>
    );
  }

  if (!formData || !isDraftLoaded) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-6 text-center gap-3">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-[#b3811b] rounded-full animate-spin" />
        <p className="text-xs font-montserrat tracking-widest uppercase text-zinc-600 font-bold">
          Loading Saved Invitation...
        </p>
      </div>
    );
  }

  const TemplateComponent = templatesMap[templateSlug];

  const handleInputChange = (fieldId: string, value: string) => {
    hasUnsavedChangesRef.current = true;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [fieldId]: value,
      };
    });
  };

  // Wizard steps categorizer: 4 logical sections
  const getFieldStep = (fieldId: string): number => {
    switch (fieldId) {
      // Step 1: Couple & Family Details
      case "bride_name":
      case "groom_name":
      case "family_names":
      case "quote":
      case "custom_message":
        return 1;

      // Step 2: Dates, Venues & Locations (Wedding, Reception & Maps in one place)
      case "wedding_date":
      case "wedding_venue":
      case "reception_date":
      case "reception_venue":
      case "gmap_coordinates":
        return 2;

      // Step 3: Program Timeline
      case "wedding_events":
        return 3;

      // Step 4: Media, RSVP & Publish
      case "slideshow_images":
      case "music_url":
      case "rsvp_phone":
      case "dress_code":
      case "transport_info":
      case "scratch_enabled":
      case "sangeet_enabled":
      case "sangeet_date":
      case "sangeet_venue":
        return 4;

      case "bg_image_url":
        return -1; // Custom background image removed

      default:
        return 1;
    }
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData?.bride_name || !formData.bride_name.trim()) {
        setStepError("Please enter the Bride's Name.");
        return false;
      }
      if (!formData?.groom_name || !formData.groom_name.trim()) {
        setStepError("Please enter the Groom's Name.");
        return false;
      }
    } else if (step === 2) {
      if (!formData?.wedding_date || !formData.wedding_date.trim()) {
        setStepError("Please select the Wedding Date & Time.");
        return false;
      }
      if (!formData?.wedding_venue || !formData.wedding_venue.trim()) {
        setStepError("Please enter the Wedding Venue Address.");
        return false;
      }
    } else if (step === 4) {
      if (!formData?.rsvp_phone || !formData.rsvp_phone.trim()) {
        setStepError("Please enter an RSVP Contact Phone Number.");
        return false;
      }
    }
    setStepError(null);
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      flushSave();
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setStepError(null);
    flushSave();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setStepError(null);
      flushSave();
      setCurrentStep(step);
    } else if (step > currentStep) {
      // Validate intermediate steps
      for (let s = currentStep; s < step; s++) {
        if (!validateStep(s)) return;
      }
      flushSave();
      setCurrentStep(step);
    }
  };

  // Asset upload with Supabase Storage integration
  const handleFileUpload = async (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a smaller image.");
      return;
    }

    try {
      setIsAutosaving(true);
      setSaveStatus("saving");
      let authHeaders = await getAuthHeaders();
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadHeaders: Record<string, string> = {};
      if (authHeaders["Authorization"]) {
        uploadHeaders["Authorization"] = authHeaders["Authorization"];
      }

      let res = await fetch("/api/media/upload", {
        method: "POST",
        headers: uploadHeaders,
        body: uploadFormData,
      });

      if (res.status === 401 && isSupabaseConfigured) {
        authHeaders = await getAuthHeaders(true);
        if (authHeaders["Authorization"]) {
          uploadHeaders["Authorization"] = authHeaders["Authorization"];
        }
        res = await fetch("/api/media/upload", {
          method: "POST",
          headers: uploadHeaders,
          body: uploadFormData,
        });
      }

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          handleInputChange(fieldId, data.url);
          setSaveStatus("saved");
        }
      } else {
        // Fallback to base64 if storage is not yet configured
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          handleInputChange(fieldId, base64);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error("Upload failed, falling back to local base64:", err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        handleInputChange(fieldId, base64);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsAutosaving(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final check for step validation
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        setIsSubmitting(false);
        const formEl = document.getElementById("editor-form");
        if (formEl) formEl.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    if (isArchived) {
      setError("This invitation is archived and cannot be modified.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // If already in edit mode for an existing paid invitation, save and redirect
    if (isEditMode && editSlug) {
      try {
        const response = await authenticatedFetch(`/api/invitations/${editSlug}`, {
          method: "PUT",
          body: JSON.stringify({ formData, revision: currentRevisionRef.current }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to update invitation details.");
        }

        router.push(`/success/${editSlug}?mode=edit`);
        return;
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An unexpected error occurred during save.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // 1. Create order on server with trusted template price
      const orderRes = await authenticatedFetch("/api/payments/order", {
        method: "POST",
        body: JSON.stringify({
          templateSlug: template.slug,
          invitationSlug: editSlug || draftSlug,
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData.message || "Failed to initialize payment order.");
      }

      const orderData = await orderRes.json();

      // 2. Ensure Razorpay client SDK is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error("Unable to load Razorpay payment gateway. Please disable ad-blockers and try again.");
      }

      if (!orderData.key || !orderData.id) {
        throw new Error(orderData.message || "Failed to initialize payment gateway order.");
      }

      // 3. Launch real Razorpay Checkout modal
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Varnam Invites",
        description: `${template.name} Digital Wedding Invitation`,
        order_id: orderData.id,
        prefill: {
          name: user?.user_metadata?.full_name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#000000",
        },
        handler: async function (response: any) {
          try {
            const verifyResponse = await authenticatedFetch("/api/payments/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                formData,
                templateSlug: template.slug,
                userId: user?.id,
                existingSlug: editSlug || draftSlug,
              }),
            });

            if (!verifyResponse.ok) {
              const err = await verifyResponse.json();
              throw new Error(err.message || "Payment verification failed.");
            }

            const verifyResult = await verifyResponse.json();
            router.push(`/success/${verifyResult.slug}`);
          } catch (err: any) {
            console.error("Verification failed:", err);
            setError(err.message || "Verification failed after payment.");
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.error("Razorpay payment failed:", response.error);
        setError(response.error?.description || "Payment was not completed. Please try again.");
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during checkout.");
      setIsSubmitting(false);
    }
  };

  const handleDeleteDraft = async () => {
    const activeSlug = editSlug || draftSlug;
    if (!activeSlug || isEditMode) return;

    setIsDeletingDraft(true);
    isDraftDeletedRef.current = true;

    try {
      const isMockSupabase = !isSupabaseConfigured;
      const { data: { session } } = await supabase.auth.getSession();
      const token = isMockSupabase ? "mock-user-token" : session?.access_token || "";

      const res = await fetch(`/api/invitations/${activeSlug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        try {
          localStorage.removeItem(`varnam_offline_draft_${activeSlug}`);
          const cached = localStorage.getItem("varnam_cached_invitations");
          if (cached) {
            const list = JSON.parse(cached);
            if (Array.isArray(list)) {
              const updated = list.filter((i: any) => i.slug !== activeSlug);
              localStorage.setItem("varnam_cached_invitations", JSON.stringify(updated));
            }
          }
        } catch {}

        router.push("/dashboard");
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || "Failed to delete draft from database.");
        isDraftDeletedRef.current = false;
        setIsDeletingDraft(false);
        setShowDeleteModal(false);
      }
    } catch (err: any) {
      console.error("Error deleting draft from editor:", err);
      alert(err.message || "Error deleting draft.");
      isDraftDeletedRef.current = false;
      setIsDeletingDraft(false);
      setShowDeleteModal(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f3efe9] flex flex-col items-center justify-center font-sans text-neutral-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#b3811b] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#8a725d] font-bold animate-pulse">
            Verifying Authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#fbfbfa] text-[#3e342a] flex flex-col">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Editor Header */}
      <header className="h-20 border-b border-[#eed57c]/20 bg-white/70 backdrop-blur-md flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
          <Link href="/templates" className="p-2 text-[#8a725d] hover:text-[#c59b27] transition-colors rounded-xl hover:bg-[#b3811b]/5">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <span className="font-cinzel text-xs text-[#8a725d] font-bold tracking-wider">DESIGN STUDIO</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span suppressHydrationWarning className="font-montserrat text-[9px] tracking-widest text-[#8a725d]/70 uppercase">
                CUSTOMIZING: {template.name}
              </span>
              <span className="text-[9px] text-[#8a725d]/40 font-montserrat">•</span>
              {saveStatus === "saving" ? (
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-ping" />
                  Saving...
                </span>
              ) : saveStatus === "offline" ? (
                <button
                  type="button"
                  onClick={() => flushSave(true)}
                  className="text-[9px] text-amber-600 hover:text-amber-700 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  title="Saved locally. Click to retry syncing"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Offline (Saved Locally) • Retry
                </button>
              ) : saveStatus === "error" ? (
                <button
                  type="button"
                  id="save-failed-retry-btn"
                  onClick={() => flushSave(true)}
                  className="text-[9px] text-rose-600 hover:text-rose-700 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer underline decoration-rose-300 underline-offset-2"
                  title={saveError || "Save failed. Click to retry"}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  Save failed • Retry
                </button>
              ) : (
                <span className="text-[9px] text-[#b3811b] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b3811b]" />
                  Saved
                </span>
              )}
            </div>
          </div>
        </div>

        <Link href="/" className="font-cinzel text-xl font-bold tracking-widest bg-gradient-to-r from-[#d4b060] to-[#b3811b] bg-clip-text text-transparent hidden sm:block">
          VARNAM
        </Link>

        <div className="flex items-center gap-2.5">
          {/* Manual Save Draft Button */}
          <button
            type="button"
            id="manual-save-draft-btn"
            onClick={() => flushSave(true)}
            disabled={isAutosaving}
            className="h-9 px-3 rounded-xl border border-[#eed57c]/60 hover:border-[#b3811b] bg-white/80 hover:bg-[#fffbf0] text-[#8a725d] hover:text-[#b3811b] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Save changes now"
          >
            <Save className={`w-3.5 h-3.5 ${isAutosaving ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          {/* Delete Draft Button (ONLY for unpaid draft) */}
          {!isEditMode && (editSlug || draftSlug) && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="h-9 px-3 rounded-xl border border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Delete this draft from database"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden sm:inline">Delete Draft</span>
            </button>
          )}

          <div className="bg-[#fffcf9] border border-[#eed57c]/30 px-4 py-1.5 rounded-xl shadow-sm">
            <span className="font-cinzel text-[#b3811b] font-bold tracking-wide text-xs">₹{template.price}</span>
          </div>
        </div>
      </header>

      {/* Save Error Notice Banner */}
      {saveStatus === "error" && saveError && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 text-center text-xs font-semibold text-rose-900 flex items-center justify-center gap-3 animate-in fade-in duration-200 z-30">
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <span>{saveError}</span>
          <button
            type="button"
            onClick={() => flushSave(true)}
            className="px-2.5 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Retry Now
          </button>
        </div>
      )}

      {/* Non-destructive Conflict Notification Banner */}
      {conflictNotice && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs font-semibold text-amber-900 flex items-center justify-center gap-2 animate-in fade-in duration-200 z-30">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>{conflictNotice}</span>
        </div>
      )}

      {/* Main Split Layout */}
      <div className="flex-grow flex flex-col lg:flex-row min-h-0">
        {/* Left Side: Form controls with 4-Step Wizard */}
        <div id="editor-form" data-lenis-prevent className="w-full lg:w-[450px] xl:w-[500px] border-r border-[#eed57c]/15 bg-white/40 p-6 overflow-y-auto lg:h-[calc(100vh-80px)] flex flex-col justify-between scroll-mt-24">
          <div>
            {/* Stepper Header */}
            <div className="mb-8 flex items-center justify-between relative px-2">
              <div className="absolute left-6 right-6 top-4 h-[1px] bg-[#eed57c]/30 z-0" />
              {[1, 2, 3, 4].map((step) => {
                const active = currentStep === step;
                const completed = currentStep > step;
                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => handleStepClick(step)}
                    className="relative z-10 flex flex-col items-center gap-1.5 group focus:outline-none"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border font-montserrat text-xs transition-all duration-500 cursor-pointer ${
                        active
                          ? "bg-gradient-to-r from-[#d4b060] to-[#b3811b] text-white border-[#b3811b] font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-105"
                          : completed
                          ? "bg-[#fffbf5] text-[#b3811b] border-[#b3811b]/60 font-bold"
                          : "bg-white text-neutral-400 border-neutral-200 group-hover:border-[#b3811b]/40 group-hover:text-[#b3811b]"
                      }`}
                    >
                      {step}
                    </div>
                    <span
                      className={`font-montserrat text-[8px] tracking-widest uppercase transition-all duration-300 ${
                        active
                          ? "text-[#b3811b] font-bold"
                          : completed
                          ? "text-[#b3811b]/70 font-semibold"
                          : "text-neutral-400 group-hover:text-neutral-600"
                      }`}
                    >
                      {step === 1 ? "Couple" : step === 2 ? "Venues" : step === 3 ? "Schedule" : "Publish"}
                    </span>
                  </button>
                );
              })}
            </div>

            {stepError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs tracking-wide leading-relaxed flex gap-2 rounded-2xl shadow-sm animate-pulse">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span>{stepError}</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs tracking-wide leading-relaxed flex gap-2 rounded-2xl shadow-sm">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* STEP 1: COUPLE & FAMILY DETAILS */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="p-4 bg-[#fffdfa] border border-[#eed57c]/30 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#eed57c]/20 pb-2">
                      <Heart className="w-4 h-4 text-[#b3811b]" />
                      <h3 className="font-montserrat text-xs tracking-wider uppercase font-bold text-[#8a725d]">
                        The Couple
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] font-bold block mb-1">
                          Bride Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData?.bride_name || ""}
                          onChange={(e) => handleInputChange("bride_name", e.target.value)}
                          placeholder={templateDefaults.bride_name || "e.g. Ananya"}
                          className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-2.5 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-xs placeholder-neutral-400"
                        />
                      </div>
                      <div>
                        <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] font-bold block mb-1">
                          Groom Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData?.groom_name || ""}
                          onChange={(e) => handleInputChange("groom_name", e.target.value)}
                          placeholder={templateDefaults.groom_name || "e.g. Siddharth"}
                          className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-2.5 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-xs placeholder-neutral-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#fffdfa] border border-[#eed57c]/30 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#eed57c]/20 pb-2">
                      <Sparkles className="w-4 h-4 text-[#b3811b]" />
                      <h3 className="font-montserrat text-xs tracking-wider uppercase font-bold text-[#8a725d]">
                        Family & Blessings
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] font-bold block mb-1">
                          With Blessings Of / Parents & Family Names
                        </label>
                        <textarea
                          rows={2}
                          value={formData?.family_names || ""}
                          onChange={(e) => handleInputChange("family_names", e.target.value)}
                          placeholder={templateDefaults.family_names || "e.g. With the divine blessings of our beloved elders: Mr. & Mrs. R. Sundaram & Family"}
                          className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-2.5 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-xs placeholder-neutral-400"
                        />
                      </div>
                      <div>
                        <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] font-bold block mb-1">
                          {getAdjustedFieldLabel("quote", "Wedding Verse / Quote")}
                        </label>
                        <textarea
                          rows={2}
                          value={formData?.quote || ""}
                          onChange={(e) => handleInputChange("quote", e.target.value)}
                          placeholder={templateDefaults.quote || "e.g. Two souls united amidst sacred blessings, embarking on an eternal auspicious journey together."}
                          className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-2.5 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-xs placeholder-neutral-400"
                        />
                      </div>
                      <div>
                        <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] font-bold block mb-1">
                          Welcome Note / Custom Message For Guests
                        </label>
                        <textarea
                          rows={2}
                          value={formData?.custom_message || ""}
                          onChange={(e) => handleInputChange("custom_message", e.target.value)}
                          placeholder={templateDefaults.custom_message || "e.g. We cordially request the honour of your gracious presence to celebrate our wedding."}
                          className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-2.5 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-xs placeholder-neutral-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: WEDDING & RECEPTION DATES, VENUES & MAPS IN ONE PLACE */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  {/* Wedding Ceremony */}
                  <div className="p-4 bg-[#fffdfa] border border-[#eed57c]/30 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#eed57c]/20 pb-2">
                      <Calendar className="w-4 h-4 text-[#b3811b]" />
                      <h3 className="font-montserrat text-xs tracking-wider uppercase font-bold text-[#8a725d]">
                        {getAdjustedFieldLabel("wedding_date", "Wedding Ceremony")}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] font-bold block mb-1">
                          {getAdjustedFieldLabel("wedding_date", "Wedding Date & Time")} <span className="text-red-500">*</span>
                        </label>
                        <div
                          onClick={(e) => {
                            const input = e.currentTarget.querySelector("input");
                            if (input) {
                              try { input.showPicker(); } catch {}
                            }
                          }}
                          className="w-full relative group cursor-pointer"
                        >
                          <input
                            type="datetime-local"
                            value={formData?.wedding_date ? new Date(formData.wedding_date).toISOString().slice(0, 16) : ""}
                            onChange={(e) => {
                              const iso = e.target.value ? new Date(e.target.value).toISOString() : "";
                              handleInputChange("wedding_date", iso);
                            }}
                            className="w-full bg-white border border-neutral-200 group-hover:border-neutral-300 text-neutral-800 px-4 py-2.5 pr-10 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-xs cursor-pointer"
                          />
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b3811b] pointer-events-none">
                            <Calendar className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] font-bold block mb-1">
                          {getAdjustedFieldLabel("wedding_venue", "Wedding Venue Address")} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={formData?.wedding_venue || ""}
                          onChange={(e) => handleInputChange("wedding_venue", e.target.value)}
                          placeholder={templateDefaults.wedding_venue || "e.g. The Leela Palace Courtyard, Adyar Seaface, MRC Nagar, Chennai - 600028"}
                          className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-2.5 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-xs placeholder-neutral-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reception Feast */}
                  <div className="p-4 bg-[#fffdfa] border border-[#eed57c]/30 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#eed57c]/20 pb-2">
                      <Sparkles className="w-4 h-4 text-[#b3811b]" />
                      <h3 className="font-montserrat text-xs tracking-wider uppercase font-bold text-[#8a725d]">
                        {getAdjustedFieldLabel("reception_date", "Reception Feast & Celebration")}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] font-bold block mb-1">
                          {getAdjustedFieldLabel("reception_date", "Reception Date & Time")}
                        </label>
                        <div
                          onClick={(e) => {
                            const input = e.currentTarget.querySelector("input");
                            if (input) {
                              try { input.showPicker(); } catch {}
                            }
                          }}
                          className="w-full relative group cursor-pointer"
                        >
                          <input
                            type="datetime-local"
                            value={formData?.reception_date ? new Date(formData.reception_date).toISOString().slice(0, 16) : ""}
                            onChange={(e) => {
                              const iso = e.target.value ? new Date(e.target.value).toISOString() : "";
                              handleInputChange("reception_date", iso);
                            }}
                            className="w-full bg-white border border-neutral-200 group-hover:border-neutral-300 text-neutral-800 px-4 py-2.5 pr-10 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-xs cursor-pointer"
                          />
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b3811b] pointer-events-none">
                            <Calendar className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] font-bold block mb-1">
                          {getAdjustedFieldLabel("reception_venue", "Reception Venue Address")}
                        </label>
                        <textarea
                          rows={3}
                          value={formData?.reception_venue || ""}
                          onChange={(e) => handleInputChange("reception_venue", e.target.value)}
                          placeholder={templateDefaults.reception_venue || "e.g. Grand Ballroom, The Leela Palace, Chennai"}
                          className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-2.5 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-xs placeholder-neutral-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Venue Map & Location */}
                  <div className="p-4 border border-[#eed57c]/30 bg-[#fffdfa] rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#eed57c]/20 pb-2">
                      <MapPin className="w-4 h-4 text-[#b3811b]" />
                      <h3 className="font-montserrat text-xs tracking-wider uppercase font-bold text-[#8a725d]">
                        Venue Location Map & GPS Search
                      </h3>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Pins location for guests to open turn-by-turn Google Maps directions on their mobile devices.
                    </p>
                    <div className="mt-1">
                      <InteractiveMapPicker
                        value={formData?.gmap_coordinates || ""}
                        suggestedVenueName={formData?.wedding_venue || ""}
                        onChange={(newVal) => handleInputChange("gmap_coordinates", newVal)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PROGRAM SCHEDULE (WEDDING & RECEPTION FEATURED) */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 border-b border-[#eed57c]/25 pb-3">
                    <Calendar className="w-4 h-4 text-[#b3811b]" />
                    <div>
                      <h3 className="font-montserrat text-xs tracking-wider uppercase font-bold text-[#8a725d]">
                        Invitation Program Schedule
                      </h3>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        Your sacred wedding ceremony and reception feast appear automatically on the invitation scroll
                      </p>
                    </div>
                  </div>

                  {/* Wedding Ceremony Program Card */}
                  <div className="p-4 bg-[#fffdfa] border border-[#eed57c]/35 rounded-2xl shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#831843] text-white text-[10px] font-bold flex items-center justify-center font-montserrat shadow-xs">
                          1
                        </span>
                        <div>
                          <span className="font-montserrat text-xs font-bold text-neutral-800">
                            {getAdjustedFieldLabel("wedding_date", "Sacred Wedding Ceremony")}
                          </span>
                          <span className="ml-2 text-[9px] uppercase tracking-wider text-[#b3811b] font-semibold bg-[#eed57c]/20 px-2 py-0.5 rounded-full">
                            Featured On Invitation
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80">
                        <span className="text-[9.5px] uppercase tracking-wider text-neutral-400 font-bold block mb-0.5">
                          Date & Time
                        </span>
                        <span className="font-medium text-neutral-800">
                          {formData?.wedding_date
                            ? new Date(formData.wedding_date).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })
                            : templateDefaults.wedding_date
                            ? new Date(templateDefaults.wedding_date).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })
                            : "Auspicious Morning (Configured in Step 2)"}
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80">
                        <span className="text-[9.5px] uppercase tracking-wider text-neutral-400 font-bold block mb-0.5">
                          Venue
                        </span>
                        <span className="font-medium text-neutral-800 line-clamp-1">
                          {formData?.wedding_venue || templateDefaults.wedding_venue || "Configured in Step 2"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reception Program Card */}
                  <div className="p-4 bg-[#fffdfa] border border-[#eed57c]/35 rounded-2xl shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#faedd3] border border-[#b8860b] text-[10px] text-[#4a2406] font-bold flex items-center justify-center font-montserrat shadow-xs">
                          2
                        </span>
                        <div>
                          <span className="font-montserrat text-xs font-bold text-neutral-800">
                            {getAdjustedFieldLabel("reception_date", "Grand Reception & Feast")}
                          </span>
                          <span className="ml-2 text-[9px] uppercase tracking-wider text-[#b3811b] font-semibold bg-[#eed57c]/20 px-2 py-0.5 rounded-full">
                            Featured On Invitation
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80">
                        <span className="text-[9.5px] uppercase tracking-wider text-neutral-400 font-bold block mb-0.5">
                          Date & Time
                        </span>
                        <span className="font-medium text-neutral-800">
                          {formData?.reception_date
                            ? new Date(formData.reception_date).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })
                            : "Evening Celebrations • 06:30 PM Onwards"}
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-neutral-200/80">
                        <span className="text-[9.5px] uppercase tracking-wider text-neutral-400 font-bold block mb-0.5">
                          Venue
                        </span>
                        <span className="font-medium text-neutral-800 line-clamp-1">
                          {formData?.reception_venue || formData?.wedding_venue || templateDefaults.reception_venue || "Grand Ballroom / Banquet Lawn"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Automatic Ready Notification */}
                  <div className="p-4 bg-gradient-to-r from-[#fffbf2] to-[#fff8eb] border border-[#eed57c]/40 rounded-2xl text-neutral-700 flex items-start gap-3 shadow-xs">
                    <div className="w-7 h-7 rounded-full bg-[#b3811b]/15 text-[#b3811b] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-[#b3811b]" />
                    </div>
                    <div>
                      <div className="font-montserrat font-bold text-xs text-neutral-900">
                        Schedule Ready For Your Invitation
                      </div>
                      <div className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                        Both celebrations are automatically styled and presented with auspicious timestamps on your guest invitation scroll. To change dates or venues, simply update them anytime in the <strong>Dates & Venues</strong> section.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: MEDIA, RSVP & REVIEW SUMMARY */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  {/* Photo Gallery Slideshow */}
                  <div className="flex flex-col gap-2.5 p-4 border border-[#eed57c]/20 bg-[#fffdfa] rounded-2xl shadow-xs">
                    <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] flex items-center gap-1.5 font-bold">
                      <ImageIcon className="w-3.5 h-3.5 text-[#b3811b]" />
                      Photo Gallery Slideshow Images
                    </label>

                    <div className="flex gap-1.5 mb-1 bg-neutral-100/80 p-1 rounded-xl border border-neutral-200/30">
                      {["preset", "upload", "url"].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setSlideshowMode(mode)}
                          className={`flex-1 py-1.5 font-montserrat text-[9px] tracking-wider uppercase transition-all duration-300 rounded-lg cursor-pointer ${
                            slideshowMode === mode
                              ? "bg-white text-[#b3811b] font-bold shadow-xs"
                              : "text-neutral-500 hover:text-neutral-800"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>

                    {slideshowMode === "preset" && (
                      <select
                        value={formData?.slideshow_images || ""}
                        onChange={(e) => handleInputChange("slideshow_images", e.target.value)}
                        className="w-full bg-white border border-neutral-200 text-neutral-800 text-xs px-3 py-2.5 rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-xs"
                      >
                        {SLIDESHOW_PRESETS.map((p) => (
                          <option key={p.value} value={p.value} className="bg-white text-neutral-800">
                            {p.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {slideshowMode === "upload" && (
                      <div className="flex flex-col gap-2">
                        <div className="relative border border-dashed border-[#b3811b]/30 py-6 flex flex-col items-center justify-center bg-[#fffcf9] rounded-2xl transition-colors hover:bg-[#fff9f2]">
                          <Upload className="w-6 h-6 text-[#b3811b]/60 mb-1" />
                          <span className="font-montserrat text-[9px] text-[#b3811b]/70 uppercase font-bold">UPLOAD COUPLE IMAGE</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const base64 = event.target?.result as string;
                                  const cur = formData?.slideshow_images || "";
                                  const newList = cur ? `${cur}, ${base64}` : base64;
                                  handleInputChange("slideshow_images", newList);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full"
                          />
                        </div>
                        {formData?.slideshow_images && (
                          <div className="flex justify-between items-center text-[10px] text-[#8a725d]/70 font-semibold px-1">
                            <span>{formData.slideshow_images.split(/,(?=\s*(?:https?:|data:))/i).filter(Boolean).length} Images Loaded</span>
                            <button
                              type="button"
                              onClick={() => handleInputChange("slideshow_images", "")}
                              className="text-red-400 hover:text-red-500 font-bold"
                            >
                              CLEAR
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {slideshowMode === "url" && (
                      <textarea
                        value={formData?.slideshow_images || ""}
                        onChange={(e) => handleInputChange("slideshow_images", e.target.value)}
                        placeholder="Paste image URLs separated by commas..."
                        rows={2}
                        className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-2 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-xs placeholder-neutral-400"
                      />
                    )}
                  </div>

                  {/* Background Music */}
                  <div className="flex flex-col gap-2.5 p-4 border border-[#eed57c]/20 bg-[#fffdfa] rounded-2xl shadow-xs">
                    <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] flex items-center gap-1.5 font-bold">
                      <Music className="w-3.5 h-3.5 text-[#b3811b]" />
                      Background Music & Melodies
                    </label>

                    <div className="flex gap-1.5 mb-1 bg-neutral-100/80 p-1 rounded-xl border border-neutral-200/30">
                      {["preset", "upload", "url"].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setMusicMode(mode)}
                          className={`flex-1 py-1.5 font-montserrat text-[9px] tracking-wider uppercase transition-all duration-300 rounded-lg cursor-pointer ${
                            musicMode === mode
                              ? "bg-white text-[#b3811b] font-bold shadow-xs"
                              : "text-neutral-500 hover:text-neutral-800"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>

                    {musicMode === "preset" && (
                      <select
                        value={formData?.music_url || ""}
                        onChange={(e) => handleInputChange("music_url", e.target.value)}
                        className="w-full bg-white border border-neutral-200 text-neutral-800 text-xs px-3 py-2.5 rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-xs"
                      >
                        {MUSIC_PRESETS.map((p) => (
                          <option key={p.value} value={p.value} className="bg-white text-neutral-800">
                            {p.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {musicMode === "upload" && (
                      <div className="relative border border-dashed border-[#b3811b]/30 py-6 flex flex-col items-center justify-center bg-[#fffcf9] rounded-2xl transition-colors hover:bg-[#fff9f2]">
                        <Upload className="w-6 h-6 text-[#b3811b]/60 mb-1" />
                        <span className="font-montserrat text-[9px] text-[#b3811b]/70 uppercase font-bold">UPLOAD BACKGROUND AUDIO (.MP3)</span>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => handleFileUpload("music_url", e)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full"
                        />
                      </div>
                    )}

                    {musicMode === "url" && (
                      <input
                        type="text"
                        value={formData?.music_url || ""}
                        onChange={(e) => handleInputChange("music_url", e.target.value)}
                        placeholder="Paste audio .mp3 URL link..."
                        className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-2.5 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-xs placeholder-neutral-400"
                      />
                    )}
                  </div>

                  {/* RSVP Contact */}
                  <div className="p-4 bg-[#fffdfa] border border-[#eed57c]/30 rounded-2xl shadow-xs space-y-3">
                    <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] font-bold block">
                      RSVP Contact Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData?.rsvp_phone || ""}
                      onChange={(e) => handleInputChange("rsvp_phone", e.target.value)}
                      placeholder={templateDefaults.rsvp_phone || "+91 98401 23456"}
                      className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-2.5 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-xs placeholder-neutral-400"
                    />
                  </div>

                  {/* Review Summary Card */}
                  <div className="p-4 bg-gradient-to-br from-[#fffdfa] to-[#faf5eb] border border-[#eed57c]/40 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-[#eed57c]/20 pb-2">
                      <span className="font-montserrat text-[10px] tracking-wider uppercase font-bold text-[#b3811b] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Invitation Summary
                      </span>
                      <span className="font-montserrat text-[9px] uppercase tracking-wider text-neutral-500 font-semibold">
                        Ready to Launch
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-500 font-medium">Couple:</span>
                        <span className="font-bold text-neutral-800">
                          {formData?.bride_name || templateDefaults.bride_name} & {formData?.groom_name || templateDefaults.groom_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500 font-medium">Wedding Date:</span>
                        <span className="font-semibold text-neutral-800">
                          {formData?.wedding_date
                            ? new Date(formData.wedding_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                            : templateDefaults.wedding_date
                            ? new Date(templateDefaults.wedding_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                            : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500 font-medium">Reception Date:</span>
                        <span className="font-semibold text-neutral-800">
                          {formData?.reception_date
                            ? new Date(formData.reception_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                            : "Same Day Evening"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500 font-medium">Programs Configured:</span>
                        <span className="font-bold text-[#b3811b]">Wedding & Reception Included</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}</div>
          </div>

          {/* Stepper Footer Controls */}
          <div className="mt-8 pt-6 border-t border-[#eed57c]/20 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 py-3 border border-neutral-200 hover:border-[#b3811b]/50 text-neutral-600 hover:text-[#b3811b] font-montserrat text-xs tracking-wider uppercase transition-colors rounded-xl font-bold shadow-sm bg-white hover:bg-neutral-50 cursor-pointer"
              >
                BACK
              </button>
            ) : (
              <div className="flex-1" />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 py-3 bg-gradient-to-r from-[#d4b060] to-[#b3811b] hover:from-[#c59b27] hover:to-[#a07a15] text-white font-montserrat font-bold text-xs tracking-wider uppercase transition-colors rounded-xl shadow-md cursor-pointer"
              >
                NEXT STEP
              </button>
            ) : (
              /* Submission checkout button on step 4 */
              <button
                type="button"
                onClick={handlePayment}
                disabled={isSubmitting}
                className="flex-grow py-3 bg-gradient-to-r from-[#d4b060] to-[#b3811b] hover:from-[#c59b27] hover:to-[#a07a15] disabled:from-neutral-200 disabled:to-neutral-300 disabled:text-neutral-400 text-white font-montserrat font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 group rounded-xl shadow-md cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    {isArchived ? "ARCHIVED (LOCKED)" : isEditMode ? "SAVE CHANGES" : `PROCEED TO PAYMENT (₹${template.price})`}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Simulated Live Viewport Preview with Device Switcher */}
        <div id="live-preview" className="flex-grow bg-[#f4f1ea] flex flex-col items-center justify-center p-4 md:p-6 lg:h-[calc(100vh-80px)] overflow-hidden relative border-t lg:border-t-0 border-[#eed57c]/20 scroll-mt-24">
          
          {/* Device Mockup Switcher Controls - Only Mobile shown on mobile devices, Tablet and Desktop hidden */}
          <div className="mb-4 flex items-center gap-1 bg-white border border-neutral-200 p-1.5 rounded-2xl shadow-md z-20">
            {[
              { mode: "mobile", icon: Smartphone, label: "Mobile", hideOnMobile: false },
              { mode: "tablet", icon: Tablet, label: "Tablet", hideOnMobile: true },
              { mode: "desktop", icon: Monitor, label: "Desktop", hideOnMobile: true },
            ].map((item) => {
              const Icon = item.icon;
              const active = previewDevice === item.mode;
              return (
                <button
                  key={item.mode}
                  type="button"
                  onClick={() => setPreviewDevice(item.mode as any)}
                  className={`${item.hideOnMobile ? "hidden md:flex" : "flex"} items-center gap-1.5 px-3 py-1.5 text-[9px] font-montserrat uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-[#d4b060] to-[#b3811b] text-white font-bold rounded-xl shadow-sm"
                      : "text-neutral-500 hover:text-[#b3811b] hover:bg-[#b3811b]/5 rounded-xl"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="absolute top-4 left-6 hidden xl:flex items-center gap-1.5 text-[#8a725d]/50 font-montserrat text-[10px] tracking-widest uppercase pointer-events-none">
            <Heart className="w-3.5 h-3.5" />
            <span>Updates dynamically as you edit the fields</span>
          </div>

          {/* Resizable Viewport Frame */}
          <div className="w-full flex-grow flex items-center justify-center overflow-hidden">
            {previewDevice === "mobile" ? (
              <div className="w-full max-w-[375px] h-[640px] bg-black border-8 border-neutral-800 rounded-[44px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.25)] relative overflow-hidden flex flex-col select-none ring-1 ring-neutral-900/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-800 rounded-b-xl z-30 flex items-center justify-center">
                  <div className="w-3.5 h-1.5 bg-black rounded-full" />
                </div>
                <div data-lenis-prevent className="w-full h-full overflow-y-auto pt-6 scale-98 origin-top select-none relative scrollbar-none preview-mode-mobile">
                  {TemplateComponent ? (
                    <TemplateComponent data={previewData} isPreview />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center p-4">
                      <span className="font-serif text-sm text-[#b3811b]/50">Loading preview...</span>
                    </div>
                  )}
                </div>
              </div>
            ) : previewDevice === "tablet" ? (
              <div className="w-full max-w-[640px] h-[680px] bg-black border-8 border-neutral-800 rounded-[32px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.25)] ring-1 ring-neutral-900/10">
                <div data-lenis-prevent className="w-full h-full overflow-y-auto pt-2 scale-98 origin-top select-none relative scrollbar-none preview-mode-tablet">
                  {TemplateComponent ? (
                    <TemplateComponent data={previewData} isPreview />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center p-4">
                      <span className="font-serif text-sm text-[#b3811b]/50">Loading preview...</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Desktop Viewport
              <div className="w-full max-w-[960px] h-[720px] bg-black border-4 border-neutral-800 rounded-[16px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.25)] ring-1 ring-neutral-900/10 scale-90 origin-center">
                <div data-lenis-prevent className="w-full h-full overflow-y-auto select-none relative scrollbar-none template-container">
                  {TemplateComponent ? (
                    <TemplateComponent data={previewData} isPreview />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center p-4">
                      <span className="font-serif text-sm text-[#b3811b]/50">Loading preview...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Navigation Toggle */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto px-4">
        <button
          type="button"
          onClick={() => {
            const targetId = activeMobileView === "form" ? "live-preview" : "editor-form";
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="bg-zinc-950/90 hover:bg-zinc-900 backdrop-blur-md text-[#eed57c] border border-[#eed57c]/30 shadow-md py-3 px-6 rounded-xl flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all duration-300 transform active:scale-95 cursor-pointer whitespace-nowrap"
        >
          {activeMobileView === "form" ? (
            <>
              <Eye className="w-4 h-4 text-[#eed57c]" />
              View Live Preview
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#eed57c]" />
              Back to Form Wizard
            </>
          )}
        </button>
      </div>
      {/* Delete Draft Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-150 p-6 rounded-[28px] w-full max-w-sm flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-sans text-lg font-bold text-zinc-900 text-center mb-1">
              DELETE DRAFT
            </h3>
            <p className="text-zinc-500 text-xs text-center mb-6 leading-relaxed font-sans">
              Are you sure you want to delete this draft? Its data will be permanently deleted from Supabase. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeletingDraft}
                className="min-h-[44px] px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs tracking-wider uppercase rounded-xl transition-colors cursor-pointer flex-1 font-sans disabled:opacity-50 flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteDraft}
                disabled={isDeletingDraft}
                className="min-h-[44px] px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer flex-1 shadow-md font-sans disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isDeletingDraft ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf8f5] text-[#3e342a] flex items-center justify-center flex-col">
        <div className="w-10 h-10 border-2 border-[#b3811b] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-cinzel text-xs tracking-widest text-[#b3811b] uppercase">Loading Studio...</span>
      </div>
    }>
      <EditorPageContent />
    </Suspense>
  );
}
