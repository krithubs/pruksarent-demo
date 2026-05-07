"use client";

import dynamic from "next/dynamic";
import { projects } from "@/lib/data";

const InteractiveMap = dynamic(() => import("./interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[400px] place-items-center rounded-2xl border border-black/10 bg-[#e8f1ed]">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-pruksa-green border-t-transparent" />
        <p className="mt-3 text-sm text-black/50">Loading map...</p>
      </div>
    </div>
  ),
});

export function MapPreview({ compact = false }: { compact?: boolean }) {
  return <InteractiveMap projects={projects} compact={compact} />;
}
