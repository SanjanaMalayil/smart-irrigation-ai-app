import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Droplets } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../i18n/translations";

export default function SoilMoisturePanel() {
  const [soilMoisture, setSoilMoisture] = useState(45);
  const { language } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setSoilMoisture((prev) => {
        const change = (Math.random() - 0.5) * 5;
        const newValue = prev + change;
        return Math.max(0, Math.min(100, newValue));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getMoistureLevel = (value: number) => {
    if (value < 30)
      return {
        label: t("low", language),
        color: "text-red-600 dark:text-red-400",
      };
    if (value < 60)
      return {
        label: t("moderate", language),
        color: "text-yellow-600 dark:text-yellow-400",
      };
    return {
      label: t("high", language),
      color: "text-green-600 dark:text-green-400",
    };
  };

  const level = getMoistureLevel(soilMoisture);

  const getAdvice = (value: number) => {
    if (value < 30) return t("soilDryAdvice", language);
    if (value < 60) return t("soilGoodAdvice", language);
    return t("soilHydratedAdvice", language);
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <img
              src="/assets/soil-sensor.dim_64x64.png"
              alt="Soil"
              className="w-6 h-6"
            />
          </div>
          <div>
            <CardTitle className="text-amber-900 dark:text-amber-100">
              {t("soilMoisture", language)}
            </CardTitle>
            <CardDescription className="text-amber-700 dark:text-amber-300">
              {t("currentSensorReading", language)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-bold text-amber-900 dark:text-amber-100 mb-2">
            {soilMoisture.toFixed(0)}%
          </div>
          <div className={`text-xl font-semibold ${level.color}`}>
            {level.label}
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={soilMoisture} className="h-4" />
          <div className="flex justify-between text-xs text-amber-700 dark:text-amber-300">
            <span>{t("dry", language)}</span>
            <span>{t("optimal", language)}</span>
            <span>{t("saturated", language)}</span>
          </div>
        </div>
        <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {getAdvice(soilMoisture)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
