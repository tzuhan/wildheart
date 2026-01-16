"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdPlacement = "educational" | "organization-detail" | "sidebar";

interface AdSenseUnitProps {
  adSlot: string;
  adClient: string;
  placement: AdPlacement;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
}

const ALLOWED_PLACEMENTS: AdPlacement[] = [
  "educational",
  "organization-detail",
  "sidebar",
];

export function AdSenseUnit({
  adSlot,
  adClient,
  placement,
  format = "auto",
  responsive = true,
  className = "",
}: AdSenseUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Validate placement
    if (!ALLOWED_PLACEMENTS.includes(placement)) {
      console.warn(
        `AdSense: Invalid placement "${placement}". Ads must be placed in approved locations.`
      );
      return;
    }

    // Only load ads if adClient is provided
    if (!adClient || !adSlot) {
      return;
    }

    // Prevent double-loading
    if (isLoaded.current) {
      return;
    }

    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, [adClient, adSlot, placement]);

  // Don't render if placement is not allowed
  if (!ALLOWED_PLACEMENTS.includes(placement)) {
    return null;
  }

  // Don't render if credentials are missing (development mode)
  if (!adClient || !adSlot) {
    return (
      <div
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 ${className}`}
      >
        <p className="text-sm">Ad Placeholder</p>
        <p className="text-xs mt-1">Configure AdSense credentials to display ads</p>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`}>
      <div className="text-xs text-gray-400 mb-1 text-center">Advertisement</div>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
