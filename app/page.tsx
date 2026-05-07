"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Home, Search, TrainFront, Trees, type LucideIcon } from "lucide-react";
import { blogs, projects, promotions } from "@/lib/data";
import { baht, copy, livingTypeLabels } from "@/lib/i18n";
import type { LivingType } from "@/lib/types";
import { useApp } from "@/components/app-providers";
import { MapPreview } from "@/components/map-preview";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";

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
      <section className="relative overflow-hidden pruksa-aurora">
        <div className="absolute inset-0 -z-10 premium-grid opacity-60" />
        <div className="container-page grid min-h-[680px] items-center gap-10 py-12 lg:grid-cols-[1fr_520px]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow">Pruksa Rental Website</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl">
              {locale === "th" ? "เช่าบ้านในแบบที่คุณเป็น" : "Rent the home that fits your life"}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/68">
              {locale === "th"
                ? "ค้นหาโครงการเช่าของ Pruksa ครบทุก Living Type พร้อม Lead, Favorite, Compare และ Booking Flow ในเว็บเดียว"
                : "Search Pruksa rental projects across living types with lead capture, favorites, compare and booking in one experience."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/rent" className="btn-primary"><Search size={18} />{t.findHome}</Link>
              <Link href="/about" className="btn-secondary">{locale === "th" ? "ดูภาพรวมระบบ" : "View system overview"}</Link>
            </div>
          </motion.div>
          <div className="glass float-soft overflow-hidden rounded-[28px] p-3">
            <div className="image-sheen rounded-2xl">
              <img src="https://static.pruksa.com/R-Desktop-2304x1296.jpg" alt="Pruksa rental home" className="h-[420px] w-full rounded-2xl object-cover" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-black/40 p-5 text-white backdrop-blur">
                <p className="text-sm text-white/75">Campaign-ready hero · image/video support</p>
                <h2 className="mt-1 text-2xl font-semibold">Well Living Rental Experience</h2>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-black/5 text-center">
              <div className="p-4"><strong>12</strong><p className="text-xs text-black/60">Projects</p></div>
              <div className="p-4"><strong>72</strong><p className="text-xs text-black/60">Mock units</p></div>
              <div className="p-4"><strong>1739</strong><p className="text-xs text-black/60">Contact</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page -mt-20 relative z-10">
        <div className="glass rounded-2xl p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            {[t.btsMrt, t.location, t.nearMe, t.mapView].map((label, index) => (
              <button key={label} className={`rounded-lg px-4 py-2 text-sm font-semibold ${index === 0 ? "bg-pruksa-green text-white" : "bg-black/5"}`}>{label}</button>
            ))}
          </div>
          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
            <label className="relative">
              <Search className="absolute left-3 top-3.5 text-black/40" size={18} />
              <input className="input pl-10" placeholder={locale === "th" ? "ค้นหาทำเล โครงการ รถไฟฟ้า หรือสถานศึกษา" : "Search location, project, transit or school"} />
            </label>
            <select className="input"><option>{t.allTypes}</option>{Object.entries(livingTypeLabels).map(([key, value]) => <option key={key}>{value[locale]}</option>)}</select>
            <select className="input"><option>{t.budget}: ฿5k-฿100k+</option><option>{baht(15000)} - {baht(30000)}</option><option>{baht(30000)}+</option></select>
            <input className="input" type="date" aria-label={t.moveIn} />
            <Link href="/rent" className="btn-primary"><Search size={18} />{t.findHome}</Link>
          </div>
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
        <div className="rounded-2xl bg-pruksa-teal p-8 text-white md:flex md:items-center md:justify-between">
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
