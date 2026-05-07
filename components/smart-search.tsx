"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  X,
  MapPin,
  TrainFront,
  GraduationCap,
  ShoppingBag,
  Hospital,
  Building2,
  Home,
  Newspaper,
  Tag,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { projects, promotions, blogs } from "@/lib/data";
import { baht, livingTypeLabels, copy } from "@/lib/i18n";
import type { LivingType, Locale } from "@/lib/types";
import { useApp } from "./app-providers";

// ── Minimal station data for search (name + line label only, no coords needed) ──
const TRANSIT_STATIONS: { name: { th: string; en: string }; line: { th: string; en: string }; color: string }[] = [
  { name: { th: "หมอชิต", en: "Mo Chit" }, line: { th: "BTS สุขุมวิท", en: "BTS Sukhumvit" }, color: "#5C8A32" },
  { name: { th: "อารีย์", en: "Ari" }, line: { th: "BTS สุขุมวิท", en: "BTS Sukhumvit" }, color: "#5C8A32" },
  { name: { th: "สยาม", en: "Siam" }, line: { th: "BTS สุขุมวิท", en: "BTS Sukhumvit" }, color: "#5C8A32" },
  { name: { th: "อโศก", en: "Asok" }, line: { th: "BTS สุขุมวิท", en: "BTS Sukhumvit" }, color: "#5C8A32" },
  { name: { th: "พร้อมพงษ์", en: "Phrom Phong" }, line: { th: "BTS สุขุมวิท", en: "BTS Sukhumvit" }, color: "#5C8A32" },
  { name: { th: "ทองหล่อ", en: "Thong Lo" }, line: { th: "BTS สุขุมวิท", en: "BTS Sukhumvit" }, color: "#5C8A32" },
  { name: { th: "เอกมัย", en: "Ekkamai" }, line: { th: "BTS สุขุมวิท", en: "BTS Sukhumvit" }, color: "#5C8A32" },
  { name: { th: "อ่อนนุช", en: "On Nut" }, line: { th: "BTS สุขุมวิท", en: "BTS Sukhumvit" }, color: "#5C8A32" },
  { name: { th: "แบริ่ง", en: "Bearing" }, line: { th: "BTS สุขุมวิท", en: "BTS Sukhumvit" }, color: "#5C8A32" },
  { name: { th: "พญาไท", en: "Phaya Thai" }, line: { th: "BTS สุขุมวิท", en: "BTS Sukhumvit" }, color: "#5C8A32" },
  { name: { th: "ชิดลม", en: "Chit Lom" }, line: { th: "BTS สุขุมวิท", en: "BTS Sukhumvit" }, color: "#5C8A32" },
  { name: { th: "ช่องนนทรี", en: "Chong Nonsi" }, line: { th: "BTS สีลม", en: "BTS Silom" }, color: "#C7352E" },
  { name: { th: "ศาลาแดง", en: "Sala Daeng" }, line: { th: "BTS สีลม", en: "BTS Silom" }, color: "#C7352E" },
  { name: { th: "บางหว้า", en: "Bang Wa" }, line: { th: "BTS สีลม", en: "BTS Silom" }, color: "#C7352E" },
  { name: { th: "พระราม 9", en: "Phra Ram 9" }, line: { th: "MRT สีน้ำเงิน", en: "MRT Blue" }, color: "#1E3A8A" },
  { name: { th: "ลาดพร้าว", en: "Lat Phrao" }, line: { th: "MRT สีน้ำเงิน", en: "MRT Blue" }, color: "#1E3A8A" },
  { name: { th: "สุขุมวิท", en: "Sukhumvit" }, line: { th: "MRT สีน้ำเงิน", en: "MRT Blue" }, color: "#1E3A8A" },
  { name: { th: "จตุจักร", en: "Chatuchak Park" }, line: { th: "MRT สีน้ำเงิน", en: "MRT Blue" }, color: "#1E3A8A" },
  { name: { th: "ห้วยขวาง", en: "Huai Khwang" }, line: { th: "MRT สีน้ำเงิน", en: "MRT Blue" }, color: "#1E3A8A" },
  { name: { th: "สุวรรณภูมิ", en: "Suvarnabhumi" }, line: { th: "แอร์พอร์ตลิงก์", en: "Airport Link" }, color: "#E11D48" },
];

const PLACES: { name: { th: string; en: string }; category: string; color: string }[] = [
  { name: { th: "จุฬาลงกรณ์มหาวิทยาลัย", en: "Chulalongkorn University" }, category: "school", color: "#2563EB" },
  { name: { th: "ม.เกษตรศาสตร์", en: "Kasetsart University" }, category: "school", color: "#2563EB" },
  { name: { th: "ม.ศรีนครินทรวิโรฒ", en: "Srinakharinwirot University" }, category: "school", color: "#2563EB" },
  { name: { th: "สยามพารากอน", en: "Siam Paragon" }, category: "mall", color: "#D946EF" },
  { name: { th: "เซ็นทรัลเวิลด์", en: "CentralWorld" }, category: "mall", color: "#D946EF" },
  { name: { th: "เทอร์มินอล 21", en: "Terminal 21" }, category: "mall", color: "#D946EF" },
  { name: { th: "ไอคอนสยาม", en: "ICONSIAM" }, category: "mall", color: "#D946EF" },
  { name: { th: "เมกาบางนา", en: "Mega Bangna" }, category: "mall", color: "#D946EF" },
  { name: { th: "โรงพยาบาลบำรุงราษฎร์", en: "Bumrungrad Hospital" }, category: "hospital", color: "#DC2626" },
  { name: { th: "โรงพยาบาลศิริราช", en: "Siriraj Hospital" }, category: "hospital", color: "#DC2626" },
  { name: { th: "โรงพยาบาลรามาธิบดี", en: "Ramathibodi Hospital" }, category: "hospital", color: "#DC2626" },
];

const LOCATIONS: { th: string; en: string }[] = [
  { th: "สุขุมวิท", en: "Sukhumvit" },
  { th: "พญาไท", en: "Phaya Thai" },
  { th: "รัชดาภิเษก", en: "Ratchada" },
  { th: "บางนา", en: "Bangna" },
  { th: "ลาดพร้าว", en: "Ladprao" },
  { th: "สาทร", en: "Sathorn" },
  { th: "ทองหล่อ", en: "Thonglor" },
  { th: "เอกมัย", en: "Ekkamai" },
  { th: "อารีย์", en: "Ari" },
  { th: "จตุจักร", en: "Chatuchak" },
];

function placeIcon(cat: string) {
  switch (cat) {
    case "school": return GraduationCap;
    case "mall": return ShoppingBag;
    case "hospital": return Hospital;
    default: return Building2;
  }
}

function placeCatLabel(cat: string, locale: Locale) {
  const map: Record<string, { th: string; en: string }> = {
    school: { th: "สถานศึกษา", en: "School" },
    mall: { th: "ศูนย์การค้า", en: "Mall" },
    hospital: { th: "โรงพยาบาล", en: "Hospital" },
  };
  return map[cat]?.[locale] ?? cat;
}

// ── Types ──
type ResultItem = {
  type: "project" | "transit" | "place" | "location" | "promotion" | "blog" | "page";
  label: string;
  sublabel: string;
  href: string;
  color?: string;
  icon: "project" | "transit" | "place" | "location" | "promo" | "blog" | "page";
  placeCategory?: string;
  price?: string;
};

// Static pages
const PAGES: { label: { th: string; en: string }; href: string }[] = [
  { label: { th: "หน้าแรก", en: "Home" }, href: "/" },
  { label: { th: "ค้นหาโครงการเช่า", en: "Rental Projects" }, href: "/rent" },
  { label: { th: "โปรโมชัน", en: "Promotions" }, href: "/promotions" },
  { label: { th: "บทความ", en: "Blog" }, href: "/blog" },
  { label: { th: "เกี่ยวกับเรา", en: "About Us" }, href: "/about" },
  { label: { th: "ติดต่อเรา", en: "Contact" }, href: "/contact" },
];

// ── Component ──
interface SmartSearchProps {
  variant?: "header" | "hero";
}

export function SmartSearch({ variant = "header" }: SmartSearchProps) {
  const { locale } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = locale === "th";

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); inputRef.current?.blur(); }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Build results
  const results = useMemo<ResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: ResultItem[] = [];

    // Projects
    projects
      .filter((p) => p.name.th.includes(q) || p.name.en.toLowerCase().includes(q) || p.area.toLowerCase().includes(q) || p.location.th.includes(q) || p.location.en.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach((p) =>
        out.push({
          type: "project",
          label: p.name[locale],
          sublabel: p.location[locale],
          href: `/rent/${p.slug}`,
          icon: "project",
          price: `${baht(p.priceMin)}-${baht(p.priceMax)}/mo`,
        })
      );

    // Transit stations
    TRANSIT_STATIONS
      .filter((s) => s.name.th.includes(q) || s.name.en.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach((s) =>
        out.push({
          type: "transit",
          label: s.name[locale],
          sublabel: s.line[locale],
          href: "/rent",
          icon: "transit",
          color: s.color,
        })
      );

    // Places
    PLACES
      .filter((p) => p.name.th.includes(q) || p.name.en.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach((p) =>
        out.push({
          type: "place",
          label: p.name[locale],
          sublabel: placeCatLabel(p.category, locale),
          href: "/rent",
          icon: "place",
          color: p.color,
          placeCategory: p.category,
        })
      );

    // Locations
    LOCATIONS
      .filter((l) => l.th.includes(q) || l.en.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach((l) =>
        out.push({
          type: "location",
          label: l[locale],
          sublabel: t ? "ทำเล" : "Location",
          href: "/rent",
          icon: "location",
        })
      );

    // Promotions
    promotions
      .filter((p) => p.title.th.includes(q) || p.title.en.toLowerCase().includes(q) || p.summary.th.includes(q) || p.summary.en.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach((p) =>
        out.push({
          type: "promotion",
          label: p.title[locale],
          sublabel: p.badge,
          href: `/promotions/${p.slug}`,
          icon: "promo",
        })
      );

    // Blog
    blogs
      .filter((b) => b.title.th.includes(q) || b.title.en.toLowerCase().includes(q) || b.category.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach((b) =>
        out.push({
          type: "blog",
          label: b.title[locale],
          sublabel: b.category + " · " + b.minutes + " min",
          href: `/blog/${b.slug}`,
          icon: "blog",
        })
      );

    // Pages
    PAGES
      .filter((p) => p.label.th.includes(q) || p.label.en.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach((p) =>
        out.push({
          type: "page",
          label: p.label[locale],
          sublabel: p.href,
          href: p.href,
          icon: "page",
        })
      );

    return out;
  }, [query, locale, t]);

  // Group results by type
  const grouped = useMemo(() => {
    const groups: Record<string, { label: string; items: ResultItem[] }> = {};
    const typeLabels: Record<string, { th: string; en: string }> = {
      project: { th: "โครงการ", en: "Projects" },
      transit: { th: "BTS / MRT", en: "BTS / MRT" },
      place: { th: "สถานที่สำคัญ", en: "Places" },
      location: { th: "ทำเล", en: "Locations" },
      promotion: { th: "โปรโมชัน", en: "Promotions" },
      blog: { th: "บทความ", en: "Blog" },
      page: { th: "หน้าเว็บ", en: "Pages" },
    };
    for (const item of results) {
      if (!groups[item.type]) {
        groups[item.type] = { label: typeLabels[item.type]?.[locale] ?? item.type, items: [] };
      }
      groups[item.type].items.push(item);
    }
    return groups;
  }, [results, locale]);

  // Quick links when empty + focused
  const quickLinks: { label: string; href: string; icon: typeof Search; color: string }[] = [
    { label: t ? "ค้นหาโครงการเช่า" : "Browse Rental Projects", href: "/rent", icon: Home, color: "bg-pruksa-green" },
    { label: t ? "ดีลพิเศษ" : "Special Deals", href: "/promotions", icon: Tag, color: "bg-pruksa-orange" },
    { label: t ? "แนะนำยอดนิยม" : "Trending Projects", href: "/rent", icon: TrendingUp, color: "bg-pruksa-teal" },
    { label: t ? "บทความล่าสุด" : "Latest Articles", href: "/blog", icon: Newspaper, color: "bg-pruksa-yellow text-pruksa-ink" },
  ];

  // Popular searches
  const popularSearches = t
    ? ["สุขุมวิท", "BTS อารีย์", "สยามพารากอน", "ทาวน์โฮม", "คอนโดใกล้ BTS"]
    : ["Sukhumvit", "BTS Ari", "Siam Paragon", "Townhome", "Condo near BTS"];

  function handleSelect(item: ResultItem) {
    setQuery("");
    setOpen(false);
    router.push(item.href);
  }

  function getItemIcon(item: ResultItem) {
    switch (item.icon) {
      case "project": return <Home size={14} />;
      case "transit": return <TrainFront size={14} />;
      case "place": {
        const Icon = placeIcon(item.placeCategory || "");
        return <Icon size={14} />;
      }
      case "location": return <MapPin size={14} />;
      case "promo": return <Tag size={14} />;
      case "blog": return <Newspaper size={14} />;
      case "page": return <Sparkles size={14} />;
    }
  }

  function getItemColor(item: ResultItem) {
    switch (item.icon) {
      case "project": return "bg-pruksa-green/10 text-pruksa-green";
      case "transit": return "";
      case "place": return "";
      case "location": return "bg-pruksa-teal/10 text-pruksa-teal";
      case "promo": return "bg-pruksa-orange/10 text-pruksa-orange";
      case "blog": return "bg-pruksa-yellow/20 text-pruksa-ink";
      case "page": return "bg-black/5 text-black/60";
    }
  }

  const showDropdown = open && (focused || query.length > 0);
  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className={`relative ${isHero ? "w-full" : ""}`}>
      {/* Input */}
      <div
        className={`flex items-center gap-2 transition-all ${
          isHero
            ? `rounded-2xl bg-white px-5 py-4 shadow-lg ring-1 ring-black/5 ${focused ? "ring-2 ring-pruksa-green/40 shadow-xl" : ""}`
            : `rounded-xl bg-black/5 px-3 py-2 ${focused ? "bg-white ring-2 ring-pruksa-green/30 shadow-md" : "hover:bg-black/[0.07]"}`
        }`}
      >
        <Search size={isHero ? 20 : 16} className={`shrink-0 ${focused ? "text-pruksa-green" : "text-black/35"}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { setFocused(true); setOpen(true); }}
          placeholder={t ? "ค้นหาโครงการ ทำเล BTS สถานที่ บทความ..." : "Search projects, locations, BTS, places, articles..."}
          className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-black/40 ${
            isHero ? "text-base" : "text-sm"
          }`}
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="shrink-0 rounded-md p-1 text-black/35 hover:bg-black/5 hover:text-black/60"
          >
            <X size={14} />
          </button>
        )}
        {isHero && (
          <Link
            href="/rent"
            className="btn-primary shrink-0 rounded-xl px-5 py-2.5 text-sm"
          >
            <Search size={16} />
            {t ? "ค้นหา" : "Search"}
          </Link>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className={`absolute z-[9999] mt-2 max-h-[70vh] w-full overflow-y-auto rounded-2xl border border-black/5 bg-white shadow-2xl ${
            isHero ? "min-w-full" : "min-w-[380px] right-0 sm:min-w-[440px]"
          }`}
        >
          {/* Has results */}
          {results.length > 0 && (
            <div className="py-2">
              {Object.entries(grouped).map(([type, group]) => (
                <div key={type}>
                  <div className="px-4 pb-1 pt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-black/35">{group.label}</p>
                  </div>
                  {group.items.map((item, i) => (
                    <button
                      key={`${type}-${i}`}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-pruksa-green/5"
                      onClick={() => handleSelect(item)}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${getItemColor(item)}`}
                        style={
                          item.color
                            ? { background: item.color + "15", color: item.color }
                            : undefined
                        }
                      >
                        {getItemIcon(item)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-black/85">{item.label}</p>
                        <p className="truncate text-xs text-black/45">{item.sublabel}</p>
                      </div>
                      {item.price && (
                        <span className="shrink-0 text-xs font-semibold text-pruksa-green">{item.price}</span>
                      )}
                      <ChevronRight size={13} className="shrink-0 text-black/20" />
                    </button>
                  ))}
                </div>
              ))}
              {/* View all on /rent */}
              <div className="border-t px-4 py-3">
                <Link
                  href="/rent"
                  className="flex items-center justify-center gap-2 rounded-lg bg-pruksa-green/5 py-2.5 text-xs font-semibold text-pruksa-green hover:bg-pruksa-green/10"
                  onClick={() => setOpen(false)}
                >
                  <Search size={13} />
                  {t ? `ดูผลลัพธ์ทั้งหมดสำหรับ "${query}"` : `View all results for "${query}"`}
                </Link>
              </div>
            </div>
          )}

          {/* Empty state with query */}
          {query.length > 0 && results.length === 0 && (
            <div className="px-6 py-10 text-center">
              <Search size={28} className="mx-auto text-black/15" />
              <p className="mt-3 text-sm font-medium text-black/50">
                {t ? `ไม่พบผลลัพธ์สำหรับ "${query}"` : `No results for "${query}"`}
              </p>
              <p className="mt-1 text-xs text-black/35">
                {t ? "ลองค้นหาด้วยคำอื่น เช่น ชื่อโครงการ สถานี หรือทำเล" : "Try searching for a project name, station or location"}
              </p>
            </div>
          )}

          {/* Quick links when empty */}
          {query.length === 0 && (
            <div className="py-2">
              {/* Popular searches */}
              <div className="px-4 pb-2 pt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-black/35">
                  {t ? "ค้นหายอดนิยม" : "Popular Searches"}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 px-4 pb-3">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-black/60 transition hover:bg-pruksa-green/10 hover:text-pruksa-green"
                    onClick={() => { setQuery(term); setOpen(true); }}
                  >
                    {term}
                  </button>
                ))}
              </div>
              {/* Quick links */}
              <div className="border-t px-4 pb-2 pt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-black/35">
                  {t ? "ลัดไปยัง" : "Quick Links"}
                </p>
              </div>
              {quickLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-pruksa-green/5"
                  onClick={() => setOpen(false)}
                >
                  <span className={`grid h-8 w-8 place-items-center rounded-lg text-white ${link.color}`}>
                    <link.icon size={14} />
                  </span>
                  <span className="text-sm font-medium text-black/70">{link.label}</span>
                  <ChevronRight size={13} className="ml-auto text-black/20" />
                </Link>
              ))}

              {/* Top projects */}
              <div className="border-t px-4 pb-2 pt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-black/35">
                  {t ? "โครงการยอดนิยม" : "Top Projects"}
                </p>
              </div>
              {projects.slice(0, 3).map((p) => (
                <Link
                  key={p.slug}
                  href={`/rent/${p.slug}`}
                  className="flex items-center gap-3 px-4 py-2 transition hover:bg-pruksa-green/5"
                  onClick={() => setOpen(false)}
                >
                  <img src={p.image} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name[locale]}</p>
                    <p className="truncate text-xs text-black/45">{p.location[locale]}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-pruksa-green">{baht(p.priceMin)}/mo</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
