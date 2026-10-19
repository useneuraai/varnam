"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface InteractiveMapPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const DEFAULT_LAT = 13.0827;
const DEFAULT_LNG = 80.2707;

function parseCoordinates(val?: string): { lat: number; lng: number; label?: string } {
  if (!val || typeof val !== "string") {
    return { lat: DEFAULT_LAT, lng: DEFAULT_LNG };
  }
  const match = val.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
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

export default function InteractiveMapPicker({ value, onChange }: InteractiveMapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<"gmap-native" | "gmap-tiles" | null>(null);

  // Google native refs
  const gmapInstanceRef = useRef<google.maps.Map | null>(null);
  const gmapMarkerRef = useRef<google.maps.Marker | null>(null);

  // Leaflet Google tiles refs
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletMarkerRef = useRef<L.Marker | null>(null);

  const initial = parseCoordinates(value);
  const coordsRef = useRef(initial);

  // Reverse geocoding helper
  const handleLocationPicked = useCallback(async (lat: number, lng: number) => {
    coordsRef.current = { lat, lng };

    // Try Google Geocoder if available
    if ((window as any).google?.maps?.Geocoder) {
      try {
        const geocoder = new (window as any).google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
          if (status === "OK" && results && results[0]) {
            const address = results[0].formatted_address;
            onChange(`${lat.toFixed(6)},${lng.toFixed(6)} (${address})`);
            return;
          }
          // Fallback to nominatim
          fallbackNominatim(lat, lng);
        });
        return;
      } catch (e) {
        // Fallback
      }
    }

    fallbackNominatim(lat, lng);

    async function fallbackNominatim(latitude: number, longitude: number) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          { headers: { "Accept-Language": "en" } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.display_name) {
            const shortAddress = data.display_name.split(",").slice(0, 3).join(",").trim();
            onChange(`${latitude.toFixed(6)},${longitude.toFixed(6)} (${shortAddress})`);
            return;
          }
        }
      } catch (err) {
        // Ignore
      }
      onChange(`${latitude.toFixed(6)},${longitude.toFixed(6)}`);
    }
  }, [onChange]);

  // Init Map
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
      // Direct Google Maps vector tiles engine
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
      }, 150);
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

  // Sync external changes (e.g. from search bar or Use Current button)
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
  }, [value]);

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-neutral-300 shadow-inner bg-neutral-100">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
