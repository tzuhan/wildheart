"use client";

import { Link } from "@/i18n/navigation";
import type { RankedOrganization, Locale } from "@/types";
import {
  getLocalizedName,
  getLocalizedDescription,
  getLocalizedRegion,
} from "@/types";
import { StatusBadge } from "./StatusBadge";
import { CategoryBadge } from "./CategoryBadge";
import { InvoiceDonationCodeBadge } from "./InvoiceDonationCodeBadge";
import { ProgressBar } from "./ProgressBar";
import { formatCurrency } from "@/lib/ranking";
import { useTranslations } from "next-intl";

interface OrganizationCardProps {
  organization: RankedOrganization;
  locale: Locale;
  onDonationClick?: (orgId: string) => void;
}

export function OrganizationCard({
  organization,
  locale,
  onDonationClick,
}: OrganizationCardProps) {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();
  const isCurrentYearFundraising = organization.fundraising?.year === currentYear;
  const progress = organization.fundraising && isCurrentYearFundraising
    ? (organization.fundraising.raisedAmount /
      organization.fundraising.targetAmount) *
    100
    : undefined;

  const handleDonationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onDonationClick?.(organization.id);
    window.open(organization.donationUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <Link href={`/organization/${organization.id}`}>
              <h3 className="text-xl font-semibold text-gray-900 hover:text-emerald-700 transition-colors">
                {getLocalizedName(organization, locale)}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 mt-1">{getLocalizedRegion(organization, locale)}</p>
          </div>
          <StatusBadge status={organization.status} dotOnly={organization.status !== "gray"} />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {organization.category === "Wildlife Rescue" && (
            <CategoryBadge category={organization.category} />
          )}
          {organization.invoiceDonationCode && (
            <InvoiceDonationCodeBadge code={organization.invoiceDonationCode} />
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {getLocalizedDescription(organization, locale)}
        </p>
        {/* Donation - 一般捐款 */}
        {organization.donation && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-md">
              <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-flex items-center gap-2">
                {t("organization.donationYear", { year: organization.donation.year })} {t("organization.donationIncome")}
                {organization.donation.reportUrl && (
                  <a
                    href={organization.donation.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                    title={t("organization.viewReport")}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </span>
              <span className="font-medium text-blue-900">
                {formatCurrency(organization.donation.amount)}
              </span>
            </div>
          </div>
        )}

        {/* Income Display */}
        {(isCurrentYearFundraising || organization.donation) && (
          <div className="mb-4 space-y-3">
            {/* Fundraising - 勸募捐款 (only show if current year) */}
            {isCurrentYearFundraising && organization.fundraising && progress !== undefined && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-flex items-center gap-2">
                    {t("organization.donationYear", { year: organization.fundraising.year })} {t("organization.fundraisingIncome")}
                    {organization.fundraising.fundActivityUrl && (
                      <a
                        href={organization.fundraising.fundActivityUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 inline-flex items-center"
                        title={t("organization.viewActivity")}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </span>
                </div>
                <ProgressBar progress={progress} status={organization.status} />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>
                    {t("organization.fundraisingRaised")}: {formatCurrency(organization.fundraising.raisedAmount)}
                  </span>
                  <span>
                    {t("organization.fundraisingTarget")}: {formatCurrency(organization.fundraising.targetAmount)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          {organization.websiteUrl && (
            <a
              href={organization.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {t("common.visitWebsite")}
            </a>
          )}
          {organization.donationUrl && (
            <button
              onClick={handleDonationClick}
              className="bg-[#84934A] hover:bg-[#6b7a3b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {t("common.goToDonationPage")}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
