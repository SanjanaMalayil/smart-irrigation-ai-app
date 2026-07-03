import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  Droplets,
  Leaf,
  Smartphone,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../i18n/translations";

export default function About() {
  const { language } = useLanguage();

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {t("aboutTitle", language)}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("aboutSubtitle", language)}
          </p>
        </div>

        {/* Aim Section */}
        <Card className="bg-card border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-foreground">
              <Target className="w-8 h-8 text-primary" />
              {t("ourAim", language)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("ourAimDesc", language)}
            </p>
          </CardContent>
        </Card>

        {/* About the App Section */}
        <Card className="bg-card border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-foreground">
              <Smartphone className="w-8 h-8 text-primary" />
              {t("aboutApp", language)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("aboutAppDesc", language)}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3 p-4 rounded-lg bg-muted">
                <Leaf className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {t("plantHealthAnalysis", language)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("plantHealthAnalysisDesc", language)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-muted">
                <Droplets className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {t("realTimeWeather", language)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("realTimeWeatherDesc", language)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-muted">
                <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {t("soilMoistureInsights", language)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("soilMoistureInsightsDesc", language)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-muted">
                <Brain className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {t("aiDrivenRecommendations", language)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("aiDrivenRecommendationsDesc", language)}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("aboutAppClosing", language)}
            </p>
          </CardContent>
        </Card>

        {/* Impact Section */}
        <Card className="bg-card border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-foreground">
              <TrendingUp className="w-8 h-8 text-primary" />
              {t("ourImpact", language)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {t("waterConservation", language)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("waterConservationDesc", language)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {t("dataInformedDecisions", language)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("dataInformedDecisionsDesc", language)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {t("supportingFarmers", language)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("supportingFarmersDesc", language)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Contributors Section */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl text-foreground">
              <Users className="w-8 h-8 text-primary" />
              {t("projectContributors", language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              {t("contributorsDesc", language)}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="group relative overflow-hidden rounded-lg bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 border-2 border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-500" />
                <h3 className="text-lg font-semibold text-foreground pl-3">
                  Sanjana S Malayil
                </h3>
              </div>

              <div className="group relative overflow-hidden rounded-lg bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 border-2 border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-500 to-emerald-500" />
                <h3 className="text-lg font-semibold text-foreground pl-3">
                  Sweksha Sikarwar
                </h3>
              </div>

              <div className="group relative overflow-hidden rounded-lg bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 border-2 border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-500" />
                <h3 className="text-lg font-semibold text-foreground pl-3">
                  Mahika Dahiya
                </h3>
              </div>

              <div className="group relative overflow-hidden rounded-lg bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 border-2 border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-500 to-emerald-500" />
                <h3 className="text-lg font-semibold text-foreground pl-3">
                  Namrata Kumari
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
