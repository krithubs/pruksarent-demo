"use client";

import Link from "next/link";
import { promotions } from "@/lib/data";
import { livingTypeLabels } from "@/lib/i18n";
import { useApp } from "@/components/app-providers";
import { Reveal } from "@/components/reveal";

export default function PromotionsPage() {
  const { locale } = useApp();

  return (
    <div>
      <section className="pruksa-aurora py-16">
        <div className="container-page">
          <p className="text-sm text-black/50">Home / Promotions</p>
          <h1 className="mt-3 text-5xl font-semibold">{locale === "th" ? "โปรโมชัน" : "Promotions"}</h1>
          <p className="mt-4 max-w-2xl text-black/65">
            {locale === "th" ? "รวมดีลพิเศษตาม Living Type พร้อมดึงโครงการที่เกี่ยวข้องโดยไม่ต้องเพิ่มคอนเทนต์ซ้ำ" : "Special offers by living type with eligible projects pulled dynamically."}
          </p>
        </div>
      </section>
      <section className="container-page py-12">
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.values(livingTypeLabels).map((label) => <button className="rounded-full bg-black/5 px-4 py-2 text-sm font-semibold" key={label.en}>{label[locale]}</button>)}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo, index) => (
            <Reveal key={promo.slug} delay={Math.min(index * 0.04, 0.2)}>
            <Link href={`/promotions/${promo.slug}`} className="card group overflow-hidden">
              <div className="image-sheen"><img src={promo.image} alt={promo.title[locale]} className="h-60 w-full object-cover transition duration-700 group-hover:scale-105" /></div>
              <div className="p-5">
                <span className="badge bg-pruksa-orange text-white">{promo.badge}</span>
                <h2 className="mt-3 text-xl font-semibold">{promo.title[locale]}</h2>
                <p className="mt-2 text-sm leading-6 text-black/60">{promo.summary[locale]}</p>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
