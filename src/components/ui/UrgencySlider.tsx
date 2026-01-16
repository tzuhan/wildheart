import { useTranslations } from "next-intl";
import type { OrganizationStatus } from "@/types";

interface UrgencySliderProps {
    value: OrganizationStatus | "all";
    onChange: (value: OrganizationStatus | "all") => void;
}

const steps: (OrganizationStatus | "all")[] = [
    "red",
    "orange",
    "yellow",
    "green",
    "all",
];

export function UrgencySlider({ value, onChange }: UrgencySliderProps) {
    const t = useTranslations();

    // Find current index (0-4)
    const currentIndex = steps.indexOf(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newIndex = parseInt(e.target.value, 10);
        const newValue = steps[newIndex];
        if (newValue) {
            onChange(newValue);
        }
    };

    const getLabel = (stepValue: OrganizationStatus | "all") => {
        if (stepValue === "all") return t("home.allUrgencyLevels");
        return t(`status.${stepValue}`);
    };

    // Calculate background gradient percentage for the track
    const percent = (currentIndex / (steps.length - 1)) * 100;

    return (
        <div className="w-full space-y-3">
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                    {t("home.urgencyLevel")}
                </label>
                <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {getLabel(value)}
                </span>
            </div>

            <div className="relative h-6 flex items-center">
                <input
                    type="range"
                    min="0"
                    max={steps.length - 1}
                    step="1"
                    value={currentIndex}
                    onChange={handleChange}
                    className="w-full absolute z-20 opacity-0 cursor-pointer h-full"
                    aria-label={t("home.urgencyLevel")}
                />

                {/* Custom Track */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden absolute z-10">
                    <div
                        className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-400 transition-all duration-300 ease-out"
                        style={{ width: `${percent}%` }}
                    />
                </div>

                {/* Custom Thumb (Visual Only - positioned by left %) */}
                <div
                    className="absolute h-5 w-5 bg-white border-2 border-emerald-600 rounded-full shadow-md z-10 pointer-events-none transition-all duration-300 ease-out transform -translate-x-1/2"
                    style={{ left: `${percent}%` }}
                />

                {/* Step Markers */}
                <div className="w-full flex justify-between absolute z-0 px-1">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`w-1 h-1 rounded-full ${index <= currentIndex ? 'bg-emerald-300' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex justify-between text-xs text-gray-400 px-1">
                <span>High</span>
                <span>Low</span>
            </div>
        </div>
    );
}
