"use client";

import { CalendarDays, CheckCircle2, CreditCard, UserRound, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { baht, copy } from "@/lib/i18n";
import type { Unit } from "@/lib/types";
import { useApp } from "./app-providers";

export function BookingModal({ unit, onClose }: { unit: Unit | null; onClose: () => void }) {
  const { locale } = useApp();
  const [step, setStep] = useState(0);
  if (!unit) return null;

  const steps = [
    { icon: CalendarDays, title: locale === "th" ? "เลือกวันเข้าชม/ย้ายเข้า" : "Select date" },
    { icon: CheckCircle2, title: locale === "th" ? "ยืนยันยูนิต" : "Confirm unit" },
    { icon: UserRound, title: locale === "th" ? "ข้อมูลผู้จอง" : "Guest info" },
    { icon: CreditCard, title: locale === "th" ? "Mobile Payment" : "Mobile Payment" },
    { icon: CheckCircle2, title: locale === "th" ? "สำเร็จ" : "Success" }
  ];
  const Icon = steps[step].icon;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
      <motion.div
        className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-soft"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-black/60">{copy[locale].bookNow}</p>
            <h2 className="text-xl font-semibold">{unit.id}</h2>
          </div>
          <button className="btn-secondary px-3 py-2" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="mt-5 flex gap-2">
          {steps.map((item, index) => (
            <span key={item.title} className={`h-2 flex-1 rounded-full ${index <= step ? "bg-pruksa-green" : "bg-black/10"}`} />
          ))}
        </div>
        <div className="mt-6 rounded-xl bg-pruksa-green/5 p-5">
          <Icon className="mb-3 text-pruksa-green" />
          <h3 className="text-lg font-semibold">{steps[step].title}</h3>
          {step === 0 && <input className="input mt-4" type="date" />}
          {step === 1 && <p className="mt-3 text-sm text-black/65">{unit.size} sqm · {unit.bedrooms} bed · {baht(unit.rent)}/month</p>}
          {step === 2 && (
            <div className="mt-4 grid gap-3">
              <input className="input" placeholder={locale === "th" ? "ชื่อผู้จอง" : "Guest name"} />
              <input className="input" placeholder={locale === "th" ? "เบอร์โทร" : "Phone"} />
            </div>
          )}
          {step === 3 && <p className="mt-3 text-sm text-black/65">{locale === "th" ? "Mobile Payment coming soon สำหรับเดโมนี้จะจบที่หน้าจอยืนยัน" : "Mobile Payment coming soon. Demo ends at confirmation."}</p>}
          {step === 4 && <p className="mt-3 text-sm text-black/65">{locale === "th" ? "ระบบ mock สร้าง booking request แล้ว และพร้อมส่งต่อ PMS/iPlern ใน Phase 2" : "Mock booking request created and ready for PMS/iPlern in Phase 2."}</p>}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          {step > 0 && step < 4 && <button className="btn-secondary" onClick={() => setStep(step - 1)}>Back</button>}
          {step < 4 ? (
            <button className="btn-primary" onClick={() => setStep(step + 1)}>Next</button>
          ) : (
            <button className="btn-primary" onClick={onClose}>Done</button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
