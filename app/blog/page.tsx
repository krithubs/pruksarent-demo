"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { blogs } from "@/lib/data";
import { useApp } from "@/components/app-providers";
import { Reveal } from "@/components/reveal";

const categories = ["All", "Lifestyle", "Tips", "Market Insights", "How-to"];

export default function BlogPage() {
  const { locale } = useApp();
  const th = locale === "th";
  const [category, setCategory] = useState("All");
  const filtered = category === "All" ? blogs : blogs.filter((post) => post.category === category);

  // Featured = first post
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div>
      {/* Hero header */}
      <section className="pruksa-aurora py-16">
        <div className="container-page">
          <p className="text-sm text-black/50">Home / Blog</p>
          <h1 className="mt-3 text-4xl font-semibold">{th ? "บทความ" : "Blog"}</h1>
          <p className="mt-3 max-w-xl text-black/55">
            {th ? "บทความสำหรับผู้เช่า ครอบคลุมไลฟ์สไตล์ เคล็ดลับ ตลาด และวิธีการจอง" : "Rental guides covering lifestyle, tips, market insights and how-to content."}
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        {/* Category tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {categories.map((item) => {
            const active = category === item;
            return (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition ${
                  active
                    ? "border-pruksa-green bg-pruksa-green text-white"
                    : "border-black/10 bg-white text-black/60 hover:border-black/20 hover:text-black"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Featured post */}
        {featured && (
          <Reveal>
            <Link href={`/blog/${featured.slug}`} className="group mb-10 grid overflow-hidden rounded-2xl bg-white shadow-soft md:grid-cols-2">
              <div className="overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title[locale]}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 md:h-full"
                />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-10">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-pruksa-green/10 px-3 py-1 text-xs font-medium text-pruksa-green">{featured.category}</span>
                  <span className="flex items-center gap-1 text-xs text-black/40"><Clock size={12} />{featured.minutes} min</span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold leading-snug">{featured.title[locale]}</h2>
                <p className="mt-3 text-sm leading-relaxed text-black/55">{featured.excerpt[locale]}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-pruksa-green transition group-hover:gap-3">
                  {th ? "อ่านต่อ" : "Read more"} <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, index) => (
              <Reveal key={post.slug} delay={Math.min(index * 0.04, 0.2)}>
                <Link href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-soft transition hover:shadow-lg">
                  <div className="overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title[locale]}
                      className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-pruksa-teal/10 px-2.5 py-0.5 text-[11px] font-medium text-pruksa-teal">{post.category}</span>
                      <span className="flex items-center gap-1 text-[11px] text-black/40"><Clock size={11} />{post.minutes} min</span>
                    </div>
                    <h3 className="mt-3 font-semibold leading-snug">{post.title[locale]}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-black/50">{post.excerpt[locale]}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-pruksa-green transition group-hover:gap-2.5">
                      {th ? "อ่านต่อ" : "Read more"} <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg font-semibold text-black/40">{th ? "ไม่พบบทความ" : "No articles found"}</p>
            <button onClick={() => setCategory("All")} className="mt-3 text-sm font-medium text-pruksa-green">{th ? "ดูทั้งหมด" : "View all"}</button>
          </div>
        )}
      </section>
    </div>
  );
}
