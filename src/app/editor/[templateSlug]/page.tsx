"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useState, useRef, Suspense } from "react";
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
  Plus
} from "lucide-react";
import { getTemplateBySlug, getDefaultTemplateData, TemplateData } from "@/lib/templates";
import { templatesMap } from "@/templates";
import { supabase } from "@/lib/supabase";

const BG_IMAGE_PRESETS = [
  { label: "Default Template Backdrop", value: "" },
  { label: "Palace Mandapam Stage Decor (Traditional Indian Decor) 🛕", value: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200" },
  { label: "Glistening Lights & Sparkles Bokeh (Wedding Night) ✨", value: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200" },
  { label: "Royal Red Rose Wedding Archway (Floral Grand Ceremony) 🌹", value: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=1200" },
  { label: "Gilded Marigold Garlands Decor (Haldi / Sangeet Vibe) 🌼", value: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&q=80&w=1200" },
  { label: "Luxurious White Roses Backdrop (Premium Minimal Arch) 🤍", value: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=1200" },
  { label: "Traditional Hands with Henna/Garland (Indian Ceremony Detail) 🪷", value: "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&q=80&w=1200" },
  { label: "Elegant Palace Courtyard (Heritage Backdrop) 🏰", value: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=1200" },
  { label: "Glimmering Gold Bokeh Wallpaper (Classic Luxury) 🪙", value: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1200" }
];

const BG_COLOR_PRESETS = [
  { label: "Deep Royal Burgundy", value: "#4a0e17" },
  { label: "Imperial Emerald Green", value: "#0b2e16" },
  { label: "Midnight Navy Blue", value: "#0a1128" },
  { label: "Luxurious Metallic Gold", value: "#b89047" },
  { label: "Champagne Pearl Velvet", value: "#fcfaf2" },
  { label: "Blush Rose Gold", value: "#f5e1e2" },
  { label: "Rich Plum Purple", value: "#2d0831" },
  { label: "Editorial Matte Black", value: "#09090b" },
  { label: "Sacred Golden Sands (Gradient)", value: "linear-gradient(135deg, #e5c060 0%, #b3811b 100%)" },
  { label: "Emerald Canopy (Gradient)", value: "linear-gradient(135deg, #184e3d 0%, #0c2b21 100%)" },
  { label: "Burgundy Satin (Gradient)", value: "linear-gradient(135deg, #5c0612 0%, #290207 100%)" },
  { label: "Royal Amethyst (Gradient)", value: "linear-gradient(135deg, #440c4a 0%, #15021a 100%)" }
];

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftSlug, setDraftSlug] = useState<string | null>(null);
  const [isAutosaving, setIsAutosaving] = useState(false);
  
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
  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState<string | null>(null);

  // Live preview device switcher state
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "tablet" | "desktop">("mobile");

  // Asset selection mode overrides: "preset" | "upload" | "url"
  const [bgImageMode, setBgImageMode] = useState("preset");
  const [musicMode, setMusicMode] = useState("preset");
  const [slideshowMode, setSlideshowMode] = useState("preset");

  // Dynamic Leaflet maps loading state
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Map Search states
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [mapSearchResults, setMapSearchResults] = useState<any[]>([]);
  
  // Custom Sections inputs states
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionContent, setNewSectionContent] = useState("");
  const [isMapSearching, setIsMapSearching] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showFallbackDropdown, setShowFallbackDropdown] = useState(false);

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

  // Initialize form with defaults or fetch existing for editing
  useEffect(() => {
    if (!templateSlug) return;

     if (editSlug) {
      setIsEditMode(true);
      setIsSubmitting(true);
      fetch(`/api/invitations/${editSlug}`)
        .then((res) => {
          if (res.status === 404) {
            console.log("Invitation slug not found (404), initializing as new draft.");
            setIsEditMode(false);
            // Remove edit query param from URL dynamically
            const newUrl = window.location.pathname;
            window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
            return getDefaultTemplateData(templateSlug);
          }
          if (!res.ok) throw new Error("Could not find invitation to edit.");
          return res.json();
        })
        .then((data) => {
          setFormData(data);
          
          if (data && data.wedding_date) {
            // Check if archived (more than 5 days after event completes)
            const now = new Date();
            const eventDate = new Date(data.wedding_date);
            const archiveLimit = new Date(eventDate.getTime() + 5 * 24 * 60 * 60 * 1000);
            if (now > archiveLimit) {
              setIsArchived(true);
              setError("This invitation is archived (license exhausted) and cannot be edited.");
            }
          }
        })
        .catch((err) => {
          console.error(err);
          setError(err.message || "Failed to load invitation.");
          setFormData(getDefaultTemplateData(templateSlug));
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      setFormData(getDefaultTemplateData(templateSlug));
    }
  }, [templateSlug, editSlug]);

  // Debounced autosave to database (if authenticated)
  useEffect(() => {
    if (!user || !formData || isArchived) return;

    // Check if the form is empty / just initialized
    if (!formData.bride_name && !formData.groom_name && !formData.wedding_venue) {
      return;
    }

    const saveDraft = async () => {
      try {
        setIsAutosaving(true);
        const { data: { session } } = await supabase.auth.getSession();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (session) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }

        if (isEditMode && (editSlug || draftSlug)) {
          // Update existing
          const slugToUse = editSlug || draftSlug;
          await fetch(`/api/invitations/${slugToUse}`, {
            method: "PUT",
            headers,
            body: JSON.stringify({ formData }),
          });
        } else {
          // If we don't have an editSlug/draftSlug yet, create a new draft!
          const cleanName = (name: string) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
          const bride = cleanName(formData.bride_name || "bride");
          const groom = cleanName(formData.groom_name || "groom");
          
          let activeSlug = draftSlug;
          if (!activeSlug) {
            const randomStr = Math.random().toString(36).substring(2, 7);
            activeSlug = `${bride}-weds-${groom}-${randomStr}`;
            setDraftSlug(activeSlug);
            
            // Update URL query parameter dynamically
            const newUrl = `${window.location.pathname}?edit=${activeSlug}`;
            window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
          }

          const res = await fetch("/api/invitations/draft", {
            method: "POST",
            headers,
            body: JSON.stringify({
              slug: activeSlug,
              templateSlug: templateSlug,
              formData,
            }),
          });
          if (res.ok) {
            setIsEditMode(true);
          }
        }
        setIsAutosaving(false);
      } catch (err) {
        console.error("Autosave error:", err);
        setIsAutosaving(false);
      }
    };

    const timer = setTimeout(() => {
      saveDraft();
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData, user, templateSlug, isArchived]);

  // Load Google Maps script dynamically (only if API key is present)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      // Do not load the script to avoid console auth warning popup block
      return;
    }

    if ((window as any).google?.maps?.places) {
      setGoogleMapsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleMapsLoaded(true);
    };
    script.onerror = () => {
      console.error("Google Maps Places script failed to load");
    };
    document.head.appendChild(script);
  }, []);

  // Attach Google Autocomplete listener to input
  useEffect(() => {
    if (!googleMapsLoaded || typeof window === "undefined" || !(window as any).google?.maps?.places) return;

    const input = document.getElementById("gmap_coordinates") as HTMLInputElement;
    if (!input) return;

    const autocomplete = new (window as any).google.maps.places.Autocomplete(input, {
      types: ["geocode", "establishment"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || "";
        handleInputChange("gmap_coordinates", `${lat.toFixed(6)},${lng.toFixed(6)} (${address})`);
      } else if (place.name) {
        handleInputChange("gmap_coordinates", place.name);
      }
    });
  }, [googleMapsLoaded, currentStep]);

  // Fallback search effect when Google Maps is not loaded
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (key) return; // Google Autocomplete will handle it

    const inputVal = formData?.gmap_coordinates || "";
    // If it already looks like coordinates, e.g. "12.345,67.890" or has trailing address in parenthesis, don't query Nominatim
    const query = inputVal.split("(")[0].trim();
    if (!query || query.length < 3 || query.includes(",") || /^[0-9.-]+\s*,\s*[0-9.-]+$/.test(query)) {
      setMapSearchResults([]);
      setShowFallbackDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsMapSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );
        if (res.ok) {
          const data = await res.json();
          setMapSearchResults(data || []);
          setShowFallbackDropdown(true);
        }
      } catch (err) {
        console.error("Fallback map search error:", err);
      } finally {
        setIsMapSearching(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [formData?.gmap_coordinates]);

  if (!template || !formData) {
    return (
      <div className="min-h-screen bg-[#080708] text-[#fbf6df] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-cinzel text-3xl font-bold tracking-widest text-gold-400 mb-4">Template Not Found</h1>
        <p className="font-serif text-sm text-gold-200/60 mb-6">The template you are trying to customize does not exist.</p>
        <Link href="/templates" className="px-6 py-2.5 bg-gold-500 text-black font-montserrat text-xs tracking-widest font-bold">
          RETURN TO GALLERY
        </Link>
      </div>
    );
  }

  const TemplateComponent = templatesMap[templateSlug];

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [fieldId]: value,
      };
    });
  };

  // Wizard steps categorizer
  const getFieldStep = (fieldId: string): number => {
    switch (fieldId) {
      // Step 1: Styling & Couple Details
      case "bride_name":
      case "groom_name":
      case "quote":
      case "bg_image_url":
        return 1;

      // Step 2: Main Event details & RSVPs
      case "wedding_date":
      case "wedding_venue":
      case "family_names":
      case "rsvp_phone":
      case "custom_message":
        return 2;

      // Step 3: Multi-Event schedule & Background Music
      case "music_url":
      case "music_enabled":
      case "scratch_enabled":
      case "sangeet_date":
      case "sangeet_venue":
      case "reception_date":
      case "reception_venue":
        return 3;

      // Step 4: Slideshow, Dress Code & Map Location
      case "slideshow_images":
      case "slideshow_enabled":
      case "dress_code":
      case "dress_code_enabled":
      case "transport_info":
      case "transport_enabled":
      case "gmap_coordinates":
      case "custom_sections":
        return 4;

      default:
        return 1;
    }
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    const stepFields = template.fields.filter((f) => getFieldStep(f.id) === step);
    for (const field of stepFields) {
      if (field.required) {
        const val = (formData as any)[field.id];
        if (!val || !val.trim()) {
          setStepError(`Please fill out the required field: "${getAdjustedFieldLabel(field.id, field.label)}"`);
          return false;
        }
      }
    }
    setStepError(null);
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setStepError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setStepError(null);
      setCurrentStep(step);
    } else if (step > currentStep) {
      // Validate intermediate steps
      for (let s = currentStep; s < step; s++) {
        if (!validateStep(s)) return;
      }
      setCurrentStep(step);
    }
  };

  // Helper for file to Base64 conversion
  const handleFileUpload = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      alert("Warning: Local file size is large. Files under 2MB are recommended for optimal load speed.");
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      handleInputChange(fieldId, base64);
    };
    reader.readAsDataURL(file);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final check for step validation
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        return;
      }
    }

    if (isArchived) {
      setError("This invitation is archived and cannot be modified.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    if (isEditMode && editSlug) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (session) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }

        const response = await fetch(`/api/invitations/${editSlug}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ formData }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to update invitation details.");
        }

        router.push(`/success/${editSlug}`);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An unexpected error occurred during save.");
        setIsSubmitting(false);
      }
      return;
    }
    setError(null);

    try {
      // Direct dummy checkout - bypass Razorpay completely to verify flows easily
      const randomStr = Math.random().toString(36).substring(2, 9);
      const verifyResponse = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: `order_mock_${randomStr}`,
          razorpay_payment_id: `pay_mock_${randomStr}`,
          razorpay_signature: "mock_signature",
          formData: formData,
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
      console.error(err);
      setError(err.message || "An unexpected error occurred during checkout.");
      setIsSubmitting(false);
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
    <div className="relative min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f3efe9] text-[#3e342a] flex flex-col">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Editor Header */}
      <header className="h-20 border-b border-[#eed57c]/20 bg-white/70 backdrop-blur-md flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
          <Link href="/templates" className="p-2 text-[#8a725d] hover:text-[#c59b27] transition-colors rounded-full hover:bg-[#b3811b]/5">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <span className="font-cinzel text-xs text-[#8a725d] font-bold tracking-wider">DESIGN STUDIO</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-montserrat text-[9px] tracking-widest text-[#8a725d]/70 uppercase">
                CUSTOMIZING: {template.name}
              </span>
              <span className="text-[9px] text-[#8a725d]/40 font-montserrat">•</span>
              {isAutosaving ? (
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-ping" />
                  Saving...
                </span>
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

        <div className="bg-[#fffcf9] border border-[#eed57c]/30 px-4 py-1.5 rounded-full shadow-sm">
          <span className="font-cinzel text-[#b3811b] font-bold tracking-wide text-xs">₹{template.price}</span>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-grow flex flex-col lg:flex-row min-h-0">
        {/* Left Side: Form controls with 4-Step Wizard */}
        <div data-lenis-prevent className="w-full lg:w-[450px] xl:w-[500px] border-r border-[#eed57c]/15 bg-white/40 p-6 overflow-y-auto lg:h-[calc(100vh-80px)] flex flex-col justify-between">
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
                      {step === 1 ? "Styling" : step === 2 ? "Details" : step === 3 ? "Timeline" : "Media"}
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
              {template.fields
                .filter((field) => getFieldStep(field.id) === currentStep)
                .filter((field) => {
                  if ((field.id === "sangeet_date" || field.id === "sangeet_venue") && formData.sangeet_enabled === "no") {
                    return false;
                  }
                  if (field.id === "music_url" && formData.music_enabled === "no") {
                    return false;
                  }
                  if (field.id === "slideshow_images" && formData.slideshow_enabled === "no") {
                    return false;
                  }
                  if (field.id === "dress_code" && formData.dress_code_enabled === "no") {
                    return false;
                  }
                  if (field.id === "transport_info" && formData.transport_enabled === "no") {
                    return false;
                  }
                  return true;
                })
                .map((field) => {
                  const val = (formData as any)[field.id] || "";
                  
                  // 1. BACKGROUND IMAGE INPUT MODE OVERRIDE
                  if (field.id === "bg_image_url") {
                    return (
                      <div key={field.id} className="flex flex-col gap-2.5 p-4 border border-[#eed57c]/20 bg-[#fffdfa] rounded-2xl shadow-sm">
                        <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] flex items-center gap-1.5 font-bold">
                          <ImageIcon className="w-3.5 h-3.5" />
                          {getAdjustedFieldLabel(field.id, field.label)}
                        </label>

                        {/* Mode Toggle Buttons */}
                        <div className="flex gap-1.5 mb-1 bg-neutral-100/80 p-1 rounded-xl border border-neutral-200/30">
                          {[
                            { id: "preset", label: "Images" },
                            { id: "color", label: "Colors" },
                            { id: "upload", label: "Upload" },
                            { id: "url", label: "Link" }
                          ].map((mode) => (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => setBgImageMode(mode.id)}
                              className={`flex-1 py-1.5 font-montserrat text-[9px] tracking-wider uppercase transition-all duration-300 rounded-lg cursor-pointer ${
                                bgImageMode === mode.id
                                  ? "bg-white text-[#b3811b] font-bold shadow-sm"
                                  : "text-neutral-500 hover:text-neutral-800"
                              }`}
                            >
                              {mode.label}
                            </button>
                          ))}
                        </div>

                        {bgImageMode === "preset" && (
                          <select
                            value={val}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full bg-white border border-neutral-200 text-neutral-800 text-xs px-3 py-2.5 rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-sm transition-all"
                          >
                            {BG_IMAGE_PRESETS.map((p) => (
                              <option key={p.value} value={p.value} className="bg-white text-neutral-800">
                                {p.label}
                              </option>
                            ))}
                          </select>
                        )}

                        {bgImageMode === "color" && (
                          <div className="space-y-3">
                            <select
                              value={val}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              className="w-full bg-white border border-neutral-200 text-neutral-800 text-xs px-3 py-2.5 rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-sm transition-all"
                            >
                              <option value="">Select a background color...</option>
                              {BG_COLOR_PRESETS.map((p) => (
                                <option key={p.value} value={p.value} className="bg-white text-neutral-800">
                                  {p.label}
                                </option>
                              ))}
                            </select>
                            {/* Visual Color Grid Swatches */}
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                              {BG_COLOR_PRESETS.map((p) => {
                                const isSelected = val === p.value;
                                return (
                                  <button
                                    key={p.value}
                                    type="button"
                                    onClick={() => handleInputChange(field.id, p.value)}
                                    style={{ background: p.value }}
                                    className={`w-8 h-8 rounded-full border shadow-sm transition-all cursor-pointer hover:scale-110 flex items-center justify-center ${
                                      isSelected
                                        ? "border-[#b3811b] ring-2 ring-[#b3811b]/30 scale-105"
                                        : "border-neutral-200"
                                    }`}
                                    title={p.label}
                                  >
                                    {isSelected && (
                                      <span className={`text-[9px] font-bold ${p.value === "#fcfaf2" || p.value === "#f5e1e2" ? "text-neutral-800" : "text-white"}`}>
                                        ✓
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {bgImageMode === "upload" && (
                          <div className="space-y-3">
                            <div className="relative border border-dashed border-[#b3811b]/30 py-6 flex flex-col items-center justify-center bg-[#fffcf9] rounded-2xl transition-colors hover:bg-[#fff9f2]">
                              <Upload className="w-6 h-6 text-[#b3811b]/60 mb-1" />
                              <span className="font-montserrat text-[9px] text-[#b3811b]/70 uppercase font-bold">
                                {val.startsWith("data:") ? "CHANGE UPLOADED IMAGE" : "UPLOAD BACKGROUND"}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(field.id, e)}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                              />
                            </div>
                            {val.startsWith("data:") && (
                              <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-xl border border-neutral-100">
                                <img src={val} alt="Custom uploaded backdrop" className="w-12 h-12 rounded-lg object-cover border border-[#eed57c]/30 shadow-sm" />
                                <div className="flex-grow min-w-0">
                                  <p className="text-[10px] font-bold text-neutral-800 truncate uppercase">Custom Upload Active</p>
                                  <button
                                    type="button"
                                    onClick={() => handleInputChange(field.id, "")}
                                    className="text-[9px] text-red-500 hover:text-red-600 font-bold uppercase"
                                  >
                                    Remove custom image
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {bgImageMode === "url" && (
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder="Paste image url link here..."
                            className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-2.5 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-sm transition-all placeholder-neutral-400"
                          />
                        )}
                      </div>
                    );
                  }

                  // 2. BACKGROUND MUSIC INPUT MODE OVERRIDE
                  if (field.id === "music_url") {
                    return (
                      <div key={field.id} className="flex flex-col gap-2.5 p-4 border border-[#eed57c]/20 bg-[#fffdfa] rounded-2xl shadow-sm">
                        <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] flex items-center gap-1.5 font-bold">
                          <Music className="w-3.5 h-3.5" />
                          {getAdjustedFieldLabel(field.id, field.label)}
                        </label>

                        {/* Mode Toggle */}
                        <div className="flex gap-1.5 mb-1 bg-neutral-100/80 p-1 rounded-xl border border-neutral-200/30">
                          {["preset", "upload", "url"].map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setMusicMode(mode)}
                              className={`flex-1 py-1.5 font-montserrat text-[9px] tracking-wider uppercase transition-all duration-300 rounded-lg cursor-pointer ${
                                musicMode === mode
                                  ? "bg-white text-[#b3811b] font-bold shadow-sm"
                                  : "text-neutral-500 hover:text-neutral-800"
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>

                        {musicMode === "preset" && (
                          <select
                            value={val}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full bg-white border border-neutral-200 text-neutral-800 text-xs px-3 py-2.5 rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-sm transition-all"
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
                            <span className="font-montserrat text-[9px] text-[#b3811b]/70 uppercase font-bold">UPLOAD BACKGROUND AUDIO</span>
                            <input
                              type="file"
                              accept="audio/*"
                              onChange={(e) => handleFileUpload(field.id, e)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full"
                            />
                          </div>
                        )}

                        {musicMode === "url" && (
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder="Paste audio .mp3 URL..."
                            className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-2.5 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-sm transition-all placeholder-neutral-400"
                          />
                        )}
                      </div>
                    );
                  }

                  // 3. PHOTO SLIDESHOW GALLERY MODE OVERRIDE
                  if (field.id === "slideshow_images") {
                    return (
                      <div key={field.id} className="flex flex-col gap-2.5 p-4 border border-[#eed57c]/20 bg-[#fffdfa] rounded-2xl shadow-sm">
                        <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] flex items-center gap-1.5 font-bold">
                          <ImageIcon className="w-3.5 h-3.5" />
                          {getAdjustedFieldLabel(field.id, field.label)}
                        </label>

                        {/* Mode Toggle */}
                        <div className="flex gap-1.5 mb-1 bg-neutral-100/80 p-1 rounded-xl border border-neutral-200/30">
                          {["preset", "upload", "url"].map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setSlideshowMode(mode)}
                              className={`flex-1 py-1.5 font-montserrat text-[9px] tracking-wider uppercase transition-all duration-300 rounded-lg cursor-pointer ${
                                slideshowMode === mode
                                  ? "bg-white text-[#b3811b] font-bold shadow-sm"
                                  : "text-neutral-500 hover:text-neutral-800"
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>

                        {slideshowMode === "preset" && (
                          <select
                            value={val}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full bg-white border border-neutral-200 text-neutral-800 text-xs px-3 py-2.5 rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-sm transition-all"
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
                              <span className="font-montserrat text-[9px] text-[#b3811b]/70 uppercase font-bold">UPLOAD SLIDESHOW IMAGE</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const base64 = event.target?.result as string;
                                      const newList = val ? `${val}, ${base64}` : base64;
                                      handleInputChange(field.id, newList);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                              />
                            </div>
                            {val && (
                              <div className="flex justify-between items-center text-[10px] text-[#8a725d]/70 font-semibold px-1">
                                <span>{val.split(/,(?=\s*(?:https?:|data:))/i).filter(Boolean).length} Images Uploaded</span>
                                <button
                                  type="button"
                                  onClick={() => handleInputChange(field.id, "")}
                                  className="text-red-400 hover:text-red-300 font-bold"
                                >
                                  CLEAR ALL
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {slideshowMode === "url" && (
                          <textarea
                            value={val}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder="Paste image URLs separated by commas..."
                            rows={3}
                            className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-2 focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-sm transition-all placeholder-neutral-400 text-xs rounded-xl"
                          />
                        )}
                      </div>
                    );
                  }

                  // 4. GOOGLE MAP COORDINATES MARKER INTEGRATION
                  if (field.id === "gmap_coordinates") {
                    const handleGetCurrentLocation = () => {
                      if (navigator.geolocation) {
                        setIsLocating(true);
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            handleInputChange(field.id, `${lat.toFixed(6)},${lng.toFixed(6)}`);
                            setIsLocating(false);
                          },
                          (error) => {
                            alert("Geolocation Error: " + error.message + " (Make sure you allow location permissions in your browser)");
                            setIsLocating(false);
                          },
                          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
                        );
                      } else {
                        alert("Geolocation is not supported by your browser.");
                      }
                    };

                    const previewUrl = `https://maps.google.com/maps?q=${encodeURIComponent(val || "13.0827,80.2707")}&z=15&output=embed`;

                    return (
                      <div key={field.id} className="flex flex-col gap-2.5 p-4 border border-[#eed57c]/20 bg-[#fffdfa] rounded-2xl shadow-sm">
                        {/* Global Google places dropdown styling */}
                        <style>{`
                          .pac-container {
                            z-index: 999999 !important;
                            border-radius: 16px !important;
                            border: 1px solid rgba(179, 129, 27, 0.2) !important;
                            font-family: inherit !important;
                            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1) !important;
                            background-color: #fffdfa !important;
                            padding: 6px 0 !important;
                            margin-top: 4px !important;
                          }
                          .pac-item {
                            padding: 8px 14px !important;
                            font-size: 11px !important;
                            color: #4a3e3d !important;
                            cursor: pointer !important;
                            border-top: 1px solid rgba(179, 129, 27, 0.08) !important;
                            display: flex !important;
                            align-items: center !important;
                          }
                          .pac-item:hover, .pac-item-selected {
                            background-color: rgba(179, 129, 27, 0.08) !important;
                          }
                          .pac-icon {
                            display: none !important;
                          }
                          .pac-item-query {
                            font-size: 11px !important;
                            color: #1a100f !important;
                            font-weight: 600 !important;
                            padding-right: 4px !important;
                          }
                          .pac-matched {
                            color: #b3811b !important;
                            font-weight: 700 !important;
                          }
                        `}</style>

                        <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] flex items-center gap-1.5 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-[#b3811b]" />
                          {field.label}
                        </label>
                        <span className="font-serif text-[9px] text-neutral-400 italic">
                          Type address or select from the recommendations that pop up as you type.
                        </span>

                        <div className="relative">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              id={field.id}
                              value={val}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              placeholder="Type address or search places..."
                              className="flex-grow bg-white border border-neutral-200 text-neutral-800 px-4 py-2.5 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-sm transition-all placeholder-neutral-400 w-full"
                            />
                            <button
                              type="button"
                              onClick={handleGetCurrentLocation}
                              disabled={isLocating}
                              className="px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs rounded-xl border border-neutral-200 shadow-sm transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer font-montserrat font-semibold text-[10px] disabled:opacity-50"
                              title="Use my current GPS location"
                            >
                              {isLocating ? "⏳ Locating..." : "📍 Use Current"}
                            </button>
                          </div>

                          {/* Fallback Custom Suggestions Dropdown */}
                          {showFallbackDropdown && mapSearchResults.length > 0 && (
                            <div className="absolute left-0 right-0 mt-1.5 bg-[#fffdfa] border border-[#eed57c]/30 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto divide-y divide-neutral-100">
                              {mapSearchResults.map((result: any, idx: number) => {
                                const parts = result.display_name.split(",");
                                const title = parts[0];
                                const subtitle = parts.slice(1).join(",").trim();
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      const lat = parseFloat(result.lat);
                                      const lng = parseFloat(result.lon);
                                      const address = result.display_name;
                                      handleInputChange("gmap_coordinates", `${lat.toFixed(6)},${lng.toFixed(6)} (${address})`);
                                      setShowFallbackDropdown(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-[#b3811b]/5 flex flex-col gap-0.5 cursor-pointer text-xs transition-colors"
                                  >
                                    <span className="font-bold text-neutral-800">{title}</span>
                                    <span className="text-[9px] text-neutral-400 truncate">{subtitle}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Google Map Live Preview */}
                        <div className="flex flex-col gap-1 mt-1 text-left">
                          <span className="font-serif text-[9px] text-neutral-400 italic">
                            Google Maps Live Preview:
                          </span>
                          <div className="w-full h-48 border border-neutral-200 relative rounded-xl overflow-hidden shadow-inner">
                            <iframe
                              title="Google Maps Location Finder Preview"
                              src={previewUrl}
                              className="w-full h-full border-0"
                              allowFullScreen
                              loading="lazy"
                            />
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[8px] text-neutral-400 font-serif leading-relaxed max-w-[70%]">
                              Tip: Google Maps handles text addresses and GPS coordinates directly.
                            </span>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(val || "13.0827,80.2707")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[8px] text-[#b3811b] hover:underline font-montserrat uppercase font-bold"
                            >
                              Search on Web ↗
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // 5. CUSTOM INFO SECTIONS BUILDER
                  if (field.id === "custom_sections") {
                    const sections = (() => {
                      if (!val) return [];
                      try {
                        return JSON.parse(val);
                      } catch {
                        return [];
                      }
                    })();

                    return (
                      <div key={field.id} className="flex flex-col gap-3.5 p-4 border border-[#eed57c]/20 bg-[#fffdfa] rounded-2xl shadow-sm">
                        <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] flex items-center gap-1.5 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-[#b3811b]" />
                          {field.label}
                        </label>
                        <span className="font-serif text-[9px] text-neutral-400 italic">
                          Add custom cards for hotel stay details, shuttle schedule, gift registry, or any extra details.
                        </span>

                        {/* List of current sections */}
                        {sections.length > 0 && (
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {sections.map((sec: any, idx: number) => (
                              <div key={idx} className="flex items-start justify-between bg-white border border-neutral-100 p-2.5 rounded-xl gap-2 shadow-sm">
                                <div className="min-w-0 flex-grow text-left">
                                  <h5 className="font-montserrat text-[9px] font-bold text-neutral-800 uppercase tracking-wide truncate">{sec.title}</h5>
                                  <p className="font-serif text-[10px] text-neutral-500 leading-normal mt-0.5 line-clamp-2 whitespace-pre-line">{sec.content}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = sections.filter((_: any, i: number) => i !== idx);
                                    handleInputChange(field.id, next.length > 0 ? JSON.stringify(next) : "");
                                  }}
                                  className="text-red-500 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add new section form */}
                        <div className="space-y-4 text-left pt-4 border-t border-[#eed57c]/15">
                          <span className="font-montserrat text-[10px] font-bold text-[#b3811b] tracking-wider uppercase block">Add New Info Card</span>
                          
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-[#8a725d] font-montserrat uppercase font-bold tracking-wide">Section Title</label>
                            <input
                              type="text"
                              value={newSectionTitle}
                              onChange={(e) => setNewSectionTitle(e.target.value)}
                              placeholder="E.g. Accommodations"
                              className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-3 text-sm rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-sm transition-all placeholder-neutral-400"
                            />
                          </div>
                          
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-[#8a725d] font-montserrat uppercase font-bold tracking-wide">Section Content</label>
                            <textarea
                              value={newSectionContent}
                              onChange={(e) => setNewSectionContent(e.target.value)}
                              placeholder="E.g. Shuttle departs from the Grand Ballroom at 2:00 PM."
                              rows={3}
                              className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-3 text-sm rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-sm transition-all placeholder-neutral-400"
                            />
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              if (!newSectionTitle.trim()) {
                                alert("Please enter a section title");
                                return;
                              }
                              if (!newSectionContent.trim()) {
                                alert("Please enter section content");
                                return;
                              }
                              const next = [...sections, { title: newSectionTitle.trim(), content: newSectionContent.trim() }];
                              handleInputChange(field.id, JSON.stringify(next));
                              setNewSectionTitle("");
                              setNewSectionContent("");
                            }}
                            className="w-full py-3 bg-zinc-950 text-white font-montserrat text-[10px] font-bold tracking-widest uppercase hover:bg-zinc-800 transition-colors rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Card
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (field.type === "toggle") {
                    const isChecked = val === "yes";
                    return (
                      <div key={field.id} className="flex items-center justify-between p-4 border border-[#eed57c]/20 bg-[#fffdfa] rounded-2xl shadow-sm">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] font-bold">
                            {getAdjustedFieldLabel(field.id, field.label)}
                          </span>
                          {field.placeholder && (
                            <span className="font-serif text-[9px] text-neutral-400 italic">
                              {getAdjustedFieldPlaceholder(field.id, field.placeholder)}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          id={field.id}
                          onClick={() => handleInputChange(field.id, isChecked ? "no" : "yes")}
                          className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none relative cursor-pointer ${
                            isChecked ? "bg-[#b3811b]" : "bg-neutral-200"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 absolute top-1 ${
                              isChecked ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  }

                  // Standard default rendering for other fields
                  return (
                    <div key={field.id} className="flex flex-col gap-1.5">
                      <label htmlFor={field.id} className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] font-bold">
                        {getAdjustedFieldLabel(field.id, field.label)} {field.required && <span className="text-red-500">*</span>}
                      </label>

                      {field.type === "textarea" ? (
                        <textarea
                          id={field.id}
                          required={field.required}
                          rows={3}
                          value={val}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={getAdjustedFieldPlaceholder(field.id, field.placeholder || "")}
                          className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-3 text-sm rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-sm transition-all placeholder-neutral-400"
                        />
                      ) : field.type === "datetime" ? (
                        /* CALENDAR SELECT TRIGGERS ON CLICK */
                        <div
                          onClick={(e) => {
                            const input = e.currentTarget.querySelector("input");
                            if (input) {
                              try {
                                input.showPicker();
                              } catch (err) {
                                console.warn("showPicker is not supported", err);
                                input.focus();
                              }
                            }
                          }}
                          className="w-full relative group cursor-pointer"
                        >
                          <input
                            type="datetime-local"
                            id={field.id}
                            required={field.required}
                            value={val ? new Date(val).toISOString().slice(0, 16) : ""}
                            onChange={(e) => {
                              const isoStr = e.target.value ? new Date(e.target.value).toISOString() : "";
                              handleInputChange(field.id, isoStr);
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="w-full bg-white border border-neutral-200 group-hover:border-neutral-300 text-neutral-800 px-4 py-3 pr-10 text-sm rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-sm transition-all cursor-pointer"
                          />
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b3811b] group-hover:text-[#8a725d] transition-colors pointer-events-none">
                            <Calendar className="w-4 h-4" />
                          </div>
                        </div>
                      ) : (
                        <input
                          type="text"
                          id={field.id}
                          required={field.required}
                          value={val}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={getAdjustedFieldPlaceholder(field.id, field.placeholder || "")}
                          className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-3 text-sm rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-sm transition-all placeholder-neutral-400"
                        />
                      )}
                    </div>
                  );
                })}
            </div>
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
                    {isArchived ? "ARCHIVED (LOCKED)" : isEditMode ? "SAVE CHANGES" : `GENERATE (₹${template.price})`}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Simulated Live Viewport Preview with Device Switcher */}
        <div className="flex-grow bg-[#f4f1ea] flex flex-col items-center justify-center p-4 md:p-6 lg:h-[calc(100vh-80px)] overflow-hidden relative border-t lg:border-t-0 border-[#eed57c]/20">
          
          {/* Device Mockup Switcher Controls */}
          <div className="mb-4 flex items-center gap-1 bg-white border border-neutral-200 p-1.5 rounded-2xl shadow-md z-20">
            {[
              { mode: "mobile", icon: Smartphone, label: "Mobile" },
              { mode: "tablet", icon: Tablet, label: "Tablet" },
              { mode: "desktop", icon: Monitor, label: "Desktop" },
            ].map((item) => {
              const Icon = item.icon;
              const active = previewDevice === item.mode;
              return (
                <button
                  key={item.mode}
                  type="button"
                  onClick={() => setPreviewDevice(item.mode as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-montserrat uppercase tracking-wider transition-all duration-300 cursor-pointer ${
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
                    <TemplateComponent data={formData} />
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
                    <TemplateComponent data={formData} />
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
                    <TemplateComponent data={formData} />
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
