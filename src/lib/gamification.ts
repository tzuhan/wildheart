import type { Achievement, UserProgress, SupportConfirmation } from "@/types";

const STORAGE_KEY = "wildlife_conservation_progress";

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_support",
    title: "First Steps",
    description: "Confirmed support for your first organization",
    icon: "🌱",
  },
  {
    id: "three_orgs",
    title: "Growing Impact",
    description: "Supported 3 different organizations",
    icon: "🌿",
  },
  {
    id: "five_orgs",
    title: "Conservation Champion",
    description: "Supported 5 different organizations",
    icon: "🌳",
  },
  {
    id: "critical_support",
    title: "Emergency Responder",
    description: "Supported an organization in critical status",
    icon: "🚨",
  },
  {
    id: "return_supporter",
    title: "Committed Conservationist",
    description: "Returned to support again in a later month",
    icon: "💚",
  },
  {
    id: "explorer",
    title: "Wildlife Explorer",
    description: "Visited 10 different organization pages",
    icon: "🔍",
  },
];

function getDefaultProgress(): UserProgress {
  return {
    supportedOrganizations: [],
    supportConfirmations: [],
    achievements: [],
    totalClicks: 0,
    wateringCredits: 0,
  };
}

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") {
    return getDefaultProgress();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load progress:", error);
  }

  return getDefaultProgress();
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
}

export function recordDonationClick(_orgId: string): UserProgress {
  const progress = loadProgress();
  progress.totalClicks += 1;
  saveProgress(progress);
  return progress;
}

export function recordWatering(): UserProgress {
  const progress = loadProgress();
  const today = new Date().toISOString().split("T")[0];
  const lastWatering = progress.lastWateringDate
    ? progress.lastWateringDate.split("T")[0]
    : null;

  if (lastWatering !== today) {
    progress.wateringCredits = (progress.wateringCredits || 0) + 1;
    progress.lastWateringDate = new Date().toISOString();
    saveProgress(progress);
  }

  return progress;
}

export function confirmSupport(
  orgId: string,
  orgStatus: string
): { progress: UserProgress; newAchievements: Achievement[] } {
  const progress = loadProgress();
  const newAchievements: Achievement[] = [];

  // Record the support confirmation
  const confirmation: SupportConfirmation = {
    organizationId: orgId,
    confirmedAt: new Date().toISOString(),
  };
  progress.supportConfirmations.push(confirmation);

  // Track unique organizations supported
  if (!progress.supportedOrganizations.includes(orgId)) {
    progress.supportedOrganizations.push(orgId);
  }

  // Check for achievements
  const earnedIds = progress.achievements.map((a) => a.id);

  // First support achievement
  if (
    progress.supportConfirmations.length === 1 &&
    !earnedIds.includes("first_support")
  ) {
    const achievement = {
      ...ACHIEVEMENTS.find((a) => a.id === "first_support")!,
      unlockedAt: new Date().toISOString(),
    };
    progress.achievements.push(achievement);
    newAchievements.push(achievement);
  }

  // Three organizations achievement
  if (
    progress.supportedOrganizations.length >= 3 &&
    !earnedIds.includes("three_orgs")
  ) {
    const achievement = {
      ...ACHIEVEMENTS.find((a) => a.id === "three_orgs")!,
      unlockedAt: new Date().toISOString(),
    };
    progress.achievements.push(achievement);
    newAchievements.push(achievement);
  }

  // Five organizations achievement
  if (
    progress.supportedOrganizations.length >= 5 &&
    !earnedIds.includes("five_orgs")
  ) {
    const achievement = {
      ...ACHIEVEMENTS.find((a) => a.id === "five_orgs")!,
      unlockedAt: new Date().toISOString(),
    };
    progress.achievements.push(achievement);
    newAchievements.push(achievement);
  }

  // Critical status support achievement
  if (orgStatus === "red" && !earnedIds.includes("critical_support")) {
    const achievement = {
      ...ACHIEVEMENTS.find((a) => a.id === "critical_support")!,
      unlockedAt: new Date().toISOString(),
    };
    progress.achievements.push(achievement);
    newAchievements.push(achievement);
  }

  // Return supporter achievement (check if supported in a different month)
  const supportDates = progress.supportConfirmations.map((s) =>
    new Date(s.confirmedAt).toISOString().slice(0, 7)
  );
  const uniqueMonths = [...new Set(supportDates)];
  if (uniqueMonths.length >= 2 && !earnedIds.includes("return_supporter")) {
    const achievement = {
      ...ACHIEVEMENTS.find((a) => a.id === "return_supporter")!,
      unlockedAt: new Date().toISOString(),
    };
    progress.achievements.push(achievement);
    newAchievements.push(achievement);
  }

  saveProgress(progress);
  return { progress, newAchievements };
}

export function getAvailableAchievements(): Achievement[] {
  return ACHIEVEMENTS;
}

export function getUserAchievements(): Achievement[] {
  const progress = loadProgress();
  return progress.achievements;
}
