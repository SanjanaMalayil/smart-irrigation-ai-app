import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import MixinViews "mo:caffeineai-data-viewer/MixinViews";

actor {
  include MixinViews();

  type ChatMessage = {
    sender : Text;
    message : Text;
    timestamp : Int;
  };

  type PlantHealthAnalysis = {
    image : Blob;
    greenRatio : Float;
    healthStatus : Text;
    timestamp : Int;
  };

  type WeatherData = {
    temperature : Float;
    humidity : Float;
    conditions : Text;
    timestamp : Int;
  };

  type IrrigationRecommendation = {
    soilMoisture : Float;
    temperature : Float;
    recommendation : Text;
    reason : Text;
    timestamp : Int;
  };

  module ChatMessage {
    public func compare(a : ChatMessage, b : ChatMessage) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  let chatHistory = Map.empty<Int, ChatMessage>();
  let plantAnalyses = Map.empty<Int, PlantHealthAnalysis>();
  let weatherDataStore = Map.empty<Int, WeatherData>();
  let irrigationRecommendations = Map.empty<Int, IrrigationRecommendation>();

  public shared ({ caller }) func addChatMessage(sender : Text, message : Text) : async () {
    let timestamp = Time.now();
    let chatMessage : ChatMessage = {
      sender;
      message;
      timestamp;
    };
    chatHistory.add(timestamp, chatMessage);
  };

  public query ({ caller }) func getChatHistory() : async [ChatMessage] {
    chatHistory.values().toArray().sort();
  };

  public shared ({ caller }) func analyzePlantHealth(image : Blob, greenRatio : Float) : async () {
    let healthStatus = if (greenRatio > 0.7) {
      "Healthy";
    } else if (greenRatio > 0.5) {
      "Moderate";
    } else {
      "Unhealthy";
    };

    let analysis : PlantHealthAnalysis = {
      image;
      greenRatio;
      healthStatus;
      timestamp = Time.now();
    };

    plantAnalyses.add(Time.now(), analysis);
  };

  public query ({ caller }) func getPlantAnalyses() : async [PlantHealthAnalysis] {
    plantAnalyses.values().toArray();
  };

  public shared ({ caller }) func updateWeatherData(temperature : Float, humidity : Float, conditions : Text) : async () {
    let weather : WeatherData = {
      temperature;
      humidity;
      conditions;
      timestamp = Time.now();
    };

    weatherDataStore.add(Time.now(), weather);
  };

  public query ({ caller }) func getLatestWeatherData() : async ?WeatherData {
    let entries = weatherDataStore.toArray();
    if (entries.size() == 0) {
      return null;
    };

    var maxEntry : ?(Int, WeatherData) = null;
    for (entry in entries.values()) {
      switch (maxEntry) {
        case (null) {
          maxEntry := ?entry;
        };
        case (?current) {
          if (entry.0 > current.0) {
            maxEntry := ?entry;
          };
        };
      };
    };

    switch (maxEntry) {
      case (null) { null };
      case (?(_, data)) { ?data };
    };
  };

  public shared ({ caller }) func addIrrigationRecommendation(soilMoisture : Float, temperature : Float, recommendation : Text, reason : Text) : async () {
    let rec : IrrigationRecommendation = {
      soilMoisture;
      temperature;
      recommendation;
      reason;
      timestamp = Time.now();
    };

    irrigationRecommendations.add(Time.now(), rec);
  };

  public query ({ caller }) func getIrrigationRecommendations() : async [IrrigationRecommendation] {
    irrigationRecommendations.values().toArray();
  };

  public query ({ caller }) func getPlantAnalysesForExport() : async [PlantHealthAnalysis] {
    plantAnalyses.values().toArray();
  };

  public query ({ caller }) func getIrrigationRecommendationsForExport() : async [IrrigationRecommendation] {
    irrigationRecommendations.values().toArray();
  };

  public query ({ caller }) func getChatHistoryForExport() : async [ChatMessage] {
    chatHistory.values().toArray().sort();
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func fetchWeatherData(apiUrl : Text) : async Text {
    await OutCall.httpGetRequest(apiUrl, [], transform);
  };
};
