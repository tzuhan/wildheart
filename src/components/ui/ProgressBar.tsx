import type { OrganizationStatus } from "@/types";

import { useTranslations } from "next-intl";

interface ProgressBarProps {
  progress: number; // 0-100
  status: OrganizationStatus;
  showLabel?: boolean;
  label?: string;
}

const progressColors: Record<OrganizationStatus, string> = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  gray: "bg-gray-500",
};

export function ProgressBar({
  progress,
  status,
  showLabel = true,
  label,
}: ProgressBarProps) {
  const t = useTranslations("progressBar");
  // Clamp only for the visual bar width, but show actual percentage in text
  const visualProgress = Math.min(100, Math.max(0, progress));
  const displayPercentage = Math.round(progress);

  return (
    <div className="w-full">
      {showLabel && label && (
        <div className="text-sm text-gray-600 mb-1">
          <span>{label}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColors[status]}`}
            style={{ width: `${visualProgress}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {t("percentOfGoal", { percentage: displayPercentage })}
        </span>
      </div>
    </div>
  );
}
