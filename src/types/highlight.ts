import type { Locale } from "./organization";

export interface Highlight {
    id: string;
    orgId?: string;
    titleZh: string;
    titleEn: string;
    summaryZh: string;
    summaryEn: string;
    sourceUrl: string;
    publishedAt: string; // ISODateString
    curatedAt: string; // ISODateString
    category: "rescue" | "education" | "fundraising" | "milestone" | "policy";
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
