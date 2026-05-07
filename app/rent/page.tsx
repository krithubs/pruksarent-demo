"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Grid2X2, List, Map, SlidersHorizontal } from "lucide-react";
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

export default function RentPage() {
  const { locale } = useApp();
  const [type, setType] = useState<"all" | LivingType>("all");
  const [view, setView] = useState<"grid" | "list" | "map">("grid");
  const [sort, setSort] = useState("popular");
  const [visibleSlugs, setVisibleSlugs] = useState<string[] | null>(null);

  const filtered = useMemo(() => {
    const result = type === "all" ? [...projects] : projects.filter((project) => project.type === type);
    return result.sort((a, b) => sort === "price-low" ? a.priceMin - b.priceMin : sort === "price-high" ? b.priceMax - a.priceMax : b.popularity - a.popularity);
  }, [type, sort]);

  const mapProjects = useMemo(() => {
    return type === "all" ? projects : projects.filter((p) => p.type === type);
  }, [type]);

  const handleProjectsInView = useCallback((slugs: string[]) => {
    setVisibleSlugs(slugs);
  }, []);

  // When in map view, show cards for projects visible on map
  const mapFilteredProjects = useMemo(() => {
    if (!visibleSlugs) return filtered;
    return filtered.filter((p) => visibleSlugs.includes(p.slug));
  }, [filtered, visibleSlugs]);

  return (
    <div>
      <section className="pruksa-aurora py-12">
        <div className="container-page">
          <p className="text-sm text-black/50">Home / Rent</p>
          <h1 className="mt-3 text-4xl font-semibold">{locale === "th" ? "ค้นหาโครงการเช่า" : "Rental project list"}</h1>
        </div>
      </section>
      <section className={`container-page grid gap-8 py-10 ${view === "map" ? "" : "lg:grid-cols-[280px_1fr]"}`}>
        {view !== "map" && (
          <aside className="glass h-fit rounded-2xl p-5 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 font-semibold"><SlidersHorizontal size={18} />Filters</div>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-medium">Living Type
                <select className="input" value={type} onChange={(event) => setType(event.target.value as "all" | LivingType)}>
                  <option value="all">{copy[locale].allTypes}</option>
                  {(Object.keys(livingTypeLabels) as LivingType[]).map((key) => <option key={key} value={key}>{livingTypeLabels[key][locale]}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">Brand<select className="input"><option>All brands</option><option>The Tree</option><option>Chapter</option><option>Pruksa Ville</option></select></label>
              <label className="grid gap-2 text-sm font-medium">Bedrooms<select className="input"><option>Any</option><option>1</option><option>2</option><option>3+</option></select></label>
              <div className="grid gap-2 text-sm font-medium">Amenities
                {["pool", "gym", "parking", "pet-friendly", "BTS/MRT"].map((item) => <label key={item} className="flex gap-2 font-normal"><input type="checkbox" />{item}</label>)}
              </div>
            </div>
          </aside>
        )}
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-black/60">
              {view === "map"
                ? (visibleSlugs ? visibleSlugs.length : filtered.length) + (locale === "th" ? " โครงการในแผนที่" : " projects on map")
                : filtered.length + " projects found"}
            </p>
            <div className="flex gap-2">
              {view !== "map" && (
                <select className="input w-44" value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="popular">Popularity</option>
                  <option value="price-low">Price low/high</option>
                  <option value="price-high">Price high/low</option>
                </select>
              )}
              {view === "map" && (
                <select className="input w-44" value={type} onChange={(event) => setType(event.target.value as "all" | LivingType)}>
                  <option value="all">{copy[locale].allTypes}</option>
                  {(Object.keys(livingTypeLabels) as LivingType[]).map((key) => <option key={key} value={key}>{livingTypeLabels[key][locale]}</option>)}
                </select>
              )}
              <button className={`btn-secondary px-3 ${view === "grid" ? "border-pruksa-green text-pruksa-green" : ""}`} onClick={() => setView("grid")}><Grid2X2 size={16} /></button>
              <button className={`btn-secondary px-3 ${view === "list" ? "border-pruksa-green text-pruksa-green" : ""}`} onClick={() => setView("list")}><List size={16} /></button>
              <button className={`btn-secondary px-3 ${view === "map" ? "border-pruksa-green text-pruksa-green" : ""}`} onClick={() => setView("map")}><Map size={16} /></button>
            </div>
          </div>
          {view === "map" ? (
            <div>
              <Reveal>
                <InteractiveMap projects={mapProjects} onProjectsInView={handleProjectsInView} />
              </Reveal>
              {mapFilteredProjects.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-4 text-sm font-semibold text-black/60">
                    {locale === "th" ? "โครงการที่แสดงบนแผนที่" : "Projects visible on map"}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {mapFilteredProjects.map((project, index) => (
                      <Reveal key={project.slug} delay={Math.min(index * 0.035, 0.18)}>
                        <ProjectCard project={project} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={view === "grid" ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3" : "grid gap-5"}>
              {filtered.map((project, index) => (
                <Reveal key={project.slug} delay={Math.min(index * 0.035, 0.18)}>
                  <ProjectCard project={project} horizontal={view === "list"} />
                </Reveal>
              ))}
            </div>
          )}
          {view !== "map" && (
            <div className="mt-8 flex justify-center gap-2">
              {[1, 2, 3].map((page) => <button key={page} className={`h-10 w-10 rounded-lg ${page === 1 ? "bg-pruksa-green text-white" : "bg-black/5"}`}>{page}</button>)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
