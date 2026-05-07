"use client";

import Link from "next/link";
import { CalendarCheck, LineChart, MessageCircle, Search } from "lucide-react";
import { useApp } from "./app-providers";

export function FloatingActions() {
  const { locale } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-30 hidden flex-col gap-3 lg:flex">
      <Link href="/rent" className="glass group flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold">
        <span className="relative grid h-9 w-9 place-items-center rounded-full bg-pruksa-green text-white pulse-ring"><Search size={17} /></span>
        {locale === "th" ? "ค้นหาบ้านเช่า" : "Find rental"}
      </Link>
      <Link href="/promotions" className="glass flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-pruksa-yellow text-pruksa-ink"><CalendarCheck size={17} /></span>
        {locale === "th" ? "ดีลพิเศษ" : "Deals"}
      </Link>
    </div>
  );
}
