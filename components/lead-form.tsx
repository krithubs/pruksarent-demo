"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { copy } from "@/lib/i18n";
import { useApp } from "./app-providers";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  moveIn: z.string().min(1),
  message: z.string().optional(),
  consent: z.literal(true)
});

type FormValues = z.infer<typeof schema>;

export function LeadForm({ compact = false }: { compact?: boolean }) {
  const { locale } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  if (submitted) {
    return (
      <div className="rounded-xl bg-pruksa-green/10 p-5 text-pruksa-green">
        <CheckCircle2 className="mb-2" />
        <p className="font-semibold">{copy[locale].success}</p>
        <p className="mt-1 text-sm text-black/65">
          {locale === "th" ? "ข้อมูล Lead ถูกบันทึกในระบบ mock และพร้อมส่งต่อ CRM/CDP ใน Phase 2" : "Lead captured in the mock flow and ready for CRM/CDP in Phase 2."}
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(() => setSubmitted(true))}>
      <h3 className="text-lg font-semibold">{copy[locale].leadTitle}</h3>
      <input className="input" placeholder={locale === "th" ? "ชื่อ-นามสกุล" : "Full name"} {...register("name")} />
      <input className="input" placeholder={locale === "th" ? "เบอร์โทร" : "Phone"} {...register("phone")} />
      <input className="input" placeholder="Email" {...register("email")} />
      <input className="input" type="date" {...register("moveIn")} />
      {!compact && <textarea className="input min-h-24" placeholder={locale === "th" ? "ข้อความเพิ่มเติม" : "Message"} {...register("message")} />}
      <label className="flex gap-2 text-xs leading-5 text-black/65">
        <input type="checkbox" className="mt-1" {...register("consent")} />
        <span>
          {locale === "th" ? "ยินยอมให้ Pruksa ติดต่อกลับและประมวลผลข้อมูลตามนโยบาย PDPA" : "I consent to contact and data processing under the PDPA policy."}
        </span>
      </label>
      {Object.keys(errors).length > 0 && <p className="text-xs text-pruksa-orange">{locale === "th" ? "กรุณากรอกข้อมูลให้ครบถ้วน" : "Please complete all required fields."}</p>}
      <button className="btn-primary" type="submit">{locale === "th" ? "ส่งข้อมูล" : "Submit"}</button>
    </form>
  );
}
