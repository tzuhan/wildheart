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
        window.open(highlight.sourceUrl, "_blank", "noopener,noreferrer");
    };

    const formattedDate = new Date(highlight.publishedAt).toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#84934A] text-emerald-800 capitalize">
                    {highlight.category}
                </span>
                <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {getLocalizedHighlightTitle(highlight, locale)}
            </h3>

            {showOrgName && orgName && (
                <p className="text-sm text-emerald-600 font-medium mb-2">{orgName}</p>
            )}

            <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
                {getLocalizedHighlightSummary(highlight, locale)}
            </p>

            <div className="flex items-center text-sm text-emerald-600 font-medium mt-auto">
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
