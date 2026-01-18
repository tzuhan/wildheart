import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header, Footer } from "@/components/layout";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { GoogleAnalytics } from "@/components/analytics";
import { AdSenseScript } from "@/components/ads";
import { locales, type Locale } from "@/i18n/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "野保報報 WildHeart Bulletin - 台灣野生動物保育捐款資訊平台",
  description:
    "發掘急需支持的台灣野生動物保育組織，找出您的捐款能產生最大影響力的地方。整理各野保團體募款資訊，讓支持野保變得更清楚、更容易。",
  keywords: [
    "台灣野生動物保育",
    "野生動物捐款",
    "野生動物救援",
    "棲地保護",
    "瀕危物種",
    "wildlife conservation Taiwan",
    "wildlife donation",
  ],
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
        <AdSenseScript adClient={ADSENSE_CLIENT} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
          <GamificationProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </GamificationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
