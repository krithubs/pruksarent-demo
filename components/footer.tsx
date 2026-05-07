"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { copy } from "@/lib/i18n";
import { useApp } from "./app-providers";

export function Footer() {
  const { locale } = useApp();
  const t = copy[locale];

  return (
    <footer className="mt-16 bg-pruksa-green text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div>
          <h2 className="text-xl font-semibold">Pruksa Rental</h2>
          <p className="mt-3 text-sm leading-7 text-white/80">
            {locale === "th"
              ? "แพลตฟอร์มรวมบ้านเช่าจาก Pruksa พร้อมค้นหา เปรียบเทียบ และจองออนไลน์"
              : "A rental platform for Pruksa homes with search, compare and online booking."}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Menu</h3>
          <div className="mt-4 grid gap-2 text-sm text-white/80">
            <Link href="/rent">{t.rent}</Link>
            <Link href="/promotions">{t.promotions}</Link>
            <Link href="/blog">{t.blog}</Link>
            <Link href="/about">{t.about}</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">{t.contact}</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/80">
            <span className="flex items-center gap-2"><Phone size={16} />1739</span>
            <span className="flex items-center gap-2"><Mail size={16} />rent@pruksa.com</span>
            <span>Pruksa Real Estate, Bangkok</span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Social</h3>
          <div className="mt-4 flex gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15"><Facebook size={18} /></span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15"><Instagram size={18} /></span>
          </div>
          <p className="mt-6 text-xs text-white/65">PDPA Policy | Cookie Policy | Terms of Service</p>
        </div>
      </div>
      <div className="border-t border-white/15 py-4 text-center text-xs text-white/70">
        © 2026 Pruksa Rental Demo. Phase 1 proposal prototype.
      </div>
    </footer>
  );
}
