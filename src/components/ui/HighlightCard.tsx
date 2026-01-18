"use client";

import { useLocale, useTranslations } from "next-intl";
import { Highlight, getLocalizedHighlightTitle, getLocalizedHighlightSummary } from "@/types/highlight";
import { useGamification } from "@/contexts/GamificationContext";
import type { Locale } from "@/types";

interface HighlightCardProps {
    highlight: Highlight;
    showOrgName?: boolean;
    orgName?: string;
}

export function HighlightCard({
    highlight,
    showOrgName = false,
    orgName,
}: HighlightCardProps) {
    const t = useTranslations("highlights");
    const locale = useLocale() as Locale;
    const { handleWatering } = useGamification();

    const handleClick = () => {
        handleWatering();
        window.open(highlight.sourceURL, "_blank", "noopener,noreferrer");
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
        >
            {highlight.category !== "homepage" && (
                <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#656D3F] text-white capitalize">
                        {t(`category.${highlight.category}`)}
                    </span>
                </div>
            )}

            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {getLocalizedHighlightTitle(highlight, locale)}
            </h3>

            {showOrgName && orgName && (
                <p className="text-sm text-[#84934A] font-medium mb-2">{orgName}</p>
            )}

            <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
                {getLocalizedHighlightSummary(highlight, locale)}
            </p>

            <div className="flex items-center text-sm text-[#84934A] hover:text-[#6b7a3b] font-medium mt-auto transition-colors">
                {t("readMore")}
                <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                </svg>
            </div>
        </div>
    );
}
