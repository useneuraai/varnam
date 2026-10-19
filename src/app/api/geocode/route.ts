import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface GeocodeResult {
  id: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
}

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q")?.trim() || "";
    const latParam = req.nextUrl.searchParams.get("lat");
    const lngParam = req.nextUrl.searchParams.get("lng");

    // 1. REVERSE GEOCODING (if lat & lng provided)
    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      if (!isNaN(lat) && !isNaN(lng)) {
        try {
          const nomRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
              headers: {
                "User-Agent": "Varnam-Wedding-Platform/1.0 (contact@varnaminvites.store)",
                "Accept-Language": "en",
              },
              signal: AbortSignal.timeout(5000),
            }
          );
          if (nomRes.ok) {
            const nomData = await nomRes.json();
            if (nomData && nomData.display_name) {
              const parts = nomData.display_name.split(",").map((s: string) => s.trim());
              const title = nomData.name || parts[0] || "Selected Location";
              const address = parts.slice(0, 4).join(", ");
              return NextResponse.json({
                success: true,
                result: {
                  id: `${lat},${lng}`,
                  title,
                  address,
                  lat,
                  lng,
                },
              });
            }
          }
        } catch (e) {
          // Fallback to coordinates
        }

        return NextResponse.json({
          success: true,
          result: {
            id: `${lat},${lng}`,
            title: "Pinned Location",
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            lat,
            lng,
          },
        });
      }
    }

    if (!q) {
      return NextResponse.json({ results: [] });
    }

    // 2. CHECK IF INPUT IS A GOOGLE MAPS URL OR DIRECT COORDINATES
    let extractedLat: number | null = null;
    let extractedLng: number | null = null;

    // Check Google Maps shortlink (e.g. maps.app.goo.gl or goo.gl/maps)
    if (q.includes("maps.app.goo.gl") || q.includes("goo.gl/maps")) {
      try {
        const redirectRes = await fetch(q, {
          method: "GET",
          redirect: "follow",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          signal: AbortSignal.timeout(4000),
        });
        const finalUrl = redirectRes.url || "";
        const m =
          finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
          finalUrl.match(/query=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
          finalUrl.match(/(-?\d+\.\d+)%2C(-?\d+\.\d+)/);
        if (m) {
          extractedLat = parseFloat(m[1]);
          extractedLng = parseFloat(m[2]);
        }
      } catch (err) {
        // Fall through to text search
      }
    }

    // Check full Google Maps URL with @lat,lng
    if (!extractedLat) {
      const urlMatch =
        q.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
        q.match(/query=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
        q.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (urlMatch) {
        extractedLat = parseFloat(urlMatch[1]);
        extractedLng = parseFloat(urlMatch[2]);
      }
    }

    // Check raw coordinate string (e.g. "13.0827, 80.2707" or "13.0827,80.2707 (Venue)")
    if (!extractedLat) {
      const directCoordMatch = q.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
      if (directCoordMatch) {
        extractedLat = parseFloat(directCoordMatch[1]);
        extractedLng = parseFloat(directCoordMatch[2]);
      }
    }

    if (
      extractedLat !== null &&
      extractedLng !== null &&
      !isNaN(extractedLat) &&
      !isNaN(extractedLng) &&
      extractedLat >= -90 &&
      extractedLat <= 90 &&
      extractedLng >= -180 &&
      extractedLng <= 180
    ) {
      // We extracted coordinates! Let's get a reverse address name
      let label = "Pinned Location";
      const labelMatch = q.match(/\(([^)]+)\)/);
      if (labelMatch) {
        label = labelMatch[1];
      }

      try {
        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${extractedLat}&lon=${extractedLng}&zoom=18&addressdetails=1`,
          {
            headers: {
              "User-Agent": "Varnam-Wedding-Platform/1.0 (contact@varnaminvites.store)",
              "Accept-Language": "en",
            },
            signal: AbortSignal.timeout(4000),
          }
        );
        if (nomRes.ok) {
          const nomData = await nomRes.json();
          if (nomData && nomData.display_name) {
            const parts = nomData.display_name.split(",").map((s: string) => s.trim());
            const title = label !== "Pinned Location" ? label : nomData.name || parts[0] || "Pinned Location";
            const address = parts.slice(0, 4).join(", ");
            return NextResponse.json({
              results: [
                {
                  id: `coord-${extractedLat}-${extractedLng}`,
                  title,
                  address,
                  lat: extractedLat,
                  lng: extractedLng,
                },
              ],
            });
          }
        }
      } catch (e) {
        // Continue with extracted coordinates
      }

      return NextResponse.json({
        results: [
          {
            id: `coord-${extractedLat}-${extractedLng}`,
            title: label,
            address: `${extractedLat.toFixed(6)}, ${extractedLng.toFixed(6)}`,
            lat: extractedLat,
            lng: extractedLng,
          },
        ],
      });
    }

    // 3. TEXT PLACE / VENUE SEARCH VIA PHOTON (Fast OpenStreetMap POI search)
    const results: GeocodeResult[] = [];

    try {
      const photonRes = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=8`,
        {
          headers: {
            "Accept-Language": "en",
          },
          signal: AbortSignal.timeout(5000),
        }
      );

      if (photonRes.ok) {
        const data = await photonRes.json();
        if (data && Array.isArray(data.features)) {
          for (const feature of data.features) {
            const props = feature.properties || {};
            const [lng, lat] = feature.geometry?.coordinates || [];
            if (typeof lat === "number" && typeof lng === "number") {
              const title = props.name || props.street || q;
              const addressParts = [
                props.street,
                props.locality,
                props.district,
                props.city,
                props.state,
                props.postcode,
                props.country,
              ].filter(Boolean);

              const address = addressParts.length > 0 ? addressParts.join(", ") : props.country || title;

              results.push({
                id: String(props.osm_id || `${lat}-${lng}`),
                title,
                address,
                lat,
                lng,
              });
            }
          }
        }
      }
    } catch (photonErr) {
      console.warn("Photon search error:", photonErr);
    }

    // 4. FALLBACK TO NOMINATIM IF PHOTON HAS NO RESULTS
    if (results.length === 0) {
      try {
        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1`,
          {
            headers: {
              "User-Agent": "Varnam-Wedding-Platform/1.0 (contact@varnaminvites.store)",
              "Accept-Language": "en",
            },
            signal: AbortSignal.timeout(5000),
          }
        );

        if (nomRes.ok) {
          const nomData = await nomRes.json();
          if (Array.isArray(nomData)) {
            for (const item of nomData) {
              const lat = parseFloat(item.lat);
              const lng = parseFloat(item.lon);
              if (!isNaN(lat) && !isNaN(lng)) {
                const parts = (item.display_name || "").split(",").map((s: string) => s.trim());
                const title = item.name || parts[0] || q;
                const address = parts.slice(1, 5).join(", ") || item.display_name;
                results.push({
                  id: String(item.osm_id || item.place_id || `${lat}-${lng}`),
                  title,
                  address,
                  lat,
                  lng,
                });
              }
            }
          }
        }
      } catch (nomErr) {
        console.warn("Nominatim search error:", nomErr);
      }
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Geocode API error:", error);
    return NextResponse.json({ error: error.message || "Failed to geocode location" }, { status: 500 });
  }
}
