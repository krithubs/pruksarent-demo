"use client";

import Link from "next/link";
import { ArrowRight, Building2, Home, Search, TrainFront, Trees, type LucideIcon } from "lucide-react";
import { blogs, projects, promotions, PROJECT_IMAGES } from "@/lib/data";
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
  condo: Building2,
};

const typeDescriptions: Record<LivingType, { th: string; en: string }> = {
  condo: { th: "ห้องชุดพร้อมอยู่ ใจกลางเมือง ใกล้รถไฟฟ้า", en: "Ready-to-live units in the city center, near BTS/MRT" },
  apartment: { th: "ห้องพักตกแต่งครบ เข้าอยู่ได้ทันที", en: "Fully furnished rooms, move in right away" },
  "single-house": { th: "บ้านเดี่ยวพร้อมสนามหญ้า พื้นที่ส่วนตัวเต็มที่", en: "Detached homes with gardens and full privacy" },
  townhome: { th: "ทาวน์โฮมหน้ากว้าง จอดรถสะดวก ใกล้ชุมชน", en: "Wide-frontage townhomes with easy parking" },
};

// Pick a dedicated hero image per type (not from round-robin)
const typeHeroImages: Record<LivingType, string> = {
  condo: PROJECT_IMAGES.condo[1],
  apartment: PROJECT_IMAGES.apartment[0],
  "single-house": PROJECT_IMAGES["single-house"][1],
  townhome: PROJECT_IMAGES.townhome[0],
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
        <div className="mb-10 text-center">
          <p className="eyebrow">Living Type</p>
          <h2 className="mt-2 text-3xl font-semibold">{locale === "th" ? "เลือกที่อยู่ตามไลฟ์สไตล์" : "Choose by living type"}</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-black/50">{locale === "th" ? "เลือกประเภทที่อยู่อาศัยที่เหมาะกับรูปแบบชีวิตของคุณ" : "Select the property type that matches your lifestyle"}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(livingTypeLabels) as LivingType[]).map((type) => {
            const Icon = typeIcons[type];
            const count = counts[type] ?? 0;
            return (
              <Link href={`/rent?type=${type}`} key={type} className="group relative overflow-hidden rounded-2xl">
                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={typeHeroImages[type]}
                    alt={livingTypeLabels[type][locale]}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                    <Icon size={20} />
                  </span>
                  <h3 className="text-lg font-semibold text-white">{livingTypeLabels[type][locale]}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{typeDescriptions[type][locale]}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {count} {locale === "th" ? "โครงการ" : "projects"}
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition group-hover:bg-white/25">
                      <ArrowRight size={14} />
                    </span>
                  </div>
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
