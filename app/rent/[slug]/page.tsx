"use client";

import { notFound } from "next/navigation";
import { Download, Eye, Heart, PlayCircle, Ruler, Star, Video } from "lucide-react";
import { useState } from "react";
import { getProject } from "@/lib/data";
import { baht, copy, livingTypeLabels } from "@/lib/i18n";
import type { Unit } from "@/lib/types";
import { BookingModal } from "@/components/booking-modal";
import { LeadForm } from "@/components/lead-form";
import { MapPreview } from "@/components/map-preview";
import { useApp } from "@/components/app-providers";
import { Reveal } from "@/components/reveal";

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  const { locale, favorites, toggleFavorite, compareUnits, toggleCompare } = useApp();
  const [bookingUnit, setBookingUnit] = useState<Unit | null>(null);

  if (!project) notFound();

  return (
    <div>
      <section className="container-page py-8">
        <p className="text-sm text-black/50">Home / Rent / {project.name[locale]}</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
          <div className="image-sheen rounded-2xl">
            <img src={project.image} alt={project.name[locale]} className="h-[470px] w-full rounded-2xl object-cover" />
            <div className="absolute bottom-6 left-6 rounded-2xl bg-white/85 p-5 shadow-soft backdrop-blur">
              <p className="text-xs font-semibold uppercase text-pruksa-green">Pruksa verified rental</p>
              <h2 className="mt-1 text-2xl font-semibold">{project.name[locale]}</h2>
            </div>
          </div>
          <div className="grid gap-4">
            {project.units.slice(0, 3).map((unit) => <div className="image-sheen rounded-2xl" key={unit.id}><img src={unit.image} alt="" className="h-[146px] w-full rounded-2xl object-cover" /></div>)}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="btn-secondary"><Eye size={16} />View 360°</button>
          <button className="btn-secondary"><PlayCircle size={16} />Watch video</button>
          <button className="btn-secondary"><Download size={16} />Brochure</button>
        </div>
      </section>

      <section className="container-page grid gap-10 py-8 lg:grid-cols-[1fr_360px]">
        <Reveal>
          <span className="badge bg-pruksa-green/10 text-pruksa-green">{livingTypeLabels[project.type][locale]}</span>
          <h1 className="mt-4 text-4xl font-semibold">{project.name[locale]}</h1>
          <p className="mt-3 text-black/65">{project.location[locale]} · {project.area}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            <div className="card p-4"><strong>{baht(project.priceMin)}</strong><p className="text-xs text-black/60">Starting rent</p></div>
            <div className="card p-4"><strong>{project.units.filter((unit) => unit.available).length}</strong><p className="text-xs text-black/60">Available</p></div>
            <div className="card p-4"><strong>{project.amenities.length}</strong><p className="text-xs text-black/60">Amenities</p></div>
            <div className="card p-4"><strong>4.8</strong><p className="text-xs text-black/60">Reviews</p></div>
          </div>

          <div className="mt-10 border-b border-black/10">
            {["Overview", "Floor Plans", "Amenities", "Location", "Reviews", copy[locale].availableUnits].map((tab) => (
              <button key={tab} className="mr-5 border-b-2 border-transparent py-4 text-sm font-semibold first:border-pruksa-green first:text-pruksa-green">{tab}</button>
            ))}
          </div>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold">{copy[locale].availableUnits}</h2>
            <p className="mt-2 text-sm text-black/60">{locale === "th" ? "แสดงข้อมูล Unit ว่างพร้อมจำนวนผู้สนใจและดีลพิเศษ" : "Available units with social proof and special deals."}</p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {project.units.map((unit) => {
                const favId = `unit:${unit.id}`;
                const isFav = favorites.includes(favId);
                const isCompare = compareUnits.some((item) => item.id === unit.id);
                return (
                  <article key={unit.id} className="card group overflow-hidden">
                    <div className="image-sheen"><img src={unit.image} alt={unit.id} className="h-48 w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                    <div className="p-5">
                      <div className="flex justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{unit.id}</h3>
                          <p className="mt-1 text-sm text-black/60"><Ruler size={14} className="inline" /> {unit.size} sqm · {unit.bedrooms} bed · Floor {unit.floor}</p>
                        </div>
                        <button className={`grid h-10 w-10 place-items-center rounded-full ${isFav ? "bg-pruksa-orange text-white" : "bg-black/5"}`} onClick={() => toggleFavorite(favId)}>
                          <Heart size={17} fill={isFav ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <p className="mt-4 text-xl font-semibold">{baht(unit.rent)}<span className="text-sm font-normal text-black/60">/mo</span></p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="badge bg-pruksa-yellow/25 text-black"><Eye size={13} /> {unit.viewing} people viewing</span>
                        {unit.special && <span className="badge bg-pruksa-orange text-white"><Star size={13} /> Special deal</span>}
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <button className="btn-primary flex-1" onClick={() => setBookingUnit(unit)}>{copy[locale].bookNow}</button>
                        <button className={`btn-secondary ${isCompare ? "border-pruksa-green text-pruksa-green" : ""}`} onClick={() => toggleCompare(unit)}>
                          {copy[locale].compare}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="mb-5 text-2xl font-semibold">{locale === "th" ? "ทำเลและสถานที่ใกล้เคียง" : "Location and nearby places"}</h2>
            <MapPreview compact />
          </section>
        </Reveal>
        <aside className="glass h-fit rounded-2xl p-5 lg:sticky lg:top-24">
          <LeadForm />
          <button className="btn-primary mt-5 w-full" onClick={() => setBookingUnit(project.units[0])}><Video size={17} />{copy[locale].bookNow}</button>
        </aside>
      </section>
      <BookingModal unit={bookingUnit} onClose={() => setBookingUnit(null)} />
    </div>
  );
}
