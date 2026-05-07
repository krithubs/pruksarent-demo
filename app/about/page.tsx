"use client";

import { BarChart3, BookOpen, Building2, CalendarCheck, Database, Home, Search, ShieldCheck, Users } from "lucide-react";
import { projects } from "@/lib/data";
import { copy, livingTypeLabels } from "@/lib/i18n";
import { LeadForm } from "@/components/lead-form";
import { useApp } from "@/components/app-providers";
import { Reveal } from "@/components/reveal";

export default function AboutPage() {
  const { locale } = useApp();

  return (
    <div>
      <section className="container-page grid min-h-[560px] items-center gap-10 py-14 lg:grid-cols-[1fr_480px]">
        <div>
          <p className="eyebrow">About Pruksa Rental</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight">{locale === "th" ? "Pruksa Rental คืออะไร" : "What is Pruksa Rental?"}</h1>
          <p className="mt-6 text-lg leading-9 text-black/65">
            {locale === "th"
              ? "แพลตฟอร์มเช่าที่อยู่อาศัยสำหรับโครงการ Pruksa ที่ช่วยให้ลูกค้าค้นหา เลือกยูนิต ส่ง Lead และจองออนไลน์ได้ครบในเว็บไซต์เดียว"
              : "A rental platform for Pruksa projects where customers can search, choose units, submit leads and book online in one place."}
          </p>
        </div>
        <div className="glass float-soft overflow-hidden rounded-[28px] p-3">
          <div className="image-sheen rounded-2xl"><img src="https://static.pruksa.com/static/images/about-pruksa/global/banner-desktop.png" className="h-72 w-full rounded-2xl object-cover" alt="" /></div>
          <div className="grid grid-cols-3 divide-x divide-black/5 text-center">
            <div className="p-5"><strong>30+</strong><p className="text-xs text-black/60">Years</p></div>
            <div className="p-5"><strong>{projects.length}</strong><p className="text-xs text-black/60">Demo projects</p></div>
            <div className="p-5"><strong>72</strong><p className="text-xs text-black/60">Units</p></div>
          </div>
        </div>
      </section>

      <Reveal className="section bg-black/[0.025]">
        <div className="container-page">
          <p className="eyebrow">Categories</p>
          <h2 className="mt-2 text-3xl font-semibold">{locale === "th" ? "หมวดหมู่ในการเช่า" : "Rental categories"}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {Object.entries(livingTypeLabels).map(([key, labels]) => (
              <div className="card p-5" key={key}>
                <Home className="text-pruksa-green" />
                <h3 className="mt-4 font-semibold">{labels[locale]}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{locale === "th" ? "เหมาะกับรูปแบบชีวิต งบประมาณ และจำนวนสมาชิกที่แตกต่างกัน" : "Fits different lifestyle, budget and household needs."}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="section container-page">
        <p className="eyebrow">How it works</p>
        <h2 className="mt-2 text-3xl font-semibold">{locale === "th" ? "ค้นหา จอง และย้ายเข้า" : "Browse, book and move in"}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[Search, CalendarCheck, Building2].map((Icon, index) => (
            <div className="card p-6" key={index}>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-pruksa-green text-white"><Icon /></span>
              <h3 className="mt-5 text-xl font-semibold">{[locale === "th" ? "ค้นหาโครงการ" : "Browse homes", locale === "th" ? "จองออนไลน์" : "Book online", locale === "th" ? "ย้ายเข้าอยู่" : "Move in"][index]}</h3>
              <p className="mt-2 leading-7 text-black/60">{locale === "th" ? "เส้นทางผู้ใช้งานออกแบบให้ตัดสินใจเร็วและส่งต่อข้อมูลครบถ้วน" : "The journey is designed for fast decisions and complete data handoff."}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="section container-page">
        <p className="eyebrow">System & Data Flow</p>
        <h2 className="mt-2 text-3xl font-semibold">{locale === "th" ? "ภาพรวมการเชื่อมต่อระบบ" : "System and data flow"}</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-4">
          {[
            { icon: Users, title: "Ads / Web Traffic", text: "Google/Facebook campaigns drive users to Pruksa Rental." },
            { icon: BookOpen, title: "Lead & Booking", text: "Lead, iPlern lead and online booking requests are captured." },
            { icon: Database, title: "PMS / CRM / CDP", text: "Phase 2 API handoff to PMS, CRM, sales management and CDP." },
            { icon: BarChart3, title: "Datalayer", text: "Analytics events support retargeting and campaign optimization." }
          ].map((item) => (
            <div className="card p-5" key={item.title}>
              <item.icon className="text-pruksa-teal" />
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-black/60">{item.text}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="section bg-pruksa-teal text-white">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-sm font-semibold uppercase text-white/70">Scope of Works</p>
            <h2 className="mt-2 text-3xl font-semibold">{locale === "th" ? "ขอบเขตงาน Phase 1" : "Phase 1 scope"}</h2>
            <div className="mt-6 grid gap-4 text-white/85">
              <p><ShieldCheck className="mr-2 inline" />Frontend + CMS-ready structure, core rent functions, API placeholders and security notes.</p>
              <p><ShieldCheck className="mr-2 inline" />Hosting, domain and SSL for 1 year included as proposal scope placeholders.</p>
              <p><ShieldCheck className="mr-2 inline" />Free MA 1 year after go-live, excluding new CR functions.</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-5 text-pruksa-ink"><LeadForm compact /></div>
        </div>
      </Reveal>
    </div>
  );
}
