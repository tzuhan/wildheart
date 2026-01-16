"use client";

import { useState, useCallback, useLayoutEffect, useId } from "react";
import dynamic from "next/dynamic";
import { CSSFallbackAnimation } from "./CSSFallbackAnimation";

const SeedAnimation = dynamic(
  () => import("./SeedAnimation").then((mod) => mod.SeedAnimation),
  {
    ssr: false,
    loading: () => <CSSFallbackAnimation />,
  }
);

interface DonationAnimationOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  organizationName?: string;
}

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return true;

  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  return !!(gl && !isMobile);
}

// Inner component that handles the animation state
function AnimationContent({
  useWebGL,
  organizationName,
  onClose,
}: {
  useWebGL: boolean;
  organizationName?: string;
  onClose: () => void;
}) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const animationKey = useId();

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
  }, []);

  return (
    <div className="relative w-full max-w-lg h-96 mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
        aria-label="Close animation"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Animation */}
      <div className="w-full h-64">
        {useWebGL ? (
          <SeedAnimation
            key={animationKey}
            onComplete={handleAnimationComplete}
            duration={5000}
          />
        ) : (
          <CSSFallbackAnimation
            key={animationKey}
            onComplete={handleAnimationComplete}
            duration={5000}
          />
        )}
      </div>

      {/* Message */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Thank You for Your Support!
          </h3>
          <p className="text-gray-600 text-sm">
            {organizationName
              ? `Your support helps ${organizationName} continue their conservation work.`
              : "Every action counts in protecting our wildlife."}
          </p>
          {animationComplete && (
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Continue Exploring
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function DonationAnimationOverlay({
  isVisible,
  onClose,
  organizationName,
}: DonationAnimationOverlayProps) {
  const [useWebGL] = useState(() => checkWebGLSupport());

  useLayoutEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Animation Content - remounts when isVisible changes */}
      <AnimationContent
        key={String(isVisible)}
        useWebGL={useWebGL}
        organizationName={organizationName}
        onClose={handleClose}
      />
    </div>
  );
}
