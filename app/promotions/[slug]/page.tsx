"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getPromotion } from "@/lib/data";
import { copy, livingTypeLabels } from "@/lib/i18n";
import { LeadForm } from "@/components/lead-form";
import { ProjectCard } from "@/components/project-card";
import { useApp } from "@/components/app-providers";
import { Reveal } from "@/components/reveal";

export default function PromotionDetailPage({ params }: { params: { slug: string } }) {
  const promo = getPromotion(params.slug);
  const { locale } = useApp();
  if (!promo) notFound();
  const eligibleProjects = projects.filter((project) => project.type === promo.type).slice(0, 4);

  return (
    <div>
      <section className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="text-sm text-black/50">Home / Promotions / {promo.title[locale]}</p>
          <span className="badge mt-6 bg-pruksa-orange text-white">{promo.badge}</span>
          <h1 className="mt-4 text-5xl font-semibold leading-tight">{promo.title[locale]}</h1>
          <p className="mt-5 text-lg leading-8 text-black/65">{promo.summary[locale]}</p>
          <div className="image-sheen mt-8 rounded-2xl"><img src={promo.image} alt="" className="h-[420px] w-full rounded-2xl object-cover" /></div>
        </div>
        <aside className="glass h-fit rounded-2xl p-5 lg:sticky lg:top-24">
          <LeadForm compact />
          <Link href="/rent" className="btn-primary mt-5 w-full">{copy[locale].bookNow}</Link>
        </aside>
      </section>
      <section className="container-page py-10">
        <h2 className="text-2xl font-semibold">{locale === "th" ? "เงื่อนไขโปรโมชัน" : "Terms and conditions"}</h2>
        <p className="mt-3 rounded-xl bg-black/[0.03] p-5 leading-7 text-black/65">{promo.terms[locale]}</p>
      </section>
      <section className="container-page py-10">
        <p className="eyebrow">{livingTypeLabels[promo.type][locale]}</p>
        <h2 className="mt-2 text-2xl font-semibold">{locale === "th" ? "โครงการที่ร่วมรายการ" : "Eligible projects"}</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {eligibleProjects.map((project, index) => <Reveal key={project.slug} delay={index * 0.04}><ProjectCard project={project} /></Reveal>)}
        </div>
      </section>
    </div>
  );
}
