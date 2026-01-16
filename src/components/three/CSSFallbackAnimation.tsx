"use client";

import { useState, useEffect } from "react";

interface CSSFallbackAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

export function CSSFallbackAnimation({
  onComplete,
  duration = 5000,
}: CSSFallbackAnimationProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const stageInterval = duration / 4;
    const timers: NodeJS.Timeout[] = [];

    for (let i = 1; i <= 4; i++) {
      timers.push(
        setTimeout(() => {
          setStage(i);
          if (i === 4) {
            setTimeout(() => onComplete?.(), 500);
          }
        }, stageInterval * i)
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [duration, onComplete]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-100 to-green-100">
      <div className="relative w-48 h-64">
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-amber-800 rounded-t-full" />

        {/* Seed */}
        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
            stage >= 1 ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full transition-colors duration-1000 ${
              stage >= 2 ? "bg-green-600" : "bg-amber-600"
            }`}
          />
        </div>

        {/* Stem */}
        <div
          className={`absolute bottom-14 left-1/2 -translate-x-1/2 w-2 bg-green-600 rounded-full transition-all duration-1000 origin-bottom ${
            stage >= 2 ? "h-24" : "h-0"
          }`}
        />

        {/* Leaves */}
        {stage >= 3 && (
          <>
            <div className="absolute bottom-32 left-1/2 -translate-x-6 animate-grow-leaf">
              <div className="w-12 h-6 bg-green-500 rounded-full -rotate-45" />
            </div>
            <div className="absolute bottom-32 left-1/2 -translate-x-6 animate-grow-leaf animation-delay-200">
              <div className="w-12 h-6 bg-green-500 rounded-full rotate-45" />
            </div>
          </>
        )}

        {/* Flower */}
        {stage >= 4 && (
          <div className="absolute bottom-40 left-1/2 -translate-x-1/2 animate-bloom">
            <div className="relative">
              <div className="w-6 h-6 bg-yellow-400 rounded-full" />
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-300 rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Particles */}
        {stage >= 4 && (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-green-300 rounded-full animate-float"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 40}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes grow-leaf {
          from {
            transform: translateX(-24px) scale(0);
          }
          to {
            transform: translateX(-24px) scale(1);
          }
        }

        @keyframes bloom {
          from {
            transform: translateX(-50%) scale(0);
          }
          to {
            transform: translateX(-50%) scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }

        .animate-grow-leaf {
          animation: grow-leaf 0.5s ease-out forwards;
        }

        .animate-bloom {
          animation: bloom 0.5s ease-out forwards;
        }

        .animate-float {
          animation: float 2s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}
