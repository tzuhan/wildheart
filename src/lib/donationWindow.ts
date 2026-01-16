import type { Organization, Locale } from "@/types";
import { getLocalizedName } from "@/types";

/**
 * Parse MM-DD format and return month (0-11) and day (1-31)
 */
function parseMonthDay(mmdd: string): { month: number; day: number } | null {
    const match = mmdd.match(/^(\d{2})-(\d{2})$/);
    if (!match) return null;

    const month = parseInt(match[1], 10) - 1; // 0-indexed
    const day = parseInt(match[2], 10);

    if (month < 0 || month > 11 || day < 1 || day > 31) return null;

    return { month, day };
}

/**
 * Check if an organization's donation window is currently open (year-agnostic)
 */
export function isDonationWindowOpen(
    organization: Organization,
    currentDate: Date = new Date()
): boolean {
    const { donationStartDate, donationEndDate } = organization;

    // If no window is defined, donations are always open
    if (!donationStartDate && !donationEndDate) {
        return true;
    }

    const now = {
        month: currentDate.getMonth(),
        day: currentDate.getDate(),
    };

    // Parse start and end dates
    const start = donationStartDate ? parseMonthDay(donationStartDate) : null;
    const end = donationEndDate ? parseMonthDay(donationEndDate) : null;

    if (!start && !end) return true;

    // Convert to comparable numbers (MMDD as integer)
    const nowCompare = now.month * 100 + now.day;
    const startCompare = start ? start.month * 100 + start.day : 0;
    const endCompare = end ? end.month * 100 + end.day : 1231;

    // Handle year-wrapping windows (e.g., 12-15 to 02-15)
    if (startCompare > endCompare) {
        // Window wraps around year boundary
        return nowCompare >= startCompare || nowCompare <= endCompare;
    } else {
        // Normal window within same year
        return nowCompare >= startCompare && nowCompare <= endCompare;
    }
}

/**
 * Create a Google Calendar link to remind user when donations open
 * @param organization The organization
 * @param locale Current locale
 * @param t Translation function that accepts keys like "calendarTitle" and "calendarDetails"
 */
export function createGoogleCalendarLink(
    organization: Organization,
    locale: Locale = "en",
    t?: (key: string, values?: Record<string, string>) => string
): string | null {
    const { donationStartDate } = organization;

    if (!donationStartDate) {
        return null;
    }

    const parsed = parseMonthDay(donationStartDate);
    if (!parsed) return null;

    // Calculate next occurrence of the start date
    const now = new Date();
    const currentYear = now.getFullYear();
    let startDate = new Date(currentYear, parsed.month, parsed.day);

    // If the date has already passed this year, schedule for next year
    if (startDate < now) {
        startDate = new Date(currentYear + 1, parsed.month, parsed.day);
    }

    const orgName = getLocalizedName(organization, locale);

    // Use translations if provided, otherwise fall back to English defaults
    const title = t
        ? t("calendarTitle", { name: orgName })
        : `勸募開始日期: ${orgName}`;
    const details = t
        ? t("calendarDetails", { name: orgName })
        : `本年度勸募開始日期: ${orgName}`;

    const encodedTitle = encodeURIComponent(title);
    const encodedDetails = encodeURIComponent(details);

    // Format as all-day event: YYYYMMDD/YYYYMMDD (start and end dates)
    const formatAllDayDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}${month}${day}`;
    };

    // All-day events need start and end date (same date for single day)
    const dates = `${formatAllDayDate(startDate)}/${formatAllDayDate(startDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${dates}&details=${encodedDetails}`;
}

/**
 * Get donation window status and dates (converted to current/next year)
 */
export function getDonationWindowInfo(organization: Organization): {
    isOpen: boolean;
    startDate?: Date;
    endDate?: Date;
    hasFutureWindow: boolean;
} {
    const isOpen = isDonationWindowOpen(organization);
    const now = new Date();
    const currentYear = now.getFullYear();

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (organization.donationStartDate) {
        const parsed = parseMonthDay(organization.donationStartDate);
        if (parsed) {
            startDate = new Date(currentYear, parsed.month, parsed.day);
            if (startDate < now) {
                startDate = new Date(currentYear + 1, parsed.month, parsed.day);
            }
        }
    }

    if (organization.donationEndDate) {
        const parsed = parseMonthDay(organization.donationEndDate);
        if (parsed) {
            endDate = new Date(currentYear, parsed.month, parsed.day);
            // If end date is before start date, it wraps to next year
            if (startDate && endDate < startDate) {
                endDate = new Date(currentYear + 1, parsed.month, parsed.day);
            }
        }
    }

    const hasFutureWindow =
        !!startDate && startDate.getTime() > now.getTime();

    return {
        isOpen,
        startDate,
        endDate,
        hasFutureWindow,
    };
}
