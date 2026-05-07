"use client";

import { X } from "lucide-react";
import { baht, copy } from "@/lib/i18n";
import { useApp } from "./app-providers";

export function CompareDrawer() {
  const { locale, compareUnits, clearCompare } = useApp();
  const visible = compareUnits.length >= 2;

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white shadow-soft">
      <div className="container-page py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">{copy[locale].compare} ({compareUnits.length}/4)</p>
            <p className="text-xs text-black/60">
              {locale === "th" ? "เปิดตารางเปรียบเทียบยูนิตแบบ side-by-side" : "Side-by-side unit comparison is ready."}
            </p>
          </div>
          <button className="btn-secondary py-2" onClick={clearCompare}><X size={16} />Clear</button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Unit</th>
                {compareUnits.map((unit) => <th key={unit.id} className="py-2">{unit.id}</th>)}
              </tr>
            </thead>
            <tbody className="text-black/70">
              <tr><td className="py-2 font-medium">Rent</td>{compareUnits.map((unit) => <td key={unit.id}>{baht(unit.rent)}/mo</td>)}</tr>
              <tr><td className="py-2 font-medium">Size</td>{compareUnits.map((unit) => <td key={unit.id}>{unit.size} sqm</td>)}</tr>
              <tr><td className="py-2 font-medium">Bedrooms</td>{compareUnits.map((unit) => <td key={unit.id}>{unit.bedrooms}</td>)}</tr>
              <tr><td className="py-2 font-medium">Special</td>{compareUnits.map((unit) => <td key={unit.id}>{unit.special ? "Yes" : "No"}</td>)}</tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
