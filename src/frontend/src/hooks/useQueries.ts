import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ChatMessage,
  ExternalBlob,
  IrrigationRecommendation,
  PlantHealthAnalysis,
  WeatherData,
} from "../backend-wrapper";
import { useActor } from "./useActor";

export function useGetChatHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

// Export-only variants. The backend exposes dedicated `*ForExport` query
// methods that return the full record set (including image bytes for plant
// analyses) for report generation, distinct from the paginated/feature views.
// ExportReport uses these so the report always reflects the complete history.
export function useGetChatHistoryForExport() {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ["chatHistoryForExport"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatHistoryForExport();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sender,
      message,
    }: { sender: string; message: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.addChatMessage(sender, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
  });
}

export function useGetPlantAnalyses() {
  const { actor, isFetching } = useActor();

  return useQuery<PlantHealthAnalysis[]>({
    queryKey: ["plantAnalyses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPlantAnalyses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPlantAnalysesForExport() {
  const { actor, isFetching } = useActor();

  return useQuery<PlantHealthAnalysis[]>({
    queryKey: ["plantAnalysesForExport"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPlantAnalysesForExport();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAnalyzePlantHealth() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    // The bindgen actor's `analyzePlantHealth` takes raw bytes (Uint8Array),
    // but feature components hand us an ExternalBlob. Resolve the bytes here so
    // the actor receives exactly what the IDL expects.
    mutationFn: async ({
      image,
      greenRatio,
    }: { image: ExternalBlob; greenRatio: number }) => {
      if (!actor) throw new Error("Actor not initialized");
      const bytes = await image.getBytes();
      await actor.analyzePlantHealth(bytes, greenRatio);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plantAnalyses"] });
    },
  });
}

export function useGetLatestWeatherData() {
  const { actor, isFetching } = useActor();

  return useQuery<WeatherData | null>({
    queryKey: ["latestWeather"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestWeatherData();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

export function useUpdateWeatherData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      temperature,
      humidity,
      conditions,
    }: { temperature: number; humidity: number; conditions: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.updateWeatherData(temperature, humidity, conditions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["latestWeather"] });
    },
  });
}

export function useGetIrrigationRecommendations() {
  const { actor, isFetching } = useActor();

  return useQuery<IrrigationRecommendation[]>({
    queryKey: ["irrigationRecommendations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIrrigationRecommendations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetIrrigationRecommendationsForExport() {
  const { actor, isFetching } = useActor();

  return useQuery<IrrigationRecommendation[]>({
    queryKey: ["irrigationRecommendationsForExport"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIrrigationRecommendationsForExport();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddIrrigationRecommendation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      soilMoisture,
      temperature,
      recommendation,
      reason,
    }: {
      soilMoisture: number;
      temperature: number;
      recommendation: string;
      reason: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.addIrrigationRecommendation(
        soilMoisture,
        temperature,
        recommendation,
        reason,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["irrigationRecommendations"],
      });
    },
  });
}

export function useFetchWeatherData() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (apiUrl: string) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.fetchWeatherData(apiUrl);
    },
  });
}
