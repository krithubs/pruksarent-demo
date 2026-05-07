export type Locale = "th" | "en";
export type LivingType = "apartment" | "single-house" | "townhome" | "condo";

export type Localized = {
  th: string;
  en: string;
};

export type Unit = {
  id: string;
  projectSlug: string;
  image: string;
  size: number;
  bedrooms: number;
  rent: number;
  floor: number;
  available: boolean;
  special: boolean;
  viewing: number;
};

export type Project = {
  slug: string;
  name: Localized;
  area: string;
  location: Localized;
  type: LivingType;
  brand: string;
  priceMin: number;
  priceMax: number;
  bedrooms: number[];
  amenities: string[];
  lat: number;
  lng: number;
  favorites: number;
  popularity: number;
  image: string;
  units: Unit[];
};

export type Promotion = {
  slug: string;
  title: Localized;
  type: LivingType;
  badge: string;
  summary: Localized;
  terms: Localized;
  image: string;
};

export type BlogPost = {
  slug: string;
  category: string;
  title: Localized;
  excerpt: Localized;
  minutes: number;
  image: string;
};
