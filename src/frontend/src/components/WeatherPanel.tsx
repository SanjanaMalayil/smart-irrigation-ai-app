import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cloud, Droplets, Loader2, RefreshCw, Thermometer } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import { useActor } from "../hooks/useActor";
import {
  useFetchWeatherData,
  useGetLatestWeatherData,
  useUpdateWeatherData,
} from "../hooks/useQueries";
import { t } from "../i18n/translations";

export default function WeatherPanel() {
  const { actor, isFetching: isActorFetching } = useActor();
  const actorReady = !!actor && !isActorFetching;

  const { data: weatherData, isLoading } = useGetLatestWeatherData();
  const updateWeather = useUpdateWeatherData();
  const fetchWeather = useFetchWeatherData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { language } = useLanguage();

  const fetchWeatherFromAPI = useCallback(async () => {
    // Bail early with a clear message if the backend actor is not ready yet.
    // This prevents the mutation from throwing "Actor not initialized", which
    // would otherwise surface as a generic "Failed to fetch weather data" toast.
    if (!actorReady) {
      toast.info(
        language === "en"
          ? "Connecting to the network, please try again in a moment"
          : "नेटवर्क से कनेक्ट हो रहा है, कृपया थोड़ी देर में पुनः प्रयास करें",
      );
      return;
    }

    setIsRefreshing(true);
    try {
      // Geolocation lookup with NYC fallback preserved.
      let latitude = 40.7128;
      let longitude = -74.006;
      try {
        const geoResponse = await fetch("https://ipapi.co/json/");
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (typeof geoData.latitude === "number") {
            latitude = geoData.latitude;
          }
          if (typeof geoData.longitude === "number") {
            longitude = geoData.longitude;
          }
        }
      } catch (geoError) {
        // Geolocation is best-effort; fall back to NYC coords silently.
        console.warn(
          "Geolocation lookup failed, using default coords:",
          geoError,
        );
      }

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&temperature_unit=celsius`;

      const weatherResponse = await fetchWeather.mutateAsync(weatherUrl);

      // Parse the raw Open-Meteo JSON body returned by the backend outcall.
      // A parse failure means the weather service returned an unexpected
      // response — surface a clear message instead of the generic failure.
      let weatherJson: {
        current?: {
          temperature_2m?: number;
          relative_humidity_2m?: number;
          weather_code?: number;
        };
      };
      try {
        weatherJson = JSON.parse(weatherResponse);
      } catch (parseError) {
        console.error("Failed to parse weather response:", parseError);
        toast.error(
          language === "en"
            ? "The weather service returned an unexpected response. Please try again."
            : "मौसम सेवा ने अप्रत्याशित प्रतिक्रिया दी है। कृपया पुनः प्रयास करें।",
        );
        return;
      }

      const current = weatherJson.current;
      if (
        !current ||
        typeof current.temperature_2m !== "number" ||
        typeof current.relative_humidity_2m !== "number" ||
        typeof current.weather_code !== "number"
      ) {
        toast.error(
          language === "en"
            ? "The weather service returned an unexpected response. Please try again."
            : "मौसम सेवा ने अप्रत्याशित प्रतिक्रिया दी है। कृपया पुनः प्रयास करें।",
        );
        return;
      }

      const temperature = current.temperature_2m;
      const humidity = current.relative_humidity_2m;
      const weatherCode = current.weather_code;

      const conditions = getWeatherCondition(weatherCode);

      await updateWeather.mutateAsync({
        temperature,
        humidity,
        conditions,
      });

      toast.success(
        language === "en"
          ? "Weather data updated successfully"
          : "मौसम डेटा सफलतापूर्वक अपडेट किया गया",
      );
    } catch (error) {
      console.error("Error fetching weather:", error);
      toast.error(
        language === "en"
          ? "Failed to fetch weather data"
          : "मौसम डेटा प्राप्त करने में विफल",
      );
    } finally {
      setIsRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actorReady, fetchWeather, updateWeather, language]);

  const getWeatherCondition = (code: number): string => {
    if (code === 0) return "Clear";
    if (code <= 3) return "Partly Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snowy";
    if (code <= 82) return "Rainy";
    if (code <= 86) return "Snowy";
    return "Stormy";
  };

  // Auto-fetch only when the actor is ready AND there is no cached weather data.
  // Gating on actorReady prevents the previous race where this effect fired on
  // mount before the backend connection was established (actor was null while
  // isFetching was true), causing an immediate failed fetch.
  useEffect(() => {
    if (actorReady && !weatherData) {
      fetchWeatherFromAPI();
    }
  }, [actorReady, weatherData, fetchWeatherFromAPI]);

  const connectingLabel =
    language === "en" ? "Connecting..." : "कनेक्ट हो रहा है...";
  const refreshAriaLabel = !actorReady
    ? connectingLabel
    : language === "en"
      ? "Refresh weather data"
      : "मौसम डेटा रिफ्रेश करें";

  return (
    <Card className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950 dark:to-blue-950 border-sky-200 dark:border-sky-800 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-sky-900 dark:text-sky-100">
                {t("weatherTitle", language)}
              </CardTitle>
              <CardDescription className="text-sky-700 dark:text-sky-300">
                {t("realTimeConditions", language)}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchWeatherFromAPI}
            disabled={isRefreshing || !actorReady}
            className="border-sky-300 dark:border-sky-700"
            aria-label={refreshAriaLabel}
            data-ocid="weather.refresh_button"
          >
            {isRefreshing || !actorReady ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && !weatherData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          </div>
        ) : weatherData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Thermometer className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-sm text-sky-700 dark:text-sky-300">
                    {t("temperature", language)}
                  </p>
                  <p className="text-2xl font-bold text-sky-900 dark:text-sky-100">
                    {weatherData.temperature.toFixed(1)}°C
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Droplets className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-sky-700 dark:text-sky-300">
                    {t("humidity", language)}
                  </p>
                  <p className="text-2xl font-bold text-sky-900 dark:text-sky-100">
                    {weatherData.humidity.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-sm text-sky-700 dark:text-sky-300 mb-1">
                {t("conditions", language)}
              </p>
              <p className="text-xl font-semibold text-sky-900 dark:text-sky-100">
                {weatherData.conditions}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-sky-700 dark:text-sky-300">
            <p>{t("noWeatherData", language)}</p>
            <Button
              onClick={fetchWeatherFromAPI}
              className="mt-4"
              variant="outline"
              disabled={!actorReady}
              data-ocid="weather.fetch_button"
            >
              {actorReady ? (
                t("fetchWeather", language)
              ) : (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {connectingLabel}
                </span>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
