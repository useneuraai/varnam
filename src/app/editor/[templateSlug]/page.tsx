"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useState, useRef } from "react";
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
} from "lucide-react";
import { getTemplateBySlug, getDefaultTemplateData, TemplateData } from "@/lib/templates";
import { templatesMap } from "@/templates";

const BG_IMAGE_PRESETS = [
  { label: "Default Template Backdrop", value: "" },
  { label: "Royal Crimson Silk", value: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200" },
  { label: "Deep Velvet Emerald", value: "https://images.unsplash.com/photo-1618005198143-e528346d9a59?auto=format&fit=crop&w=1200" },
  { label: "Luxury Gold Foil", value: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200" },
  { label: "Floral White Silk", value: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200" }
];

const MUSIC_PRESETS = [
  { label: "Default Template Melody", value: "" },
  { label: "Classical Wedding Shehnai", value: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { label: "Sufi Flute Instrumental", value: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { label: "Romantic Piano Orchestral", value: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

const SLIDESHOW_PRESETS = [
  { label: "Default Couple Set", value: "" },
  { label: "Curated Indian Couple Set", value: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&q=80&w=600, https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600" },
  { label: "Minimalist Wedding Set", value: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600, https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600" }
];

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();

  const templateSlug = typeof params?.templateSlug === "string" ? params.templateSlug : "";
  const template = getTemplateBySlug(templateSlug);

  const [formData, setFormData] = useState<TemplateData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
  const [isMapSearching, setIsMapSearching] = useState(false);

  // Initialize form with defaults
  useEffect(() => {
    if (templateSlug) {
      setFormData(getDefaultTemplateData(templateSlug));
    }
  }, [templateSlug]);

  // Load Leaflet stylesheet and script dynamically on browser
  useEffect(() => {
    if (typeof window === "undefined") return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  // Initialize Leaflet map picker
  useEffect(() => {
    if (!leafletLoaded || !formData || currentStep !== 4) return;
    const L = (window as any).L;
    if (!L) return;

    const coordsStr = formData.gmap_coordinates || "13.0827,80.2707";
    const cleanedCoords = coordsStr.split("(")[0].trim();
    const [lat, lng] = cleanedCoords.split(",").map(Number);

    const mapContainer = document.getElementById("leaflet-map");
    if (!mapContainer) return;

    if (mapRef.current) return; // already initialized

    // Center map on coordinates
    const map = L.map("leaflet-map").setView([lat, lng], 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    const reverseGeocode = async (newLat: number, newLng: number) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.display_name) {
            const parts = data.display_name.split(",");
            const shortLabel = parts.slice(0, 3).join(",").trim();
            const coordsStr = `${newLat.toFixed(4)},${newLng.toFixed(4)} (${shortLabel})`;
            handleInputChange("gmap_coordinates", coordsStr);
            setMapSearchQuery(shortLabel);
            return;
          }
        }
      } catch (err) {
        console.error("Reverse geocoding error:", err);
      }
      const positionStr = `${newLat.toFixed(4)},${newLng.toFixed(4)}`;
      handleInputChange("gmap_coordinates", positionStr);
    };

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      reverseGeocode(pos.lat, pos.lng);
    });

    map.on("click", (e: any) => {
      marker.setLatLng(e.latlng);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [leafletLoaded, formData === null, currentStep]);

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

  // Helper to fly the Leaflet map and position pin dynamically
  const selectLocation = (lat: number, lng: number, label?: string) => {
    const coordsStr = label
      ? `${lat.toFixed(4)},${lng.toFixed(4)} (${label})`
      : `${lat.toFixed(4)},${lng.toFixed(4)}`;
    handleInputChange("gmap_coordinates", coordsStr);

    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 15);
    }
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
  };

  // OpenStreetMap Nominatim search handler
  const handleMapSearch = async () => {
    if (!mapSearchQuery.trim()) return;
    setIsMapSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearchQuery)}&limit=5`
      );
      if (res.ok) {
        const data = await res.json();
        setMapSearchResults(data);
      }
    } catch (err) {
      console.error("Map search error:", err);
    } finally {
      setIsMapSearching(false);
    }
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
      case "scratch_enabled":
      case "sangeet_date":
      case "sangeet_venue":
      case "reception_date":
      case "reception_venue":
        return 3;

      // Step 4: Slideshow, Dress Code & Map Location
      case "slideshow_images":
      case "dress_code":
      case "transport_info":
      case "gmap_coordinates":
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
          setStepError(`Please fill out the required field: "${field.label}"`);
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

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create order on the server
      const orderResponse = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateSlug: template.slug,
          amount: template.price,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to initialize payment order. Please try again.");
      }

      const orderData = await orderResponse.json();
      
      // 2. Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.amount,
        currency: "INR",
        name: "Varnam Wedding Invites",
        description: `Bespoke Design: ${template.name}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            setIsSubmitting(true);
            // 3. Verify payment signature on the server and save invite
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                formData: formData,
                templateSlug: template.slug,
              }),
            });

            if (!verifyResponse.ok) {
              const err = await verifyResponse.json();
              throw new Error(err.message || "Payment verification failed.");
            }

            const verifyResult = await verifyResponse.json();
            router.push(`/success/${verifyResult.slug}`);
          } catch (verifyErr: any) {
            setError(verifyErr.message || "Verification failed. Please contact support.");
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: `${formData.bride_name} & ${formData.groom_name}`,
          contact: formData.rsvp_phone || "",
        },
        theme: {
          color: "#b3811b",
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      // 4. Open Razorpay Checkout overlay
      if ((window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during checkout.");
      setIsSubmitting(false);
    }
  };

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
            <span className="font-montserrat text-[9px] tracking-widest text-[#8a725d]/70 uppercase">
              CUSTOMIZING: {template.name}
            </span>
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
                          {field.label}
                        </label>

                        {/* Mode Toggle Buttons */}
                        <div className="flex gap-1.5 mb-1 bg-neutral-100/80 p-1 rounded-xl border border-neutral-200/30">
                          {["preset", "upload", "url"].map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setBgImageMode(mode)}
                              className={`flex-1 py-1.5 font-montserrat text-[9px] tracking-wider uppercase transition-all duration-300 rounded-lg cursor-pointer ${
                                bgImageMode === mode
                                  ? "bg-white text-[#b3811b] font-bold shadow-sm"
                                  : "text-neutral-500 hover:text-neutral-800"
                              }`}
                            >
                              {mode}
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

                        {bgImageMode === "upload" && (
                          <div className="relative border border-dashed border-[#b3811b]/30 py-6 flex flex-col items-center justify-center bg-[#fffcf9] rounded-2xl transition-colors hover:bg-[#fff9f2]">
                            <Upload className="w-6 h-6 text-[#b3811b]/60 mb-1" />
                            <span className="font-montserrat text-[9px] text-[#b3811b]/70 uppercase font-bold">UPLOAD BACKGROUND</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(field.id, e)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full"
                            />
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
                          {field.label}
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
                          {field.label}
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
                    return (
                      <div key={field.id} className="flex flex-col gap-2.5 p-4 border border-[#eed57c]/20 bg-[#fffdfa] rounded-2xl shadow-sm">
                        <label className="font-montserrat text-[10px] tracking-widest uppercase text-[#8a725d] flex items-center gap-1.5 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-[#b3811b]" />
                          {field.label}
                        </label>

                        {/* Easy Map Search Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={mapSearchQuery}
                            onChange={(e) => setMapSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleMapSearch();
                              }
                            }}
                            placeholder="Search venue (e.g. ITC Grand Chola Chennai)..."
                            className="flex-grow bg-white border border-neutral-200 text-neutral-800 px-3 py-2 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-sm transition-all placeholder-neutral-400"
                          />
                          <button
                            type="button"
                            onClick={handleMapSearch}
                            disabled={isMapSearching}
                            className="px-4 py-2 bg-gradient-to-r from-[#d4b060] to-[#b3811b] hover:from-[#c59b27] hover:to-[#a07a15] text-white font-montserrat text-[10px] font-bold tracking-widest uppercase transition-colors shrink-0 disabled:bg-[#eed57c]/40 rounded-xl shadow-sm cursor-pointer"
                          >
                            {isMapSearching ? "SEARCHING..." : "SEARCH"}
                          </button>
                        </div>

                        {/* Search Results Autocomplete Box */}
                        {mapSearchResults.length > 0 && (
                          <div className="border border-neutral-200 bg-white divide-y divide-neutral-100 max-h-40 overflow-y-auto rounded-xl shadow-lg mt-1">
                            {mapSearchResults.map((result) => (
                              <button
                                key={result.place_id}
                                type="button"
                                onClick={() => {
                                  const lat = parseFloat(result.lat);
                                  const lon = parseFloat(result.lon);
                                  const parts = result.display_name.split(",");
                                  const shortLabel = parts.slice(0, 3).join(",").trim();
                                  selectLocation(lat, lon, shortLabel);
                                  setMapSearchResults([]);
                                  setMapSearchQuery(shortLabel);
                                }}
                                className="w-full text-left px-3 py-2 text-[10px] text-[#5a483a] hover:bg-[#eed57c]/10 transition-colors leading-relaxed"
                              >
                                {result.display_name}
                              </button>
                            ))}
                          </div>
                        )}

                        <input
                          type="text"
                          id={field.id}
                          value={val}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder="e.g. 13.0827,80.2707"
                          className="w-full bg-white border border-neutral-200 text-neutral-800 px-4 py-2.5 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-1 focus:ring-[#b3811b]/30 shadow-sm transition-all placeholder-neutral-400"
                        />

                        {/* Interactive Leaflet Map picker container */}
                        <div className="flex flex-col gap-1 mt-1">
                          <span className="font-serif text-[10px] text-neutral-400 italic text-left">
                            Or drag the marker pin on the map below:
                          </span>
                          <div
                            id="leaflet-map"
                            className="w-full h-48 border border-neutral-200 bg-[#fbfbfa] relative z-10 rounded-xl overflow-hidden shadow-inner"
                          />
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
                            {field.label}
                          </span>
                          {field.placeholder && (
                            <span className="font-serif text-[9px] text-neutral-400 italic">{field.placeholder}</span>
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
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>

                      {field.type === "textarea" ? (
                        <textarea
                          id={field.id}
                          required={field.required}
                          rows={3}
                          value={val}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
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
                          placeholder={field.placeholder}
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
                    GENERATE (₹{template.price})
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
