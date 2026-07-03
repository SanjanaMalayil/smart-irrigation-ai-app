export type Language = "en" | "hi";

export type TranslationKey =
  // Header
  | "appTitle"
  | "appSubtitle"
  | "dashboard"
  | "about"
  | "export"
  | "languageToggle"
  // Footer
  | "builtWith"
  | "using"
  // Dashboard tabs
  | "overview"
  | "irrigation"
  | "crops"
  | "plantHealth"
  | "aiAssistant"
  // Hero
  | "heroTitle"
  | "heroSubtitle"
  | "weather"
  // Plant Health
  | "plantHealthAnalyzer"
  | "uploadLeafImage"
  | "clickToUpload"
  | "dragAndDropHint"
  | "dragActive"
  | "pngJpgUpTo10MB"
  | "analyzePlantHealth"
  | "analyzing"
  | "howItWorks"
  | "howItWorksDesc"
  | "analysisHistory"
  | "previousAssessments"
  | "noAnalysesYet"
  | "uploadToGetStarted"
  | "greenRatio"
  | "healthy"
  | "moderate"
  | "unhealthy"
  | "irrigationVerdict"
  | "irrigationNeeded"
  | "noIrrigationNeeded"
  | "greenRatioLowWarning"
  // Weather
  | "weatherTitle"
  | "realTimeConditions"
  | "temperature"
  | "humidity"
  | "conditions"
  | "fetchWeather"
  | "noWeatherData"
  // Soil Moisture
  | "soilMoisture"
  | "currentSensorReading"
  | "dry"
  | "optimal"
  | "saturated"
  | "soilDryAdvice"
  | "soilGoodAdvice"
  | "soilHydratedAdvice"
  | "low"
  | "high"
  // Irrigation Status
  | "irrigationStatus"
  | "aiPoweredRecommendations"
  | "noRecommendations"
  | "generateRecommendation"
  | "analysis"
  | "recommendationUpdated"
  | "failedToGenerate"
  | "weatherDataNotAvailable"
  // Crop Water Requirements
  | "cropWaterRequirements"
  | "irrigationSchedules"
  | "waterRequirement"
  | "dailyWater"
  | "irrigationFrequency"
  | "optimalTemperature"
  | "growthStages"
  | "growthStagesWaterNeeds"
  | "waterManagementTips"
  | "stage"
  | "waterNeeds"
  | "tips"
  // Chat
  | "chatTitle"
  | "chatDescription"
  | "welcomeTitle"
  | "welcomeMessage"
  | "tryAsking"
  | "placeholderAsk"
  | "send"
  // About
  | "aboutTitle"
  | "aboutSubtitle"
  | "ourAim"
  | "ourAimDesc"
  | "aboutApp"
  | "aboutAppDesc"
  | "plantHealthAnalysis"
  | "plantHealthAnalysisDesc"
  | "realTimeWeather"
  | "realTimeWeatherDesc"
  | "soilMoistureInsights"
  | "soilMoistureInsightsDesc"
  | "aiDrivenRecommendations"
  | "aiDrivenRecommendationsDesc"
  | "aboutAppClosing"
  | "ourImpact"
  | "waterConservation"
  | "waterConservationDesc"
  | "dataInformedDecisions"
  | "dataInformedDecisionsDesc"
  | "supportingFarmers"
  | "supportingFarmersDesc"
  | "projectContributors"
  | "contributorsDesc"
  // Export
  | "exportReport"
  | "exportSubtitle"
  | "dateRange"
  | "from"
  | "to"
  | "plantAnalysesSection"
  | "irrigationRecommendationsSection"
  | "chatHistorySection"
  | "printReport"
  | "noDataInRange"
  | "totalRecords"
  | "generatedOn"
  | "recommendation"
  | "reason"
  | "sender"
  | "message"
  | "date"
  | "status"
  | "soilMoistureLabel"
  | "temperatureLabel";

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    appTitle: "Smart Irrigation AI",
    appSubtitle: "Intelligent Water Management",
    dashboard: "Dashboard",
    about: "About",
    export: "Export",
    languageToggle: "Language",
    builtWith: "Built with",
    using: "using",
    overview: "Overview",
    irrigation: "Irrigation",
    crops: "Crops",
    plantHealth: "Plant Health",
    aiAssistant: "AI Assistant",
    heroTitle: "Smart Irrigation AI",
    heroSubtitle:
      "Optimize your irrigation with AI-powered insights, real-time monitoring, and crop-specific guidance",
    weather: "Weather",
    plantHealthAnalyzer: "Plant Health Analyzer",
    uploadLeafImage: "Upload leaf images for health analysis",
    clickToUpload: "Click to upload leaf image",
    dragAndDropHint: "or drag and drop a leaf image here",
    dragActive: "Drop the leaf image here",
    pngJpgUpTo10MB: "PNG, JPG up to 10MB",
    analyzePlantHealth: "Analyze Plant Health",
    analyzing: "Analyzing...",
    howItWorks: "How it works",
    howItWorksDesc:
      "The AI analyzes the green color ratio in your leaf image to determine plant health. Higher green ratios indicate healthier plants.",
    analysisHistory: "Analysis History",
    previousAssessments: "Previous plant health assessments",
    noAnalysesYet: "No analyses yet",
    uploadToGetStarted: "Upload a leaf image to get started",
    greenRatio: "Green Ratio",
    healthy: "Healthy",
    moderate: "Moderate",
    unhealthy: "Unhealthy",
    irrigationVerdict: "Irrigation Verdict",
    irrigationNeeded: "Irrigation Needed",
    noIrrigationNeeded: "No Irrigation Needed",
    greenRatioLowWarning:
      "Green ratio is below 40%. Plant may need irrigation attention.",
    weatherTitle: "Weather",
    realTimeConditions: "Real-time conditions",
    temperature: "Temperature",
    humidity: "Humidity",
    conditions: "Conditions",
    fetchWeather: "Fetch Weather",
    noWeatherData: "No weather data available",
    soilMoisture: "Soil Moisture",
    currentSensorReading: "Current sensor reading",
    dry: "Dry (0%)",
    optimal: "Optimal (50%)",
    saturated: "Saturated (100%)",
    soilDryAdvice: "Soil is dry. Consider irrigation.",
    soilGoodAdvice: "Soil moisture is at a good level.",
    soilHydratedAdvice: "Soil is well hydrated. No irrigation needed.",
    low: "Low",
    high: "High",
    irrigationStatus: "Irrigation Status",
    aiPoweredRecommendations: "AI-powered recommendations",
    noRecommendations: "No recommendations available",
    generateRecommendation: "Generate Recommendation",
    analysis: "Analysis",
    recommendationUpdated: "Recommendation updated",
    failedToGenerate: "Failed to generate recommendation",
    weatherDataNotAvailable: "Weather data not available",
    cropWaterRequirements: "Crop Water Requirements",
    irrigationSchedules:
      "Irrigation schedules and water management for different crops",
    waterRequirement: "Water Requirement",
    dailyWater: "Daily",
    irrigationFrequency: "Irrigation Frequency",
    optimalTemperature: "Optimal Temperature",
    growthStages: "Growth Stages",
    growthStagesWaterNeeds: "Growth Stages & Water Needs",
    waterManagementTips: "Water Management Tips",
    stage: "Stage",
    waterNeeds: "Water needs",
    tips: "Tips",
    chatTitle: "AI Assistant",
    chatDescription:
      "Ask about irrigation, crops, water conservation, and fertilizer tips",
    welcomeTitle: "Welcome to Smart Irrigation AI!",
    welcomeMessage:
      "Ask me anything about irrigation, soil moisture, crop water needs, water conservation, fertilizer tips, or yield optimization.",
    tryAsking: "Try asking",
    placeholderAsk:
      "Ask about irrigation, crops, water conservation, fertilizers...",
    send: "Send",
    aboutTitle: "About Smart Irrigation AI",
    aboutSubtitle:
      "Empowering sustainable agriculture through intelligent water management",
    ourAim: "Our Aim",
    ourAimDesc:
      "To promote sustainable agriculture through AI-based optimization of irrigation and water usage, improving crop yield while conserving precious water resources. We believe that smart technology can help farmers make better decisions, reduce waste, and contribute to a more sustainable future for agriculture worldwide.",
    aboutApp: "About the App",
    aboutAppDesc:
      "Smart Irrigation AI is a comprehensive web-based platform that integrates multiple advanced technologies to provide farmers and agricultural professionals with actionable insights for optimal water management.",
    plantHealthAnalysis: "Plant Health Analysis",
    plantHealthAnalysisDesc:
      "Upload leaf images for instant health assessment using advanced color analysis technology",
    realTimeWeather: "Real-Time Weather Updates",
    realTimeWeatherDesc:
      "Automatic location detection with live weather data to inform irrigation decisions",
    soilMoistureInsights: "Soil Moisture Insights",
    soilMoistureInsightsDesc:
      "Monitor soil moisture levels with visual indicators and actionable recommendations",
    aiDrivenRecommendations: "AI-Driven Recommendations",
    aiDrivenRecommendationsDesc:
      "Intelligent irrigation guidance based on multiple environmental factors and crop types",
    aboutAppClosing:
      "Our AI chat assistant provides personalized crop advice, water conservation guidance, and fertilizer recommendations tailored to your specific needs. The app combines all these features into an intuitive interface that makes precision agriculture accessible to everyone.",
    ourImpact: "Our Impact",
    waterConservation: "Water Conservation",
    waterConservationDesc:
      "By providing precise irrigation recommendations, we help farmers reduce water waste significantly while maintaining or improving crop yields. Every drop counts in building a sustainable future.",
    dataInformedDecisions: "Data-Informed Decision Making",
    dataInformedDecisionsDesc:
      "Our platform empowers farmers with real-time data and AI-powered insights, enabling them to make informed decisions based on actual conditions rather than guesswork or traditional schedules.",
    supportingFarmers: "Supporting Farmers and Research",
    supportingFarmersDesc:
      "Smart Irrigation AI serves both individual farmers and agricultural research institutions, providing tools that advance sustainable farming practices and contribute to the global effort to feed a growing population responsibly.",
    projectContributors: "Project Contributors",
    contributorsDesc:
      "This project was brought to life by a dedicated team of innovators committed to sustainable agriculture:",
    exportReport: "Export & Report",
    exportSubtitle:
      "Generate and print reports for plant analyses, irrigation recommendations, and chat history",
    dateRange: "Date Range",
    from: "From",
    to: "To",
    plantAnalysesSection: "Plant Analyses",
    irrigationRecommendationsSection: "Irrigation Recommendations",
    chatHistorySection: "Chat History Summary",
    printReport: "Print Report",
    noDataInRange: "No data available for the selected date range",
    totalRecords: "Total Records",
    generatedOn: "Generated on",
    recommendation: "Recommendation",
    reason: "Reason",
    sender: "Sender",
    message: "Message",
    date: "Date",
    status: "Status",
    soilMoistureLabel: "Soil Moisture",
    temperatureLabel: "Temperature",
  },
  hi: {
    appTitle: "स्मार्ट सिंचाई AI",
    appSubtitle: "बुद्धिमान जल प्रबंधन",
    dashboard: "डैशबोर्ड",
    about: "परिचय",
    export: "निर्यात",
    languageToggle: "भाषा",
    builtWith: "के साथ बनाया गया",
    using: "का उपयोग करके",
    overview: "अवलोकन",
    irrigation: "सिंचाई",
    crops: "फसलें",
    plantHealth: "पौधे का स्वास्थ्य",
    aiAssistant: "AI सहायक",
    heroTitle: "स्मार्ट सिंचाई AI",
    heroSubtitle:
      "AI-संचालित अंतर्दृष्टि, वास्तविक समय निगरानी, और फसल-विशिष्ट मार्गदर्शन के साथ अपनी सिंचाई को अनुकूलित करें",
    weather: "मौसम",
    plantHealthAnalyzer: "पौधे स्वास्थ्य विश्लेषक",
    uploadLeafImage: "स्वास्थ्य विश्लेषण के लिए पत्ती की छवि अपलोड करें",
    clickToUpload: "पत्ती की छवि अपलोड करने के लिए क्लिक करें",
    dragAndDropHint: "या यहाँ पत्ती की छवि खींचें और छोड़ें",
    dragActive: "पत्ती की छवि यहाँ छोड़ें",
    pngJpgUpTo10MB: "PNG, JPG 10MB तक",
    analyzePlantHealth: "पौधे का स्वास्थ्य विश्लेषण करें",
    analyzing: "विश्लेषण कर रहा है...",
    howItWorks: "यह कैसे काम करता है",
    howItWorksDesc:
      "AI आपकी पत्ती की छवि में हरे रंग के अनुपात का विश्लेषण करके पौधे के स्वास्थ्य का निर्धारण करता है। उच्च हरे अनुपात स्वस्थ पौधों का संकेत देते हैं।",
    analysisHistory: "विश्लेषण इतिहास",
    previousAssessments: "पिछले पौधे स्वास्थ्य आकलन",
    noAnalysesYet: "अभी तक कोई विश्लेषण नहीं",
    uploadToGetStarted: "शुरू करने के लिए एक पत्ती की छवि अपलोड करें",
    greenRatio: "हरा अनुपात",
    healthy: "स्वस्थ",
    moderate: "मध्यम",
    unhealthy: "अस्वस्थ",
    irrigationVerdict: "सिंचाई निर्णय",
    irrigationNeeded: "सिंचाई की आवश्यकता है",
    noIrrigationNeeded: "सिंचाई की आवश्यकता नहीं",
    greenRatioLowWarning:
      "हरा अनुपात 40% से कम है। पौधे को सिंचाई की आवश्यकता हो सकती है।",
    weatherTitle: "मौसम",
    realTimeConditions: "वास्तविक समय की स्थिति",
    temperature: "तापमान",
    humidity: "आर्द्रता",
    conditions: "स्थिति",
    fetchWeather: "मौसम डेटा प्राप्त करें",
    noWeatherData: "कोई मौसम डेटा उपलब्ध नहीं",
    soilMoisture: "मिट्टी की नमी",
    currentSensorReading: "वर्तमान सेंसर रीडिंग",
    dry: "शुष्क (0%)",
    optimal: "इष्टतम (50%)",
    saturated: "संतृप्त (100%)",
    soilDryAdvice: "मिट्टी सूखी है। सिंचाई पर विचार करें।",
    soilGoodAdvice: "मिट्टी की नमी अच्छे स्तर पर है।",
    soilHydratedAdvice: "मिट्टी अच्छी तरह से हाइड्रेटेड है। सिंचाई की आवश्यकता नहीं।",
    low: "कम",
    high: "उच्च",
    irrigationStatus: "सिंचाई स्थिति",
    aiPoweredRecommendations: "AI-संचालित सिफारिशें",
    noRecommendations: "कोई सिफारिश उपलब्ध नहीं",
    generateRecommendation: "सिफारिश उत्पन्न करें",
    analysis: "विश्लेषण",
    recommendationUpdated: "सिफारिश अपडेट की गई",
    failedToGenerate: "सिफारिश उत्पन्न करने में विफल",
    weatherDataNotAvailable: "मौसम डेटा उपलब्ध नहीं",
    cropWaterRequirements: "फसल जल आवश्यकताएं",
    irrigationSchedules: "विभिन्न फसलों के लिए सिंचाई अनुसूची और जल प्रबंधन",
    waterRequirement: "जल आवश्यकता",
    dailyWater: "दैनिक",
    irrigationFrequency: "सिंचाई आवृत्ति",
    optimalTemperature: "इष्टतम तापमान",
    growthStages: "विकास चरण",
    growthStagesWaterNeeds: "विकास चरण और जल आवश्यकताएं",
    waterManagementTips: "जल प्रबंधन सुझाव",
    stage: "चरण",
    waterNeeds: "जल आवश्यकताएं",
    tips: "सुझाव",
    chatTitle: "AI सहायक",
    chatDescription: "सिंचाई, फसलें, जल संरक्षण, और उर्वरक सुझावों के बारे में पूछें",
    welcomeTitle: "स्मार्ट सिंचाई AI में आपका स्वागत है!",
    welcomeMessage:
      "सिंचाई, मिट्टी की नमी, फसल जल आवश्यकताओं, जल संरक्षण, उर्वरक सुझाव, या उपज अनुकूलन के बारे में कुछ भी पूछें।",
    tryAsking: "पूछने का प्रयास करें",
    placeholderAsk: "सिंचाई, फसलें, जल संरक्षण, उर्वरकों के बारे में पूछें...",
    send: "भेजें",
    aboutTitle: "स्मार्ट सिंचाई AI के बारे में",
    aboutSubtitle: "बुद्धिमान जल प्रबंधन के माध्यम से टिकाऊ कृषि को सशक्त बनाना",
    ourAim: "हमारा लक्ष्य",
    ourAimDesc:
      "सिंचाई और जल उपयोग के AI-आधारित अनुकूलन के माध्यम से टिकाऊ कृषि को बढ़ावा देना, कीमती जल संसाधनों का संरक्षण करते हुए फसल उपज में सुधार करना। हमारा मानना है कि स्मार्ट तकनीक किसानों को बेहतर निर्णय लेने, अपशिष्ट कम करने, और दुनिया भर में कृषि के लिए एक अधिक टिकाऊ भविष्य में योगदान करने में मदद कर सकती है।",
    aboutApp: "ऐप के बारे में",
    aboutAppDesc:
      "स्मार्ट सिंचाई AI एक व्यापक वेब-आधारित प्लेटफॉर्म है जो किसानों और कृषि पेशेवरों को इष्टतम जल प्रबंधन के लिए कार्रवाई योग्य अंतर्दृष्टि प्रदान करने के लिए कई उन्नत तकनीकों को एकीकृत करता है।",
    plantHealthAnalysis: "पौधे स्वास्थ्य विश्लेषण",
    plantHealthAnalysisDesc:
      "उन्नत रंग विश्लेषण तकनीक का उपयोग करके त्वरित स्वास्थ्य आकलन के लिए पत्ती की छवियां अपलोड करें",
    realTimeWeather: "वास्तविक समय मौसम अपडेट",
    realTimeWeatherDesc:
      "सिंचाई निर्णयों को सूचित करने के लिए लाइव मौसम डेटा के साथ स्वचालित स्थान पहचान",
    soilMoistureInsights: "मिट्टी नमी अंतर्दृष्टि",
    soilMoistureInsightsDesc:
      "दृश्य संकेतकों और कार्रवाई योग्य सिफारिशों के साथ मिट्टी की नमी स्तर की निगरानी करें",
    aiDrivenRecommendations: "AI-संचालित सिफारिशें",
    aiDrivenRecommendationsDesc:
      "कई पर्यावरणीय कारकों और फसल प्रकारों के आधार पर बुद्धिमान सिंचाई मार्गदर्शन",
    aboutAppClosing:
      "हमारा AI चैट सहायक आपकी विशिष्ट आवश्यकताओं के अनुरूप व्यक्तिगत फसल सलाह, जल संरक्षण मार्गदर्शन, और उर्वरक सिफारिशें प्रदान करता है। ऐप इन सभी सुविधाओं को एक सहज इंटरफेस में जोड़ता है जो सटीक कृषि को सभी के लिए सुलभ बनाता है।",
    ourImpact: "हमारा प्रभाव",
    waterConservation: "जल संरक्षण",
    waterConservationDesc:
      "सटीक सिंचाई सिफारिशें प्रदान करके, हम किसानों को फसल उपज बनाए रखते या सुधारते हुए जल अपशिष्ट को काफी कम करने में मदद करते हैं। एक टिकाऊ भविष्य बनाने में हर बूंद मायने रखती है।",
    dataInformedDecisions: "डेटा-सूचित निर्णय लेना",
    dataInformedDecisionsDesc:
      "हमारा प्लेटफॉर्म किसानों को वास्तविक समय डेटा और AI-संचालित अंतर्दृष्टि के साथ सशक्त बनाता है, जिससे वे अनुमान या पारंपरिक अनुसूचियों के बजाय वास्तविक स्थितियों के आधार पर सूचित निर्णय ले सकें।",
    supportingFarmers: "किसानों और अनुसंधान का समर्थन",
    supportingFarmersDesc:
      "स्मार्ट सिंचाई AI व्यक्तिगत किसानों और कृषि अनुसंधान संस्थानों दोनों की सेवा करता है, टिकाऊ खेती प्रथाओं को आगे बढ़ाने और एक बढ़ती आबादी को जिम्मेदारी से खिलाने के वैश्विक प्रयास में योगदान करने वाले उपकरण प्रदान करता है।",
    projectContributors: "परियोजना योगदानकर्ता",
    contributorsDesc:
      "यह परियोजना टिकाऊ कृषि के प्रति प्रतिबद्ध नवप्रवर्तकों की एक समर्पित टीम द्वारा जीवंत बनाई गई:",
    exportReport: "निर्यात और रिपोर्ट",
    exportSubtitle:
      "पौधे विश्लेषण, सिंचाई सिफारिशों, और चैट इतिहास के लिए रिपोर्ट उत्पन्न और प्रिंट करें",
    dateRange: "तिथि सीमा",
    from: "से",
    to: "तक",
    plantAnalysesSection: "पौधे विश्लेषण",
    irrigationRecommendationsSection: "सिंचाई सिफारिशें",
    chatHistorySection: "चैट इतिहास सारांश",
    printReport: "रिपोर्ट प्रिंट करें",
    noDataInRange: "चयनित तिथि सीमा के लिए कोई डेटा उपलब्ध नहीं",
    totalRecords: "कुल रिकॉर्ड",
    generatedOn: "पर उत्पन्न",
    recommendation: "सिफारिश",
    reason: "कारण",
    sender: "प्रेषक",
    message: "संदेश",
    date: "तिथि",
    status: "स्थिति",
    soilMoistureLabel: "मिट्टी की नमी",
    temperatureLabel: "तापमान",
  },
};

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key] || key;
}
