import type { LivingType, Locale } from "./types";

export const livingTypeLabels: Record<LivingType, Record<Locale, string>> = {
  apartment: { th: "อพาร์ทเม้นท์", en: "Apartment" },
  "single-house": { th: "บ้านเดี่ยว", en: "Single House" },
  townhome: { th: "ทาวน์โฮม", en: "Townhome" },
  condo: { th: "คอนโด", en: "Condo" }
};

export const copy = {
  th: {
    rent: "เช่า",
    promotions: "โปรโมชัน",
    blog: "บทความ",
    about: "เกี่ยวกับเรา",
    contact: "ติดต่อเรา",
    signIn: "เข้าสู่ระบบ",
    findHome: "ค้นหาที่พัก",
    viewProject: "ดูโครงการ",
    bookNow: "จองเลย",
    leadTitle: "ให้เจ้าหน้าที่ติดต่อกลับ",
    compare: "เปรียบเทียบ",
    favorite: "รายการโปรด",
    allTypes: "ทุกประเภท",
    budget: "งบประมาณ",
    moveIn: "วันย้ายเข้า",
    mapView: "แผนที่",
    nearMe: "ใกล้ฉัน",
    location: "ทำเล",
    btsMrt: "BTS/MRT",
    availableUnits: "ยูนิตว่าง",
    success: "ส่งข้อมูลสำเร็จ",
    cookie: "เว็บไซต์นี้ใช้คุกกี้เพื่อปรับปรุงประสบการณ์และวัดผลแคมเปญตาม PDPA",
    acceptAll: "ยอมรับทั้งหมด",
    reject: "ปฏิเสธ",
    customize: "ตั้งค่า"
  },
  en: {
    rent: "Rent",
    promotions: "Promotions",
    blog: "Blog",
    about: "About",
    contact: "Contact",
    signIn: "Sign In",
    findHome: "Find your home",
    viewProject: "View Project",
    bookNow: "Book Now",
    leadTitle: "Request a call back",
    compare: "Compare",
    favorite: "Favorites",
    allTypes: "All types",
    budget: "Budget",
    moveIn: "Move-in date",
    mapView: "Map View",
    nearMe: "Near Me",
    location: "Location",
    btsMrt: "BTS/MRT",
    availableUnits: "Available Units",
    success: "Submitted successfully",
    cookie: "This site uses cookies to improve experience and measure campaigns under PDPA.",
    acceptAll: "Accept All",
    reject: "Reject",
    customize: "Customize"
  }
};

export function baht(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);
}
