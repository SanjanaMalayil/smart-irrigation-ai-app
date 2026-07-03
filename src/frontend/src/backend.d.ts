import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<HttpHeader>;
}
export interface HttpRequestResult {
    status: bigint;
    body: Uint8Array;
    headers: Array<HttpHeader>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: HttpRequestResult;
}
export interface IrrigationRecommendation {
    soilMoisture: number;
    temperature: number;
    timestamp: bigint;
    recommendation: string;
    reason: string;
}
export interface WeatherData {
    temperature: number;
    humidity: number;
    timestamp: bigint;
    conditions: string;
}
export interface ChatMessage {
    sender: string;
    message: string;
    timestamp: bigint;
}
export interface HttpHeader {
    value: string;
    name: string;
}
export interface PlantHealthAnalysis {
    healthStatus: string;
    timestamp: bigint;
    greenRatio: number;
    image: Uint8Array;
}
export interface backendInterface {
    addChatMessage(sender: string, message: string): Promise<void>;
    addIrrigationRecommendation(soilMoisture: number, temperature: number, recommendation: string, reason: string): Promise<void>;
    analyzePlantHealth(image: Uint8Array, greenRatio: number): Promise<void>;
    fetchWeatherData(apiUrl: string): Promise<string>;
    getChatHistory(): Promise<Array<ChatMessage>>;
    getChatHistoryForExport(): Promise<Array<ChatMessage>>;
    getIrrigationRecommendations(): Promise<Array<IrrigationRecommendation>>;
    getIrrigationRecommendationsForExport(): Promise<Array<IrrigationRecommendation>>;
    getLatestWeatherData(): Promise<WeatherData | null>;
    getPlantAnalyses(): Promise<Array<PlantHealthAnalysis>>;
    getPlantAnalysesForExport(): Promise<Array<PlantHealthAnalysis>>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateWeatherData(temperature: number, humidity: number, conditions: string): Promise<void>;
}
