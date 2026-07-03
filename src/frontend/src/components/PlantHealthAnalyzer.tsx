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
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Leaf,
  Loader2,
  Upload,
  WifiOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend-wrapper";
import { useLanguage } from "../context/LanguageContext";
import { useActor } from "../hooks/useActor";
import {
  useAnalyzePlantHealth,
  useGetPlantAnalyses,
} from "../hooks/useQueries";
import { t } from "../i18n/translations";

// Staged upload progress shown while image bytes travel to the backend.
// Each stage flips on as handleAnalyze advances, giving the user concrete
// feedback that bytes are being sent (requirement: upload progress).
type UploadStage =
  | "idle"
  | "reading"
  | "analyzing-pixels"
  | "uploading"
  | "analyzing";

const STAGE_LABEL_EN: Record<UploadStage, string> = {
  idle: "",
  reading: "Reading image…",
  "analyzing-pixels": "Measuring green ratio…",
  uploading: "Uploading image bytes…",
  analyzing: "Analyzing on backend…",
};

const STAGE_LABEL_HI: Record<UploadStage, string> = {
  idle: "",
  reading: "छवि पढ़ रहा है…",
  "analyzing-pixels": "हरा अनुपात माप रहा है…",
  uploading: "छवि बाइट्स अपलोड हो रहे हैं…",
  analyzing: "बैकएंड पर विश्लेषण हो रहा है…",
};

export default function PlantHealthAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadStage, setUploadStage] = useState<UploadStage>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive actor readiness directly from useActor (per project learning):
  // the mutation hook's `enabled` flag only gates query execution, not
  // mutation calls, so the component must gate clicks/drops itself.
  const { actor, isFetching, error: actorError } = useActor();
  const actorReady = !!actor && !isFetching;

  const { data: analyses, isLoading } = useGetPlantAnalyses();
  const analyzePlant = useAnalyzePlantHealth();
  const { language } = useLanguage();

  // Revoke object URLs to avoid leaking blob memory when previews change.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const processFile = (file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(
        language === "en"
          ? "Please select an image file"
          : "कृपया एक छवि फ़ाइल चुनें",
      );
      return;
    }
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (actorReady && e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    // Ignore drops while the backend actor is not ready — per project
    // learning, gating on actorReady here prevents a dropped file from
    // being queued for a mutation that would throw "Actor not initialized".
    if (!actorReady) {
      toast.error(
        language === "en"
          ? "Still connecting to the backend. Please wait a moment and try again."
          : "बैकएंड से कनेक्ट हो रहा है। कृपया थोड़ा प्रतीक्षा करें और पुनः प्रयास करें।",
      );
      return;
    }
    processFile(e.dataTransfer.files?.[0]);
  };

  const calculateGreenRatio = async (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) {
          resolve(0.5);
          return;
        }

        let greenPixels = 0;
        let totalPixels = 0;

        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];

          if (g > r && g > b && g > 50) {
            greenPixels++;
          }
          totalPixels++;
        }

        const ratio = greenPixels / totalPixels;
        resolve(ratio);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error(
        language === "en"
          ? "Please select an image first"
          : "कृपया पहले एक छवि चुनें",
      );
      return;
    }

    // Gate on actor readiness before doing any work — per project learning,
    // the mutation hook throws "Actor not initialized" if the actor is null,
    // so we surface a clear connecting state instead of letting it fail.
    if (!actorReady) {
      toast.error(
        language === "en"
          ? "Still connecting to the backend. Please wait a moment and try again."
          : "बैकएंड से कनेक्ट हो रहा है। कृपया थोड़ा प्रतीक्षा करें और पुनः प्रयास करें।",
      );
      return;
    }

    setIsAnalyzing(true);
    try {
      setUploadStage("reading");
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      setUploadStage("analyzing-pixels");
      const greenRatio = await calculateGreenRatio(selectedFile);

      setUploadStage("uploading");
      const blob = ExternalBlob.fromBytes(bytes);

      setUploadStage("analyzing");
      await analyzePlant.mutateAsync({
        image: blob,
        greenRatio,
      });

      toast.success(
        language === "en"
          ? "Plant health analyzed successfully"
          : "पौधे का स्वास्थ्य सफलतापूर्वक विश्लेषित किया गया",
      );
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Analysis error:", error);
      // Distinguish "Actor not initialized" (client-side wiring) from a
      // backend error (replica reject / network) so the toast is specific
      // rather than a generic swallowed failure.
      const message =
        error instanceof Error ? error.message : String(error ?? "");
      if (message.includes("Actor not initialized")) {
        toast.error(
          language === "en"
            ? "Backend connection not ready. Please wait for the connection and try again."
            : "बैकएंड कनेक्शन तैयार नहीं है। कृपया कनेक्शन की प्रतीक्षा करें और पुनः प्रयास करें।",
        );
      } else {
        toast.error(
          language === "en"
            ? `Failed to analyze plant health: ${message || "backend error"}`
            : `पौधे का स्वास्थ्य विश्लेषण करने में विफल: ${message || "बैकएंड त्रुटि"}`,
        );
      }
    } finally {
      setIsAnalyzing(false);
      setUploadStage("idle");
    }
  };

  const getHealthBadgeVariant = (
    status: string,
  ): "default" | "secondary" | "destructive" => {
    if (status === "Healthy") return "default";
    if (status === "Moderate") return "secondary";
    return "destructive";
  };

  const getHealthLabel = (status: string) => {
    if (status === "Healthy") return t("healthy", language);
    if (status === "Moderate") return t("moderate", language);
    return t("unhealthy", language);
  };

  const stageLabel =
    language === "en"
      ? STAGE_LABEL_EN[uploadStage]
      : STAGE_LABEL_HI[uploadStage];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <img
                src="/assets/leaf-healthy.dim_64x64.png"
                alt="Leaf"
                className="w-6 h-6"
              />
            </div>
            <div>
              <CardTitle className="text-foreground">
                {t("plantHealthAnalyzer", language)}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t("uploadLeafImage", language)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connecting state — actor not ready yet. Per user preference,
              show clear feedback while the backend connection is pending. */}
          {!actorReady && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-700 dark:text-amber-300"
              data-ocid="plant_health.connecting_state"
            >
              {actorError ? (
                <WifiOff className="w-4 h-4 flex-shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
              )}
              <span>
                {actorError
                  ? language === "en"
                    ? `Connection error: ${actorError}`
                    : `कनेक्शन त्रुटि: ${actorError}`
                  : language === "en"
                    ? "Connecting to the backend…"
                    : "बैकएंड से कनेक्ट हो रहा है…"}
              </span>
            </div>
          )}

          <button
            type="button"
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors w-full ${
              isDragging
                ? "border-primary bg-primary/10 scale-[1.01]"
                : "border-input hover:border-primary"
            } ${!actorReady ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            onClick={() => {
              if (!actorReady) return;
              fileInputRef.current?.click();
            }}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            aria-disabled={!actorReady}
            data-ocid="plant_health.upload.dropzone"
          >
            {previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
                <p className="text-sm text-muted-foreground">
                  {selectedFile?.name}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload
                  className={`w-12 h-12 mx-auto transition-colors ${
                    isDragging ? "text-primary" : "text-primary"
                  }`}
                />
                <div>
                  <p className="font-semibold text-foreground">
                    {isDragging
                      ? t("dragActive", language)
                      : t("clickToUpload", language)}
                  </p>
                  {!isDragging && (
                    <p className="text-sm text-muted-foreground">
                      {t("dragAndDropHint", language)}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {t("pngJpgUpTo10MB", language)}
                  </p>
                </div>
              </div>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            data-ocid="plant_health.upload.input"
          />

          {/* Upload progress feedback — staged indicator shown while image
              bytes are being sent to the backend (requirement). */}
          {isAnalyzing && uploadStage !== "idle" && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/30 text-sm text-primary"
              data-ocid="plant_health.loading_state"
            >
              <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
              <span>{stageLabel}</span>
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!selectedFile || isAnalyzing || !actorReady}
            className="w-full"
            data-ocid="plant_health.analyze_button"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("analyzing", language)}
              </>
            ) : !actorReady ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {language === "en" ? "Connecting…" : "कनेक्ट हो रहा है…"}
              </>
            ) : (
              <>
                <Leaf className="w-4 h-4 mr-2" />
                {t("analyzePlantHealth", language)}
              </>
            )}
          </Button>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>{t("howItWorks", language)}:</strong>{" "}
              {t("howItWorksDesc", language)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground">
            {t("analysisHistory", language)}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("previousAssessments", language)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div
              className="flex items-center justify-center py-8"
              data-ocid="plant_health.loading_state"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : analyses && analyses.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {analyses
                .slice()
                .reverse()
                .map((analysis, index) => (
                  <div
                    key={analysis.timestamp.toString()}
                    className="p-4 bg-muted rounded-lg space-y-3"
                    data-ocid={`plant_health.item.${index + 1}`}
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={getHealthBadgeVariant(analysis.healthStatus)}
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
                      src={URL.createObjectURL(
                        new Blob([analysis.image as BlobPart]),
                      )}
                      alt="Plant analysis"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("greenRatio", language)}:
                      </span>
                      <span className="font-semibold text-foreground">
                        {(analysis.greenRatio * 100).toFixed(1)}%
                      </span>
                    </div>
                    {analysis.greenRatio < 0.4 ? (
                      <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-destructive">
                            {t("irrigationVerdict", language)}:{" "}
                            {t("irrigationNeeded", language)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("greenRatioLowWarning", language)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 p-3 bg-green-500/10 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                          {t("irrigationVerdict", language)}:{" "}
                          {t("noIrrigationNeeded", language)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div
              className="text-center py-8 text-muted-foreground"
              data-ocid="plant_health.empty_state"
            >
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-primary" />
              <p>{t("noAnalysesYet", language)}</p>
              <p className="text-sm mt-2">
                {t("uploadToGetStarted", language)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
