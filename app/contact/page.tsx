"use client";

import { Mail, MapPin, Phone, QrCode } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { MapPreview } from "@/components/map-preview";
import { useApp } from "@/components/app-providers";
import { Reveal } from "@/components/reveal";

export default function ContactPage() {
  const { locale } = useApp();

  return (
    <div>
      <section className="container-page py-12">
        <div className="relative overflow-hidden rounded-2xl bg-black p-8 text-white shadow-soft">
          <img src="https://static.pruksa.com/Pruksa_KV-Well-Living_Baner-2304x1296px.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
          <div className="relative z-10 max-w-2xl py-24">
            <p className="text-sm font-semibold uppercase text-white/70">Contact Pruksa</p>
            <h1 className="mt-3 text-5xl font-semibold">{locale === "th" ? "ติดต่อเรา" : "Contact Us"}</h1>
            <p className="mt-5 text-lg leading-8 text-white/85">{locale === "th" ? "ติดต่อฝ่ายขาย ข้อมูลโครงการ หรือฝ่ายบริการลูกค้า เราจะตอบกลับโดยเร็ว" : "Reach out for sales, project information or customer support."}</p>
          </div>
        </div>
      </section>
      <Reveal className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_420px]">
        <div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="card p-5"><MapPin className="text-pruksa-green" /><h2 className="mt-4 font-semibold">Pruksa Real Estate Public Company Limited</h2><p className="mt-2 text-sm leading-6 text-black/60">2534/160 New Petchburi Road, Bangkok 10310</p></div>
            <div className="card p-5"><Phone className="text-pruksa-green" /><h2 className="mt-4 font-semibold">1739</h2><p className="mt-2 text-sm leading-6 text-black/60">Pruksa Contact Center</p></div>
            <div className="card p-5"><Mail className="text-pruksa-green" /><h2 className="mt-4 font-semibold">rent@pruksa.com</h2><p className="mt-2 text-sm leading-6 text-black/60">General rental enquiry</p></div>
            <div className="card p-5"><QrCode className="text-pruksa-green" /><h2 className="mt-4 font-semibold">LINE @pruksarent</h2><div className="mt-3 grid h-24 w-24 place-items-center rounded-lg bg-black/5 text-xs">QR</div></div>
          </div>
          <div className="mt-8"><MapPreview compact /></div>
        </div>
        <aside className="glass h-fit rounded-2xl p-5 lg:sticky lg:top-24"><LeadForm /></aside>
      </Reveal>
    </div>
  );
}
