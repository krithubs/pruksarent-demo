"use client";

import Link from "next/link";
import { Building2, Home, Search, TrainFront, Trees, type LucideIcon } from "lucide-react";
import { blogs, projects, promotions } from "@/lib/data";
import { baht, copy, livingTypeLabels } from "@/lib/i18n";
import type { LivingType } from "@/lib/types";
import { useApp } from "@/components/app-providers";
import { HeroBanner } from "@/components/hero-banner";
import { MapPreview } from "@/components/map-preview";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { SmartSearch } from "@/components/smart-search";

const typeIcons: Record<LivingType, LucideIcon> = {
  apartment: Building2,
  "single-house": Home,
  townhome: Trees,
  condo: Building2
};

export default function HomePage() {
  const { locale } = useApp();
  const t = copy[locale];
  const counts = projects.reduce<Record<string, number>>((acc, project) => {
    acc[project.type] = (acc[project.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      {/* ── Fullscreen Hero Banner ── */}
      <HeroBanner />

      {/* ── Smart Search Bar ── */}
      <section className="container-page relative z-10 -mt-16 sm:-mt-20">
        <div className="glass rounded-2xl p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {[t.btsMrt, t.location, t.nearMe, t.mapView].map((label, index) => (
                <button key={label} className={`rounded-lg px-3 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm ${index === 0 ? "bg-pruksa-green text-white" : "bg-black/5"}`}>{label}</button>
              ))}
            </div>
            <p className="hidden text-xs text-black/40 sm:block">{locale === "th" ? "ค้นหาได้ทุกอย่างในช่องเดียว" : "Search everything in one place"}</p>
          </div>
          <SmartSearch variant="hero" />
        </div>
      </section>

      <Reveal className="section container-page">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Living Type</p>
            <h2 className="mt-2 text-3xl font-semibold">{locale === "th" ? "เลือกที่อยู่ตามไลฟ์สไตล์" : "Choose by living type"}</h2>
          </div>
          <TrainFront className="text-pruksa-green" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {(Object.keys(livingTypeLabels) as LivingType[]).map((type) => {
            const Icon = typeIcons[type];
            const project = projects.find((item) => item.type === type)!;
            return (
              <Link href={`/rent?type=${type}`} key={type} className="card group overflow-hidden">
                <img src={project.image} alt="" className="h-36 w-full object-cover transition group-hover:scale-105" />
                <div className="p-5">
                  <Icon className="text-pruksa-green" />
                  <h3 className="mt-3 text-lg font-semibold">{livingTypeLabels[type][locale]}</h3>
                  <p className="text-sm text-black/60">{counts[type] ?? 0} projects</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Reveal>

      <Reveal className="section overflow-hidden bg-black/[0.025]">
        <div className="container-page">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="eyebrow">Featured Projects</p>
              <h2 className="mt-2 text-3xl font-semibold">{locale === "th" ? "โครงการแนะนำ" : "Featured projects"}</h2>
            </div>
            <Link href="/rent" className="btn-secondary">{t.viewProject}</Link>
          </div>
          <div className="hide-scrollbar scroll-mask flex gap-5 overflow-x-auto pb-4">
            {projects.slice(0, 8).map((project) => (
              <div className="min-w-[320px]" key={project.slug}><ProjectCard project={project} /></div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="section container-page grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow">Promotion</p>
          <h2 className="mt-2 text-3xl font-semibold">{locale === "th" ? "ข้อเสนอพิเศษ" : "Promotion highlights"}</h2>
          <div className="mt-6 grid gap-4">
            {promotions.slice(0, 3).map((promo) => (
              <Link href={`/promotions/${promo.slug}`} key={promo.slug} className="card group grid overflow-hidden sm:grid-cols-[160px_1fr]">
                <div className="image-sheen"><img src={promo.image} alt="" className="h-36 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-full" /></div>
                <div className="p-5">
                  <span className="badge bg-pruksa-orange text-white">{promo.badge}</span>
                  <h3 className="mt-3 font-semibold">{promo.title[locale]}</h3>
                  <p className="mt-2 text-sm text-black/60">{promo.summary[locale]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">Map Search</p>
          <h2 className="mt-2 text-3xl font-semibold">{locale === "th" ? "ค้นหาบนแผนที่" : "Explore on map"}</h2>
          <div className="mt-6"><MapPreview compact /></div>
        </div>
      </Reveal>

      <Reveal className="section container-page">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="eyebrow">Blog</p>
            <h2 className="mt-2 text-3xl font-semibold">{locale === "th" ? "บทความล่าสุด" : "Latest articles"}</h2>
          </div>
          <Link href="/blog" className="btn-secondary">{t.blog}</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {blogs.slice(0, 3).map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="card group overflow-hidden">
              <div className="image-sheen"><img src={post.image} alt="" className="h-48 w-full object-cover transition duration-700 group-hover:scale-105" /></div>
              <div className="p-5">
                <span className="text-xs font-semibold text-pruksa-teal">{post.category}</span>
                <h3 className="mt-2 font-semibold">{post.title[locale]}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{post.excerpt[locale]}</p>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>

      <section className="container-page">
        <div className="rounded-2xl p-8 text-white backdrop-blur-md md:flex md:items-center md:justify-between" style={{ backgroundColor: "#0A6B2C" }}>
          <div>
            <h2 className="text-2xl font-semibold">{locale === "th" ? "ต้องการข้อมูลเพิ่มเติม?" : "Need more information?"}</h2>
            <p className="mt-2 text-white/80">Phone 1739 · LINE @pruksarent · rent@pruksa.com</p>
          </div>
          <Link href="/contact" className="btn-primary mt-6 bg-white text-pruksa-green hover:bg-white/90 md:mt-0">{t.contact}</Link>
        </div>
      </section>
    </>
  );
}
