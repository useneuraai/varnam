"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Search,
  MapPin,
  Navigation,
  ExternalLink,
  Loader2,
  X,
  Crosshair,
  Sparkles,
  Check,
} from "lucide-react";

interface InteractiveMapPickerProps {
  value: string;
  onChange: (value: string) => void;
  suggestedVenueName?: string;
}

interface GeocodeResult {
  id: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
}

const DEFAULT_LAT = 13.0827;
const DEFAULT_LNG = 80.2707;

function parseCoordinates(val?: string): { lat: number; lng: number; label?: string } {
  if (!val || typeof val !== "string") {
    return { lat: DEFAULT_LAT, lng: DEFAULT_LNG };
  }

  // Check for @lat,lng in Google Maps URLs
  const atMatch = val.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  // Check for lat,lng coordinates
  const match = val.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      const labelMatch = val.match(/\(([^)]+)\)/);
      return { lat, lng, label: labelMatch ? labelMatch[1] : undefined };
    }
  }
  return { lat: DEFAULT_LAT, lng: DEFAULT_LNG };
}

function loadGoogleMapsScript(apiKey?: string): Promise<typeof google> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is undefined"));
  }
  if ((window as any).google?.maps?.Map) {
    return Promise.resolve((window as any).google);
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById("gmaps-sdk-script");
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).google));
      existing.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.id = "gmaps-sdk-script";
    const keyParam = apiKey ? `key=${apiKey}&` : "";
    script.src = `https://maps.googleapis.com/maps/api/js?${keyParam}libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve((window as any).google);
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

export default function InteractiveMapPicker({
  value,
  onChange,
  suggestedVenueName = "",
}: InteractiveMapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, setEngine] = useState<"gmap-native" | "gmap-tiles" | null>(null);

  // Search & Geocoding State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const initial = parseCoordinates(value);
  const [selectedPlace, setSelectedPlace] = useState<{
    title: string;
    address: string;
    lat: number;
    lng: number;
  }>({
    title: initial.label || "Wedding Venue",
    address: initial.label ? `${initial.lat.toFixed(4)}, ${initial.lng.toFixed(4)}` : "Chennai, Tamil Nadu",
    lat: initial.lat,
    lng: initial.lng,
  });

  // Google native refs
  const gmapInstanceRef = useRef<google.maps.Map | null>(null);
  const gmapMarkerRef = useRef<google.maps.Marker | null>(null);

  // Leaflet Google tiles refs
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletMarkerRef = useRef<L.Marker | null>(null);

  // Reverse geocoding on pin drag / click
  const handleLocationPicked = useCallback(
    async (lat: number, lng: number) => {
      try {
        const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
        if (res.ok) {
          const data = await res.json();
          if (data.result) {
            const { title, address } = data.result;
            setSelectedPlace({ title, address, lat, lng });
            onChange(`${lat.toFixed(6)},${lng.toFixed(6)} (${title})`);
            return;
          }
        }
      } catch (err) {
        // Fallback
      }

      setSelectedPlace({
        title: "Selected Location",
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        lat,
        lng,
      });
      onChange(`${lat.toFixed(6)},${lng.toFixed(6)}`);
    },
    [onChange]
  );

  // Execute venue search
  const executeSearch = useCallback(async (query: string) => {
    const q = query.trim();
    if (!q) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Venue search request failed:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search on typing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      executeSearch(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, executeSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Select place from dropdown
  const handleSelectPlace = (place: GeocodeResult) => {
    const { lat, lng, title, address } = place;
    setSelectedPlace({ title, address, lat, lng });
    setSearchQuery("");
    setShowDropdown(false);

    // Pan Leaflet map
    if (leafletMapRef.current && leafletMarkerRef.current) {
      leafletMarkerRef.current.setLatLng([lat, lng]);
      leafletMapRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
    }

    // Pan Google map
    if (gmapInstanceRef.current && gmapMarkerRef.current) {
      gmapMarkerRef.current.setPosition({ lat, lng });
      gmapInstanceRef.current.panTo({ lat, lng });
      gmapInstanceRef.current.setZoom(16);
    }

    // Update parent formData
    onChange(`${lat.toFixed(6)},${lng.toFixed(6)} (${title})`);
  };

  // GPS Locate Current Position
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setIsLocating(false);

        if (leafletMapRef.current && leafletMarkerRef.current) {
          leafletMarkerRef.current.setLatLng([lat, lng]);
          leafletMapRef.current.flyTo([lat, lng], 16, { duration: 1 });
        }
        if (gmapInstanceRef.current && gmapMarkerRef.current) {
          gmapMarkerRef.current.setPosition({ lat, lng });
          gmapInstanceRef.current.panTo({ lat, lng });
        }
        handleLocationPicked(lat, lng);
      },
      (err) => {
        setIsLocating(false);
        alert("GPS Location error: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current) return;
    let isCancelled = false;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // If API key is present, attempt native Google Maps JS SDK
    if (apiKey) {
      loadGoogleMapsScript(apiKey)
        .then((googleObj) => {
          if (isCancelled || !containerRef.current) return;
          try {
            const map = new googleObj.maps.Map(containerRef.current, {
              center: { lat: initial.lat, lng: initial.lng },
              zoom: 15,
              zoomControl: true,
              mapTypeControl: true,
              streetViewControl: false,
              fullscreenControl: true,
            });

            const marker = new googleObj.maps.Marker({
              position: { lat: initial.lat, lng: initial.lng },
              map: map,
              draggable: true,
              animation: googleObj.maps.Animation.DROP,
            });

            map.addListener("click", (e: google.maps.MapMouseEvent) => {
              if (!e.latLng) return;
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              marker.setPosition({ lat, lng });
              handleLocationPicked(lat, lng);
            });

            marker.addListener("dragend", () => {
              const pos = marker.getPosition();
              if (!pos) return;
              handleLocationPicked(pos.lat(), pos.lng());
            });

            gmapInstanceRef.current = map;
            gmapMarkerRef.current = marker;
            setEngine("gmap-native");
          } catch (e) {
            initGoogleTiles();
          }
        })
        .catch(() => {
          if (!isCancelled) initGoogleTiles();
        });
    } else {
      // Direct Google Maps vector tiles engine (works with 0 API keys)
      initGoogleTiles();
    }

    function initGoogleTiles() {
      if (isCancelled || !containerRef.current) return;

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      const map = L.map(containerRef.current, {
        center: [initial.lat, initial.lng],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
      });

      // Google Maps Roads and Satellite Tiles
      const googleRoads = L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        attribution: "&copy; Google Maps",
      }).addTo(map);

      const googleSatellite = L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        attribution: "&copy; Google Maps",
      });

      // Layer Control (Map vs Satellite)
      L.control.layers(
        { "Map": googleRoads, "Satellite": googleSatellite },
        {},
        { position: "topright" }
      ).addTo(map);

      // Google Red Pin Marker
      const redPinIcon = L.divIcon({
        className: "gmap-pin",
        html: `
          <div style="position: relative; width: 32px; height: 42px; transform: translate(-50%, -100%); cursor: grab;">
            <svg viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16C0 26.5 14 39.5 15.4 41.2C15.7 41.6 16.3 41.6 16.6 41.2C18 39.5 32 26.5 32 16C32 7.163 24.837 0 16 0Z" fill="#EA4335" stroke="#B31412" stroke-width="1"/>
              <circle cx="16" cy="15" r="5.5" fill="#FFFFFF"/>
            </svg>
            <div style="position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 40%); width: 12px; height: 4px; background: rgba(0,0,0,0.3); border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
      });

      const marker = L.marker([initial.lat, initial.lng], {
        icon: redPinIcon,
        draggable: true,
      }).addTo(map);

      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        handleLocationPicked(lat, lng);
      });

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        handleLocationPicked(pos.lat, pos.lng);
      });

      leafletMapRef.current = map;
      leafletMarkerRef.current = marker;
      setEngine("gmap-tiles");

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    return () => {
      isCancelled = true;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
      gmapInstanceRef.current = null;
      gmapMarkerRef.current = null;
    };
  }, []);

  // Sync external changes
  useEffect(() => {
    const parsed = parseCoordinates(value);

    if (gmapInstanceRef.current && gmapMarkerRef.current) {
      const pos = gmapMarkerRef.current.getPosition();
      if (pos) {
        const diff = Math.abs(pos.lat() - parsed.lat) + Math.abs(pos.lng() - parsed.lng);
        if (diff > 0.0001) {
          gmapMarkerRef.current.setPosition({ lat: parsed.lat, lng: parsed.lng });
          gmapInstanceRef.current.panTo({ lat: parsed.lat, lng: parsed.lng });
        }
      }
    } else if (leafletMapRef.current && leafletMarkerRef.current) {
      const pos = leafletMarkerRef.current.getLatLng();
      const diff = Math.abs(pos.lat - parsed.lat) + Math.abs(pos.lng - parsed.lng);
      if (diff > 0.0001) {
        leafletMarkerRef.current.setLatLng([parsed.lat, parsed.lng]);
        leafletMapRef.current.flyTo([parsed.lat, parsed.lng], 16, { duration: 1 });
      }
    }

    if (parsed.label) {
      setSelectedPlace((prev) => ({
        ...prev,
        title: parsed.label || prev.title,
        lat: parsed.lat,
        lng: parsed.lng,
      }));
    }
  }, [value]);

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${selectedPlace.lat},${selectedPlace.lng}`;

  return (
    <div className="space-y-3">
      {/* 1. GMAP SEARCH BAR & AUTOCOMPLETE */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#b3811b]" />
              ) : (
                <Search className="w-4 h-4 text-neutral-400" />
              )}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  executeSearch(searchQuery);
                }
              }}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowDropdown(true);
                }
              }}
              placeholder="Search hall, hotel, address, or paste Google Maps link..."
              className="w-full bg-white border border-neutral-300 text-neutral-800 pl-10 pr-9 py-2.5 text-xs rounded-xl focus:border-[#b3811b] focus:outline-none focus:ring-2 focus:ring-[#b3811b]/20 shadow-xs placeholder-neutral-400 font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setShowDropdown(false);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Button */}
          <button
            type="button"
            onClick={() => executeSearch(searchQuery)}
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2.5 bg-[#b3811b] hover:bg-[#9c6f13] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 font-montserrat"
          >
            {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Search</span>
          </button>

          {/* GPS Button */}
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            className="px-3 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl border border-neutral-200 shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50 font-montserrat"
            title="Use current GPS position"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#b3811b]" />
            ) : (
              <Crosshair className="w-3.5 h-3.5 text-[#b3811b]" />
            )}
            <span className="hidden sm:inline">My GPS</span>
          </button>
        </div>

        {/* Quick Suggestion Chip from Wedding Venue if available */}
        {suggestedVenueName && suggestedVenueName.trim().length > 2 && (
          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-neutral-400">Quick Search:</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery(suggestedVenueName);
                executeSearch(suggestedVenueName);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eed57c]/20 hover:bg-[#eed57c]/40 text-[#8a725d] text-[10.5px] font-medium border border-[#eed57c]/50 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#b3811b]" />
              <span className="truncate max-w-[220px]">{suggestedVenueName}</span>
            </button>
          </div>
        )}

        {/* 2. AUTOCOMPLETE / SEARCH RESULTS DROPDOWN */}
        {showDropdown && (
          <div className="absolute z-[1000] mt-1.5 w-full bg-white rounded-2xl shadow-xl border border-[#eed57c]/40 overflow-hidden max-h-72 overflow-y-auto animate-in fade-in-50 duration-150">
            {isSearching ? (
              <div className="p-4 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#b3811b]" />
                <span>Searching venues and landmarks...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <ul className="divide-y divide-neutral-100">
                {searchResults.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectPlace(item)}
                      className="w-full text-left px-4 py-3 hover:bg-[#fffdfa] flex items-start gap-3 transition-colors cursor-pointer group"
                    >
                      <div className="mt-0.5 p-1.5 rounded-full bg-[#eed57c]/20 text-[#b3811b] group-hover:bg-[#b3811b] group-hover:text-white transition-colors shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-xs font-semibold text-neutral-800 truncate group-hover:text-[#b3811b] transition-colors">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {item.address}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : hasSearched ? (
              <div className="p-4 text-center text-xs text-neutral-500 space-y-1">
                <p className="font-semibold text-neutral-700">No exact matches found</p>
                <p className="text-[11px] text-neutral-400">
                  Try typing the city name or drag the red pin directly on the map below.
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* 3. SELECTED VENUE BADGE CARD */}
      <div className="p-3 bg-gradient-to-r from-[#fffcf2] to-[#fff8eb] border border-[#eed57c]/40 rounded-xl flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#b3811b]/10 text-[#b3811b] flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-[#b3811b]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11.5px] font-bold text-neutral-800 truncate flex items-center gap-1.5">
              <span>{selectedPlace.title}</span>
            </div>
            <div className="text-[10px] text-neutral-500 truncate">
              {selectedPlace.lat.toFixed(6)}, {selectedPlace.lng.toFixed(6)}
            </div>
          </div>
        </div>

        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#eed57c]/60 text-[#8a725d] hover:text-[#b3811b] hover:border-[#b3811b] text-[10.5px] font-montserrat font-bold shrink-0 transition shadow-2xs"
          title="Verify location in Google Maps"
        >
          <span>Verify in Maps</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      {/* 4. LEAFLET / GOOGLE TILES MAP WITH DRAGGABLE PIN */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-neutral-300 shadow-inner bg-neutral-100">
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Helper guide */}
      <p className="text-[10.5px] text-neutral-400 flex items-center gap-1">
        <Navigation className="w-3 h-3 text-[#b3811b] shrink-0" />
        <span>Tip: Drag the red pin or click anywhere on the map to pinpoint the exact hall entrance.</span>
      </p>
    </div>
  );
}
