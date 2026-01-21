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
        <div className="w-full">
            <div
                className="relative w-full h-[480px] overflow-hidden bg-black group md:h-[560px]"
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

                        // Use banner image for highlight id 0, otherwise use imageURL from data
                        const backgroundImage = highlight.id === "0"
                            ? "/banner-bg.jpg"
                            : highlight.imageURL;

                        // Determine gradient based on category or default for site intro (mobile only)
                        const mobileGradientClass = backgroundImage
                            ? "" // No gradient when image is present
                            : orgName
                                ? "bg-gradient-to-r from-[#84934A]/80 to-slate-900"
                                : "bg-gradient-to-r from-slate-900 via-[#84934A]/80 to-slate-900"; // Special gradient for intro

                        return (
                            <div
                                key={highlight.id}
                                className="w-full flex-shrink-0 h-full relative bg-black"
                            >
                                {/* Mobile Layout - Image top half, content bottom half */}
                                <div
                                    className={`md:hidden absolute top-0 left-0 right-0 h-1/2 ${mobileGradientClass}`}
                                    style={backgroundImage ? {
                                        backgroundImage: `url(${backgroundImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    } : undefined}
                                >
                                    {!backgroundImage && (
                                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                    )}
                                </div>
                                {/* Mobile gradient overlay between image and content */}
                                <div className="md:hidden absolute top-1/2 left-0 right-0 h-30 -translate-y-1/2 bg-gradient-to-b from-transparent via-black/50 to-black z-[5]"></div>
                                {/* Mobile bottom half background */}
                                <div className="md:hidden absolute bottom-0 left-0 right-0 h-1/2 bg-black"></div>

                                {/* Desktop Layout - Image on right 2/3 */}
                                <div
                                    className="hidden md:block absolute right-0 top-0 w-2/3 h-full"
                                    style={backgroundImage ? {
                                        backgroundImage: `url(${backgroundImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    } : undefined}
                                >
                                    {!backgroundImage && (
                                        <div className="absolute inset-0 bg-gradient-to-l from-[#84934A]/60 to-black"></div>
                                    )}
                                </div>

                                {/* Desktop Gradient overlay - left 1/3 fading into image */}
                                <div className="hidden md:block absolute left-0 top-0 w-2/3 h-full bg-gradient-to-r from-black via-black to-transparent z-10"></div>

                                {/* Content */}
                                <div className="relative h-full flex flex-col md:flex-row md:items-center z-20">
                                    {/* Mobile: Learn More button on top half (image area) */}
                                    {highlight.sourceURL && (
                                        <div className="md:hidden absolute top-0 left-0 right-0 h-1/2 flex items-end justify-center pb-4 z-10">
                                            <button
                                                onClick={() => handleHeroClick(highlight.sourceURL)}
                                                className="px-6 py-2 bg-[#84934A] hover:bg-[#6b7a3b] text-white rounded-full font-semibold transition-all text-sm flex items-center gap-2 shadow-lg"
                                            >
                                                {t("readMore")}
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    {/* Mobile: content in bottom half */}
                                    <div className="md:hidden absolute bottom-0 left-0 right-0 h-1/2 flex flex-col justify-center px-6 py-4 text-center text-white">
                                        {highlight.category !== "homepage" && (
                                            <div className="mb-2">
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#84934A]/20 text-[#b8c472] border border-[#84934A]/30">
                                                    {t(`category.${highlight.category}`)}
                                                </span>
                                            </div>
                                        )}

                                        <h1 className="text-xl font-bold mb-2 leading-tight">
                                            {getLocalizedHighlightTitle(highlight, locale)}
                                        </h1>

                                        <p className="text-sm text-white/90 mb-3 leading-relaxed line-clamp-2">
                                            {getLocalizedHighlightSummary(highlight, locale)}
                                        </p>

                                        {orgName && (
                                            <span className="text-[#b8c472] font-medium text-sm">
                                                {orgName}
                                            </span>
                                        )}
                                    </div>

                                    {/* Desktop: centered content in left 1/3 */}
                                    <div className="hidden md:flex flex-col justify-center items-center w-1/3 h-full px-12 text-white text-center">
                                        {highlight.category !== "homepage" && (
                                            <div className="mb-4">
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#84934A]/20 text-[#b8c472] border border-[#84934A]/30">
                                                    {t(`category.${highlight.category}`)}
                                                </span>
                                            </div>
                                        )}

                                        <h1 className="text-2xl lg:text-3xl font-bold mb-6 leading-tight">
                                            {getLocalizedHighlightTitle(highlight, locale)}
                                        </h1>

                                        <p className="text-lg text-white/90 mb-8 leading-relaxed">
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
                            </div>
                        );
                    })}
                </div>

                {highlights.length > 1 && (
                    <>
                        {/* Navigation Controls */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 md:p-2.5 rounded-r-lg backdrop-blur-sm transition-all z-30 opacity-70 hover:opacity-100 md:opacity-100"
                            aria-label="Previous slide"
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 md:p-2.5 rounded-l-lg backdrop-blur-sm transition-all z-30 opacity-70 hover:opacity-100 md:opacity-100"
                            aria-label="Next slide"
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
