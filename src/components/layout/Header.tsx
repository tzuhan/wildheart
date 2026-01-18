"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/ui";
import Image from "next/image";
import logo from "@/app/logo.svg";

export function Header() {
  const t = useTranslations();

  return (
    <header className="bg-[#656D3F] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <Image src={logo} alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold">{t("common.siteName")}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/about"
              className="hover:text-emerald-200 transition-colors"
            >
              {t("nav.about")}
            </Link>
            <LanguageSwitcher />
          </nav>

          {/* Mobile view: show LanguageSwitcher and a question mark linking to /about */}
          <div className="flex items-center space-x-4 md:hidden">
            <LanguageSwitcher />
            <Link
              href="/about"
              aria-label="About"
              className="hover:text-emerald-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
