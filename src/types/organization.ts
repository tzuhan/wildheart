export type Locale = "zh-TW" | "en";

export type OrganizationCategory =
  | "Wildlife Rescue"
  | "Habitat Conservation and Education"
  | "Bird Protection"
  | "Marine Conservation"
  | "Endangered Species"
  | "Wildlife Rehabilitation";

export type UrgencyLevel = 1 | 2 | 3 | 4 | 5;

export type OrganizationStatus = "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "gray";

export interface Organization {
  id: string;
  isShow: boolean;
  nameZh: string;
  nameEn: string;
  descriptionZh: string;
  descriptionEn: string;
  detailZh?: string; // Extended description/details
  detailEn?: string; // Extended description/details
  category: OrganizationCategory;
  regionZh: string;
  regionEn: string;
  urgencyLevel: UrgencyLevel;
  donationUrl: string;
  lastUpdateAt: string; // ISO Date String
  status: OrganizationStatus;
  imageURL?: string;
  donationStartDate?: string; // MM-DD format (e.g., "02-01" for Feb 1), recurring annually
  donationEndDate?: string; // MM-DD format (e.g., "03-31" for Mar 31), recurring annually
  invoiceDonationCode?: string; // Optional donation code for invoicing purposes
  websiteUrl?: string; // Organization's official website
  snsUrl?: string; // Social media URL (e.g., Facebook)
  shopUrl?: string; // Online shop URL
  comment?: string; // Additional comments
}

// 勸募捐款 - Fundraising from fundraisingData tab
export interface FundraisingInfo {
  organizationId: string;
  year: number;
  targetAmount: number; // in NTD
  raisedAmount: number; // in NTD
  activityNameZh: string;
  activityNameEn: string;
  fundActivityUrl?: string; // URL to fundraising activity page
}

// 一般捐款 - General donations from organizations tab
export interface DonationInfo {
  organizationId: string;
  year: number;
  amount: number; // in NTD
  reportUrl?: string; // URL to donation report
}

export interface OrganizationWithIncome extends Organization {
  fundraising?: FundraisingInfo; // 勸募捐款
  donation?: DonationInfo; // 一般捐款
}

export interface RankedOrganization extends OrganizationWithIncome {
  urgencyScore: number;
  fundingGapRatio?: number;
}

// Helper function to get localized organization name
export function getLocalizedName(org: Organization, locale: Locale): string {
  return locale === "en" ? org.nameEn : org.nameZh;
}

// Helper function to get localized organization description
export function getLocalizedDescription(org: Organization, locale: Locale): string {
  return locale === "en" ? org.descriptionEn : org.descriptionZh;
}

// Helper function to get localized region
export function getLocalizedRegion(org: Organization, locale: Locale): string {
  return locale === "en" ? org.regionEn : org.regionZh;
}

// Helper function to get localized detail
export function getLocalizedDetail(org: Organization, locale: Locale): string | undefined {
  return locale === "en" ? org.detailEn : org.detailZh;
}

// Helper function to get localized reporting period
export function getLocalizedActivityName(fundraising: FundraisingInfo, locale: Locale): string {
  return locale === "en" ? fundraising.activityNameEn : fundraising.activityNameZh;
}
