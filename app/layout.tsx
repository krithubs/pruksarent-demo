import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { CompareDrawer } from "@/components/compare-drawer";
import { FloatingActions } from "@/components/floating-actions";
import { ScrollProgress } from "@/components/scroll-progress";

export const metadata: Metadata = {
  title: "Pruksa Rental Website Demo",
  description: "Bilingual rental property website demo for Pruksa Real Estate.",
  openGraph: {
    title: "Pruksa Rental",
    description: "Find rental homes, compare units and book online.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <AppProviders>
          <ScrollProgress />
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingActions />
          <CompareDrawer />
          <CookieConsent />
        </AppProviders>
      </body>
    </html>
  );
}
