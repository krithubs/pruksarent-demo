import blogsJson from "@/data/blogs.json";
import projectsJson from "@/data/projects.json";
import promotionsJson from "@/data/promotions.json";
import type { BlogPost, Project, Promotion, Unit } from "./types";

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
  units: makeUnits(project)
}));

export const promotions = promotionsJson as Promotion[];
export const blogs = blogsJson as BlogPost[];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getPromotion(slug: string) {
  return promotions.find((promotion) => promotion.slug === slug);
}

export function getBlog(slug: string) {
  return blogs.find((blog) => blog.slug === slug);
}
