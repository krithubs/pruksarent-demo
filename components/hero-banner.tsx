"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, Search, Volume2, VolumeX } from "lucide-react";
import { useApp } from "./app-providers";
import { copy } from "@/lib/i18n";

// ── Slide data ──
type ImageSlide = {
  type: "image";
  src: string;
  alt: string;
  headline: { th: string; en: string };
  sub: { th: string; en: string };
};

type VideoSlide = {
  type: "video";
  youtubeId: string;
  poster: string;
  headline: { th: string; en: string };
  sub: { th: string; en: string };
};

type Slide = ImageSlide | VideoSlide;

const SLIDES: Slide[] = [
  {
    type: "image",
    src: "https://static.pruksa.com/R-Desktop-2304x1296.jpg",
    alt: "Pruksa rental home",
    headline: { th: "เช่าบ้านในแบบที่คุณเป็น", en: "Rent the Home That Fits Your Life" },
    sub: { th: "เช่าบ้านคุณภาพจาก Pruksa เริ่มต้นเพียง ฿15,000/เดือน", en: "Quality rental homes from Pruksa starting at ฿15,000/mo" },
  },
  {
    type: "video",
    youtubeId: "9fOGn8E1LA0",
    poster: "https://static.pruksa.com/Pruksa_KV-Well-Living_Baner-2304x1296px.jpg",
    headline: { th: "สัมผัสวิดีโอทัวร์โครงการ", en: "Take a Virtual Project Tour" },
    sub: { th: "ชมวิดีโอทัวร์โครงการก่อนนัดชมจริง", en: "Watch project tours before scheduling a visit" },
  },
  {
    type: "image",
    src: "https://static.pruksa.com/Pruksa_KV-Well-Living_Baner-2304x1296px.jpg",
    alt: "Pruksa well living",
    headline: { th: "โปรย้ายเข้าฟรี", en: "Free Move-In Promo" },
    sub: { th: "สำหรับสัญญาเช่า 12 เดือนขึ้นไป เงื่อนไขเป็นไปตามบริษัทกำหนด", en: "For 12-month leases. Terms & conditions apply." },
  },
  {
    type: "image",
    src: "https://static.pruksa.com/imresizer-1716867765104.jpg",
    alt: "Pruksa modern living",
    headline: { th: "คอนโดใกล้รถไฟฟ้า", en: "Condos Near BTS/MRT" },
    sub: { th: "เดินทางสะดวก ใกล้ BTS/MRT เดินเพียง 5 นาที", en: "Easy commute — just 5 min walk to BTS/MRT" },
  },
];

const AUTO_INTERVAL = 6000;

export function HeroBanner() {
  const { locale } = useApp();
  const t = copy[locale];
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const slide = SLIDES[current];

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
      setVideoPlaying(false);
    }, AUTO_INTERVAL);
  }, []);

  useEffect(() => {
    if (!paused && !videoPlaying) startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, videoPlaying, startTimer]);

  function goTo(index: number) {
    setCurrent(index);
    setVideoPlaying(false);
    if (!paused) startTimer();
  }

  function prev() { goTo((current - 1 + SLIDES.length) % SLIDES.length); }
  function next() { goTo((current + 1) % SLIDES.length); }

  function playVideo() {
    setVideoPlaying(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function toggleMute() {
    setMuted((m) => !m);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: muted ? "unMute" : "mute" }),
        "*"
      );
    }
  }

  // Swipe
  const touchStart = useRef(0);
  function onTouchStart(e: React.TouchEvent) { touchStart.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  }

  return (
    <section
      className="group relative -mt-[88px] h-screen min-h-[600px] w-full overflow-hidden bg-black"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Slides ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {slide.type === "image" ? (
            <img
              src={slide.src}
              alt={slide.alt}
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : !videoPlaying ? (
            <div className="relative h-full w-full">
              <img src={slide.poster} alt="Video thumbnail" className="h-full w-full object-cover" draggable={false} />
              <button
                onClick={playVideo}
                className="absolute inset-0 z-10 grid place-items-center"
                aria-label="Play video"
              >
                <span className="grid h-20 w-20 place-items-center rounded-full bg-white/90 shadow-2xl backdrop-blur transition hover:scale-110 sm:h-24 sm:w-24">
                  <svg viewBox="0 0 24 24" fill="#5BA730" className="ml-1 h-9 w-9 sm:h-11 sm:w-11">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            </div>
          ) : (
            <div className="relative h-full w-full">
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${slide.youtubeId}?autoplay=1&mute=${muted ? 1 : 0}&enablejsapi=1&rel=0&modestbranding=1&playsinline=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                title="Project video tour"
              />
              <button
                onClick={toggleMute}
                className="absolute bottom-28 right-6 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Gradient overlays ── */}
      {!(slide.type === "video" && videoPlaying) && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </>
      )}

      {/* ── Content overlay ── */}
      {!(slide.type === "video" && videoPlaying) && (
        <div className="absolute inset-0 z-10 flex flex-col justify-end">
          <div className="container-page pb-32 sm:pb-36 lg:pb-40">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="max-w-2xl"
              >
                {slide.type === "video" && (
                  <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M8 5v14l11-7z" /></svg>
                    VIDEO TOUR
                  </span>
                )}
                <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  {slide.headline[locale]}
                </h1>
                <p className="mt-3 max-w-lg text-base text-white/75 sm:text-lg lg:text-xl">
                  {slide.sub[locale]}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
                  <Link href="/rent" className="inline-flex items-center gap-2 rounded-xl bg-pruksa-green px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pruksa-green/30 transition hover:-translate-y-0.5 hover:shadow-xl sm:px-7 sm:py-4 sm:text-base">
                    <Search size={18} />
                    {t.findHome}
                  </Link>
                  <Link href="/about" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10 sm:px-7 sm:py-4 sm:text-base">
                    {locale === "th" ? "เกี่ยวกับเรา" : "About us"}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ── Navigation arrows ── */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25 sm:left-6 sm:h-12 sm:w-12 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25 sm:right-6 sm:h-12 sm:w-12 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* ── Bottom bar: dots + pause ── */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-4 sm:bottom-8 sm:justify-between sm:px-8">
        <div className="hidden sm:block" />

        {/* Dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="relative h-1.5 overflow-hidden rounded-full transition-all duration-300"
              style={{ width: i === current ? 36 : 10 }}
            >
              <span className={`absolute inset-0 rounded-full transition ${i === current ? "bg-white" : "bg-white/35"}`} />
              {i === current && !paused && !videoPlaying && (
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full bg-pruksa-green"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: AUTO_INTERVAL / 1000, ease: "linear" }}
                  key={`progress-${current}`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Pause / Play */}
        <button
          onClick={() => setPaused((p) => !p)}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
          aria-label={paused ? "Play" : "Pause"}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>

      {/* ── Slide counter (mobile) ── */}
      <div className="absolute right-4 top-24 z-20 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur sm:hidden">
        {current + 1} / {SLIDES.length}
      </div>
    </section>
  );
}
