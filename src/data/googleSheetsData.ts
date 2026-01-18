/**
 * Data fetching from Google Sheets
 *
 * Configure your Google Sheet ID in the environment variable:
 * NEXT_PUBLIC_GOOGLE_SHEET_ID=your-sheet-id-here
 *
 * Required sheets and columns:
 *
 * Sheet: "organizations"
 * Columns: id, is_show, name_zh, name_en, description_zh, description_en, detail_zh,
 *          category, region_zh, region_en, urgencyLevel,
 *          organizationURL, snsURL, donationURL, shopURL, status, recentYear,
 *          recentYearDonationReportURL, donationAmount, imageURL, donationStartDate,
 *          donationEndDate, invoiceDonationCode, lastUpdateAt, comment
 *
 * Sheet: "fundraisingData"
 * Columns: organizationId, year, targetAmount, raisedAmount, activityNameZh, activityNameEn, fundActivityURL
 *
 * Sheet: "highlights"
 * Columns: id, organizationId, titleZh, titleEn, summaryZh, summaryEn, sourceURL, imageURL, curatedAt, category, isFeatured
 */

import {
  fetchGoogleSheet,
  parseNumber,
  parseBoolean,
  type GoogleSheetConfig,
} from "@/lib/googleSheets";
import type {
  Organization,
  FundraisingInfo,
  DonationInfo,
  OrganizationStatus,
  OrganizationCategory,
  UrgencyLevel,
} from "@/types";
import type { Highlight } from "@/types/highlight";
import { parse } from "path";

// Get sheet ID from environment variable
const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || "";

// Sheet configurations
const organizationsSheet: GoogleSheetConfig = {
  sheetId: SHEET_ID,
  sheetName: "organizations",
};

const fundraisingDataSheet: GoogleSheetConfig = {
  sheetId: SHEET_ID,
  sheetName: "fundraisingData",
};

const highlightsSheet: GoogleSheetConfig = {
  sheetId: SHEET_ID,
  sheetName: "highlights",
};

// Raw row types from CSV (using underscore naming from Google Sheets)
// All fields are strings from CSV, optional fields default to empty string
interface OrganizationRow extends Record<string, string> {
  id: string;
  is_show: string;
  name_zh: string;
  name_en: string;
  description_zh: string;
  description_en: string;
  detail_zh: string;
  category: string;
  region_zh: string;
  region_en: string;
  urgencyLevel: string;
  organizationURL: string;
  snsURL: string;
  donationURL: string;
  shopURL: string;
  status: string;
  recentYear: string;
  recentYearDonationReportURL: string;
  donationAmount: string;
  imageURL: string;
  donationStartDate: string;
  donationEndDate: string;
  invoiceDonationCode: string;
  lastUpdateAt: string;
  comment: string;
}

interface FundraisingDataRow extends Record<string, string> {
  organizationId: string;
  year: string;
  targetAmount: string;
  raisedAmount: string;
  activityNameZh: string;
  activityNameEn: string;
  fundActivityURL: string;
}

interface HighlightRow extends Record<string, string> {
  id: string;
  organizationId: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  sourceURL: string;
  imageURL: string;
  curatedAt: string;
  category: string;
  isFeatured: string;
}

/**
 * Fetch organizations from Google Sheets
 */
export async function fetchOrganizations(): Promise<Organization[]> {
  if (!SHEET_ID) {
    console.warn("NEXT_PUBLIC_GOOGLE_SHEET_ID not set, using empty data");
    return [];
  }

  const rows = await fetchGoogleSheet<OrganizationRow>(organizationsSheet);

  return rows.map((row) => ({
    id: row.id,
    isShow: parseBoolean(row.is_show),
    nameZh: row.name_zh,
    nameEn: row.name_en,
    descriptionZh: row.description_zh,
    descriptionEn: row.description_en,
    detailZh: row.detail_zh || undefined,
    detailEn: undefined, // Not in current schema
    category: row.category as OrganizationCategory,
    regionZh: row.region_zh,
    regionEn: row.region_en,
    urgencyLevel: (parseNumber(row.urgencyLevel) || 1) as UrgencyLevel,
    donationUrl: row.donationURL,
    lastUpdateAt: row.lastUpdateAt,
    status: row.status as OrganizationStatus,
    imageURL: row.imageURL || undefined,
    donationStartDate: row.donationStartDate || undefined,
    donationEndDate: row.donationEndDate || undefined,
    invoiceDonationCode: row.invoiceDonationCode || undefined,
    websiteUrl: row.organizationURL || undefined,
    snsUrl: row.snsURL || undefined,
    shopUrl: row.shopURL || undefined,
    comment: row.comment || undefined,
  }));
}

/**
 * Fetch fundraising data (勸募捐款) from Google Sheets fundraisingData tab
 */
export async function fetchFundraisingData(): Promise<FundraisingInfo[]> {
  if (!SHEET_ID) {
    return [];
  }

  const rows = await fetchGoogleSheet<FundraisingDataRow>(fundraisingDataSheet);

  return rows.map((row) => ({
    organizationId: row.organizationId,
    year: parseNumber(row.year) || new Date().getFullYear(),
    targetAmount: parseNumber(row.targetAmount) || 0,
    raisedAmount: parseNumber(row.raisedAmount) || 0,
    activityNameZh: row.activityNameZh,
    activityNameEn: row.activityNameEn,
    fundActivityUrl: row.fundActivityURL || undefined,
  }));
}

/**
 * Fetch donation data (一般捐款) from Google Sheets organizations tab
 */
export async function fetchDonationData(): Promise<DonationInfo[]> {
  if (!SHEET_ID) {
    return [];
  }

  const rows = await fetchGoogleSheet<OrganizationRow>(organizationsSheet);

  // Filter rows that have donation data
  return rows
    .filter((row) => row.recentYear && row.donationAmount)
    .map((row) => ({
      organizationId: row.id,
      year: parseNumber(row.recentYear) || new Date().getFullYear(),
      amount: parseNumber(row.donationAmount) || 0,
      reportUrl: row.recentYearDonationReportURL || undefined,
    }));
}

/**
 * Fetch highlights from Google Sheets
 */
export async function fetchHighlights(): Promise<Highlight[]> {
  if (!SHEET_ID) {
    return [];
  }

  const rows = await fetchGoogleSheet<HighlightRow>(highlightsSheet);

  return rows.map((row) => ({
    id: row.id,
    organizationId: row.organizationId || undefined,
    titleZh: row.titleZh,
    titleEn: row.titleEn,
    summaryZh: row.summaryZh,
    summaryEn: row.summaryEn,
    sourceURL: row.sourceURL,
    imageURL: row.imageURL || undefined,
    curatedAt: row.curatedAt,
    category: row.category as Highlight["category"],
    isFeatured: parseBoolean(row.isFeatured),
  }));
}
