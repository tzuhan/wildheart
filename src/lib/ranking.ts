import type {
  Organization,
  FundraisingInfo,
  DonationInfo,
  RankedOrganization,
  OrganizationStatus,
} from "@/types";

export function calculateDaysSince(isoDateString: string): number {
  const date = new Date(isoDateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function calculateFundingGapRatio(
  fundraising: FundraisingInfo | undefined
): number | undefined {
  if (!fundraising || fundraising.targetAmount === 0) {
    return undefined;
  }
  const gap = fundraising.targetAmount - fundraising.raisedAmount;
  return Math.max(0, gap / fundraising.targetAmount);
}

export function calculateUrgencyScore(
  organization: Organization,
  fundraising?: FundraisingInfo
): number {
  const daysSinceUpdate = calculateDaysSince(organization.lastUpdateAt);
  const gapRatio = calculateFundingGapRatio(fundraising);

  // Base score from urgency level (1-5 scale, multiplied by 10)
  let score = organization.urgencyLevel * 10;

  // Add funding gap contribution if available (0-1 ratio, multiplied by 20)
  if (gapRatio !== undefined) {
    score += gapRatio * 20;
  }

  // Add recency factor (more recent updates get slight boost)
  // Days since last update, multiplied by 1.5
  score += daysSinceUpdate * 1.5;

  return Math.round(score * 100) / 100;
}

export function determineStatusFromGap(
  gapRatio: number | undefined
): OrganizationStatus {
  if (gapRatio === undefined) {
    return "yellow"; // Default when no data
  }

  if (gapRatio > 0.7) {
    return "red"; // Most Urgent: Funding gap more than 70%
  } else if (gapRatio > 0.3) {
    return "orange"; // Needs Immediate Support: 30-70%
  } else if (gapRatio > 0.1) {
    return "yellow"; // Ongoing Support Needed: 10-30%
  } else {
    return "green"; // Healthy: Less than 10%
  }
}

export function getStatusLabel(status: OrganizationStatus): string {
  switch (status) {
    case "red":
      return "Most Urgent";
    case "orange":
      return "Needs Immediate Support";
    case "yellow":
      return "Ongoing Support Needed";
    case "green":
      return "Stable";
    case "blue":
      return "Well Resourced";
    case "purple":
      return "Highly Resourced";
    case "gray":
      return "Unknown Status";
  }
}

export function getStatusDescription(status: OrganizationStatus): string {
  switch (status) {
    case "red":
      return "Annual fundraising under 1 million NTD";
    case "orange":
      return "Annual fundraising between 1-3 million NTD";
    case "yellow":
      return "Annual fundraising between 3-6 million NTD";
    case "green":
      return "Annual fundraising between 6-15 million NTD";
    case "blue":
      return "Annual fundraising between 15-100 million NTD";
    case "purple":
      return "Annual fundraising over 100 million NTD";
    case "gray":
      return "Annual fundraising status unknown";
  }
}

export function rankOrganizations(
  organizations: Organization[],
  fundraisingData: FundraisingInfo[],
  donationData: DonationInfo[] = []
): RankedOrganization[] {
  // Filter to only show organizations with isShow=true
  const visibleOrganizations = organizations.filter((org) => org.isShow);

  // Group fundraising data by organizationId and pick the latest year for each
  const fundraisingMap = new Map<string, FundraisingInfo>();
  for (const f of fundraisingData) {
    const existing = fundraisingMap.get(f.organizationId);
    if (!existing || f.year > existing.year) {
      fundraisingMap.set(f.organizationId, f);
    }
  }

  const donationMap = new Map(
    donationData.map((d) => [d.organizationId, d])
  );

  const ranked: RankedOrganization[] = visibleOrganizations.map((org) => {
    const fundraising = fundraisingMap.get(org.id);
    const donation = donationMap.get(org.id);
    const fundingGapRatio = calculateFundingGapRatio(fundraising);
    const urgencyScore = calculateUrgencyScore(org, fundraising);

    return {
      ...org,
      fundraising,
      donation,
      urgencyScore,
      fundingGapRatio,
    };
  });

  // Sort by urgencyLevel first (5 is most urgent, so highest first),
  // then by donation amount (lowest first, 0 goes to end)
  return ranked.sort((a, b) => {
    // First, sort by urgency level (highest first)
    if (a.urgencyLevel !== b.urgencyLevel) {
      return b.urgencyLevel - a.urgencyLevel;
    }

    // If same urgency level, sort by donation amount (lowest first, 0 at end)
    const aDonation = a.donation?.amount ?? 0;
    const bDonation = b.donation?.amount ?? 0;

    if (aDonation === 0 && bDonation === 0) return 0;
    if (aDonation === 0) return 1;
    if (bDonation === 0) return -1;
    return aDonation - bDonation;
  });
}

export function formatCurrency(amount: number, currency: string = "TWD"): string {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}
