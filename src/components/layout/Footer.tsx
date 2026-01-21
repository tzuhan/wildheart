"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              {t("common.siteName")}
            </h3>
            <p className="text-sm">{t("footer.description")}</p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.about")}
                </Link>
              </li>

            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              {t("footer.importantNotice")}
            </h3>
            <p className="text-sm text-gray-400">
              {t("footer.importantNoticeText")}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>{t("footer.dataDisclaimer")}</p>
          <p className="mt-2">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
