import type { OrganizationCategory } from "@/types";
import { useTranslations } from "next-intl";

interface CategoryBadgeProps {
  category: OrganizationCategory;
}


export function CategoryBadge({ category }: CategoryBadgeProps) {
  const t = useTranslations("category");

  if (!category) {
    return null;
  }

  // Try to get translation, fall back to raw category value
  let displayName: string;
  try {
    displayName = t(category);
  } catch {
    displayName = category;
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
      <span>{displayName}</span>
    </span>
  );
}
