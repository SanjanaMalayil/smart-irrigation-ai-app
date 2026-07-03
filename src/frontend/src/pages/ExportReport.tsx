import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Droplets,
  FileDown,
  Leaf,
  Loader2,
  MessageSquare,
  Printer,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  useGetChatHistoryForExport,
  useGetIrrigationRecommendationsForExport,
  useGetPlantAnalysesForExport,
} from "../hooks/useQueries";
import { t } from "../i18n/translations";

export default function ExportReport() {
  const { language } = useLanguage();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Use the dedicated `*ForExport` backend methods so the report always
  // reflects the complete record set (including image bytes for plant
  // analyses), distinct from the feature-view queries used elsewhere.
  const { data: plantAnalyses, isLoading: isLoadingAnalyses } =
    useGetPlantAnalysesForExport();
  const { data: recommendations, isLoading: isLoadingRecommendations } =
    useGetIrrigationRecommendationsForExport();
  const { data: chatHistory, isLoading: isLoadingChat } =
    useGetChatHistoryForExport();

  const fromTimestamp = fromDate ? new Date(fromDate).getTime() : 0;
  const toTimestamp = toDate
    ? new Date(toDate).getTime() + 86400000
    : Number.MAX_SAFE_INTEGER;

  const filteredAnalyses = useMemo(() => {
    if (!plantAnalyses) return [];
    return plantAnalyses.filter((a) => {
      const ts = Number(a.timestamp) / 1000000;
      return ts >= fromTimestamp && ts <= toTimestamp;
    });
  }, [plantAnalyses, fromTimestamp, toTimestamp]);

  const filteredRecommendations = useMemo(() => {
    if (!recommendations) return [];
    return recommendations.filter((r) => {
      const ts = Number(r.timestamp) / 1000000;
      return ts >= fromTimestamp && ts <= toTimestamp;
    });
  }, [recommendations, fromTimestamp, toTimestamp]);

  const filteredChat = useMemo(() => {
    if (!chatHistory) return [];
    return chatHistory.filter((c) => {
      const ts = Number(c.timestamp) / 1000000;
      return ts >= fromTimestamp && ts <= toTimestamp;
    });
  }, [chatHistory, fromTimestamp, toTimestamp]);

  // Build object URLs for plant analysis images once per filtered list and
  // revoke them when the list changes or the component unmounts. Creating a
  // new URL inside .map() on every render leaks blob URLs and can exhaust the
  // browser's URL quota on large reports.
  const imageUrls = useMemo(() => {
    const map = new Map<string, string>();
    for (const analysis of filteredAnalyses) {
      const key = analysis.timestamp.toString();
      const blob = new Blob([analysis.image as BlobPart], {
        type: "image/jpeg",
      });
      map.set(key, URL.createObjectURL(blob));
    }
    return map;
  }, [filteredAnalyses]);

  useEffect(() => {
    return () => {
      for (const url of imageUrls.values()) {
        URL.revokeObjectURL(url);
      }
    };
  }, [imageUrls]);

  const handlePrint = () => {
    window.print();
  };

  const isLoading =
    isLoadingAnalyses || isLoadingRecommendations || isLoadingChat;

  const getHealthLabel = (status: string) => {
    if (status === "Healthy") return t("healthy", language);
    if (status === "Moderate") return t("moderate", language);
    return t("unhealthy", language);
  };

  const getHealthBadgeVariant = (
    status: string,
  ): "default" | "secondary" | "destructive" => {
    if (status === "Healthy") return "default";
    if (status === "Moderate") return "secondary";
    return "destructive";
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t("exportReport", language)}
            </h1>
            <p className="text-muted-foreground">
              {t("exportSubtitle", language)}
            </p>
          </div>
          <Button
            onClick={handlePrint}
            className="gap-2"
            data-ocid="export.print_button"
          >
            <Printer className="w-4 h-4" />
            {t("printReport", language)}
          </Button>
        </div>

        {/* Date Range Filter */}
        <Card className="bg-card border shadow-lg print:hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileDown className="w-5 h-5 text-primary" />
              {t("dateRange", language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from-date">{t("from", language)}</Label>
                <Input
                  id="from-date"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  data-ocid="export.from_date.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to-date">{t("to", language)}</Label>
                <Input
                  id="to-date"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  data-ocid="export.to_date.input"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Plant Analyses Section */}
            <Card className="bg-card border shadow-lg print:shadow-none print:border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Leaf className="w-5 h-5 text-green-500" />
                  {t("plantAnalysesSection", language)}
                  <Badge variant="secondary" className="ml-auto">
                    {t("totalRecords", language)}: {filteredAnalyses.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredAnalyses.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAnalyses
                      .slice()
                      .reverse()
                      .map((analysis, index) => (
                        <div
                          key={analysis.timestamp.toString()}
                          className="p-4 bg-muted rounded-lg space-y-3"
                          data-ocid={`export.plant_analysis.item.${index + 1}`}
                        >
                          <div className="flex items-center justify-between">
                            <Badge
                              variant={getHealthBadgeVariant(
                                analysis.healthStatus,
                              )}
                            >
                              {getHealthLabel(analysis.healthStatus)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                Number(analysis.timestamp) / 1000000,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <img
                            src={imageUrls.get(analysis.timestamp.toString())}
                            alt="Plant analysis"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                {t("greenRatio", language)}:
                              </span>
                              <span className="ml-2 font-semibold text-foreground">
                                {(analysis.greenRatio * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                {t("status", language)}:
                              </span>
                              <span className="ml-2 font-semibold text-foreground">
                                {analysis.healthStatus}
                              </span>
                            </div>
                          </div>
                          {analysis.greenRatio < 0.4 && (
                            <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                              <p className="text-sm text-destructive">
                                {t("greenRatioLowWarning", language)}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div
                    className="text-center py-8 text-muted-foreground"
                    data-ocid="export.plant_analysis.empty_state"
                  >
                    <Leaf className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p>{t("noDataInRange", language)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Separator />

            {/* Irrigation Recommendations Section */}
            <Card className="bg-card border shadow-lg print:shadow-none print:border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  {t("irrigationRecommendationsSection", language)}
                  <Badge variant="secondary" className="ml-auto">
                    {t("totalRecords", language)}:{" "}
                    {filteredRecommendations.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredRecommendations.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRecommendations
                      .slice()
                      .reverse()
                      .map((rec, index) => (
                        <div
                          key={rec.timestamp.toString()}
                          className="p-4 bg-muted rounded-lg space-y-3"
                          data-ocid={`export.irrigation.item.${index + 1}`}
                        >
                          <div className="flex items-center justify-between">
                            <Badge
                              variant={
                                rec.recommendation.includes("Recommended")
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {rec.recommendation}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                Number(rec.timestamp) / 1000000,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                {t("soilMoistureLabel", language)}:
                              </span>
                              <span className="ml-2 font-semibold text-foreground">
                                {rec.soilMoisture.toFixed(0)}%
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                {t("temperatureLabel", language)}:
                              </span>
                              <span className="ml-2 font-semibold text-foreground">
                                {rec.temperature.toFixed(1)}°C
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                {t("recommendation", language)}:
                              </span>
                              <span className="ml-2 font-semibold text-foreground">
                                {rec.recommendation}
                              </span>
                            </div>
                          </div>
                          <div className="p-3 bg-background rounded border">
                            <span className="text-sm text-muted-foreground">
                              {t("reason", language)}:
                            </span>
                            <p className="text-sm text-foreground mt-1">
                              {rec.reason}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div
                    className="text-center py-8 text-muted-foreground"
                    data-ocid="export.irrigation.empty_state"
                  >
                    <Droplets className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p>{t("noDataInRange", language)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Separator />

            {/* Chat History Section */}
            <Card className="bg-card border shadow-lg print:shadow-none print:border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  {t("chatHistorySection", language)}
                  <Badge variant="secondary" className="ml-auto">
                    {t("totalRecords", language)}: {filteredChat.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredChat.length > 0 ? (
                  <div className="space-y-3">
                    {filteredChat.map((msg, index) => (
                      <div
                        key={`${msg.timestamp}-${msg.sender}`}
                        className={`p-4 rounded-lg ${
                          msg.sender === "user"
                            ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
                            : "bg-muted border"
                        }`}
                        data-ocid={`export.chat.item.${index + 1}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant={
                              msg.sender === "user" ? "default" : "secondary"
                            }
                          >
                            {msg.sender === "user"
                              ? t("sender", language)
                              : "AI"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(
                              Number(msg.timestamp) / 1000000,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="text-center py-8 text-muted-foreground"
                    data-ocid="export.chat.empty_state"
                  >
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p>{t("noDataInRange", language)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground pt-4">
              <p>
                {t("generatedOn", language)}: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
