"use client";

import Link from "next/link";
import { useState } from "react";
import { blogs } from "@/lib/data";
import { useApp } from "@/components/app-providers";
import { Reveal } from "@/components/reveal";

const categories = ["All", "Lifestyle", "Tips", "Market Insights", "How-to"];

export default function BlogPage() {
  const { locale } = useApp();
  const [category, setCategory] = useState("All");
  const filtered = category === "All" ? blogs : blogs.filter((post) => post.category === category);

  return (
    <div>
      <section className="container-page py-16">
        <p className="text-sm text-black/50">Home / Blog</p>
        <h1 className="mt-3 text-5xl font-semibold">{locale === "th" ? "บทความ" : "Blog"}</h1>
        <p className="mt-4 max-w-2xl text-black/65">
          {locale === "th" ? "บทความสำหรับผู้เช่า ครอบคลุมไลฟ์สไตล์ เคล็ดลับ ตลาด และวิธีการจอง" : "Rental guides covering lifestyle, tips, market insights and how-to content."}
        </p>
      </section>
      <section className="container-page">
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm font-semibold ${category === item ? "bg-pruksa-green text-white" : "bg-black/5"}`}>{item}</button>)}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, index) => (
            <Reveal key={post.slug} delay={Math.min(index * 0.04, 0.2)}>
            <Link href={`/blog/${post.slug}`} className="card group overflow-hidden">
              <div className="image-sheen"><img src={post.image} alt={post.title[locale]} className="h-56 w-full object-cover transition duration-700 group-hover:scale-105" /></div>
              <div className="p-5">
                <span className="text-xs font-semibold text-pruksa-teal">{post.category} · {post.minutes} min</span>
                <h2 className="mt-3 text-xl font-semibold">{post.title[locale]}</h2>
                <p className="mt-2 text-sm leading-6 text-black/60">{post.excerpt[locale]}</p>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
