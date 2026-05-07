"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { copy } from "@/lib/i18n";
import { useApp } from "./app-providers";

export function Footer() {
  const { locale } = useApp();
  const t = copy[locale];

  return (
    <footer className="mt-16 text-white" style={{ backgroundColor: "#4D4D4D" }}>
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
              <img src="https://static.pruksa.com/static/favicons/apple-touch-icon.png" alt="Pruksa" className="h-7 w-7 object-contain" />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-semibold">PRUKSA</span>
              <span className="block text-xs font-medium text-white/60">Rental Experience</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-white/70">
            {locale === "th"
              ? "แพลตฟอร์มรวมบ้านเช่าจาก Pruksa พร้อมค้นหา เปรียบเทียบ และจองออนไลน์"
              : "A rental platform for Pruksa homes with search, compare and online booking."}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Menu</h3>
          <div className="mt-4 grid gap-2.5 text-sm">
            <Link href="/rent" className="text-white/80 transition hover:text-white">{t.rent}</Link>
            <Link href="/promotions" className="text-white/80 transition hover:text-white">{t.promotions}</Link>
            <Link href="/blog" className="text-white/80 transition hover:text-white">{t.blog}</Link>
            <Link href="/about" className="text-white/80 transition hover:text-white">{t.about}</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">{t.contact}</h3>
          <div className="mt-4 grid gap-3 text-sm">
            <span className="flex items-center gap-2.5 text-white/80"><Phone size={15} className="text-white/50" />1739</span>
            <span className="flex items-center gap-2.5 text-white/80"><Mail size={15} className="text-white/50" />rent@pruksa.com</span>
            <span className="text-white/60">Pruksa Real Estate, Bangkok</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Social</h3>
          <div className="mt-4 flex gap-3">
            <span className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"><Facebook size={18} /></span>
            <span className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"><Instagram size={18} /></span>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/45">
            <span className="cursor-pointer transition hover:text-white/70">PDPA Policy</span>
            <span>·</span>
            <span className="cursor-pointer transition hover:text-white/70">Cookie Policy</span>
            <span>·</span>
            <span className="cursor-pointer transition hover:text-white/70">Terms of Service</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © 2026 Pruksa Rental Demo. Phase 1 proposal prototype.
      </div>
    </footer>
  );
}
