"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  StatusBadge,
  CategoryBadge,
  InvoiceDonationCodeBadge,
  ProgressBar,
  AchievementNotification,
  HighlightCard,
} from "@/components/ui";
import { DonationAnimationOverlay } from "@/components/three";
import {
  formatCurrency,
  formatPercentage,
  calculateFundingGapRatio,
} from "@/lib/ranking";
import {
  getDonationWindowInfo,
  createGoogleCalendarLink,
} from "@/lib/donationWindow";
import { useGamification } from "@/contexts/GamificationContext";

import { useTranslations, useLocale } from "next-intl";
import type { Locale, Organization, FundraisingInfo, DonationInfo } from "@/types";
import type { Highlight } from "@/types/highlight";
import {
  getLocalizedName,
  getLocalizedDescription,
  getLocalizedDetail,
  getLocalizedRegion,
  getLocalizedActivityName,
} from "@/types";

interface OrganizationDetailClientProps {
  organization: Organization;
  allFundraising: FundraisingInfo[];
  donation: DonationInfo | undefined;
  highlights: Highlight[];
}

export default function OrganizationDetailClient({
  organization,
  allFundraising,
  donation,
  highlights,
}: OrganizationDetailClientProps) {
  const locale = useLocale() as Locale;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const t = useTranslations();
  const tStatus = useTranslations("status");

  const {
    handleDonationClick,
    handleSupportConfirm,
    pendingAchievements,
    dismissAchievement,
    showAnimation,
    setShowAnimation,
  } = useGamification();

  // Get the most recent fundraising for progress calculation
  const latestFundraising = allFundraising.length > 0 ? allFundraising[0] : undefined;
  const gapRatio = calculateFundingGapRatio(latestFundraising);
  const donationWindow = getDonationWindowInfo(organization);
  const calendarLink = !donationWindow.isOpen && donationWindow.hasFutureWindow
    ? createGoogleCalendarLink(organization, locale)
    : null;

  const handleGoToDonation = () => {
    handleDonationClick(organization.id);
    window.open(organization.donationUrl, "_blank", "noopener,noreferrer");
    setShowConfirmModal(true);
  };

  const handleConfirmSupport = () => {
    handleSupportConfirm(organization.id, organization.status);
    setShowConfirmModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t("common.backToOrganizations")}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              {organization.imageUrl && (
                <img
                  src={organization.imageUrl}
                  alt={getLocalizedName(organization, locale)}
                  className="w-16 h-16 object-contain rounded-lg flex-shrink-0"
                />
              )}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {getLocalizedName(organization, locale)}
                  </h1>
                  {organization.snsUrl && (
                    <a
                      href={organization.snsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                      title="Facebook"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                </div>
                <p className="text-gray-500">{getLocalizedRegion(organization, locale)}</p>
              </div>
            </div>
            <StatusBadge status={organization.status} size="lg" />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <CategoryBadge category={organization.category} />
            {organization.status && (
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm">
                {tStatus(`${organization.status}Desc`)}
              </span>
            )}
            {organization.invoiceDonationCode && (
              <InvoiceDonationCodeBadge code={organization.invoiceDonationCode} />
            )}
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">
            {getLocalizedDescription(organization, locale)}
          </p>

          {getLocalizedDetail(organization, locale) && (
            <p className="text-gray-600 leading-relaxed mt-4 whitespace-pre-line">
              {getLocalizedDetail(organization, locale)}
            </p>
          )}

          {organization.comment && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-amber-800 text-sm leading-relaxed whitespace-pre-line">
                  {organization.comment}
                </p>
              </div>
            </div>
          )}

          <div className="mb-8" />

          {/* Donation Window Info - Only show when NOT currently open */}
          {!donationWindow.isOpen && (donationWindow.startDate || donationWindow.endDate) && (
            <div className="rounded-xl p-5 mb-6 bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="font-semibold text-amber-900">
                  {t("organization.donationWindow")}
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-amber-900 font-medium">
                      {donationWindow.hasFutureWindow && donationWindow.startDate ? (
                        t("organization.donationOpens", {
                          date: donationWindow.startDate?.toLocaleDateString(locale) || "N/A",
                        })
                      ) : (
                        t("organization.donationWindowClosed", {
                          start: donationWindow.startDate?.toLocaleDateString(locale) || "N/A",
                          end: donationWindow.endDate?.toLocaleDateString(locale) || "N/A",
                        })
                      )}
                    </p>
                  </div>
                </div>
                {calendarLink && (
                  <a
                    href={calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {t("organization.addToCalendar")}
                  </a>
                )}
              </div>
            </div>
          )}

          {(donationWindow.isOpen && organization.donationUrl) || organization.websiteUrl || organization.shopUrl ? (
            <div className="flex flex-col items-start gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {organization.websiteUrl && (
                  <a
                    href={organization.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 rounded-lg text-base font-semibold transition-colors"
                  >
                    {t("common.visitWebsite")}
                  </a>
                )}
                {donationWindow.isOpen && organization.donationUrl && (
                  <button
                    onClick={handleGoToDonation}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg text-base font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    {t("common.goToDonationPage")}
                  </button>
                )}
                {organization.shopUrl && (
                  <a
                    href={organization.shopUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg text-base font-semibold hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    {t("common.visitShop")}
                  </a>
                )}
              </div>
              {donationWindow.isOpen && organization.donationUrl && (
                <p className="text-sm text-gray-500">
                  {t("organization.redirectNotice")}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* Income Sources */}
        {(allFundraising.length > 0 || donation) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t("organization.incomeTitle")}
            </h2>

            <div className="space-y-6">
              {/* Fundraising Section - 勸募捐款 (all years) */}
              {allFundraising.map((fundraising, index) => {
                const progress = (fundraising.raisedAmount / fundraising.targetAmount) * 100;

                return (
                  <div key={`${fundraising.organizationId}-${fundraising.year}`} className="border-b border-gray-100 pb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-800">
                        {t("organization.donationYear", { year: fundraising.year })} {t("organization.fundraisingIncome")}
                      </h3>
                    </div>

                    <ProgressBar
                      progress={progress}
                      status={organization.status}
                      label={getLocalizedActivityName(fundraising, locale)}
                    />

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-emerald-50 rounded-lg p-4">
                        <p className="text-sm text-emerald-700 mb-1">{t("organization.fundraisingRaised")}</p>
                        <p className="text-xl font-bold text-emerald-900">
                          {formatCurrency(fundraising.raisedAmount)}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">{t("organization.fundraisingTarget")}</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(fundraising.targetAmount)}
                        </p>
                      </div>
                    </div>

                    {fundraising.fundActivityUrl && (
                      <div className="mt-3">
                        <a
                          href={fundraising.fundActivityUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                        >
                          {t("organization.viewActivity")}
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Donation Section - 一般捐款 */}
              {donation && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-800">
                      {t("organization.donationYear", { year: donation.year })} {t("organization.donationIncome")}
                    </h3>
                    
                    {donation.reportUrl && (
                    <div className="mt-3">
                      <a
                        href={donation.reportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                      >
                        {t("organization.viewReport")}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                    )}
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-700 mb-1">{t("organization.donationAmount")}</p>
                    <p className="text-xl font-bold text-blue-900">
                      {formatCurrency(donation.amount)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>{t("organization.dataSource")}: MOHW及官方網站、粉絲頁</p>
            </div>
          </div>
        )}



        {/* Weekly Highlights */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t("highlights.title")}
          </h2>
          {highlights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {highlights
                .slice(0, 3)
                .map((highlight) => (
                  <HighlightCard key={highlight.id} highlight={highlight} />
                ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              {t("highlights.noHighlights")}
            </p>
          )}
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500 mt-6">
          {t("organization.lastUpdated", {
            date: new Date(organization.lastUpdateAt).toLocaleDateString(),
          })}
        </div>
      </div>

      {/* Support Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl p-8 max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t("supportConfirm.title")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("supportConfirm.message")}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {t("supportConfirm.note")}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {t("supportConfirm.notYet")}
              </button>
              <button
                onClick={handleConfirmSupport}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                {t("supportConfirm.yesSupported")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donation Animation Overlay */}
      <DonationAnimationOverlay
        isVisible={showAnimation}
        onClose={() => setShowAnimation(false)}
        organizationName={getLocalizedName(organization, locale)}
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
