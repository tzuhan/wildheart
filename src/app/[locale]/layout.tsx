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
  title: "Wildlife Conservation Hub - Support Wildlife Organizations",
  description:
    "Discover wildlife organizations that need your support. Find where your contribution can make the biggest impact for conservation efforts.",
  keywords: [
    "wildlife conservation",
    "donation",
    "wildlife rescue",
    "habitat protection",
    "endangered species",
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
