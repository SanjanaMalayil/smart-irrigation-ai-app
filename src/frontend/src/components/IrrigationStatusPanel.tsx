import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  Droplets,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import { useActor } from "../hooks/useActor";
import {
  useAddIrrigationRecommendation,
  useGetIrrigationRecommendations,
  useGetLatestWeatherData,
} from "../hooks/useQueries";
import { t } from "../i18n/translations";

export default function IrrigationStatusPanel() {
  const { actor, isFetching: isActorFetching } = useActor();
  // Per AGENTS.md learnings: gate effects and click handlers on a derived
  // actorReady flag read directly from useActor, not on the hook's `enabled`
  // flag (which only controls query execution, not mutation calls). Without
  // this, addRecommendation.mutateAsync throws "Actor not initialized" during
  // the init window.
  const actorReady = !!actor && !isActorFetching;

  const { data: recommendations } = useGetIrrigationRecommendations();
  const addRecommendation = useAddIrrigationRecommendation();
  const { data: weatherData } = useGetLatestWeatherData();
  const [soilMoisture, setSoilMoisture] = useState(45);
  const { language } = useLanguage();

  const latestRecommendation =
    recommendations && recommendations.length > 0
      ? recommendations[recommendations.length - 1]
      : null;

  const generateRecommendation = useCallback(async () => {
    // Bail early with a clear message if the backend actor is not ready yet,
    // mirroring WeatherPanel. This prevents the mutation from throwing
    // "Actor not initialized", which would otherwise surface as a generic
    // "Failed to generate" toast.
    if (!actorReady) {
      toast.info(
        language === "en"
          ? "Connecting to the network, please try again in a moment"
          : "नेटवर्क से कनेक्ट हो रहा है, कृपया थोड़ी देर में पुनः प्रयास करें",
      );
      return;
    }

    if (!weatherData) {
      toast.error(t("weatherDataNotAvailable", language));
      return;
    }

    const temperature = weatherData.temperature;
    const moisture = soilMoisture;

    let recommendation = "";
    let reason = "";

    if (moisture < 30) {
      recommendation = "Irrigation Recommended";
      reason = `Soil moisture is low (${moisture.toFixed(0)}%). Plants need water.`;
    } else if (moisture < 50 && temperature > 25) {
      recommendation = "Irrigation Recommended";
      reason = `Moderate soil moisture (${moisture.toFixed(0)}%) with high temperature (${temperature.toFixed(1)}°C). Consider irrigation.`;
    } else if (moisture >= 60) {
      recommendation = "No Irrigation Needed";
      reason = `Soil moisture is adequate (${moisture.toFixed(0)}%). No irrigation required.`;
    } else {
      recommendation = "Monitor Conditions";
      reason = `Soil moisture is moderate (${moisture.toFixed(0)}%). Continue monitoring.`;
    }

    try {
      await addRecommendation.mutateAsync({
        soilMoisture: moisture,
        temperature,
        recommendation,
        reason,
      });
      toast.success(t("recommendationUpdated", language));
    } catch (_error) {
      toast.error(t("failedToGenerate", language));
    }
  }, [actorReady, weatherData, soilMoisture, language, addRecommendation]);

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

  // Auto-generate only when the actor is ready AND weather data has arrived AND
  // there is no existing recommendation. Gating on actorReady prevents the race
  // where this effect fires when weatherData arrives but the actor is still
  // initializing (actor null while isFetching true), which would call
  // addRecommendation.mutateAsync and throw "Actor not initialized".
  useEffect(() => {
    if (actorReady && weatherData && !latestRecommendation) {
      generateRecommendation();
    }
  }, [actorReady, weatherData, latestRecommendation, generateRecommendation]);

  const isIrrigationNeeded =
    latestRecommendation?.recommendation.includes("Recommended");

  const connectingLabel =
    language === "en" ? "Connecting..." : "कनेक्ट हो रहा है...";
  const refreshAriaLabel = !actorReady
    ? connectingLabel
    : language === "en"
      ? "Generate irrigation recommendation"
      : "सिंचाई सिफारिश उत्पन्न करें";

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-emerald-900 dark:text-emerald-100">
                {t("irrigationStatus", language)}
              </CardTitle>
              <CardDescription className="text-emerald-700 dark:text-emerald-300">
                {t("aiPoweredRecommendations", language)}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={generateRecommendation}
            disabled={addRecommendation.isPending || !actorReady}
            className="border-emerald-300 dark:border-emerald-700"
            aria-label={refreshAriaLabel}
            data-ocid="irrigation.refresh_button"
          >
            {addRecommendation.isPending || !actorReady ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {latestRecommendation ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-6">
              {isIrrigationNeeded ? (
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-3" />
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    {latestRecommendation.recommendation}
                  </Badge>
                </div>
              ) : (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                  <Badge
                    variant="outline"
                    className="text-lg px-4 py-2 border-green-500 text-green-700 dark:text-green-300"
                  >
                    {latestRecommendation.recommendation}
                  </Badge>
                </div>
              )}
            </div>
            <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                {t("analysis", language)}
              </h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-3">
                {latestRecommendation.reason}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {t("soilMoistureLabel", language)}:
                  </span>
                  <span className="ml-2 font-semibold text-emerald-900 dark:text-emerald-100">
                    {latestRecommendation.soilMoisture.toFixed(0)}%
                  </span>
                </div>
                <div>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {t("temperatureLabel", language)}:
                  </span>
                  <span className="ml-2 font-semibold text-emerald-900 dark:text-emerald-100">
                    {latestRecommendation.temperature.toFixed(1)}°C
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-emerald-700 dark:text-emerald-300 mb-4">
              {t("noRecommendations", language)}
            </p>
            <Button
              onClick={generateRecommendation}
              disabled={!actorReady || !weatherData}
              data-ocid="irrigation.generate_button"
            >
              {!actorReady ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {connectingLabel}
                </span>
              ) : (
                t("generateRecommendation", language)
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
