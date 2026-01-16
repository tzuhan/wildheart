"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  useSyncExternalStore,
} from "react";
import type { UserProgress, Achievement } from "@/types";
import {
  loadProgress,
  confirmSupport,
  recordDonationClick,
  recordWatering,
} from "@/lib/gamification";
import { trackDonationLinkClick, trackSupportConfirmed } from "@/lib/analytics";

interface GamificationContextType {
  progress: UserProgress;
  pendingAchievements: Achievement[];
  handleDonationClick: (orgId: string) => void;
  handleSupportConfirm: (orgId: string, orgStatus: string) => void;
  dismissAchievement: (achievementId: string) => void;
  showAnimation: boolean;
  setShowAnimation: (show: boolean) => void;
  currentOrganization: string | null;
  handleWatering: () => void;
}

const GamificationContext = createContext<GamificationContextType | null>(null);

const defaultProgress: UserProgress = {
  supportedOrganizations: [],
  supportConfirmations: [],
  achievements: [],
  totalClicks: 0,
  wateringCredits: 0,
};

// External store for localStorage-based progress
let cachedProgress: UserProgress | null = null;
const listeners = new Set<() => void>();

function subscribeToProgress(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getProgressSnapshot(): UserProgress {
  if (typeof window === "undefined") return defaultProgress;
  if (cachedProgress === null) {
    cachedProgress = loadProgress();
  }
  return cachedProgress;
}

function getServerSnapshot(): UserProgress {
  return defaultProgress;
}

function updateCachedProgress(newProgress: UserProgress) {
  cachedProgress = newProgress;
  listeners.forEach((listener) => listener());
}

export function GamificationProvider({ children }: { children: ReactNode }) {
  const progress = useSyncExternalStore(
    subscribeToProgress,
    getProgressSnapshot,
    getServerSnapshot
  );

  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>(
    []
  );
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentOrganization, setCurrentOrganization] = useState<string | null>(
    null
  );

  const handleDonationClick = useCallback((orgId: string) => {
    trackDonationLinkClick(orgId);
    const updated = recordDonationClick(orgId);
    updateCachedProgress(updated);
    setCurrentOrganization(orgId);
  }, []);

  const handleSupportConfirm = useCallback(
    (orgId: string, orgStatus: string) => {
      trackSupportConfirmed(orgId);
      const { progress: updated, newAchievements } = confirmSupport(
        orgId,
        orgStatus
      );
      updateCachedProgress(updated);

      if (newAchievements.length > 0) {
        setPendingAchievements((prev) => [...prev, ...newAchievements]);
      }

      setShowAnimation(true);
    },
    []
  );

  const dismissAchievement = useCallback((achievementId: string) => {
    setPendingAchievements((prev) =>
      prev.filter((a) => a.id !== achievementId)
    );
  }, []);

  const handleWatering = useCallback(() => {
    const updatedProgress = recordWatering();
    updateCachedProgress(updatedProgress);
  }, []);

  return (
    <GamificationContext.Provider
      value={{
        progress,
        pendingAchievements,
        handleDonationClick,
        handleSupportConfirm,
        dismissAchievement,
        showAnimation,
        setShowAnimation,
        currentOrganization,
        handleWatering,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error(
      "useGamification must be used within a GamificationProvider"
    );
  }
  return context;
}
