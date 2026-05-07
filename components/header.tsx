"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Languages, Menu, Sparkles, X } from "lucide-react";
import { useApp } from "./app-providers";
import { copy } from "@/lib/i18n";
import { SmartSearch } from "./smart-search";

const nav = [
  { href: "/rent", key: "rent" },
  { href: "/promotions", key: "promotions" },
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const { locale, setLocale, favorites } = useApp();
  const t = copy[locale];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock scroll on mobile when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-transparent px-3 py-3">
      <div className="container-page glass flex h-16 items-center justify-between gap-4 rounded-2xl px-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold text-pruksa-ink">
          <span className="grid h-10 w-10 place-items-center">
            <img src="/Logo_pruksa-thai_cs2.png" alt="Pruksa" className="h-10 w-10 object-contain" />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block">PRUKSA</span>
            <span className="block text-xs font-medium text-pruksa-green">Rental Experience</span>
          </span>
        </Link>

        {/* Search (desktop) */}
        <div className="hidden flex-1 justify-end lg:flex lg:max-w-xs xl:max-w-sm">
          <div className="w-full">
            <SmartSearch variant="header" />
          </div>
        </div>

        {/* Right actions */}
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

          {/* Hamburger */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className={`grid h-10 w-10 place-items-center rounded-xl border transition ${open ? "border-pruksa-green bg-pruksa-green/5 text-pruksa-green" : "border-black/10 bg-white text-black/70 hover:border-black/20"}`}
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Dropdown menu */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-xl"
                >
                  {/* Nav links */}
                  <div className="p-2">
                    {nav.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${active ? "bg-pruksa-green/10 text-pruksa-green" : "text-black/70 hover:bg-black/[0.03] hover:text-black"}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-pruksa-green" : "bg-transparent"}`} />
                          {t[item.key]}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Divider + extras */}
                  <div className="border-t border-black/5 p-2">
                    <button
                      onClick={() => { setLocale(locale === "th" ? "en" : "th"); setOpen(false); }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-black/60 transition hover:bg-black/[0.03] hover:text-black sm:hidden"
                    >
                      <Languages size={15} />
                      {locale === "th" ? "English" : "ภาษาไทย"}
                    </button>
                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center gap-3 rounded-xl bg-pruksa-green/5 px-4 py-3 text-sm font-medium text-pruksa-green transition hover:bg-pruksa-green/10"
                    >
                      <Sparkles size={15} />
                      {locale === "th" ? "สนใจจอง / ติดต่อเรา" : "Book / Contact us"}
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
