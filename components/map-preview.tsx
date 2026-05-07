"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { projects } from "@/lib/data";
import { copy } from "@/lib/i18n";
import { useApp } from "./app-providers";

export function MapPreview({ compact = false }: { compact?: boolean }) {
  const { locale } = useApp();

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-black/10 bg-[#e8f1ed] premium-grid shadow-soft ${compact ? "h-[360px]" : "h-[480px]"}`}>
      <div className="absolute inset-0 opacity-70" style={{
        backgroundImage:
          "linear-gradient(35deg, transparent 45%, rgba(41,110,109,.2) 46%, transparent 47%), linear-gradient(95deg, transparent 48%, rgba(91,167,48,.22) 49%, transparent 50%), linear-gradient(150deg, transparent 46%, rgba(0,0,0,.08) 47%, transparent 48%)",
        backgroundSize: "160px 160px, 220px 220px, 180px 180px"
      }} />
      <div className="glass absolute left-5 top-5 z-10 rounded-xl p-4">
        <p className="text-sm font-semibold">{copy[locale].mapView}</p>
        <p className="text-xs text-black/60">Bangkok project pins · BTS/MRT · malls · schools</p>
      </div>
      <div className="absolute bottom-5 left-5 z-10 flex flex-wrap gap-2">
        {["BTS", "MRT", "Mall", "School", "Hospital"].map((item) => (
          <span key={item} className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur">{item}</span>
        ))}
      </div>
      {projects.map((project, index) => (
        <Link
          href={`/rent/${project.slug}`}
          key={project.slug}
          className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${18 + (index % 6) * 13}%`, top: `${26 + Math.floor(index / 3) * 13}%` }}
        >
          <span className="relative grid h-10 w-10 place-items-center rounded-full bg-pruksa-orange text-white shadow-soft transition group-hover:scale-110 pulse-ring">
            <MapPin size={18} />
          </span>
          <span className="absolute left-8 top-8 hidden w-44 rounded-lg bg-white p-3 text-xs shadow-soft group-hover:block">
            <strong>{project.name[locale]}</strong><br />{project.location[locale]}
          </span>
        </Link>
      ))}
    </div>
  );
}
