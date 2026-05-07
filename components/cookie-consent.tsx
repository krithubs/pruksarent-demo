"use client";

import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { copy } from "@/lib/i18n";
import { useApp } from "./app-providers";

export function CookieConsent() {
  const { locale } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!window.localStorage.getItem("pruksa-cookie-consent"));
  }, []);

  const choose = (value: string) => {
    window.localStorage.setItem("pruksa-cookie-consent", value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="glass fixed bottom-4 left-4 right-4 z-50 rounded-xl p-4 md:left-auto md:max-w-xl">
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-pruksa-teal/10 p-2 text-pruksa-teal"><Settings size={20} /></span>
        <div className="flex-1">
          <p className="text-sm leading-6">{copy[locale].cookie}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn-primary py-2" onClick={() => choose("accept")}>{copy[locale].acceptAll}</button>
            <button className="btn-secondary py-2" onClick={() => choose("reject")}>{copy[locale].reject}</button>
            <button className="btn-secondary py-2" onClick={() => choose("custom")}>{copy[locale].customize}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
