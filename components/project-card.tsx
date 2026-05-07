"use client";

import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { baht, copy, livingTypeLabels } from "@/lib/i18n";
import type { Project } from "@/lib/types";
import { useApp } from "./app-providers";

export function ProjectCard({ project, horizontal = false }: { project: Project; horizontal?: boolean }) {
  const { locale, favorites, toggleFavorite } = useApp();
  const favoriteId = `project:${project.slug}`;
  const active = favorites.includes(favoriteId);

  return (
    <article className={`card group overflow-hidden ${horizontal ? "grid md:grid-cols-[260px_1fr]" : ""}`}>
      <div className={`image-sheen ${horizontal ? "md:h-full" : ""}`}>
        <img src={project.image} alt={project.name[locale]} className={`h-56 w-full object-cover transition duration-700 group-hover:scale-105 ${horizontal ? "md:h-full" : ""}`} />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="badge bg-white/90 text-pruksa-green shadow-sm backdrop-blur">{project.brand}</span>
          <span className="badge bg-pruksa-orange text-white">Live</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="badge bg-pruksa-green/10 text-pruksa-green">{livingTypeLabels[project.type][locale]}</span>
            <h3 className="mt-3 text-xl font-semibold">{project.name[locale]}</h3>
            <p className="mt-2 flex items-center gap-1 text-sm text-black/60"><MapPin size={15} />{project.location[locale]}</p>
          </div>
          <button
            className={`grid h-10 w-10 place-items-center rounded-full border ${active ? "border-pruksa-orange bg-pruksa-orange text-white" : "border-black/10"}`}
            onClick={() => toggleFavorite(favoriteId)}
            aria-label="Favorite"
          >
            <Heart size={18} fill={active ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="mt-4 rounded-xl bg-gradient-to-r from-pruksa-green/10 to-pruksa-yellow/20 p-3">
          <p className="text-sm font-semibold">{baht(project.priceMin)} - {baht(project.priceMax)}/mo</p>
          <p className="mt-1 text-xs text-black/55">❤ {project.favorites + (active ? 1 : 0)} favorited · {project.units.filter((unit) => unit.available).length} available</p>
        </div>
        <Link href={`/rent/${project.slug}`} className="btn-primary mt-5 w-full">{copy[locale].viewProject}</Link>
      </div>
    </article>
  );
}
