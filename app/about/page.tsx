"use client";

import Link from "next/link";
import {
  Building2,
  CalendarCheck,
  CheckCircle2,
  HeartHandshake,
  Home,
  MapPin,
  Search,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { projects } from "@/lib/data";
import { livingTypeLabels } from "@/lib/i18n";
import { useApp } from "@/components/app-providers";
import { Reveal } from "@/components/reveal";

export default function AboutPage() {
  const { locale } = useApp();
  const t = locale === "th";

  const totalUnits = projects.reduce((sum, p) => sum + p.units.length, 0);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="pruksa-aurora relative overflow-hidden">
        <div className="container-page grid min-h-[560px] items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow">{t ? "เกี่ยวกับเรา" : "About Us"}</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              {t ? (
                <>PRUKSA <span className="text-pruksa-green">Rental</span> Experience</>
              ) : (
                <>PRUKSA <span className="text-pruksa-green">Rental</span> Experience</>
              )}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-black/65">
              {t
                ? "แพลตฟอร์มเช่าที่อยู่อาศัยครบวงจรจาก Pruksa Real Estate ให้คุณค้นหา เลือก เปรียบเทียบ และจองบ้านเช่าคุณภาพได้ในที่เดียว มั่นใจได้ในทุกขั้นตอน"
                : "A complete rental experience by Pruksa Real Estate. Search, compare and book quality homes in one place — with confidence at every step."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/rent" className="btn-primary">
                <Search size={16} />
                {t ? "ค้นหาบ้านเช่า" : "Find Your Home"}
              </Link>
              <Link href="/contact" className="btn-secondary">
                {t ? "ติดต่อเรา" : "Contact Us"}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="glass float-soft overflow-hidden rounded-[28px] p-3">
              <div className="image-sheen rounded-2xl">
                <img
                  src="https://static.pruksa.com/static/images/about-pruksa/global/banner-desktop.png"
                  className="h-80 w-full rounded-2xl object-cover"
                  alt="Pruksa Living"
                />
              </div>
              <div className="grid grid-cols-3 divide-x divide-black/5 text-center">
                <div className="p-5">
                  <strong className="text-2xl">30+</strong>
                  <p className="text-xs text-black/60">{t ? "ปีแห่งความไว้วางใจ" : "Years of Trust"}</p>
                </div>
                <div className="p-5">
                  <strong className="text-2xl">{projects.length}</strong>
                  <p className="text-xs text-black/60">{t ? "โครงการให้เช่า" : "Rental Projects"}</p>
                </div>
                <div className="p-5">
                  <strong className="text-2xl">{totalUnits}+</strong>
                  <p className="text-xs text-black/60">{t ? "ยูนิตพร้อมอยู่" : "Units Available"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <Reveal className="section container-page">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{t ? "เราคือใคร" : "Who We Are"}</p>
          <h2 className="mt-3 text-3xl font-semibold">{t ? "พฤกษา เรียลเอสเตท" : "Pruksa Real Estate"}</h2>
          <p className="mt-6 text-lg leading-8 text-black/60">
            {t
              ? "พฤกษา เรียลเอสเตท เป็นหนึ่งในผู้พัฒนาอสังหาริมทรัพย์ชั้นนำของประเทศไทย ก่อตั้งมากว่า 30 ปี ครอบคลุมโครงการบ้านเดี่ยว ทาวน์โฮม คอนโด และอพาร์ทเม้นท์ ภายใต้มาตรฐานคุณภาพที่ลูกค้าไว้วางใจ Pruksa Rental Experience คือบริการเช่าที่อยู่อาศัยจากโครงการ Pruksa โดยตรง เพื่อให้คุณเข้าถึงบ้านคุณภาพในราคาที่เหมาะสม"
              : "Pruksa Real Estate is one of Thailand's leading property developers with over 30 years of experience. Our portfolio spans single houses, townhomes, condominiums, and apartments — all built to trusted quality standards. Pruksa Rental Experience brings these quality homes directly to renters at fair prices."}
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {[
            { icon: Building2, value: "670+", label: t ? "โครงการทั้งหมด" : "Total Projects" },
            { icon: Home, value: "500K+", label: t ? "ครอบครัวที่ไว้วางใจ" : "Families Served" },
            { icon: MapPin, value: "77", label: t ? "จังหวัดทั่วไทย" : "Provinces Nationwide" },
            { icon: Star, value: "4.7", label: t ? "คะแนนรีวิว" : "Average Rating" },
          ].map((stat) => (
            <div className="card p-6 text-center" key={stat.label}>
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-pruksa-green/10 text-pruksa-green">
                <stat.icon size={22} />
              </span>
              <p className="mt-4 text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-sm text-black/55">{stat.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── Rental Categories ── */}
      <Reveal className="section bg-black/[0.025]">
        <div className="container-page">
          <p className="eyebrow">{t ? "ประเภทที่อยู่อาศัย" : "Property Types"}</p>
          <h2 className="mt-2 text-3xl font-semibold">{t ? "เลือกสไตล์ที่เหมาะกับคุณ" : "Find Your Perfect Style"}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(livingTypeLabels).map(([key, labels]) => {
              const count = projects.filter((p) => p.type === key).length;
              return (
                <Link href={`/rent?type=${key}`} className="card group p-6" key={key}>
                  <Home className="text-pruksa-green transition group-hover:scale-110" />
                  <h3 className="mt-4 text-lg font-semibold">{labels[locale]}</h3>
                  <p className="mt-2 text-sm leading-6 text-black/55">
                    {t ? "เหมาะกับรูปแบบชีวิต งบประมาณ และจำนวนสมาชิกที่แตกต่างกัน" : "Fits different lifestyles, budgets and household needs."}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-pruksa-green">{count} {t ? "โครงการ" : "projects"}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* ── Why Rent With Us ── */}
      <Reveal className="section container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t ? "ทำไมต้องเช่ากับเรา" : "Why Rent With Pruksa"}</p>
          <h2 className="mt-2 text-3xl font-semibold">{t ? "จุดเด่นบริการเช่าจาก Pruksa" : "What Makes Us Different"}</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Shield,
              color: "bg-pruksa-green",
              title: t ? "คุณภาพจากผู้พัฒนาโดยตรง" : "Quality Direct from Developer",
              text: t
                ? "บ้านเช่าทุกหลังผ่านการตรวจสอบมาตรฐาน Pruksa ก่อนส่งมอบ มั่นใจในคุณภาพวัสดุและการก่อสร้าง"
                : "Every rental unit is inspected to Pruksa standards before handover. Confidence in build quality guaranteed.",
            },
            {
              icon: ShoppingBag,
              color: "bg-pruksa-orange",
              title: t ? "ราคาเป็นธรรม โปร่งใส" : "Fair & Transparent Pricing",
              text: t
                ? "ราคาเช่าตรงจากเจ้าของโครงการ ไม่ผ่านนายหน้า ไม่มีค่าใช้จ่ายแอบแฝง"
                : "Rent directly from the developer. No agent fees, no hidden costs.",
            },
            {
              icon: HeartHandshake,
              color: "bg-pruksa-teal",
              title: t ? "ดูแลตลอดสัญญา" : "Full-Term Support",
              text: t
                ? "ทีมดูแลลูกค้าพร้อมช่วยเหลือตั้งแต่เลือกยูนิตจนถึงย้ายออก พร้อมบริการซ่อมบำรุง"
                : "Our team supports you from unit selection to move-out, including maintenance service.",
            },
            {
              icon: TrendingUp,
              color: "bg-pruksa-yellow text-pruksa-ink",
              title: t ? "สิ่งอำนวยความสะดวกครบ" : "Full Amenities",
              text: t
                ? "สระว่ายน้ำ ฟิตเนส ที่จอดรถ ระบบรักษาความปลอดภัย 24 ชม. ครบทุกโครงการ"
                : "Pool, gym, parking, 24-hour security — complete facilities in every project.",
            },
            {
              icon: Sparkles,
              color: "bg-gradient-to-br from-pruksa-green to-pruksa-teal",
              title: t ? "โปรโมชันพิเศษ" : "Exclusive Promotions",
              text: t
                ? "ดีลเช่าราคาพิเศษ ฟรีค่าส่วนกลาง และโปรย้ายเข้าฟรี สำหรับลูกค้าที่จองผ่านเว็บไซต์"
                : "Special rental deals, free common fees and move-in promos for online bookings.",
            },
            {
              icon: Users,
              color: "bg-gradient-to-br from-pruksa-orange to-pruksa-yellow",
              title: t ? "ชุมชนคุณภาพ" : "Quality Community",
              text: t
                ? "อยู่ร่วมกับเพื่อนบ้านที่มีคุณภาพชีวิตใกล้เคียงกัน ในโครงการที่บริหารจัดการอย่างเป็นระบบ"
                : "Live in a well-managed community with neighbors who share similar lifestyle standards.",
            },
          ].map((item) => (
            <div className="card p-6" key={item.title}>
              <span className={`grid h-12 w-12 place-items-center rounded-xl text-white ${item.color}`}>
                <item.icon size={22} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-black/60">{item.text}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── How It Works ── */}
      <Reveal className="section bg-black/[0.025]">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">{t ? "ขั้นตอนง่ายๆ" : "How It Works"}</p>
            <h2 className="mt-2 text-3xl font-semibold">{t ? "3 ขั้นตอน สู่บ้านใหม่" : "3 Steps to Your New Home"}</h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Search,
                title: t ? "ค้นหาและเปรียบเทียบ" : "Search & Compare",
                text: t
                  ? "ค้นหาโครงการตามทำเล BTS/MRT สถานที่ใกล้เคียง หรืองบประมาณ เปรียบเทียบยูนิตได้สูงสุด 4 ยูนิต"
                  : "Find projects by location, BTS/MRT, nearby places or budget. Compare up to 4 units side-by-side.",
              },
              {
                step: "02",
                icon: CalendarCheck,
                title: t ? "นัดชมและจอง" : "Visit & Book",
                text: t
                  ? "นัดเข้าชมยูนิตจริง จากนั้นจองออนไลน์ได้ทันที หรือให้เจ้าหน้าที่ติดต่อกลับ"
                  : "Schedule a viewing, then book online instantly or request a callback from our team.",
              },
              {
                step: "03",
                icon: Building2,
                title: t ? "ทำสัญญาและย้ายเข้า" : "Sign & Move In",
                text: t
                  ? "ทำสัญญาเช่า ชำระค่าเช่างวดแรก และย้ายเข้าอยู่ได้เลย พร้อมทีมดูแลตลอดสัญญา"
                  : "Sign the lease, pay your first month and move in. Our team supports you throughout.",
              },
            ].map((item, i) => (
              <div className="relative" key={item.step}>
                {i < 2 && (
                  <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-gradient-to-r from-pruksa-green/30 to-transparent md:block" />
                )}
                <div className="card relative z-10 p-8 text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-pruksa-green text-white shadow-lg shadow-pruksa-green/25">
                    <item.icon size={24} />
                  </span>
                  <span className="mt-4 inline-block rounded-full bg-pruksa-green/10 px-3 py-1 text-xs font-bold text-pruksa-green">
                    {t ? "ขั้นตอนที่" : "STEP"} {item.step}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-black/60">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Testimonials ── */}
      <Reveal className="section container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t ? "เสียงจากลูกค้า" : "What Renters Say"}</p>
          <h2 className="mt-2 text-3xl font-semibold">{t ? "ลูกค้าเช่าพูดถึงเรา" : "Trusted by Renters"}</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              name: t ? "คุณสมชาย ก." : "Somchai K.",
              role: t ? "ผู้เช่า The Tree สุขุมวิท" : "Renter at The Tree Sukhumvit",
              text: t
                ? "ค้นหาง่าย เปรียบเทียบได้ชัดเจน จองผ่านเว็บไซต์สะดวกมาก ย้ายเข้าภายใน 2 สัปดาห์"
                : "Easy to search, clear comparison, convenient online booking. Moved in within 2 weeks.",
              stars: 5,
            },
            {
              name: t ? "คุณพิมพ์ ว." : "Pim W.",
              role: t ? "ผู้เช่า Chapter One รัชดา" : "Renter at Chapter One Ratchada",
              text: t
                ? "ราคาเช่าตรงจากพฤกษา ไม่ต้องผ่านนายหน้า ประหยัดค่าใช้จ่ายได้เยอะ ทีมดูแลก็ดีมาก"
                : "Direct pricing from Pruksa, no agent fees. Saved a lot and the support team is excellent.",
              stars: 5,
            },
            {
              name: t ? "คุณเจมส์ ล." : "James L.",
              role: t ? "ผู้เช่า Pleno เอกมัย" : "Renter at Pleno Ekamai",
              text: t
                ? "ฟีเจอร์แผนที่ค้นหาใกล้ BTS ช่วยเลือกบ้านได้ตรงใจ ส่วนกลางครบ ฟิตเนส สระว่ายน้ำ ที่จอดรถ"
                : "The BTS map search helped me find the perfect home. Full facilities — gym, pool, parking.",
              stars: 4,
            },
          ].map((review) => (
            <div className="card p-6" key={review.name}>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < review.stars ? "fill-pruksa-yellow text-pruksa-yellow" : "text-black/15"} />
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-black/65">&ldquo;{review.text}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3 border-t pt-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-pruksa-green/10 text-sm font-bold text-pruksa-green">
                  {review.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-xs text-black/50">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── CTA ── */}
      <Reveal className="section">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-pruksa-green px-6 py-16 text-center text-white sm:px-12">
            {/* Decorative blobs */}
            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-pruksa-yellow/20 blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-semibold sm:text-4xl">
                {t ? "พร้อมหาบ้านเช่าที่ใช่แล้วหรือยัง?" : "Ready to Find Your Perfect Home?"}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                {t
                  ? "เริ่มค้นหาโครงการเช่าจาก Pruksa วันนี้ ด้วยแผนที่ BTS/MRT ฟิลเตอร์ครบ และจองได้ทันที"
                  : "Start browsing Pruksa rental projects today with BTS/MRT map search, full filters and instant booking."}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/rent"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-semibold text-pruksa-green shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Search size={16} />
                  {t ? "ค้นหาบ้านเช่า" : "Browse Rental Projects"}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-7 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10"
                >
                  <CheckCircle2 size={16} />
                  {t ? "ให้เจ้าหน้าที่ติดต่อกลับ" : "Request a Callback"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
