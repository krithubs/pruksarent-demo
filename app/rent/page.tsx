"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Grid2X2, List, Map, SlidersHorizontal, X } from "lucide-react";
import { projects } from "@/lib/data";
import { copy, livingTypeLabels } from "@/lib/i18n";
import type { LivingType } from "@/lib/types";
import { ProjectCard } from "@/components/project-card";
import { useApp } from "@/components/app-providers";
import { Reveal } from "@/components/reveal";

const InteractiveMap = dynamic(() => import("@/components/interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[600px] place-items-center rounded-2xl border border-black/10 bg-[#e8f1ed]">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-pruksa-green border-t-transparent" />
        <p className="mt-3 text-sm text-black/50">Loading map...</p>
      </div>
    </div>
  ),
});

const BRANDS = ["The Tree", "Chapter", "Plum", "Passorn", "Pruksa Ville", "Pleno", "The Privacy", "Baan Pruksa", "Pruksa Avenue", "Pruksa Living"] as const;
const BED_OPTS = ["any", "1", "2", "3+"] as const;
const AMENITIES = [
  { id: "pool", label: { th: "สระว่ายน้ำ", en: "Pool" } },
  { id: "gym", label: { th: "ฟิตเนส", en: "Gym" } },
  { id: "parking", label: { th: "ที่จอดรถ", en: "Parking" } },
  { id: "pet-friendly", label: { th: "เลี้ยงสัตว์ได้", en: "Pet-friendly" } },
  { id: "bts", label: { th: "ใกล้ BTS/MRT", en: "Near BTS/MRT" } },
] as const;

export default function RentPage() {
  const { locale } = useApp();
  const th = locale === "th";

  const [type, setType] = useState<"all" | LivingType>("all");

  // Read ?type= from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("type") as LivingType | null;
    if (t && t in livingTypeLabels) setType(t);
  }, []);
  const [brand, setBrand] = useState("all");
  const [bed, setBed] = useState("any");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [view, setView] = useState<"grid" | "list" | "map">("grid");
  const [sort, setSort] = useState("popular");
  const [visibleSlugs, setVisibleSlugs] = useState<string[] | null>(null);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sheet]);

  const activeCount = [type !== "all", brand !== "all", bed !== "any", amenities.length > 0].filter(Boolean).length;
  function clearAll() { setType("all"); setBrand("all"); setBed("any"); setAmenities([]); }
  function togAm(id: string) { setAmenities((p) => p.includes(id) ? p.filter((a) => a !== id) : [...p, id]); }

  const filtered = useMemo(() => {
    let r = [...projects];
    if (type !== "all") r = r.filter((p) => p.type === type);
    if (brand !== "all") r = r.filter((p) => p.brand === brand);
    if (bed !== "any") { const b = bed === "3+" ? 3 : Number(bed); r = r.filter((p) => bed === "3+" ? p.bedrooms.some((x) => x >= 3) : p.bedrooms.includes(b)); }
    if (amenities.length) r = r.filter((p) => amenities.every((a) => p.amenities.includes(a)));
    return r.sort((a, b) => sort === "price-low" ? a.priceMin - b.priceMin : sort === "price-high" ? b.priceMax - a.priceMax : b.popularity - a.popularity);
  }, [type, brand, bed, amenities, sort]);

  const mapProjects = useMemo(() => type === "all" ? projects : projects.filter((p) => p.type === type), [type]);
  const handleVis = useCallback((s: string[]) => setVisibleSlugs(s), []);
  const mapFiltered = useMemo(() => !visibleSlugs ? filtered : filtered.filter((p) => visibleSlugs.includes(p.slug)), [filtered, visibleSlugs]);

  // ── Shared filter panel ──
  function FilterPanel({ onApply }: { onApply?: () => void }) {
    return (
      <div className="grid gap-6">
        {/* Living Type — chip buttons */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-black/40">{th ? "ประเภทที่อยู่" : "Living Type"}</p>
          <div className="flex flex-wrap gap-2">
            <ChipBtn label={copy[locale].allTypes} active={type === "all"} onClick={() => setType("all")} />
            {(Object.keys(livingTypeLabels) as LivingType[]).map((k) => (
              <ChipBtn key={k} label={livingTypeLabels[k][locale]} active={type === k} onClick={() => setType(type === k ? "all" : k)} />
            ))}
          </div>
        </div>

        {/* Brand — chip buttons */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-black/40">{th ? "แบรนด์" : "Brand"}</p>
          <div className="flex flex-wrap gap-2">
            <ChipBtn label={th ? "ทุกแบรนด์" : "All brands"} active={brand === "all"} onClick={() => setBrand("all")} />
            {BRANDS.map((b) => (
              <ChipBtn key={b} label={b} active={brand === b} onClick={() => setBrand(brand === b ? "all" : b)} />
            ))}
          </div>
        </div>

        {/* Bedrooms — segmented control */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-black/40">{th ? "ห้องนอน" : "Bedrooms"}</p>
          <div className="inline-flex rounded-xl border border-black/10 bg-black/[0.02] p-1">
            {BED_OPTS.map((b) => (
              <button
                key={b}
                onClick={() => setBed(b)}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition ${bed === b ? "bg-pruksa-green text-white shadow-sm" : "text-black/55 hover:text-black"}`}
              >
                {b === "any" ? (th ? "ทั้งหมด" : "Any") : b}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities — checkbox list */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-black/40">{th ? "สิ่งอำนวยความสะดวก" : "Amenities"}</p>
          <div className="grid gap-1">
            {AMENITIES.map((a) => {
              const on = amenities.includes(a.id);
              return (
                <label
                  key={a.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 transition hover:bg-black/[0.02]"
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => togAm(a.id)}
                    className="h-4 w-4 shrink-0 cursor-pointer rounded border-black/20 accent-pruksa-green"
                  />
                  <span className={`text-sm ${on ? "font-medium text-pruksa-green" : "text-black/65"}`}>{a.label[locale]}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 border-t border-black/5 pt-5">
          <button onClick={clearAll} className="flex-1 rounded-xl border border-black/10 py-2.5 text-sm font-medium text-black/55 transition hover:border-black/20 hover:text-black">
            {th ? "ล้างทั้งหมด" : "Clear All"}
          </button>
          <button
            onClick={onApply}
            className="flex-1 rounded-xl bg-pruksa-green py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-pruksa-green/90"
          >
            {th ? "ดูผลลัพธ์" : "Apply"} ({filtered.length})
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="pruksa-aurora py-12">
        <div className="container-page">
          <p className="text-sm text-black/50">Home / Rent</p>
          <h1 className="mt-3 text-4xl font-semibold">{th ? "ค้นหาโครงการเช่า" : "Rental project list"}</h1>
        </div>
      </section>

      <section className={`container-page grid gap-8 py-10 ${view === "map" ? "" : "lg:grid-cols-[300px_1fr]"}`}>
        {/* ── Sidebar (desktop) ── */}
        {view !== "map" && (
          <aside className="hidden h-fit rounded-2xl border border-black/5 bg-white p-6 shadow-soft lg:sticky lg:top-24 lg:block">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-semibold"><SlidersHorizontal size={18} />{th ? "ตัวกรอง" : "Filters"}</div>
              {activeCount > 0 && (
                <button onClick={clearAll} className="text-xs font-medium text-pruksa-green hover:underline">{th ? "ล้างทั้งหมด" : "Clear all"}</button>
              )}
            </div>
            <FilterPanel />
          </aside>
        )}

        {/* ── Main content ── */}
        <div>
          {/* Toolbar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Mobile filter trigger */}
              <button
                className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium shadow-sm lg:hidden"
                onClick={() => setSheet(true)}
              >
                <SlidersHorizontal size={15} />
                {th ? "ตัวกรอง" : "Filters"}
                {activeCount > 0 && (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-pruksa-green text-[10px] font-bold text-white">{activeCount}</span>
                )}
              </button>
              <p className="text-sm text-black/60">
                {view === "map"
                  ? (visibleSlugs ? visibleSlugs.length : filtered.length) + (th ? " โครงการในแผนที่" : " projects on map")
                  : filtered.length + (th ? " โครงการ" : " projects found")}
              </p>
            </div>
            <div className="flex gap-2">
              {view !== "map" && (
                <select className="input w-44" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="popular">{th ? "ยอดนิยม" : "Popularity"}</option>
                  <option value="price-low">{th ? "ราคาต่ำ→สูง" : "Price low/high"}</option>
                  <option value="price-high">{th ? "ราคาสูง→ต่ำ" : "Price high/low"}</option>
                </select>
              )}
              {view === "map" && (
                <select className="input w-44" value={type} onChange={(e) => setType(e.target.value as "all" | LivingType)}>
                  <option value="all">{copy[locale].allTypes}</option>
                  {(Object.keys(livingTypeLabels) as LivingType[]).map((k) => <option key={k} value={k}>{livingTypeLabels[k][locale]}</option>)}
                </select>
              )}
              <button className={`btn-secondary px-3 ${view === "grid" ? "border-pruksa-green text-pruksa-green" : ""}`} onClick={() => setView("grid")}><Grid2X2 size={16} /></button>
              <button className={`btn-secondary px-3 ${view === "list" ? "border-pruksa-green text-pruksa-green" : ""}`} onClick={() => setView("list")}><List size={16} /></button>
              <button className={`btn-secondary px-3 ${view === "map" ? "border-pruksa-green text-pruksa-green" : ""}`} onClick={() => setView("map")}><Map size={16} /></button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && view !== "map" && (
            <div className="mb-5 flex flex-wrap gap-2">
              {type !== "all" && <ActiveChip label={livingTypeLabels[type][locale]} onRemove={() => setType("all")} />}
              {brand !== "all" && <ActiveChip label={brand} onRemove={() => setBrand("all")} />}
              {bed !== "any" && <ActiveChip label={bed + (th ? " ห้องนอน" : " bed")} onRemove={() => setBed("any")} />}
              {amenities.map((a) => <ActiveChip key={a} label={AMENITIES.find((x) => x.id === a)!.label[locale]} onRemove={() => togAm(a)} />)}
            </div>
          )}

          {/* Results */}
          {view === "map" ? (
            <div>
              <Reveal><InteractiveMap projects={mapProjects} onProjectsInView={handleVis} /></Reveal>
              {mapFiltered.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-4 text-sm font-semibold text-black/60">{th ? "โครงการที่แสดงบนแผนที่" : "Projects visible on map"}</h3>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {mapFiltered.map((p, i) => <Reveal key={p.slug} delay={Math.min(i * 0.035, 0.18)}><ProjectCard project={p} /></Reveal>)}
                  </div>
                </div>
              )}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <SlidersHorizontal size={36} className="mx-auto text-black/15" />
              <p className="mt-4 font-semibold text-black/50">{th ? "ไม่พบโครงการ" : "No projects found"}</p>
              <p className="mt-1 text-sm text-black/35">{th ? "ลองปรับตัวกรองใหม่" : "Try adjusting your filters"}</p>
              <button onClick={clearAll} className="mt-4 rounded-xl bg-pruksa-green/10 px-5 py-2 text-sm font-medium text-pruksa-green">{th ? "ล้างตัวกรอง" : "Clear filters"}</button>
            </div>
          ) : (
            <div className={view === "grid" ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3" : "grid gap-5"}>
              {filtered.map((p, i) => <Reveal key={p.slug} delay={Math.min(i * 0.035, 0.18)}><ProjectCard project={p} horizontal={view === "list"} /></Reveal>)}
            </div>
          )}
          {view !== "map" && filtered.length > 0 && (
            <div className="mt-8 flex justify-center gap-2">
              {[1, 2, 3].map((n) => <button key={n} className={`h-10 w-10 rounded-lg ${n === 1 ? "bg-pruksa-green text-white" : "bg-black/5"}`}>{n}</button>)}
            </div>
          )}
        </div>
      </section>

      {/* ── Mobile bottom sheet ── */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40" onClick={() => setSheet(false)} />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl"
            >
              <div className="sticky top-0 z-10 border-b bg-white px-5 pb-4 pt-3">
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-black/15" />
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-lg font-semibold"><SlidersHorizontal size={18} />{th ? "ตัวกรอง" : "Filters"}</span>
                  <button onClick={() => setSheet(false)} className="grid h-8 w-8 place-items-center rounded-full bg-black/5"><X size={16} /></button>
                </div>
              </div>
              <div className="p-5">
                <FilterPanel onApply={() => setSheet(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Chip button ── */
function ChipBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${active ? "border-pruksa-green bg-pruksa-green text-white shadow-sm" : "border-black/10 text-black/65 hover:border-black/20 hover:text-black"}`}
    >
      {label}
    </button>
  );
}

/* ── Active filter chip ── */
function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-pruksa-green/10 px-3 py-1 text-xs font-medium text-pruksa-green">
      {label}
      <button onClick={onRemove} className="hover:text-pruksa-green/60"><X size={12} /></button>
    </span>
  );
}
