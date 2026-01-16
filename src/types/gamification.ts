export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string; // ISO Date String
}

export interface UserProgress {
  supportedOrganizations: string[]; // Organization IDs
  supportConfirmations: SupportConfirmation[];
  achievements: Achievement[];
  totalClicks: number;
  lastWateringDate?: string; // ISO Date String
  wateringCredits: number;
}

export interface SupportConfirmation {
  organizationId: string;
  confirmedAt: string; // ISO Date String
}

export type AnalyticsEvent =
  | "donation_link_clicked"
  | "support_confirmed"
  | "page_view"
  | "organization_viewed";

export interface AnalyticsPayload {
  event: AnalyticsEvent;
  organizationId?: string;
  timestamp: string;
  metadata?: Record<string, string>;
}
