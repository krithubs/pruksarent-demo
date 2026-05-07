"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Search, X, MapPin, Navigation, ChevronRight, TrainFront } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { baht, livingTypeLabels } from "@/lib/i18n";
import { useApp } from "./app-providers";
import type L from "leaflet";

const BANGKOK_CENTER: [number, number] = [13.74, 100.56];
const DEFAULT_ZOOM = 12;

// ----- Transit line data -----
type TransitStation = { name: { th: string; en: string }; lat: number; lng: number };
type TransitLine = {
  id: string;
  name: { th: string; en: string };
  color: string;
  stations: TransitStation[];
};

const TRANSIT_LINES: TransitLine[] = [
  {
    id: "bts-sukhumvit",
    name: { th: "BTS สายสุขุมวิท", en: "BTS Sukhumvit Line" },
    color: "#5C8A32",
    stations: [
      { name: { th: "คูคต", en: "Khu Khot" }, lat: 13.9328, lng: 100.6447 },
      { name: { th: "แยก คปอ.", en: "Royal Thai Air Force Museum" }, lat: 13.9183, lng: 100.6277 },
      { name: { th: "พิพิธภัณฑ์กองทัพอากาศ", en: "RTAF Museum" }, lat: 13.9100, lng: 100.6220 },
      { name: { th: "สายหยุด", en: "Sai Yud" }, lat: 13.8937, lng: 100.6141 },
      { name: { th: "พหลโยธิน 59", en: "Phahon Yothin 59" }, lat: 13.8825, lng: 100.6085 },
      { name: { th: "สะพานใหม่", en: "Saphan Mai" }, lat: 13.8720, lng: 100.6034 },
      { name: { th: "วัดพระศรีมหาธาตุ", en: "Wat Phra Si Mahathat" }, lat: 13.8528, lng: 100.5789 },
      { name: { th: "หมอชิต", en: "Mo Chit" }, lat: 13.8027, lng: 100.5533 },
      { name: { th: "สะพานควาย", en: "Saphan Khwai" }, lat: 13.7939, lng: 100.5495 },
      { name: { th: "อารีย์", en: "Ari" }, lat: 13.7793, lng: 100.5446 },
      { name: { th: "สนามเป้า", en: "Sanam Pao" }, lat: 13.7713, lng: 100.5418 },
      { name: { th: "อนุสาวรีย์ชัยฯ", en: "Victory Monument" }, lat: 13.7627, lng: 100.5381 },
      { name: { th: "พญาไท", en: "Phaya Thai" }, lat: 13.7565, lng: 100.5344 },
      { name: { th: "ราชเทวี", en: "Ratchathewi" }, lat: 13.7517, lng: 100.5316 },
      { name: { th: "สยาม", en: "Siam" }, lat: 13.7454, lng: 100.5342 },
      { name: { th: "ชิดลม", en: "Chit Lom" }, lat: 13.7441, lng: 100.5430 },
      { name: { th: "เพลินจิต", en: "Phloen Chit" }, lat: 13.7438, lng: 100.5488 },
      { name: { th: "นานา", en: "Nana" }, lat: 13.7406, lng: 100.5553 },
      { name: { th: "อโศก", en: "Asok" }, lat: 13.7370, lng: 100.5604 },
      { name: { th: "พร้อมพงษ์", en: "Phrom Phong" }, lat: 13.7301, lng: 100.5695 },
      { name: { th: "ทองหล่อ", en: "Thong Lo" }, lat: 13.7243, lng: 100.5782 },
      { name: { th: "เอกมัย", en: "Ekkamai" }, lat: 13.7193, lng: 100.5853 },
      { name: { th: "พระโขนง", en: "Phra Khanong" }, lat: 13.7153, lng: 100.5914 },
      { name: { th: "อ่อนนุช", en: "On Nut" }, lat: 13.7058, lng: 100.6012 },
      { name: { th: "บางจาก", en: "Bang Chak" }, lat: 13.6966, lng: 100.6054 },
      { name: { th: "ปุณณวิถี", en: "Punnawithi" }, lat: 13.6893, lng: 100.6097 },
      { name: { th: "อุดมสุข", en: "Udom Suk" }, lat: 13.6798, lng: 100.6098 },
      { name: { th: "บางนา", en: "Bang Na" }, lat: 13.6686, lng: 100.6049 },
      { name: { th: "แบริ่ง", en: "Bearing" }, lat: 13.6615, lng: 100.6012 },
      { name: { th: "สำโรง", en: "Samrong" }, lat: 13.6454, lng: 100.5955 },
      { name: { th: "เคหะฯ", en: "Kheha" }, lat: 13.6129, lng: 100.5881 },
    ],
  },
  {
    id: "bts-silom",
    name: { th: "BTS สายสีลม", en: "BTS Silom Line" },
    color: "#C7352E",
    stations: [
      { name: { th: "สนามกีฬาแห่งชาติ", en: "National Stadium" }, lat: 13.7463, lng: 100.5290 },
      { name: { th: "สยาม", en: "Siam" }, lat: 13.7454, lng: 100.5342 },
      { name: { th: "ราชดำริ", en: "Ratchadamri" }, lat: 13.7401, lng: 100.5391 },
      { name: { th: "ศาลาแดง", en: "Sala Daeng" }, lat: 13.7288, lng: 100.5346 },
      { name: { th: "ช่องนนทรี", en: "Chong Nonsi" }, lat: 13.7236, lng: 100.5292 },
      { name: { th: "สุรศักดิ์", en: "Surasak" }, lat: 13.7189, lng: 100.5200 },
      { name: { th: "สะพานตากสิน", en: "Saphan Taksin" }, lat: 13.7183, lng: 100.5141 },
      { name: { th: "กรุงธนบุรี", en: "Krung Thonburi" }, lat: 13.7201, lng: 100.5036 },
      { name: { th: "วงเวียนใหญ่", en: "Wongwian Yai" }, lat: 13.7214, lng: 100.4946 },
      { name: { th: "โพธิ์นิมิตร", en: "Pho Nimit" }, lat: 13.7195, lng: 100.4839 },
      { name: { th: "ตลาดพลู", en: "Talat Phlu" }, lat: 13.7139, lng: 100.4764 },
      { name: { th: "วุฒากาศ", en: "Wutthakat" }, lat: 13.7106, lng: 100.4680 },
      { name: { th: "บางหว้า", en: "Bang Wa" }, lat: 13.7200, lng: 100.4574 },
    ],
  },
  {
    id: "mrt-blue",
    name: { th: "MRT สายสีน้ำเงิน", en: "MRT Blue Line" },
    color: "#1E3A8A",
    stations: [
      { name: { th: "ท่าพระ", en: "Tha Phra" }, lat: 13.7229, lng: 100.4667 },
      { name: { th: "บางไผ่", en: "Bang Phai" }, lat: 13.7325, lng: 100.4555 },
      { name: { th: "บางหว้า", en: "Bang Wa" }, lat: 13.7200, lng: 100.4574 },
      { name: { th: "เพชรเกษม 48", en: "Phetkasem 48" }, lat: 13.7131, lng: 100.4383 },
      { name: { th: "ภาษีเจริญ", en: "Phasi Charoen" }, lat: 13.7178, lng: 100.4357 },
      { name: { th: "หลักสอง", en: "Lak Song" }, lat: 13.7239, lng: 100.4157 },
      { name: { th: "หัวลำโพง", en: "Hua Lamphong" }, lat: 13.7380, lng: 100.5172 },
      { name: { th: "สามย่าน", en: "Sam Yan" }, lat: 13.7326, lng: 100.5291 },
      { name: { th: "สีลม", en: "Si Lom" }, lat: 13.7291, lng: 100.5369 },
      { name: { th: "ลุมพินี", en: "Lumphini" }, lat: 13.7257, lng: 100.5455 },
      { name: { th: "คลองเตย", en: "Khlong Toei" }, lat: 13.7224, lng: 100.5543 },
      { name: { th: "ศูนย์การประชุมฯ", en: "Queen Sirikit" }, lat: 13.7230, lng: 100.5604 },
      { name: { th: "สุขุมวิท", en: "Sukhumvit" }, lat: 13.7362, lng: 100.5610 },
      { name: { th: "เพชรบุรี", en: "Phetchaburi" }, lat: 13.7483, lng: 100.5644 },
      { name: { th: "พระราม 9", en: "Phra Ram 9" }, lat: 13.7580, lng: 100.5653 },
      { name: { th: "ศูนย์วัฒนธรรมฯ", en: "Thailand Cultural Centre" }, lat: 13.7651, lng: 100.5706 },
      { name: { th: "ห้วยขวาง", en: "Huai Khwang" }, lat: 13.7745, lng: 100.5738 },
      { name: { th: "สุทธิสาร", en: "Sutthisan" }, lat: 13.7831, lng: 100.5739 },
      { name: { th: "รัชดาภิเษก", en: "Ratchadaphisek" }, lat: 13.7882, lng: 100.5742 },
      { name: { th: "ลาดพร้าว", en: "Lat Phrao" }, lat: 13.8063, lng: 100.5734 },
      { name: { th: "พหลโยธิน", en: "Phahon Yothin" }, lat: 13.8136, lng: 100.5609 },
      { name: { th: "จตุจักร", en: "Chatuchak Park" }, lat: 13.8023, lng: 100.5537 },
      { name: { th: "กำแพงเพชร", en: "Kamphaeng Phet" }, lat: 13.7985, lng: 100.5510 },
      { name: { th: "บางซื่อ", en: "Bang Sue" }, lat: 13.8061, lng: 100.5370 },
    ],
  },
  {
    id: "mrt-purple",
    name: { th: "MRT สายสีม่วง", en: "MRT Purple Line" },
    color: "#6B21A8",
    stations: [
      { name: { th: "คลองบางไผ่", en: "Khlong Bang Phai" }, lat: 13.9007, lng: 100.4219 },
      { name: { th: "ตลาดบางใหญ่", en: "Talad Bang Yai" }, lat: 13.8850, lng: 100.4151 },
      { name: { th: "สามแยกบางใหญ่", en: "Sam Yaek Bang Yai" }, lat: 13.8658, lng: 100.4168 },
      { name: { th: "บางพลู", en: "Bang Phlu" }, lat: 13.8561, lng: 100.4268 },
      { name: { th: "บางรักใหญ่", en: "Bang Rak Yai" }, lat: 13.8460, lng: 100.4309 },
      { name: { th: "บางรักน้อยท่าอิฐ", en: "Bang Rak Noi Tha It" }, lat: 13.8373, lng: 100.4391 },
      { name: { th: "ไทรม้า", en: "Sai Ma" }, lat: 13.8292, lng: 100.4490 },
      { name: { th: "สะพานพระนั่งเกล้า", en: "Phra Nang Klao Bridge" }, lat: 13.8225, lng: 100.4752 },
      { name: { th: "แยกนนทบุรี 1", en: "Yaek Nonthaburi 1" }, lat: 13.8223, lng: 100.4942 },
      { name: { th: "ศูนย์ราชการนนทบุรี", en: "Nonthaburi Civic Center" }, lat: 13.8204, lng: 100.5063 },
      { name: { th: "กระทรวงสาธารณสุข", en: "Ministry of Public Health" }, lat: 13.8156, lng: 100.5233 },
      { name: { th: "แยกติวานนท์", en: "Yaek Tiwanon" }, lat: 13.8108, lng: 100.5336 },
      { name: { th: "วงศ์สว่าง", en: "Wong Sawang" }, lat: 13.8035, lng: 100.5373 },
      { name: { th: "บางซ่อน", en: "Bang Son" }, lat: 13.8046, lng: 100.5402 },
      { name: { th: "เตาปูน", en: "Tao Poon" }, lat: 13.8061, lng: 100.5370 },
    ],
  },
  {
    id: "bts-gold",
    name: { th: "BTS สายสีทอง", en: "BTS Gold Line" },
    color: "#D4A017",
    stations: [
      { name: { th: "กรุงธนบุรี", en: "Krung Thonburi" }, lat: 13.7201, lng: 100.5036 },
      { name: { th: "เจริญนคร", en: "Charoen Nakhon" }, lat: 13.7240, lng: 100.5066 },
      { name: { th: "คลองสาน", en: "Khlong San" }, lat: 13.7280, lng: 100.5095 },
    ],
  },
  {
    id: "arl",
    name: { th: "แอร์พอร์ต เรล ลิงก์", en: "Airport Rail Link" },
    color: "#E11D48",
    stations: [
      { name: { th: "พญาไท", en: "Phaya Thai" }, lat: 13.7565, lng: 100.5344 },
      { name: { th: "ราชปรารภ", en: "Ratchaprarop" }, lat: 13.7526, lng: 100.5413 },
      { name: { th: "มักกะสัน", en: "Makkasan" }, lat: 13.7502, lng: 100.5610 },
      { name: { th: "รามคำแหง", en: "Ramkhamhaeng" }, lat: 13.7580, lng: 100.5890 },
      { name: { th: "หัวหมาก", en: "Hua Mak" }, lat: 13.7579, lng: 100.6089 },
      { name: { th: "บ้านทับช้าง", en: "Ban Thap Chang" }, lat: 13.7523, lng: 100.6516 },
      { name: { th: "ลาดกระบัง", en: "Lat Krabang" }, lat: 13.7457, lng: 100.6835 },
      { name: { th: "สุวรรณภูมิ", en: "Suvarnabhumi" }, lat: 13.6933, lng: 100.7510 },
    ],
  },
  {
    id: "mrt-yellow",
    name: { th: "MRT สายสีเหลือง", en: "MRT Yellow Line" },
    color: "#EAB308",
    stations: [
      { name: { th: "ลาดพร้าว", en: "Lat Phrao" }, lat: 13.8063, lng: 100.5734 },
      { name: { th: "ภาวนา", en: "Phawana" }, lat: 13.8046, lng: 100.5902 },
      { name: { th: "โชคชัย 4", en: "Chok Chai 4" }, lat: 13.8010, lng: 100.6050 },
      { name: { th: "ลาดพร้าว 71", en: "Lat Phrao 71" }, lat: 13.7946, lng: 100.6153 },
      { name: { th: "ลาดพร้าว 83", en: "Lat Phrao 83" }, lat: 13.7882, lng: 100.6244 },
      { name: { th: "มหาดไทย", en: "Mahat Thai" }, lat: 13.7802, lng: 100.6338 },
      { name: { th: "ลาดพร้าว 101", en: "Lat Phrao 101" }, lat: 13.7733, lng: 100.6421 },
      { name: { th: "บางกะปิ", en: "Bang Kapi" }, lat: 13.7665, lng: 100.6495 },
      { name: { th: "แยกลำสาลี", en: "Yaek Lam Sali" }, lat: 13.7663, lng: 100.6373 },
      { name: { th: "ศรีกรีฑา", en: "Si Kritha" }, lat: 13.7547, lng: 100.6432 },
      { name: { th: "หัวหมาก", en: "Hua Mak" }, lat: 13.7472, lng: 100.6316 },
      { name: { th: "กลันตัน", en: "Kalantan" }, lat: 13.7369, lng: 100.6255 },
      { name: { th: "ศรีนุช", en: "Si Nut" }, lat: 13.7247, lng: 100.6234 },
      { name: { th: "สวนหลวง ร.9", en: "Suan Luang Rama IX" }, lat: 13.7133, lng: 100.6303 },
      { name: { th: "ศรีอุดม", en: "Si Udom" }, lat: 13.6980, lng: 100.6381 },
      { name: { th: "ศรีเอี่ยม", en: "Si Iam" }, lat: 13.6871, lng: 100.6476 },
      { name: { th: "ศรีลาซาล", en: "Si La Salle" }, lat: 13.6765, lng: 100.6542 },
      { name: { th: "ศรีแบริ่ง", en: "Si Bearing" }, lat: 13.6635, lng: 100.6611 },
      { name: { th: "สำโรง", en: "Samrong" }, lat: 13.6454, lng: 100.5955 },
    ],
  },
  {
    id: "mrt-pink",
    name: { th: "MRT สายสีชมพู", en: "MRT Pink Line" },
    color: "#EC4899",
    stations: [
      { name: { th: "แคราย", en: "Khae Rai" }, lat: 13.8600, lng: 100.5151 },
      { name: { th: "สามัคคี", en: "Samakkhi" }, lat: 13.8642, lng: 100.5260 },
      { name: { th: "กรมชลประทาน", en: "Royal Irrigation Dept." }, lat: 13.8629, lng: 100.5374 },
      { name: { th: "ปากเกร็ด", en: "Pak Kret" }, lat: 13.8650, lng: 100.5540 },
      { name: { th: "เลี่ยงเมืองปากเกร็ด", en: "Liang Mueang Pak Kret" }, lat: 13.8627, lng: 100.5738 },
      { name: { th: "แจ้งวัฒนะ-ปากเกร็ด 28", en: "Chaeng Watthana-Pak Kret 28" }, lat: 13.8582, lng: 100.5857 },
      { name: { th: "ศรีรัช", en: "Si Rat" }, lat: 13.8491, lng: 100.5857 },
      { name: { th: "เมืองทอง", en: "Mueang Thong" }, lat: 13.8387, lng: 100.5867 },
      { name: { th: "ศูนย์ราชการเฉลิมพระเกียรติ", en: "Government Complex" }, lat: 13.8524, lng: 100.5665 },
      { name: { th: "หลักสี่", en: "Lak Si" }, lat: 13.8612, lng: 100.5653 },
      { name: { th: "ราชภัฏพระนคร", en: "Ratchaphat Phra Nakhon" }, lat: 13.8529, lng: 100.5872 },
      { name: { th: "วัดพระศรีมหาธาตุ", en: "Wat Phra Si Mahathat" }, lat: 13.8528, lng: 100.5789 },
      { name: { th: "รามอินทรา 3", en: "Ram Inthra 3" }, lat: 13.8450, lng: 100.6031 },
      { name: { th: "ลาดปลาเค้า", en: "Lat Pla Khao" }, lat: 13.8371, lng: 100.6096 },
      { name: { th: "รามอินทรา กม.4", en: "Ram Inthra Km.4" }, lat: 13.8295, lng: 100.6261 },
      { name: { th: "มัยลาภ", en: "Maiyalap" }, lat: 13.8233, lng: 100.6382 },
      { name: { th: "วัชรพล", en: "Watcharapol" }, lat: 13.8152, lng: 100.6521 },
      { name: { th: "รามอินทรา กม.6-7", en: "Ram Inthra Km.6-7" }, lat: 13.8076, lng: 100.6620 },
      { name: { th: "คู้บอน", en: "Khu Bon" }, lat: 13.7930, lng: 100.6750 },
      { name: { th: "มีนบุรี", en: "Min Buri" }, lat: 13.8130, lng: 100.7300 },
    ],
  },
];

// Radius (km) to consider a project "near" a transit line
const TRANSIT_NEARBY_RADIUS = 1.5;

// Known locations for search suggestions
const LOCATIONS: { name: { th: string; en: string }; lat: number; lng: number }[] = [
  { name: { th: "สุขุมวิท", en: "Sukhumvit" }, lat: 13.723, lng: 100.585 },
  { name: { th: "พญาไท", en: "Phaya Thai" }, lat: 13.779, lng: 100.544 },
  { name: { th: "รัชดาภิเษก", en: "Ratchada" }, lat: 13.764, lng: 100.574 },
  { name: { th: "บางนา", en: "Bangna" }, lat: 13.668, lng: 100.616 },
  { name: { th: "ลาดพร้าว", en: "Ladprao" }, lat: 13.793, lng: 100.605 },
  { name: { th: "รามอินทรา", en: "Ram Intra" }, lat: 13.83, lng: 100.63 },
  { name: { th: "ราชพฤกษ์", en: "Ratchaphruek" }, lat: 13.78, lng: 100.44 },
  { name: { th: "เอกมัย", en: "Ekkamai" }, lat: 13.72, lng: 100.585 },
  { name: { th: "ทองหล่อ", en: "Thonglor" }, lat: 13.73, lng: 100.578 },
  { name: { th: "อารีย์", en: "Ari" }, lat: 13.779, lng: 100.545 },
];

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface InteractiveMapProps {
  projects: Project[];
  compact?: boolean;
  onProjectsInView?: (slugs: string[]) => void;
}

export default function InteractiveMap({ projects, compact = false, onProjectsInView }: InteractiveMapProps) {
  const { locale } = useApp();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const transitLayerRef = useRef<L.LayerGroup | null>(null);
  const [ready, setReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [activeLine, setActiveLine] = useState<TransitLine | null>(null);
  const [showLinePanel, setShowLinePanel] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Projects near active transit line
  const nearbyLineProjects = useMemo(() => {
    if (!activeLine) return null;
    return projects.filter((p) =>
      activeLine.stations.some((s) => getDistance(p.lat, p.lng, s.lat, s.lng) <= TRANSIT_NEARBY_RADIUS)
    );
  }, [activeLine, projects]);

  type Suggestion = {
    type: "location" | "project" | "transit-line" | "transit-station";
    label: string;
    sublabel: string;
    lat: number;
    lng: number;
    slug?: string;
    lineId?: string;
    lineColor?: string;
  };

  const suggestions = useMemo<Suggestion[]>(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();

    // Transit line matches
    const lineMatches: Suggestion[] = TRANSIT_LINES
      .filter((line) => line.name.th.includes(q) || line.name.en.toLowerCase().includes(q))
      .slice(0, 3)
      .map((line) => {
        const mid = line.stations[Math.floor(line.stations.length / 2)];
        return {
          type: "transit-line",
          label: line.name[locale],
          sublabel: line.stations.length + (locale === "th" ? " สถานี" : " stations"),
          lat: mid.lat,
          lng: mid.lng,
          lineId: line.id,
          lineColor: line.color,
        };
      });

    // Transit station matches
    const stationMatches: Suggestion[] = [];
    for (const line of TRANSIT_LINES) {
      for (const station of line.stations) {
        if (station.name.th.includes(q) || station.name.en.toLowerCase().includes(q)) {
          stationMatches.push({
            type: "transit-station",
            label: station.name[locale],
            sublabel: line.name[locale],
            lat: station.lat,
            lng: station.lng,
            lineId: line.id,
            lineColor: line.color,
          });
        }
      }
      if (stationMatches.length >= 5) break;
    }

    const locationMatches = LOCATIONS.filter(
      (loc) => loc.name.th.includes(q) || loc.name.en.toLowerCase().includes(q)
    ).slice(0, 3);

    const projectMatches = projects
      .filter(
        (p) =>
          p.name.th.includes(q) ||
          p.name.en.toLowerCase().includes(q) ||
          p.location.th.includes(q) ||
          p.location.en.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q)
      )
      .slice(0, 4);

    return [
      ...lineMatches,
      ...stationMatches.slice(0, 5),
      ...locationMatches.map((loc) => ({
        type: "location" as const,
        label: loc.name[locale],
        sublabel: locale === "th" ? "ทำเล" : "Location",
        lat: loc.lat,
        lng: loc.lng,
      })),
      ...projectMatches.map((p) => ({
        type: "project" as const,
        label: p.name[locale],
        sublabel: p.location[locale],
        lat: p.lat,
        lng: p.lng,
        slug: p.slug,
      })),
    ];
  }, [searchQuery, projects, locale]);

  // Sorted projects by distance from search center
  const sortedProjects = useMemo(() => {
    if (!searchCenter) return projects;
    return [...projects]
      .map((p) => ({ ...p, distance: getDistance(searchCenter.lat, searchCenter.lng, p.lat, p.lng) }))
      .sort((a, b) => a.distance - b.distance);
  }, [projects, searchCenter]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    let cancelled = false;

    async function init() {
      const L = (await import("leaflet")).default;

      if (cancelled || !mapRef.current) return;

      // Fix default marker icons
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        center: BANGKOK_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      leafletMap.current = map;
      setReady(true);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // Draw transit line on map
  const drawTransitLine = useCallback(async (line: TransitLine | null) => {
    if (!leafletMap.current || !ready) return;

    const L = (await import("leaflet")).default;
    const map = leafletMap.current;

    // Clear previous transit layer
    if (transitLayerRef.current) {
      transitLayerRef.current.clearLayers();
      map.removeLayer(transitLayerRef.current);
      transitLayerRef.current = null;
    }

    if (!line) return;

    const group = L.layerGroup();

    // Draw polyline
    const coords = line.stations.map((s): [number, number] => [s.lat, s.lng]);
    L.polyline(coords, {
      color: line.color,
      weight: 5,
      opacity: 0.8,
      dashArray: undefined,
    }).addTo(group);

    // Draw station dots
    line.stations.forEach((station) => {
      const stationIcon = L.divIcon({
        className: "transit-station-marker",
        html: `<div style="
          width: 14px; height: 14px;
          background: white;
          border: 3px solid ${line.color};
          border-radius: 50%;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([station.lat, station.lng], { icon: stationIcon, zIndexOffset: 500 });
      marker.bindTooltip(station.name[locale], {
        permanent: false,
        direction: "top",
        offset: [0, -8],
        className: "transit-tooltip",
      });
      marker.addTo(group);
    });

    group.addTo(map);
    transitLayerRef.current = group;

    // Fit map to line bounds
    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
  }, [ready, locale]);

  // When activeLine changes, draw it
  useEffect(() => {
    drawTransitLine(activeLine);
  }, [activeLine, drawTransitLine]);

  // Update markers when projects or locale changes
  const updateMarkers = useCallback(async () => {
    if (!leafletMap.current || !ready) return;

    const L = (await import("leaflet")).default;
    const map = leafletMap.current;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const customIcon = (isSelected: boolean) =>
      L.divIcon({
        className: "custom-map-marker",
        html: `<div style="
          width: ${isSelected ? "40px" : "32px"};
          height: ${isSelected ? "40px" : "32px"};
          background: ${isSelected ? "#F15A29" : "#5BA730"};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.2s;
          cursor: pointer;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3" fill="white" stroke="white"/>
          </svg>
        </div>`,
        iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
        iconAnchor: [isSelected ? 20 : 16, isSelected ? 40 : 32],
      });

    sortedProjects.forEach((project) => {
      const isSelected = selectedProject?.slug === project.slug;
      const marker = L.marker([project.lat, project.lng], {
        icon: customIcon(isSelected),
        zIndexOffset: isSelected ? 1000 : 0,
      });

      marker.on("click", () => {
        setSelectedProject(project);
        map.flyTo([project.lat, project.lng], 15, { duration: 0.5 });
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [ready, sortedProjects, selectedProject]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  // Notify parent about visible projects
  useEffect(() => {
    if (!leafletMap.current || !ready || !onProjectsInView) return;
    const map = leafletMap.current;

    function updateVisibleProjects() {
      if (!map) return;
      const bounds = map.getBounds();
      const visible = projects
        .filter((p) => bounds.contains([p.lat, p.lng]))
        .map((p) => p.slug);
      onProjectsInView?.(visible);
    }

    map.on("moveend", updateVisibleProjects);
    updateVisibleProjects();
    return () => {
      map.off("moveend", updateVisibleProjects);
    };
  }, [ready, projects, onProjectsInView]);

  function handleSelectSuggestion(suggestion: Suggestion) {
    setSearchQuery(suggestion.label);
    setShowSuggestions(false);

    if (suggestion.type === "transit-line" && suggestion.lineId) {
      const line = TRANSIT_LINES.find((l) => l.id === suggestion.lineId)!;
      setActiveLine(line);
      setSearchCenter(null);
      setSelectedProject(null);
      return; // drawTransitLine handles the map view
    }

    if (suggestion.type === "transit-station" && suggestion.lineId) {
      const line = TRANSIT_LINES.find((l) => l.id === suggestion.lineId)!;
      setActiveLine(line);
      setSearchCenter({ lat: suggestion.lat, lng: suggestion.lng, label: suggestion.label });
      setSelectedProject(null);
      // Fly to station after line draws
      setTimeout(() => {
        leafletMap.current?.flyTo([suggestion.lat, suggestion.lng], 15, { duration: 0.8 });
      }, 300);
      return;
    }

    setActiveLine(null);
    setSearchCenter({ lat: suggestion.lat, lng: suggestion.lng, label: suggestion.label });

    if (leafletMap.current) {
      const zoom = suggestion.type === "project" ? 16 : 14;
      leafletMap.current.flyTo([suggestion.lat, suggestion.lng], zoom, { duration: 0.8 });
    }

    if (suggestion.type === "project" && suggestion.slug) {
      const project = projects.find((p) => p.slug === suggestion.slug);
      if (project) setSelectedProject(project);
    }
  }

  function handleSelectLine(line: TransitLine) {
    setActiveLine(line);
    setSearchQuery(line.name[locale]);
    setSearchCenter(null);
    setSelectedProject(null);
    setShowLinePanel(false);
  }

  function handleClearSearch() {
    setSearchQuery("");
    setSearchCenter(null);
    setSelectedProject(null);
    setActiveLine(null);
    if (leafletMap.current) {
      leafletMap.current.flyTo(BANGKOK_CENTER, DEFAULT_ZOOM, { duration: 0.8 });
    }
  }

  function handleNearMe() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setSearchCenter({ lat: latitude, lng: longitude, label: locale === "th" ? "ตำแหน่งปัจจุบัน" : "My Location" });
        setSearchQuery(locale === "th" ? "ตำแหน่งปัจจุบัน" : "My Location");
        if (leafletMap.current) {
          leafletMap.current.flyTo([latitude, longitude], 14, { duration: 0.8 });
        }
      },
      () => {
        alert(locale === "th" ? "ไม่สามารถเข้าถึงตำแหน่งได้" : "Unable to access location");
      }
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-black/10 ${compact ? "h-[400px]" : "h-[600px]"}`}>
      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />

      {/* Search bar overlay */}
      <div className="absolute left-0 right-0 top-0 z-[1000] p-3">
        <div ref={searchRef} className="relative mx-auto max-w-lg">
          <div className="flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur">
            <Search size={18} className="shrink-0 text-black/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={locale === "th" ? "ค้นหาทำเล, โครงการ, BTS/MRT..." : "Search location, project, BTS/MRT..."}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/40"
            />
            {searchQuery && (
              <button onClick={handleClearSearch} className="shrink-0 text-black/40 hover:text-black">
                <X size={16} />
              </button>
            )}
            <button
              onClick={() => setShowLinePanel((v) => !v)}
              className={`shrink-0 rounded-lg p-1.5 transition ${showLinePanel || activeLine ? "bg-pruksa-teal text-white" : "bg-pruksa-teal/10 text-pruksa-teal hover:bg-pruksa-teal/20"}`}
              title={locale === "th" ? "เส้นทาง BTS/MRT" : "BTS/MRT Lines"}
            >
              <TrainFront size={16} />
            </button>
            <button
              onClick={handleNearMe}
              className="shrink-0 rounded-lg bg-pruksa-green/10 p-1.5 text-pruksa-green hover:bg-pruksa-green/20"
              title={locale === "th" ? "ใกล้ฉัน" : "Near me"}
            >
              <Navigation size={16} />
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="mt-1.5 max-h-72 overflow-y-auto rounded-xl bg-white/95 shadow-lg backdrop-blur">
              {suggestions.map((s, i) => (
                <button
                  key={`${s.type}-${s.label}-${i}`}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-pruksa-green/5"
                  onClick={() => handleSelectSuggestion(s)}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                      s.type === "transit-line" || s.type === "transit-station"
                        ? ""
                        : s.type === "location"
                          ? "bg-pruksa-teal/10 text-pruksa-teal"
                          : "bg-pruksa-orange/10 text-pruksa-orange"
                    }`}
                    style={
                      s.type === "transit-line" || s.type === "transit-station"
                        ? { background: (s.lineColor || "#296E6D") + "18", color: s.lineColor || "#296E6D" }
                        : undefined
                    }
                  >
                    {s.type === "transit-line" || s.type === "transit-station" ? (
                      <TrainFront size={14} />
                    ) : (
                      <MapPin size={14} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.label}</p>
                    <p className="truncate text-xs text-black/50">{s.sublabel}</p>
                  </div>
                  {s.type === "transit-line" && (
                    <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ background: s.lineColor }}>
                      {locale === "th" ? "สาย" : "LINE"}
                    </span>
                  )}
                  {s.type !== "transit-line" && <ChevronRight size={14} className="shrink-0 text-black/30" />}
                </button>
              ))}
            </div>
          )}

          {/* Transit line picker panel */}
          {showLinePanel && !showSuggestions && (
            <div className="mt-1.5 max-h-80 overflow-y-auto rounded-xl bg-white/95 shadow-lg backdrop-blur">
              <div className="sticky top-0 border-b bg-white/95 px-4 py-2.5 backdrop-blur">
                <p className="text-xs font-semibold text-black/60">
                  {locale === "th" ? "เลือกเส้นทาง BTS / MRT" : "Select BTS / MRT Line"}
                </p>
              </div>
              {TRANSIT_LINES.map((line) => (
                <button
                  key={line.id}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-black/5 ${activeLine?.id === line.id ? "bg-black/5" : ""}`}
                  onClick={() => handleSelectLine(line)}
                >
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white"
                    style={{ background: line.color }}
                  >
                    <TrainFront size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{line.name[locale]}</p>
                    <p className="text-xs text-black/50">
                      {line.stations.length} {locale === "th" ? "สถานี" : "stations"}
                      {" · "}
                      {line.stations[0].name[locale]} → {line.stations[line.stations.length - 1].name[locale]}
                    </p>
                  </div>
                  {activeLine?.id === line.id && (
                    <span className="shrink-0 rounded-full bg-pruksa-green px-2 py-0.5 text-[10px] font-bold text-white">
                      {locale === "th" ? "เลือกอยู่" : "Active"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active transit line indicator */}
        {activeLine && !searchCenter && (
          <div className="mx-auto mt-2 flex max-w-lg items-center justify-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: activeLine.color }} />
              {activeLine.name[locale]}
              {nearbyLineProjects && " · " + nearbyLineProjects.length + (locale === "th" ? " โครงการใกล้เคียง" : " nearby projects")}
            </span>
            <button
              onClick={handleClearSearch}
              className="rounded-full bg-white/90 p-1 shadow-sm backdrop-blur hover:bg-white"
            >
              <X size={12} />
            </button>
          </div>
        )}
        {/* Search center indicator */}
        {searchCenter && (
          <div className="mx-auto mt-2 flex max-w-lg items-center justify-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
              {activeLine && <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: activeLine.color }} />}
              {!activeLine && <MapPin size={12} className="text-pruksa-orange" />}
              {searchCenter.label}
              {!activeLine && sortedProjects.length > 0 && " · " + sortedProjects.length + (locale === "th" ? " โครงการ" : " projects")}
            </span>
          </div>
        )}
      </div>

      {/* Map container */}
      <div ref={mapRef} className="h-full w-full" />

      {/* Loading state */}
      {!ready && (
        <div className="absolute inset-0 z-[999] grid place-items-center bg-[#e8f1ed]">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-pruksa-green border-t-transparent" />
            <p className="mt-3 text-sm text-black/50">{locale === "th" ? "กำลังโหลดแผนที่..." : "Loading map..."}</p>
          </div>
        </div>
      )}

      {/* Selected project card */}
      {selectedProject && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] mx-auto max-w-sm">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="flex">
              <img
                src={selectedProject.image}
                alt={selectedProject.name[locale]}
                className="h-28 w-28 shrink-0 object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
                <div>
                  <span className="inline-block rounded bg-pruksa-green/10 px-1.5 py-0.5 text-[10px] font-semibold text-pruksa-green">
                    {livingTypeLabels[selectedProject.type][locale]}
                  </span>
                  <h3 className="mt-1 truncate text-sm font-semibold">{selectedProject.name[locale]}</h3>
                  <p className="flex items-center gap-1 text-xs text-black/50">
                    <MapPin size={10} />
                    {selectedProject.location[locale]}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-pruksa-green">
                    {baht(selectedProject.priceMin)}-{baht(selectedProject.priceMax)}/mo
                  </p>
                  <Link
                    href={`/rent/${selectedProject.slug}`}
                    className="rounded-lg bg-pruksa-orange px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-pruksa-orange/90"
                  >
                    {locale === "th" ? "ดูรายละเอียด" : "View"}
                  </Link>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-black/10 text-black/50 hover:bg-black/20"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Nearby projects list — for transit line OR location search */}
      {!selectedProject && (activeLine || searchCenter) && (
        <div className="absolute bottom-4 left-4 z-[1000] max-h-52 w-72 overflow-y-auto rounded-xl bg-white/95 shadow-lg backdrop-blur">
          <div className="sticky top-0 border-b bg-white/95 px-3 py-2 backdrop-blur">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-black/60">
              {activeLine && <span className="inline-block h-2 w-2 rounded-full" style={{ background: activeLine.color }} />}
              {activeLine && !searchCenter
                ? (locale === "th" ? "โครงการแนว " : "Projects along ") + activeLine.name[locale]
                : locale === "th" ? "โครงการใกล้เคียง" : "Nearby projects"}
            </p>
          </div>
          {(() => {
            const listProjects = activeLine && !searchCenter ? nearbyLineProjects ?? [] : sortedProjects;
            const maxItems = compact ? 3 : 6;
            if (listProjects.length === 0) {
              return (
                <div className="px-3 py-4 text-center text-xs text-black/40">
                  {locale === "th" ? "ไม่พบโครงการในแนวนี้" : "No projects found along this line"}
                </div>
              );
            }
            return listProjects.slice(0, maxItems).map((project) => {
              // Find nearest station for transit line display
              let nearestStation = "";
              if (activeLine) {
                let minDist = Infinity;
                for (const s of activeLine.stations) {
                  const d = getDistance(project.lat, project.lng, s.lat, s.lng);
                  if (d < minDist) {
                    minDist = d;
                    nearestStation = s.name[locale] + " (" + minDist.toFixed(1) + " km)";
                  }
                }
              }
              const distStr = "distance" in project ? ((project as Project & { distance: number }).distance).toFixed(1) + " km" : "";
              return (
                <button
                  key={project.slug}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-pruksa-green/5"
                  onClick={() => {
                    setSelectedProject(project);
                    leafletMap.current?.flyTo([project.lat, project.lng], 15, { duration: 0.5 });
                  }}
                >
                  <img src={project.image} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{project.name[locale]}</p>
                    <p className="truncate text-[10px] text-black/50">
                      {baht(project.priceMin)}/mo
                      {nearestStation && <> · <TrainFront size={9} className="inline" /> {nearestStation}</>}
                      {!nearestStation && distStr && " · " + distStr}
                    </p>
                  </div>
                </button>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}
