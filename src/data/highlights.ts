import type { Highlight } from "@/types/highlight";
import { fetchHighlights } from "./googleSheetsData";

// Cache for fetched data
let highlightsCache: Highlight[] | null = null;

/**
 * Get all highlights (fetches from Google Sheets)
 */
export async function getHighlights(): Promise<Highlight[]> {
    if (highlightsCache) {
        return highlightsCache;
    }
    highlightsCache = await fetchHighlights();
    return highlightsCache;
}

/**
 * Get highlights by organization ID
 */
export async function getHighlightsByOrganizationId(organizationId: string): Promise<Highlight[]> {
    const highlights = await getHighlights();
    return highlights
        .filter((h) => h.organizationId === organizationId)
        .sort(
            (a, b) =>
                new Date(b.curatedAt).getTime() - new Date(a.curatedAt).getTime()
        );
}

/**
 * Get featured highlights
 */
export async function getFeaturedHighlights(): Promise<Highlight[]> {
    const highlights = await getHighlights();
    return highlights
        .filter((h) => h.isFeatured)
        .sort(
            (a, b) =>
                new Date(b.curatedAt).getTime() - new Date(a.curatedAt).getTime()
        );
}

/**
 * Clear highlights cache (useful for revalidation)
 */
export function clearHighlightsCache(): void {
    highlightsCache = null;
}
