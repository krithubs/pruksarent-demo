"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Facebook, Link2, Quote, Twitter } from "lucide-react";
import { blogs, getBlog } from "@/lib/data";
import { useApp } from "@/components/app-providers";
import { Reveal } from "@/components/reveal";

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = getBlog(params.slug);
  const { locale } = useApp();
  if (!post) notFound();
  const related = blogs.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <article>
      <section className="container-page py-10">
        <p className="text-sm text-black/50">Home / Blog / {post.title[locale]}</p>
        <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight">{post.title[locale]}</h1>
        <p className="mt-4 text-sm text-black/60">{post.category} · {post.minutes} min read</p>
        <div className="image-sheen mt-8 rounded-2xl"><img src={post.image} alt="" className="h-[460px] w-full rounded-2xl object-cover" /></div>
      </section>
      <Reveal className="container-page grid gap-10 lg:grid-cols-[1fr_260px]">
        <div className="prose max-w-none">
          <p className="text-lg leading-9 text-black/70">{post.excerpt[locale]}</p>
          <p className="mt-6 leading-8 text-black/70">
            {locale === "th"
              ? "การเลือกบ้านเช่าที่เหมาะสมควรเริ่มจากภาพรวมการใช้ชีวิตจริง ทั้งเวลาเดินทาง งบประมาณต่อเดือน พื้นที่ที่ต้องการ และบริการหลังเข้าอยู่ เว็บไซต์เดโมนี้จำลองวิธีที่ลูกค้าค้นหา เปรียบเทียบ และส่งข้อมูลจองได้ภายในเส้นทางเดียว"
              : "Choosing a rental home should start with real lifestyle needs: commute, monthly budget, space and service after move-in. This demo models how customers search, compare and submit a booking request in one journey."}
          </p>
          <blockquote className="my-8 rounded-2xl bg-pruksa-green/10 p-6 text-xl font-semibold leading-9 text-pruksa-green">
            <Quote className="mb-3" />{locale === "th" ? "เว็บเช่าที่ดีต้องช่วยให้ลูกค้าตัดสินใจได้เร็ว และส่งต่อข้อมูลให้ทีมขายได้ครบ" : "A good rental website helps customers decide faster and sends complete data to sales."}
          </blockquote>
          <img src="https://images.unsplash.com/photo-1554224154-26032fced8bd?auto=format&fit=crop&w=1200&q=80" alt="" className="my-8 rounded-2xl" />
          <p className="leading-8 text-black/70">
            {locale === "th" ? "ใน Phase 2 ข้อมูลจากบทความสามารถบริหารผ่าน CMS และเชื่อมต่อ Datalayer เพื่อวิเคราะห์ความสนใจของผู้เช่าในแต่ละกลุ่มได้" : "In Phase 2, article content can be managed through CMS and connected to the Datalayer to analyze renter interests by segment."}
          </p>
        </div>
        <aside className="h-fit rounded-2xl bg-black/[0.03] p-5 lg:sticky lg:top-24">
          <p className="font-semibold">Share</p>
          <div className="mt-4 flex gap-2">
            <button className="btn-secondary px-3"><Facebook size={16} /></button>
            <button className="btn-secondary px-3"><Twitter size={16} /></button>
            <button className="btn-secondary px-3"><Link2 size={16} /></button>
          </div>
        </aside>
      </Reveal>
      <section className="container-page py-14">
        <h2 className="text-2xl font-semibold">{locale === "th" ? "บทความที่เกี่ยวข้อง" : "Related articles"}</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {related.map((item) => <Link href={`/blog/${item.slug}`} key={item.slug} className="card overflow-hidden"><img src={item.image} className="h-40 w-full object-cover" alt="" /><div className="p-4 font-semibold">{item.title[locale]}</div></Link>)}
        </div>
      </section>
    </article>
  );
}
