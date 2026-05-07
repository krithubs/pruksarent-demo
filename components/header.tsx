"use client";

import Link from "next/link";
import { Heart, Languages, Menu, Sparkles, UserRound } from "lucide-react";
import { useApp } from "./app-providers";
import { copy } from "@/lib/i18n";

const nav = [
  { href: "/rent", key: "rent" },
  { href: "/promotions", key: "promotions" },
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" }
] as const;

export function Header() {
  const { locale, setLocale, favorites } = useApp();
  const t = copy[locale];

  return (
    <header className="sticky top-0 z-40 bg-transparent px-3 py-3">
      <div className="container-page glass flex h-16 items-center justify-between gap-4 rounded-2xl px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-pruksa-ink">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
            <img src="https://static.pruksa.com/static/favicons/apple-touch-icon.png" alt="Pruksa" className="h-7 w-7 object-contain" />
          </span>
          <span className="leading-tight">
            <span className="block">PRUKSA</span>
            <span className="block text-xs font-medium text-pruksa-green">Rental Experience</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-black/70 transition hover:text-pruksa-green">
              {t[item.key]}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            className="btn-secondary hidden px-3 py-2 sm:inline-flex"
            onClick={() => setLocale(locale === "th" ? "en" : "th")}
            aria-label="Toggle language"
          >
            <Languages size={16} />
            {locale === "th" ? "EN" : "TH"}
          </button>
          <Link href="/rent" className="btn-secondary px-3 py-2" aria-label="Favorites">
            <Heart size={16} />
            <span className="rounded-full bg-pruksa-orange px-2 py-0.5 text-xs text-white">{favorites.length}</span>
          </Link>
          <button className="btn-primary hidden px-4 py-2 sm:inline-flex">
            <Sparkles size={16} />
            {locale === "th" ? "สนใจจอง" : "Interested"}
          </button>
          <button className="btn-secondary hidden px-3 py-2 xl:inline-flex">
            <UserRound size={16} />
            {t.signIn}
          </button>
          <button className="btn-secondary px-3 py-2 lg:hidden" aria-label="Menu">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
