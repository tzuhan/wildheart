import type { Locale } from "./organization";

export interface Highlight {
    id: string;
    organizationId?: string;
    titleZh: string;
    titleEn: string;
    summaryZh: string;
    summaryEn: string;
    sourceURL: string;
    imageURL?: string; // Background image URL
    curatedAt: string; // ISODateString
    category: "rescue" | "education" | "fundraising" | "milestone" | "policy" | "homepage";
    isFeatured: boolean;
}

// Helper function to get localized title
export function getLocalizedHighlightTitle(highlight: Highlight, locale: Locale): string {
    return locale === "en" ? highlight.titleEn : highlight.titleZh;
}

// Helper function to get localized summary
export function getLocalizedHighlightSummary(highlight: Highlight, locale: Locale): string {
    return locale === "en" ? highlight.summaryEn : highlight.summaryZh;
}
