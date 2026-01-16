import type { Organization, FundraisingInfo, DonationInfo } from "@/types";
import {
  fetchOrganizations,
  fetchFundraisingData,
  fetchDonationData,
} from "./googleSheetsData";

// Cache for fetched data
let organizationsCache: Organization[] | null = null;
let fundraisingCache: FundraisingInfo[] | null = null;
let donationCache: DonationInfo[] | null = null;

/**
 * Get all organizations (fetches from Google Sheets)
 */
export async function getOrganizations(): Promise<Organization[]> {
  if (organizationsCache) {
    return organizationsCache;
  }
  organizationsCache = await fetchOrganizations();
  return organizationsCache;
}

/**
 * Get organization by ID
 */
export async function getOrganizationById(
  id: string
): Promise<Organization | undefined> {
  const orgs = await getOrganizations();
  return orgs.find((org) => org.id === id);
}

/**
 * Get all fundraising data
 */
export async function getFundraisingData(): Promise<FundraisingInfo[]> {
  if (fundraisingCache) {
    return fundraisingCache;
  }
  fundraisingCache = await fetchFundraisingData();
  return fundraisingCache;
}

/**
 * Get fundraising data by organization ID (returns most recent year)
 */
export async function getFundraisingByOrgId(
  orgId: string
): Promise<FundraisingInfo | undefined> {
  const data = await getFundraisingData();
  return data.find((f) => f.organizationId === orgId);
}

/**
 * Get all fundraising data by organization ID (returns all years, sorted by year descending)
 */
export async function getAllFundraisingByOrgId(
  orgId: string
): Promise<FundraisingInfo[]> {
  const data = await getFundraisingData();
  return data
    .filter((f) => f.organizationId === orgId)
    .sort((a, b) => b.year - a.year);
}

/**
 * Get all donation data
 */
export async function getDonationData(): Promise<DonationInfo[]> {
  if (donationCache) {
    return donationCache;
  }
  donationCache = await fetchDonationData();
  return donationCache;
}

/**
 * Get donations by organization ID
 */
export async function getDonationsByOrgId(
  orgId: string
): Promise<DonationInfo[]> {
  const data = await getDonationData();
  return data.filter((d) => d.organizationId === orgId);
}

/**
 * Clear all caches (useful for revalidation)
 */
export function clearCache(): void {
  organizationsCache = null;
  fundraisingCache = null;
  donationCache = null;
}

// For backwards compatibility with components that import `organizations` directly
// This will be an empty array initially and should be replaced with async calls
export const organizations: Organization[] = [];
export const fundraisingData: FundraisingInfo[] = [];
export const donationData: DonationInfo[] = [];
