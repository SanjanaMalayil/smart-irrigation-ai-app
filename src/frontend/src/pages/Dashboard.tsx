import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, Droplets, Leaf, MessageSquare, Sprout } from "lucide-react";
import { useState } from "react";
import ChatInterface from "../components/ChatInterface";
import CropWaterRequirements from "../components/CropWaterRequirements";
import HeroSection from "../components/HeroSection";
import IrrigationStatusPanel from "../components/IrrigationStatusPanel";
import PlantHealthAnalyzer from "../components/PlantHealthAnalyzer";
import SoilMoisturePanel from "../components/SoilMoisturePanel";
import WeatherPanel from "../components/WeatherPanel";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../i18n/translations";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { language } = useLanguage();

  return (
    <>
      <HeroSection onNavigate={setActiveTab} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-card backdrop-blur-sm">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2"
              data-ocid="dashboard.overview.tab"
            >
              <Cloud className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t("overview", language)}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="irrigation"
              className="flex items-center gap-2"
              data-ocid="dashboard.irrigation.tab"
            >
              <Droplets className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t("irrigation", language)}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="crops"
              className="flex items-center gap-2"
              data-ocid="dashboard.crops.tab"
            >
              <Sprout className="w-4 h-4" />
              <span className="hidden sm:inline">{t("crops", language)}</span>
            </TabsTrigger>
            <TabsTrigger
              value="plant-health"
              className="flex items-center gap-2"
              data-ocid="dashboard.plant_health.tab"
            >
              <Leaf className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t("plantHealth", language)}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="flex items-center gap-2"
              data-ocid="dashboard.chat.tab"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t("aiAssistant", language)}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherPanel />
              <SoilMoisturePanel />
            </div>
            <IrrigationStatusPanel />
            <CropWaterRequirements />
          </TabsContent>

          <TabsContent value="irrigation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SoilMoisturePanel />
              <WeatherPanel />
            </div>
            <IrrigationStatusPanel />
          </TabsContent>

          <TabsContent value="crops">
            <CropWaterRequirements />
          </TabsContent>

          <TabsContent value="plant-health">
            <PlantHealthAnalyzer />
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
