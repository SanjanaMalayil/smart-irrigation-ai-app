import { Button } from "@/components/ui/button";
import { Cloud, Droplets, Leaf, MessageSquare, Sprout } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../i18n/translations";

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 dark:from-emerald-900 dark:via-green-900 dark:to-teal-900">
      <div className="absolute inset-0 opacity-20">
        <img
          src="/assets/generated/irrigation-hero.dim_800x600.jpg"
          alt="Smart Irrigation"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            {t("heroTitle", language)}
          </h1>
          <p className="text-xl md:text-2xl text-emerald-50 mb-12 drop-shadow-md">
            {t("heroSubtitle", language)}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            <button
              type="button"
              onClick={() => onNavigate("overview")}
              className="flex flex-col items-center gap-3 p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
              data-ocid="hero.weather.button"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                <img
                  src="/assets/generated/weather-sunny.dim_64x64.png"
                  alt="Weather"
                  className="w-10 h-10"
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t("weather", language)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("irrigation")}
              className="flex flex-col items-center gap-3 p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
              data-ocid="hero.irrigation.button"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <img
                  src="/assets/generated/soil-sensor.dim_64x64.png"
                  alt="Soil Sensor"
                  className="w-10 h-10"
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t("irrigation", language)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("crops")}
              className="flex flex-col items-center gap-3 p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
              data-ocid="hero.crops.button"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-lime-600 rounded-full flex items-center justify-center">
                <Sprout className="w-10 h-10 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t("crops", language)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("plant-health")}
              className="flex flex-col items-center gap-3 p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
              data-ocid="hero.plant_health.button"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-lime-500 to-green-600 rounded-full flex items-center justify-center">
                <img
                  src="/assets/generated/leaf-healthy.dim_64x64.png"
                  alt="Plant Health"
                  className="w-10 h-10"
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t("plantHealth", language)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("chat")}
              className="flex flex-col items-center gap-3 p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all hover:scale-105 shadow-lg col-span-2 md:col-span-1"
              data-ocid="hero.chat.button"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <img
                  src="/assets/generated/chat-bot.dim_64x64.png"
                  alt="AI Assistant"
                  className="w-10 h-10"
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t("aiAssistant", language)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
