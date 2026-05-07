import blogsJson from "@/data/blogs.json";
import projectsJson from "@/data/projects.json";
import promotionsJson from "@/data/promotions.json";
import type { BlogPost, LivingType, Project, Promotion, Unit } from "./types";

// ── Type-based project images ──
// Each type has multiple images for variety; assigned round-robin per project.
const PROJECT_IMAGES: Record<LivingType, string[]> = {
  condo: [
    // คอนโดสูงกรุงเทพ — ตึกสูง, สระว่ายน้ำบนดาดฟ้า, วิวเมือง
    "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
  ],
  apartment: [
    // อพาร์ทเม้นท์ — ห้องพักตกแต่งโมเดิร์น, ห้องนั่งเล่น, วิวระเบียง
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  ],
  "single-house": [
    // บ้านเดี่ยว — หมู่บ้านจัดสรร, สนามหญ้า, สไตล์โมเดิร์น tropical
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  ],
  townhome: [
    // ทาวน์โฮม — บ้านแถวโมเดิร์น, หน้าบ้านกว้าง
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
  ],
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1200&q=80";

// Counter per type for round-robin assignment
const typeCounters: Record<string, number> = {};

function getProjectImage(type: LivingType): string {
  const images = PROJECT_IMAGES[type];
  if (!images || images.length === 0) return FALLBACK_IMAGE;
  const idx = typeCounters[type] ?? 0;
  typeCounters[type] = idx + 1;
  return images[idx % images.length];
}

const unitImages = [
  "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80"
];

function makeUnits(project: Omit<Project, "units">): Unit[] {
  return Array.from({ length: 6 }).map((_, index) => {
    const rentStep = Math.max(1800, Math.round((project.priceMax - project.priceMin) / 6));
    return {
      id: `${project.slug.toUpperCase().slice(0, 3)}-${1201 + index}`,
      projectSlug: project.slug,
      image: unitImages[index % unitImages.length],
      size: project.type === "single-house" ? 140 + index * 12 : project.type === "townhome" ? 95 + index * 8 : 28 + index * 7,
      bedrooms: project.bedrooms[Math.min(index % project.bedrooms.length, project.bedrooms.length - 1)],
      rent: project.priceMin + rentStep * index,
      floor: 8 + index,
      available: index !== 4,
      special: index % 2 === 0,
      viewing: 8 + index * 3
    };
  });
}

export const projects: Project[] = (projectsJson as Omit<Project, "units">[]).map((project) => ({
  ...project,
  image: getProjectImage(project.type),
  units: makeUnits(project),
}));

export const promotions = promotionsJson as Promotion[];
export const blogs = blogsJson as BlogPost[];

export { PROJECT_IMAGES, FALLBACK_IMAGE };

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getPromotion(slug: string) {
  return promotions.find((promotion) => promotion.slug === slug);
}

export function getBlog(slug: string) {
  return blogs.find((blog) => blog.slug === slug);
}
