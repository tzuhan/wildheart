"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { OrganizationCard, TransparencyBanner, AchievementNotification, UrgencyRankingList, /* UrgencySlider, */ HighlightCarousel } from "@/components/ui";
import { DonationAnimationOverlay } from "@/components/three";
import { useGamification } from "@/contexts/GamificationContext";
import type { OrganizationStatus, OrganizationCategory, Locale, RankedOrganization } from "@/types";
import type { Highlight } from "@/types/highlight";
import { getLocalizedName, getLocalizedDescription } from "@/types";
import { sanitizeSearchInput } from "@/lib/security";

const statusFilters: OrganizationStatus[] = ["red", "orange", "yellow", "green"];

interface HomePageClientProps {
  rankedOrganizations: RankedOrganization[];
  featuredHighlights: Highlight[];
}

export default function HomePageClient({
  rankedOrganizations,
  featuredHighlights,
}: HomePageClientProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  // Temporarily disabled - const [selectedStatus, setSelectedStatus] = useState<OrganizationStatus | "all">("all");
  const selectedStatus: OrganizationStatus | "all" = "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMethod, setSortMethod] = useState<"urgency" | "donation_low" | "donation_high">("donation_low");

  const {
    handleDonationClick,
    pendingAchievements,
    dismissAchievement,
    showAnimation,
    setShowAnimation,
    currentOrganization,
  } = useGamification();

  const filteredOrganizations = useMemo(() => {
    let filtered = rankedOrganizations.filter((org) => {
      if (selectedStatus !== "all" && org.status !== selectedStatus) {
        return false;
      }
      if (searchQuery) {
        const nameMatch = getLocalizedName(org, locale).toLowerCase().includes(searchQuery.toLowerCase());
        const descMatch = getLocalizedDescription(org, locale).toLowerCase().includes(searchQuery.toLowerCase());
        if (!nameMatch && !descMatch) {
          return false;
        }
      }
      return true;
    });

    // Apply sorting based on selected method
    if (sortMethod === "donation_low") {
      filtered = [...filtered].sort((a, b) => {
        const aDonation = a.donation?.amount ?? 0;
        const bDonation = b.donation?.amount ?? 0;

        // Organizations without donation data (0) go to the end
        if (aDonation === 0 && bDonation === 0) {
          // Tie-breaker: sort by urgency level (highest first) for consistency
          return b.urgencyLevel - a.urgencyLevel;
        }
        if (aDonation === 0) return 1;
        if (bDonation === 0) return -1;
        return aDonation - bDonation;
      });
    } else if (sortMethod === "donation_high") {
      filtered = [...filtered].sort((a, b) => {
        const aDonation = a.donation?.amount ?? 0;
        const bDonation = b.donation?.amount ?? 0;

        // Organizations without donation data (0) go to the end
        if (aDonation === 0 && bDonation === 0) {
          // Tie-breaker: sort by urgency level (highest first) for consistency
          return b.urgencyLevel - a.urgencyLevel;
        }
        if (aDonation === 0) return 1;
        if (bDonation === 0) return -1;
        return bDonation - aDonation;
      });
    }
    // Default: "urgency" - already sorted by urgency from rankedOrganizations

    return filtered;
  }, [rankedOrganizations, selectedStatus, searchQuery, locale, sortMethod]);

  const currentOrgData = currentOrganization
    ? rankedOrganizations.find((o) => o.id === currentOrganization)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">


      <main className="flex-grow">
        {/* Weekly Highlights Carousel - Hero Section */}
        <div className="w-full hidden">
          <HighlightCarousel highlights={featuredHighlights} organizations={rankedOrganizations} />
        </div>

        {/* Transparency Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-4 ">
          <TransparencyBanner />
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Filters and Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div>
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("home.searchOrganizations")}
                  </label>
                  <input
                    type="text"
                    id="search"
                    placeholder={t("home.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(sanitizeSearchInput(e.target.value))}
                    maxLength={100}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter / Urgency Slider - temporarily hidden */}
                {/* <div>
                  <UrgencySlider
                    value={selectedStatus}
                    onChange={(value) => setSelectedStatus(value)}
                  />
                </div> */}

                {/* Sort Method */}
                <div>
                  <label
                    htmlFor="sortMethod"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("home.sortBy")}
                  </label>
                  <select
                    id="sortMethod"
                    value={sortMethod}
                    onChange={(e) => setSortMethod(e.target.value as "urgency" | "donation_low" | "donation_high")}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  >
                    {/* <option value="urgency">{t("home.sortByUrgency")}</option> */}
                    <option value="donation_low">{t("home.sortByDonationLow")}</option>
                    <option value="donation_high">{t("home.sortByDonationHigh")}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div>
              <p className="text-gray-600">
                {t("home.showingResults", {
                  count: filteredOrganizations.length,
                  total: rankedOrganizations.length,
                })}
              </p>
            </div>

            {/* Organizations Grid */}
            {filteredOrganizations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOrganizations.map((org) => (
                  <OrganizationCard
                    key={org.id}
                    organization={org}
                    locale={locale}
                    onDonationClick={handleDonationClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">{t("home.noResults")}</p>
              </div>
            )}
          </div>

          {/* Right Column: Ranking List */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <UrgencyRankingList rankedOrganizations={filteredOrganizations} sortMethod={sortMethod} />
            </div>
          </div>
        </div>
      </main>

      {/* Donation Animation Overlay */}
      <DonationAnimationOverlay
        isVisible={showAnimation}
        onClose={() => setShowAnimation(false)}
        organizationName={currentOrgData ? getLocalizedName(currentOrgData, locale) : undefined}
      />

      {/* Achievement Notifications */}
      {pendingAchievements.map((achievement) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onDismiss={() => dismissAchievement(achievement.id)}
        />
      ))}
    </div>
  );
}
