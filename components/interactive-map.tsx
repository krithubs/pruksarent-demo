"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Search, X, MapPin, Navigation, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { baht, livingTypeLabels } from "@/lib/i18n";
import { useApp } from "./app-providers";
import type L from "leaflet";

const BANGKOK_CENTER: [number, number] = [13.74, 100.56];
const DEFAULT_ZOOM = 12;

// Known locations for search suggestions
const LOCATIONS: { name: { th: string; en: string }; lat: number; lng: number }[] = [
  { name: { th: "สุขุมวิท", en: "Sukhumvit" }, lat: 13.723, lng: 100.585 },
  { name: { th: "พญาไท", en: "Phaya Thai" }, lat: 13.779, lng: 100.544 },
  { name: { th: "รัชดาภิเษก", en: "Ratchada" }, lat: 13.764, lng: 100.574 },
  { name: { th: "บางนา", en: "Bangna" }, lat: 13.668, lng: 100.616 },
  { name: { th: "ลาดพร้าว", en: "Ladprao" }, lat: 13.793, lng: 100.605 },
  { name: { th: "รามอินทรา", en: "Ram Intra" }, lat: 13.83, lng: 100.63 },
  { name: { th: "ราชพฤกษ์", en: "Ratchaphruek" }, lat: 13.78, lng: 100.44 },
  { name: { th: "เอกมัย", en: "Ekkamai" }, lat: 13.72, lng: 100.585 },
  { name: { th: "ทองหล่อ", en: "Thonglor" }, lat: 13.73, lng: 100.578 },
  { name: { th: "อารีย์", en: "Ari" }, lat: 13.779, lng: 100.545 },
  { name: { th: "BTS อ่อนนุช", en: "BTS On Nut" }, lat: 13.705, lng: 100.601 },
  { name: { th: "BTS อารีย์", en: "BTS Ari" }, lat: 13.779, lng: 100.544 },
  { name: { th: "MRT พระราม 9", en: "MRT Rama 9" }, lat: 13.758, lng: 100.565 },
  { name: { th: "MRT ลาดพร้าว", en: "MRT Ladprao" }, lat: 13.806, lng: 100.573 },
  { name: { th: "BTS แบริ่ง", en: "BTS Bearing" }, lat: 13.668, lng: 100.601 },
];

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface InteractiveMapProps {
  projects: Project[];
  compact?: boolean;
  onProjectsInView?: (slugs: string[]) => void;
}

export default function InteractiveMap({ projects, compact = false, onProjectsInView }: InteractiveMapProps) {
  const { locale } = useApp();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [ready, setReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const locationMatches = LOCATIONS.filter(
      (loc) => loc.name.th.includes(q) || loc.name.en.toLowerCase().includes(q)
    ).slice(0, 5);
    const projectMatches = projects
      .filter(
        (p) =>
          p.name.th.includes(q) ||
          p.name.en.toLowerCase().includes(q) ||
          p.location.th.includes(q) ||
          p.location.en.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q)
      )
      .slice(0, 5);
    return [
      ...locationMatches.map((loc) => ({
        type: "location" as const,
        label: loc.name[locale],
        sublabel: locale === "th" ? "ทำเล" : "Location",
        lat: loc.lat,
        lng: loc.lng,
      })),
      ...projectMatches.map((p) => ({
        type: "project" as const,
        label: p.name[locale],
        sublabel: p.location[locale],
        lat: p.lat,
        lng: p.lng,
        slug: p.slug,
      })),
    ];
  }, [searchQuery, projects, locale]);

  // Sorted projects by distance from search center
  const sortedProjects = useMemo(() => {
    if (!searchCenter) return projects;
    return [...projects]
      .map((p) => ({ ...p, distance: getDistance(searchCenter.lat, searchCenter.lng, p.lat, p.lng) }))
      .sort((a, b) => a.distance - b.distance);
  }, [projects, searchCenter]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    let cancelled = false;

    async function init() {
      const L = (await import("leaflet")).default;

      if (cancelled || !mapRef.current) return;

      // Fix default marker icons
      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        center: BANGKOK_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      leafletMap.current = map;
      setReady(true);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // Update markers when projects or locale changes
  const updateMarkers = useCallback(async () => {
    if (!leafletMap.current || !ready) return;

    const L = (await import("leaflet")).default;
    const map = leafletMap.current;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const customIcon = (isSelected: boolean) =>
      L.divIcon({
        className: "custom-map-marker",
        html: `<div style="
          width: ${isSelected ? "40px" : "32px"};
          height: ${isSelected ? "40px" : "32px"};
          background: ${isSelected ? "#F15A29" : "#5BA730"};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.2s;
          cursor: pointer;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3" fill="white" stroke="white"/>
          </svg>
        </div>`,
        iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
        iconAnchor: [isSelected ? 20 : 16, isSelected ? 40 : 32],
      });

    sortedProjects.forEach((project) => {
      const isSelected = selectedProject?.slug === project.slug;
      const marker = L.marker([project.lat, project.lng], {
        icon: customIcon(isSelected),
        zIndexOffset: isSelected ? 1000 : 0,
      });

      marker.on("click", () => {
        setSelectedProject(project);
        map.flyTo([project.lat, project.lng], 15, { duration: 0.5 });
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [ready, sortedProjects, selectedProject]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  // Notify parent about visible projects
  useEffect(() => {
    if (!leafletMap.current || !ready || !onProjectsInView) return;
    const map = leafletMap.current;

    function updateVisibleProjects() {
      if (!map) return;
      const bounds = map.getBounds();
      const visible = projects
        .filter((p) => bounds.contains([p.lat, p.lng]))
        .map((p) => p.slug);
      onProjectsInView?.(visible);
    }

    map.on("moveend", updateVisibleProjects);
    updateVisibleProjects();
    return () => {
      map.off("moveend", updateVisibleProjects);
    };
  }, [ready, projects, onProjectsInView]);

  function handleSelectSuggestion(suggestion: (typeof suggestions)[0]) {
    setSearchQuery(suggestion.label);
    setShowSuggestions(false);
    setSearchCenter({ lat: suggestion.lat, lng: suggestion.lng, label: suggestion.label });

    if (leafletMap.current) {
      const zoom = suggestion.type === "project" ? 16 : 14;
      leafletMap.current.flyTo([suggestion.lat, suggestion.lng], zoom, { duration: 0.8 });
    }

    if (suggestion.type === "project" && "slug" in suggestion) {
      const project = projects.find((p) => p.slug === suggestion.slug);
      if (project) setSelectedProject(project);
    }
  }

  function handleClearSearch() {
    setSearchQuery("");
    setSearchCenter(null);
    setSelectedProject(null);
    if (leafletMap.current) {
      leafletMap.current.flyTo(BANGKOK_CENTER, DEFAULT_ZOOM, { duration: 0.8 });
    }
  }

  function handleNearMe() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setSearchCenter({ lat: latitude, lng: longitude, label: locale === "th" ? "ตำแหน่งปัจจุบัน" : "My Location" });
        setSearchQuery(locale === "th" ? "ตำแหน่งปัจจุบัน" : "My Location");
        if (leafletMap.current) {
          leafletMap.current.flyTo([latitude, longitude], 14, { duration: 0.8 });
        }
      },
      () => {
        alert(locale === "th" ? "ไม่สามารถเข้าถึงตำแหน่งได้" : "Unable to access location");
      }
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-black/10 ${compact ? "h-[400px]" : "h-[600px]"}`}>
      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />

      {/* Search bar overlay */}
      <div className="absolute left-0 right-0 top-0 z-[1000] p-3">
        <div ref={searchRef} className="relative mx-auto max-w-lg">
          <div className="flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur">
            <Search size={18} className="shrink-0 text-black/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={locale === "th" ? "ค้นหาทำเล, โครงการ, BTS/MRT..." : "Search location, project, BTS/MRT..."}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/40"
            />
            {searchQuery && (
              <button onClick={handleClearSearch} className="shrink-0 text-black/40 hover:text-black">
                <X size={16} />
              </button>
            )}
            <button
              onClick={handleNearMe}
              className="shrink-0 rounded-lg bg-pruksa-green/10 p-1.5 text-pruksa-green hover:bg-pruksa-green/20"
              title={locale === "th" ? "ใกล้ฉัน" : "Near me"}
            >
              <Navigation size={16} />
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="mt-1.5 max-h-64 overflow-y-auto rounded-xl bg-white/95 shadow-lg backdrop-blur">
              {suggestions.map((s, i) => (
                <button
                  key={`${s.type}-${i}`}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-pruksa-green/5"
                  onClick={() => handleSelectSuggestion(s)}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                      s.type === "location" ? "bg-pruksa-teal/10 text-pruksa-teal" : "bg-pruksa-orange/10 text-pruksa-orange"
                    }`}
                  >
                    <MapPin size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.label}</p>
                    <p className="truncate text-xs text-black/50">{s.sublabel}</p>
                  </div>
                  <ChevronRight size={14} className="shrink-0 text-black/30" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search center indicator */}
        {searchCenter && (
          <div className="mx-auto mt-2 flex max-w-lg items-center justify-center gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
              <MapPin size={12} className="mr-1 inline text-pruksa-orange" />
              {searchCenter.label}
              {sortedProjects.length > 0 && " · " + sortedProjects.length + (locale === "th" ? " โครงการ" : " projects")}
            </span>
          </div>
        )}
      </div>

      {/* Map container */}
      <div ref={mapRef} className="h-full w-full" />

      {/* Loading state */}
      {!ready && (
        <div className="absolute inset-0 z-[999] grid place-items-center bg-[#e8f1ed]">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-pruksa-green border-t-transparent" />
            <p className="mt-3 text-sm text-black/50">{locale === "th" ? "กำลังโหลดแผนที่..." : "Loading map..."}</p>
          </div>
        </div>
      )}

      {/* Selected project card */}
      {selectedProject && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] mx-auto max-w-sm">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="flex">
              <img
                src={selectedProject.image}
                alt={selectedProject.name[locale]}
                className="h-28 w-28 shrink-0 object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
                <div>
                  <span className="inline-block rounded bg-pruksa-green/10 px-1.5 py-0.5 text-[10px] font-semibold text-pruksa-green">
                    {livingTypeLabels[selectedProject.type][locale]}
                  </span>
                  <h3 className="mt-1 truncate text-sm font-semibold">{selectedProject.name[locale]}</h3>
                  <p className="flex items-center gap-1 text-xs text-black/50">
                    <MapPin size={10} />
                    {selectedProject.location[locale]}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-pruksa-green">
                    {baht(selectedProject.priceMin)}-{baht(selectedProject.priceMax)}/mo
                  </p>
                  <Link
                    href={`/rent/${selectedProject.slug}`}
                    className="rounded-lg bg-pruksa-orange px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-pruksa-orange/90"
                  >
                    {locale === "th" ? "ดูรายละเอียด" : "View"}
                  </Link>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-black/10 text-black/50 hover:bg-black/20"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Nearby projects list (compact mode shows fewer) */}
      {searchCenter && !selectedProject && (
        <div className="absolute bottom-4 left-4 z-[1000] max-h-48 w-72 overflow-y-auto rounded-xl bg-white/95 shadow-lg backdrop-blur">
          <div className="sticky top-0 border-b bg-white/95 px-3 py-2 backdrop-blur">
            <p className="text-xs font-semibold text-black/60">
              {locale === "th" ? "โครงการใกล้เคียง" : "Nearby projects"}
            </p>
          </div>
          {sortedProjects.slice(0, compact ? 3 : 5).map((project) => (
            <button
              key={project.slug}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-pruksa-green/5"
              onClick={() => {
                setSelectedProject(project);
                leafletMap.current?.flyTo([project.lat, project.lng], 15, { duration: 0.5 });
              }}
            >
              <img src={project.image} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{project.name[locale]}</p>
                <p className="text-[10px] text-black/50">{baht(project.priceMin)}/mo · {"distance" in project ? ((project as Project & { distance: number }).distance).toFixed(1) + " km" : ""}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
