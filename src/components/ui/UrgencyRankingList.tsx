"use client";

import { useTranslations, useLocale } from "next-intl";
import { RankedOrganization, Locale, getLocalizedName } from "@/types";
import { formatCurrency } from "@/lib/ranking";

type SortMethod = "urgency" | "donation_low" | "donation_high";

interface UrgencyRankingListProps {
    rankedOrganizations: RankedOrganization[];
    sortMethod?: SortMethod;
}

export function UrgencyRankingList({ rankedOrganizations, sortMethod = "urgency" }: UrgencyRankingListProps) {
    const t = useTranslations();
    const locale = useLocale() as Locale;

    // Show all organizations (already sorted based on current sort method)
    const topOrgs = rankedOrganizations;

    // Get the appropriate title based on sort method
    const getTitleKey = () => {
        switch (sortMethod) {
            case "donation_low":
                return "ranking.titleDonationLow";
            case "donation_high":
                return "ranking.titleDonationHigh";
            default:
                return "ranking.titleUrgency";
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t(getTitleKey())}
            </h2>
            <div className="space-y-3">
                {topOrgs.map((org, index) => (
                    <div key={org.id} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className={`
                                flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0
                                ${index < 3 ? 'bg-[#84934A] text-[#ECECEC]' : 'bg-gray-100 text-gray-600'}
                            `}>
                                {index + 1}
                            </span>
                            <span className="font-medium text-gray-900 truncate text-sm">
                                {getLocalizedName(org, locale)}
                            </span>
                        </div>
                        <span className="text-sm font-medium text-blue-700 whitespace-nowrap">
                            {org.donation?.amount ? formatCurrency(org.donation.amount) : '-'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
