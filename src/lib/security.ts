/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitize search input to prevent potential issues
 * - Removes HTML tags
 * - Limits length to prevent DoS
 * - Trims whitespace
 */
export function sanitizeSearchInput(input: string, maxLength: number = 100): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  return input
    .trim()
    .slice(0, maxLength)
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove potential script injection patterns
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "");
}

/**
 * Validate that a URL is safe to open (http/https only)
 */
export function isValidExternalUrl(url: string): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  try {
    const parsed = new URL(url);
    return /^https?:$/.test(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate Google Analytics measurement ID format
 */
export function isValidGAId(id: string): boolean {
  if (!id || typeof id !== "string") {
    return false;
  }
  // GA4 format: G-XXXXXXXXXX
  return /^G-[A-Z0-9]+$/.test(id);
}

/**
 * Validate Google AdSense client ID format
 */
export function isValidAdSenseId(id: string): boolean {
  if (!id || typeof id !== "string") {
    return false;
  }
  // AdSense format: ca-pub-XXXXXXXXXXXXXXXX
  return /^ca-pub-\d+$/.test(id);
}
