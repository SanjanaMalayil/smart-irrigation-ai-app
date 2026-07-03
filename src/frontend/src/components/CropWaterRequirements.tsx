import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Calendar,
  Droplets,
  Leaf,
  Sprout,
  Thermometer,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../i18n/translations";

interface CropInfo {
  name: string;
  nameHi: string;
  waterRequirement: string;
  dailyWater: string;
  irrigationFrequency: string;
  optimalTemp: string;
  growthStages: {
    stage: string;
    waterNeeds: string;
    tips: string;
  }[];
  tips: string[];
}

const cropData: Record<string, CropInfo> = {
  rice: {
    name: "Rice",
    nameHi: "चावल",
    waterRequirement: "High (1200-1500 mm/season)",
    dailyWater: "5-8 mm/day",
    irrigationFrequency: "Continuous flooding or alternate wetting/drying",
    optimalTemp: "20-35°C",
    growthStages: [
      {
        stage: "Seedling",
        waterNeeds: "Keep flooded 2-5 cm",
        tips: "Maintain consistent water level",
      },
      {
        stage: "Tillering",
        waterNeeds: "Alternate wetting/drying",
        tips: "Allow soil to dry slightly between irrigation",
      },
      {
        stage: "Flowering",
        waterNeeds: "Keep flooded 5-10 cm",
        tips: "Critical stage - maintain water level",
      },
      {
        stage: "Grain filling",
        waterNeeds: "Reduce water gradually",
        tips: "Drain field 2 weeks before harvest",
      },
    ],
    tips: [
      "Use alternate wetting and drying (AWD) to save 15-30% water",
      "Maintain 2-5 cm water depth during critical growth stages",
      "Drain field completely 2 weeks before harvest",
      "Monitor for pests in standing water",
    ],
  },
  wheat: {
    name: "Wheat",
    nameHi: "गेहूं",
    waterRequirement: "Medium (450-650 mm/season)",
    dailyWater: "3-5 mm/day",
    irrigationFrequency: "Every 10-15 days",
    optimalTemp: "15-25°C",
    growthStages: [
      {
        stage: "Germination",
        waterNeeds: "Light irrigation",
        tips: "Keep soil moist but not waterlogged",
      },
      {
        stage: "Tillering",
        waterNeeds: "Moderate irrigation",
        tips: "Water every 10-12 days",
      },
      {
        stage: "Jointing",
        waterNeeds: "High irrigation",
        tips: "Critical stage - ensure adequate moisture",
      },
      {
        stage: "Grain filling",
        waterNeeds: "Moderate to high",
        tips: "Maintain soil moisture at 60-70%",
      },
    ],
    tips: [
      "Apply first irrigation 20-25 days after sowing",
      "Critical irrigation stages: crown root initiation, tillering, flowering, and grain filling",
      "Avoid waterlogging which can reduce yield by 20-50%",
      "Use drip or sprinkler irrigation for water efficiency",
    ],
  },
  tomato: {
    name: "Tomato",
    nameHi: "टमाटर",
    waterRequirement: "Medium (400-600 mm/season)",
    dailyWater: "4-6 mm/day",
    irrigationFrequency: "Every 2-3 days",
    optimalTemp: "20-30°C",
    growthStages: [
      {
        stage: "Transplanting",
        waterNeeds: "High irrigation",
        tips: "Water daily for first week",
      },
      {
        stage: "Vegetative",
        waterNeeds: "Moderate irrigation",
        tips: "Water every 2-3 days",
      },
      {
        stage: "Flowering",
        waterNeeds: "Consistent moisture",
        tips: "Avoid water stress to prevent blossom drop",
      },
      {
        stage: "Fruit development",
        waterNeeds: "High irrigation",
        tips: "Maintain consistent moisture to prevent cracking",
      },
    ],
    tips: [
      "Use drip irrigation to prevent foliar diseases",
      "Maintain soil moisture at 60-80% field capacity",
      "Avoid irregular watering to prevent fruit cracking",
      "Mulch to conserve moisture and regulate soil temperature",
      "Reduce watering as fruits begin to ripen for better flavor",
    ],
  },
  corn: {
    name: "Corn (Maize)",
    nameHi: "मक्का",
    waterRequirement: "Medium-High (500-800 mm/season)",
    dailyWater: "5-7 mm/day",
    irrigationFrequency: "Every 5-7 days",
    optimalTemp: "20-30°C",
    growthStages: [
      {
        stage: "Germination",
        waterNeeds: "Moderate irrigation",
        tips: "Keep soil moist for uniform emergence",
      },
      {
        stage: "Vegetative",
        waterNeeds: "Moderate irrigation",
        tips: "Water every 7-10 days",
      },
      {
        stage: "Tasseling/Silking",
        waterNeeds: "High irrigation",
        tips: "Most critical stage - ensure adequate water",
      },
      {
        stage: "Grain filling",
        waterNeeds: "High irrigation",
        tips: "Maintain moisture for kernel development",
      },
    ],
    tips: [
      "Critical water period: 2 weeks before to 3 weeks after silking",
      "Water stress during tasseling can reduce yield by 50%",
      "Use furrow or sprinkler irrigation",
      "Apply 25-30 mm per irrigation event",
    ],
  },
  potato: {
    name: "Potato",
    nameHi: "आलू",
    waterRequirement: "Medium (500-700 mm/season)",
    dailyWater: "4-6 mm/day",
    irrigationFrequency: "Every 3-5 days",
    optimalTemp: "15-25°C",
    growthStages: [
      {
        stage: "Planting",
        waterNeeds: "Light irrigation",
        tips: "Avoid overwatering to prevent rot",
      },
      {
        stage: "Vegetative",
        waterNeeds: "Moderate irrigation",
        tips: "Increase water as plants grow",
      },
      {
        stage: "Tuber initiation",
        waterNeeds: "High irrigation",
        tips: "Critical stage - maintain consistent moisture",
      },
      {
        stage: "Tuber bulking",
        waterNeeds: "High irrigation",
        tips: "Peak water requirement period",
      },
    ],
    tips: [
      "Maintain soil moisture at 65-85% field capacity",
      "Use drip or sprinkler irrigation for uniform distribution",
      "Avoid water stress during tuber formation",
      "Stop irrigation 2 weeks before harvest for better storage",
      "Mulch to conserve moisture and prevent greening",
    ],
  },
  cotton: {
    name: "Cotton",
    nameHi: "कपास",
    waterRequirement: "Medium (700-1300 mm/season)",
    dailyWater: "5-8 mm/day",
    irrigationFrequency: "Every 7-10 days",
    optimalTemp: "25-35°C",
    growthStages: [
      {
        stage: "Germination",
        waterNeeds: "Moderate irrigation",
        tips: "Ensure good soil moisture for emergence",
      },
      {
        stage: "Vegetative",
        waterNeeds: "Moderate irrigation",
        tips: "Water every 10-12 days",
      },
      {
        stage: "Flowering",
        waterNeeds: "High irrigation",
        tips: "Critical stage - maintain adequate moisture",
      },
      {
        stage: "Boll development",
        waterNeeds: "High irrigation",
        tips: "Peak water requirement period",
      },
    ],
    tips: [
      "Critical water period: flowering to boll development",
      "Use furrow or drip irrigation",
      "Reduce irrigation during boll opening for better fiber quality",
      "Monitor for waterlogging which can cause root diseases",
    ],
  },
};

export default function CropWaterRequirements() {
  const { language } = useLanguage();

  return (
    <Card className="bg-card border shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-lime-600 rounded-lg flex items-center justify-center">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-foreground">
              {t("cropWaterRequirements", language)}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("irrigationSchedules", language)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rice" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
            <TabsTrigger value="rice" data-ocid="crops.tab.rice">
              {language === "hi" ? cropData.rice.nameHi : cropData.rice.name}
            </TabsTrigger>
            <TabsTrigger value="wheat" data-ocid="crops.tab.wheat">
              {language === "hi" ? cropData.wheat.nameHi : cropData.wheat.name}
            </TabsTrigger>
            <TabsTrigger value="tomato" data-ocid="crops.tab.tomato">
              {language === "hi"
                ? cropData.tomato.nameHi
                : cropData.tomato.name}
            </TabsTrigger>
            <TabsTrigger value="corn" data-ocid="crops.tab.corn">
              {language === "hi" ? cropData.corn.nameHi : cropData.corn.name}
            </TabsTrigger>
            <TabsTrigger value="potato" data-ocid="crops.tab.potato">
              {language === "hi"
                ? cropData.potato.nameHi
                : cropData.potato.name}
            </TabsTrigger>
            <TabsTrigger value="cotton" data-ocid="crops.tab.cotton">
              {language === "hi"
                ? cropData.cotton.nameHi
                : cropData.cotton.name}
            </TabsTrigger>
          </TabsList>

          {Object.entries(cropData).map(([key, crop]) => (
            <TabsContent key={key} value={key} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      {t("waterRequirement", language)}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {crop.waterRequirement}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {t("dailyWater", language)}: {crop.dailyWater}
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                      {t("irrigationFrequency", language)}
                    </span>
                  </div>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">
                    {crop.irrigationFrequency}
                  </p>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                      {t("optimalTemperature", language)}
                    </span>
                  </div>
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    {crop.optimalTemp}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                      {t("growthStages", language)}
                    </span>
                  </div>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    {crop.growthStages.length} stages
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Sprout className="w-5 h-5" />
                  {t("growthStagesWaterNeeds", language)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {crop.growthStages.map((stage, stageIndex) => (
                    <div
                      key={stage.stage}
                      className="p-4 bg-muted rounded-lg border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-foreground">
                          {stage.stage}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {t("stage", language)} {stageIndex + 1}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>{t("waterNeeds", language)}:</strong>{" "}
                        {stage.waterNeeds}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-start gap-1">
                        <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {stage.tips}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  {t("waterManagementTips", language)}
                </h3>
                <div className="space-y-2">
                  {crop.tips.map((tip, index) => (
                    <div
                      key={tip}
                      className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
