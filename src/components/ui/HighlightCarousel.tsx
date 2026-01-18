"use client";

import { useState, useEffect, useCallback } from "react";
import { Locale, getLocalizedName, Organization } from "@/types";
import { Highlight, getLocalizedHighlightTitle, getLocalizedHighlightSummary } from "@/types/highlight";
import { useLocale, useTranslations } from "next-intl";
import { useGamification } from "@/contexts/GamificationContext";

interface HighlightCarouselProps {
    highlights: Highlight[];
    organizations?: Organization[];
}

export function HighlightCarousel({ highlights, organizations = [] }: HighlightCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const locale = useLocale() as Locale;
    const t = useTranslations("highlights");
    const { handleWatering } = useGamification();

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % highlights.length);
    }, [highlights.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + highlights.length) % highlights.length);
    }, [highlights.length]);

    useEffect(() => {
        if (isPaused || highlights.length <= 1) return;

        const interval = setInterval(nextSlide, 7000); // 7 seconds for hero
        return () => clearInterval(interval);
    }, [isPaused, highlights.length, nextSlide]);

    const handleHeroClick = (url: string) => {
        handleWatering();
        window.open(url, "_blank", "noopener,noreferrer");
    };

    if (highlights.length === 0) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div
                className="relative w-full h-[480px] overflow-hidden bg-gray-900 group rounded-xl"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Slides Container */}
                <div
                    className="flex h-full transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {highlights.map((highlight) => {
                        const org = highlight.organizationId
                            ? organizations.find((o) => o.id === highlight.organizationId)
                            : undefined;
                        const orgName = org ? getLocalizedName(org, locale) : undefined;

                        // Determine gradient based on category or default for site intro
                        const gradientClass = highlight.imageURL
                            ? "" // No gradient when image is present
                            : orgName
                                ? "bg-gradient-to-r from-[#84934A]/80 to-slate-900"
                                : "bg-gradient-to-r from-slate-900 via-[#84934A]/80 to-slate-900"; // Special gradient for intro

                        return (
                            <div
                                key={highlight.id}
                                className={`w-full flex-shrink-0 h-full flex items-center justify-center relative ${gradientClass}`}
                                style={highlight.imageURL ? {
                                    backgroundImage: `url(${highlight.imageURL})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                } : undefined}
                            >
                                {/* Dark overlay for image backgrounds */}
                                {highlight.imageURL && (
                                    <div className="absolute inset-0 bg-black/60"></div>
                                )}
                                {/* Decorative Elements */}
                                {!highlight.imageURL && (
                                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                )}

                                <div className="max-w-4xl mx-auto px-6 pb-8 text-center z-10 text-white">
                                    {highlight.category !== "homepage" && (
                                        <div className="mb-4">
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#84934A]/20 text-[#b8c472] border border-[#84934A]/30">
                                                {t(`category.${highlight.category}`)}
                                            </span>
                                        </div>
                                    )}

                                    <h1 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight drop-shadow-lg">
                                        {getLocalizedHighlightTitle(highlight, locale)}
                                    </h1>

                                    <p className="text-base md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md line-clamp-3 md:line-clamp-none">
                                        {getLocalizedHighlightSummary(highlight, locale)}
                                    </p>

                                    <div className="flex flex-col items-center gap-2">
                                        {orgName && (
                                            <span className="text-[#b8c472] font-medium">
                                                {orgName}
                                            </span>
                                        )}

                                        {highlight.sourceURL && (
                                            <button
                                                onClick={() => handleHeroClick(highlight.sourceURL)}
                                                className="mt-4 px-8 py-3 bg-[#84934A] hover:bg-[#6b7a3b] text-white rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                            >
                                                {t("readMore")}
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {highlights.length > 1 && (
                    <>
                        {/* Controls - Always visible on desktop, hidden on mobile initially? let's keep them accessible */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label="Previous slide"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label="Next slide"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Indicators */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-20">
                            {highlights.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-12 h-1 rounded-full transition-all ${index === currentIndex ? "bg-[#84934A]" : "bg-white/30 hover:bg-white/50"
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
