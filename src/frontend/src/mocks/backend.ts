import type { backendInterface } from "../backend";

const now = BigInt(Date.parse("2026-06-27T10:00:00Z") * 1000);

const sampleChatHistory = [
  { sender: "user", message: "How often should I water my tomato plants?", timestamp: now - BigInt(120_000_000_000) },
  { sender: "assistant", message: "Tomato plants typically need about 1-2 inches of water per week. In hot weather, water deeply every 2-3 days to encourage deep root growth.", timestamp: now - BigInt(60_000_000_000) },
];

const samplePlantAnalyses = [
  {
    healthStatus: "Healthy",
    timestamp: now - BigInt(300_000_000_000),
    greenRatio: 0.78,
    image: new Uint8Array([0x89, 0x50, 0x4e, 0x47]),
  },
  {
    healthStatus: "Moderate",
    timestamp: now - BigInt(180_000_000_000),
    greenRatio: 0.58,
    image: new Uint8Array([0x89, 0x50, 0x4e, 0x47]),
  },
];

const sampleWeather = {
  temperature: 28.4,
  humidity: 64.2,
  timestamp: now - BigInt(900_000_000_000),
  conditions: "Partly cloudy",
};

const sampleIrrigation = [
  {
    soilMoisture: 32.5,
    temperature: 28.4,
    timestamp: now - BigInt(600_000_000_000),
    recommendation: "Apply 12mm of water to the north field in the next 24 hours.",
    reason: "Soil moisture is below the 35% threshold and temperatures are elevated.",
  },
];

export const mockBackend: backendInterface = {
  // MixinView hooks exposed by the data-viewer. The mock returns empty
  // [key, value] arrays so any dev-only introspection against the mock
  // behaves as if no records have been ingested.
  __chatHistory: async () => [],
  __irrigationRecommendations: async () => [],
  __plantAnalyses: async () => [],
  __weatherDataStore: async () => [],
  addChatMessage: async () => undefined,
  addIrrigationRecommendation: async () => undefined,
  analyzePlantHealth: async () => undefined,
  fetchWeatherData: async () =>
    JSON.stringify({
      main: { temp: 28.4, humidity: 64 },
      weather: [{ description: "Partly cloudy" }],
    }),
  getChatHistory: async () => sampleChatHistory,
  getChatHistoryForExport: async () => sampleChatHistory,
  getIrrigationRecommendations: async () => sampleIrrigation,
  getIrrigationRecommendationsForExport: async () => sampleIrrigation,
  getLatestWeatherData: async () => sampleWeather,
  getPlantAnalyses: async () => samplePlantAnalyses,
  getPlantAnalysesForExport: async () => samplePlantAnalyses,
  transform: async (input) => ({
    status: 200n,
    body: new Uint8Array(),
    headers: [],
  }),
  updateWeatherData: async () => undefined,
};
