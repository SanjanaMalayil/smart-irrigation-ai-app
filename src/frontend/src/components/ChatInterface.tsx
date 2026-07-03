import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";
import { useActor } from "../hooks/useActor";
import { useAddChatMessage, useGetChatHistory } from "../hooks/useQueries";
import { t } from "../i18n/translations";

// Sentinel thrown by useAddChatMessage when the actor is null. Matching on this
// exact string lets us surface a "still connecting" toast instead of a generic
// backend failure.
const ACTOR_NOT_INITIALIZED = "Actor not initialized";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { actor, isFetching } = useActor();
  // Gate every backend interaction on a ready actor. Per the project learning,
  // the mutation hook's `enabled` flag only controls query execution — we read
  // actor readiness here so the click handler and effects can short-circuit
  // before the mutation ever throws.
  const actorReady = !!actor && !isFetching;

  const { data: chatHistory } = useGetChatHistory();
  const addMessage = useAddChatMessage();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // Auto-fetch the full chat history on mount once the actor is ready. The
  // query is already `enabled` on the same condition, but we explicitly
  // invalidate here so a late-arriving actor (e.g. after a retry) reliably
  // refetches instead of staying stuck on the disabled empty result.
  useEffect(() => {
    if (actorReady) {
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    }
  }, [actorReady, queryClient]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom when chat history changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const hi = language === "hi";

    if (
      lowerMessage.includes("conserv") ||
      lowerMessage.includes("save water") ||
      lowerMessage.includes("water saving") ||
      lowerMessage.includes("बचाओ") ||
      lowerMessage.includes("संरक्षण")
    ) {
      return hi
        ? "जल संरक्षण के सुझाव:\n\n1. पानी की बर्बादी 30-50% कम करने के लिए ड्रिप सिंचाई का उपयोग करें\n2. मिट्टी की नमी बनाए रखने के लिए पौधों के चारों ओर मल्चिंग करें\n3. वाष्पीकरण कम करने के लिए सुबह जल्दी या शाम को पानी दें\n4. अधिक पानी देने से बचने के लिए मिट्टी नमी सेंसर लगाएं\n5. सिंचाई के लिए वर्षा जल एकत्र करें\n6. सूखा-प्रतिरोधी फसल किस्मों का उपयोग करें\n7. धान की खेती के लिए वैकल्पिक गीला और सूखा (AWD) विधि अपनाएं\n8. सिंचाई प्रणाली में रिसाव को तुरंत ठीक करें"
        : "Water Conservation Tips:\n\n1. Use drip irrigation to reduce water waste by 30-50%\n2. Mulch around plants to retain soil moisture\n3. Water during early morning or evening to minimize evaporation\n4. Install soil moisture sensors to avoid over-watering\n5. Collect rainwater for irrigation\n6. Use drought-resistant crop varieties\n7. Practice alternate wetting and drying (AWD) for rice cultivation\n8. Fix leaks in irrigation systems promptly";
    }

    if (
      lowerMessage.includes("fertiliz") ||
      lowerMessage.includes("nutrient") ||
      lowerMessage.includes("npk") ||
      lowerMessage.includes("उर्वरक") ||
      lowerMessage.includes("खाद")
    ) {
      return hi
        ? "उर्वरक उपयोग के सुझाव:\n\n1. पोषक तत्वों की आवश्यकता जानने के लिए उर्वरक डालने से पहले मिट्टी की जांच करें\n2. रिसाव कम करने के लिए नाइट्रोजन को बांटकर डालें\n3. मिट्टी का स्वास्थ्य सुधारने के लिए कम्पोस्ट जैसे जैविक उर्वरकों का उपयोग करें\n4. बेहतर अवशोषण के लिए पर्याप्त मिट्टी नमी होने पर उर्वरक डालें\n5. अधिक उर्वरक डालने से बचें, यह पौधों को नुकसान और जल प्रदूषण कर सकता है\n6. निरंतर पोषक आपूर्ति के लिए धीमी गति से घुलने वाले उर्वरकों का उपयोग करें\n7. मिट्टी परीक्षण परिणामों के आधार पर फॉस्फोरस और पोटैशियम डालें\n8. कुशल पोषक वितरण के लिए फर्टिगेशन (सिंचाई के साथ उर्वरक) पर विचार करें"
        : "Fertilizer Application Tips:\n\n1. Test soil before applying fertilizers to determine nutrient needs\n2. Apply nitrogen in split doses to reduce leaching\n3. Use organic fertilizers like compost to improve soil health\n4. Apply fertilizers when soil moisture is adequate for better absorption\n5. Avoid over-fertilization which can harm plants and pollute water\n6. Use slow-release fertilizers for sustained nutrient supply\n7. Apply phosphorus and potassium based on soil test results\n8. Consider fertigation (fertilizer through irrigation) for efficient nutrient delivery";
    }

    if (
      lowerMessage.includes("irrigation") ||
      lowerMessage.includes("water") ||
      lowerMessage.includes("सिंचाई") ||
      lowerMessage.includes("पानी")
    ) {
      return hi
        ? "इष्टतम सिंचाई के लिए, मिट्टी की नमी के स्तर और मौसम की स्थिति पर नज़र रखें। वाष्पीकरण कम करने के लिए सुबह जल्दी या शाम को पानी दें। गहरी जड़ों के विकास को बढ़ावा देने के लिए हल्की, बार-बार सिंचाई के बजाय गहरी, कम बार सिंचाई करने का लक्ष्य रखें। पारंपरिक तरीकों की तुलना में 30-50% पानी बचाने के लिए ड्रिप सिंचाई प्रणाली का उपयोग करने पर विचार करें।"
        : "For optimal irrigation, monitor soil moisture levels and weather conditions. Water early morning or evening to reduce evaporation. Aim for deep, infrequent watering rather than shallow, frequent watering to encourage deep root growth. Consider using drip irrigation systems to save 30-50% water compared to traditional methods.";
    }

    if (
      lowerMessage.includes("soil") ||
      lowerMessage.includes("moisture") ||
      lowerMessage.includes("मिट्टी") ||
      lowerMessage.includes("नमी")
    ) {
      return hi
        ? "मिट्टी की नमी पौधों के स्वास्थ्य के लिए महत्वपूर्ण है। अधिकांश फसलें 40-60% मिट्टी नमी में अच्छी तरह पनपती हैं। स्तर की निगरानी करने और सिंचाई को तदनुसार समायोजित करने के लिए सेंसर का उपयोग करें। रेतीली मिट्टी चिकनी मिट्टी की तुलना में तेजी से सूखती है और अधिक बार सिंचाई की आवश्यकता होती है। मल्चिंग नमी बनाए रखने और मिट्टी का तापमान नियंत्रित करने में मदद करती है।"
        : "Soil moisture is crucial for plant health. Most crops thrive with soil moisture between 40-60%. Use sensors to monitor levels and adjust irrigation accordingly. Sandy soils drain faster and need more frequent watering than clay soils. Mulching helps retain moisture and regulate soil temperature.";
    }

    if (
      lowerMessage.includes("crop") ||
      lowerMessage.includes("plant") ||
      lowerMessage.includes("rice") ||
      lowerMessage.includes("wheat") ||
      lowerMessage.includes("tomato") ||
      lowerMessage.includes("फसल") ||
      lowerMessage.includes("पौधा") ||
      lowerMessage.includes("चावल") ||
      lowerMessage.includes("गेहूं") ||
      lowerMessage.includes("टमाटर")
    ) {
      return hi
        ? "विभिन्न फसलों की जल आवश्यकताएं अलग-अलग होती हैं:\n\n• चावल: अधिक जल आवश्यकता (1200-1500 मिमी/मौसम), वैकल्पिक गीला/सूखा विधि अपनाएं\n• गेहूं: मध्यम आवश्यकता (450-650 मिमी/मौसम), महत्वपूर्ण चरण कल्ले निकलना और फूल आना है\n• टमाटर: मध्यम आवश्यकता (400-600 मिमी/मौसम), फल फटने से बचाने के लिए लगातार नमी बनाए रखें\n• मक्का: मध्यम-अधिक आवश्यकता (500-800 मिमी/मौसम), पुष्पगुच्छ/रेशम अवस्था के दौरान सबसे महत्वपूर्ण\n\nप्रत्येक फसल प्रकार की विस्तृत जानकारी के लिए फसल टैब देखें।"
        : "Different crops have varying water needs:\n\n• Rice: High water requirement (1200-1500 mm/season), use alternate wetting/drying\n• Wheat: Medium requirement (450-650 mm/season), critical stages are tillering and flowering\n• Tomato: Medium requirement (400-600 mm/season), maintain consistent moisture to prevent fruit cracking\n• Corn: Medium-high requirement (500-800 mm/season), most critical during tasseling/silking\n\nCheck the Crops tab for detailed information on each crop type.";
    }

    if (
      lowerMessage.includes("yield") ||
      lowerMessage.includes("optimize") ||
      lowerMessage.includes("production") ||
      lowerMessage.includes("उपज") ||
      lowerMessage.includes("उत्पादन")
    ) {
      return hi
        ? "उपज को अनुकूलित करने के लिए:\n\n1. उचित मिट्टी नमी बनाए रखें (अधिकांश फसलों के लिए 40-60%)\n2. वाष्पीकरण कम करने के लिए ठंडे घंटों में पानी दें\n3. नमी बनाए रखने और खरपतवार दबाने के लिए मल्च का उपयोग करें\n4. हमारे प्लांट हेल्थ विश्लेषक का उपयोग करके नियमित रूप से पौधों के स्वास्थ्य की निगरानी करें\n5. विकास चरणों के आधार पर सिंचाई समायोजित करें - फूल आना और फल लगना महत्वपूर्ण हैं\n6. सही समय और सही मात्रा में उर्वरक डालें\n7. जल दक्षता के लिए ड्रिप या स्प्रिंकलर सिंचाई का उपयोग करें\n8. मिट्टी का स्वास्थ्य बनाए रखने के लिए फसल चक्र अपनाएं"
        : "To optimize yield:\n\n1. Maintain proper soil moisture (40-60% for most crops)\n2. Water during cooler hours to reduce evaporation\n3. Use mulch to retain moisture and suppress weeds\n4. Monitor plant health regularly using our Plant Health analyzer\n5. Adjust irrigation based on growth stages - flowering and fruiting are critical\n6. Apply fertilizers at the right time and in correct amounts\n7. Use drip or sprinkler irrigation for water efficiency\n8. Practice crop rotation to maintain soil health";
    }

    if (
      lowerMessage.includes("temperature") ||
      lowerMessage.includes("weather") ||
      lowerMessage.includes("climate") ||
      lowerMessage.includes("तापमान") ||
      lowerMessage.includes("मौसम")
    ) {
      return hi
        ? "तापमान जल आवश्यकताओं को काफी प्रभावित करता है। गर्म दिनों में (>30°C), बढ़े हुए वाष्पोत्सर्जन के कारण पौधों को अधिक पानी की आवश्यकता होती है। ठंडे या बरसाती मौसम में सिंचाई कम करें। सिंचाई अनुसूची को सक्रिय रूप से समायोजित करने के लिए मौसम पूर्वानुमान की निगरानी करें। अधिक आर्द्रता पानी की हानि कम करती है, जबकि हवा इसे बढ़ाती है। वास्तविक समय की स्थिति ट्रैक करने के लिए हमारे मौसम पैनल का उपयोग करें।"
        : "Temperature affects water needs significantly. On hot days (>30°C), plants need more water due to increased evapotranspiration. Reduce watering during cool or rainy periods. Monitor weather forecasts to adjust irrigation schedules proactively. High humidity reduces water loss, while wind increases it. Use our Weather panel to track real-time conditions.";
    }

    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey") ||
      lowerMessage.includes("नमस्ते") ||
      lowerMessage.includes("हैलो")
    ) {
      return hi
        ? "नमस्ते! मैं आपका स्मार्ट सिंचाई AI सहायक हूं। मैं इनमें आपकी मदद कर सकता हूं:\n\n• सिंचाई अनुसूची और जल प्रबंधन\n• मिट्टी नमी निगरानी\n• फसल-विशिष्ट जल आवश्यकताएं\n• जल संरक्षण रणनीतियां\n• उर्वरक उपयोग के सुझाव\n• उपज अनुकूलन तकनीकें\n\nआप क्या जानना चाहेंगे?"
        : "Hello! I'm your Smart Irrigation AI assistant. I can help you with:\n\n• Irrigation scheduling and water management\n• Soil moisture monitoring\n• Crop-specific water requirements\n• Water conservation strategies\n• Fertilizer application tips\n• Yield optimization techniques\n\nWhat would you like to know?";
    }

    return hi
      ? "मैं सिंचाई प्रबंधन, मिट्टी नमी निगरानी, फसल जल आवश्यकताओं, जल संरक्षण सुझावों, उर्वरक मार्गदर्शन, और उपज अनुकूलन में आपकी मदद कर सकता हूं। मुझसे पूछें:\n\n• विशिष्ट फसलों के लिए सिंचाई अनुसूची\n• जल संरक्षण तकनीकें\n• उर्वरक उपयोग की सर्वोत्तम प्रथाएं\n• मिट्टी नमी प्रबंधन\n• मौसम-आधारित सिंचाई समायोजन\n\nआप क्या सीखना चाहेंगे?"
      : "I can help you with irrigation management, soil moisture monitoring, crop water needs, water conservation tips, fertilizer guidance, and yield optimization. Ask me about:\n\n• Watering schedules for specific crops\n• Water conservation techniques\n• Fertilizer application best practices\n• Soil moisture management\n• Weather-based irrigation adjustments\n\nWhat would you like to learn about?";
  };

  // Surface a specific toast for a known failure mode rather than a generic
  // "Failed to send message". Distinguishes the actor-not-initialized case
  // (still connecting) from a real backend error.
  const reportError = (error: unknown, phase: "send" | "generate") => {
    const isActorDown =
      error instanceof Error && error.message === ACTOR_NOT_INITIALIZED;
    const phaseLabel =
      phase === "send"
        ? language === "en"
          ? "send your message"
          : "संदेश भेजने"
        : language === "en"
          ? "generate a reply"
          : "उत्तर तैयार करने";

    if (isActorDown) {
      toast.error(
        language === "en"
          ? `Still connecting to the backend — could not ${phaseLabel}. Please wait a moment and try again.`
          : `बैकएंड से कनेक्ट हो रहा है — ${phaseLabel} नहीं हो सका। कृपया थोड़ी देर प्रतीक्षा करें और पुनः प्रयास करें।`,
      );
      return;
    }

    const detail = error instanceof Error ? error.message : String(error);
    toast.error(
      language === "en"
        ? `Could not ${phaseLabel} (backend error: ${detail}). Please try again.`
        : `${phaseLabel} नहीं हो सका (बैकएंड त्रुटि: ${detail})। कृपया पुनः प्रयास करें।`,
    );
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    // Hard gate: never call the mutation while the actor isn't ready. This
    // avoids the "Actor not initialized" throw path entirely for the user
    // message; the AI reply path still guards defensively below.
    if (!actorReady) {
      toast.error(
        language === "en"
          ? "Still connecting to the backend — please wait a moment and try again."
          : "बैकएंड से कनेक्ट हो रहा है — कृपया थोड़ी देर प्रतीक्षा करें और पुनः प्रयास करें।",
      );
      return;
    }

    const userMessage = message.trim();
    setMessage("");
    setIsGenerating(true);

    try {
      // 1. Persist the user's message to the backend.
      await addMessage.mutateAsync({
        sender: "user",
        message: userMessage,
      });
    } catch (error) {
      reportError(error, "send");
      setIsGenerating(false);
      return;
    }

    try {
      // 2. Generate the assistant reply locally (keyword matcher) and persist
      //    it so the chatbot actually replies in the history.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const aiResponse = generateAIResponse(userMessage);
      await addMessage.mutateAsync({
        sender: "assistant",
        message: aiResponse,
      });
    } catch (error) {
      reportError(error, "generate");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const connecting = !actorReady;
  const inputDisabled = connecting || isGenerating;
  const sendDisabled = !message.trim() || isGenerating || connecting;

  return (
    <Card className="bg-card border shadow-lg h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <img
              src="/assets/generated/chat-bot.dim_64x64.png"
              alt="AI"
              className="w-6 h-6"
            />
          </div>
          <div>
            <CardTitle className="text-foreground">
              {t("chatTitle", language)}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("chatDescription", language)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto px-6" ref={scrollRef}>
          <div className="space-y-4 py-4">
            {connecting ? (
              <div
                className="flex flex-col items-center justify-center py-8 text-muted-foreground"
                data-ocid="chat.loading_state"
              >
                <Loader2 className="w-8 h-8 mb-3 animate-spin text-primary" />
                <p className="font-semibold">
                  {language === "en"
                    ? "Connecting to the backend..."
                    : "बैकएंड से कनेक्ट हो रहा है..."}
                </p>
                <p className="text-sm mt-1">
                  {language === "en"
                    ? "Your chat history will load once the connection is ready."
                    : "कनेक्शन तैयार होने पर आपका चैट इतिहास लोड होगा।"}
                </p>
              </div>
            ) : !chatHistory || chatHistory.length === 0 ? (
              <div
                className="text-center py-8 text-muted-foreground"
                data-ocid="chat.empty_state"
              >
                <Bot className="w-12 h-12 mx-auto mb-3 text-primary" />
                <p className="font-semibold mb-2">
                  {t("welcomeTitle", language)}
                </p>
                <p className="text-sm mb-4">{t("welcomeMessage", language)}</p>
                <div className="text-xs space-y-1 text-left max-w-md mx-auto bg-muted p-4 rounded-lg">
                  <p className="font-semibold mb-2">
                    {t("tryAsking", language)}:
                  </p>
                  {language === "hi" ? (
                    <>
                      <p>• "मैं अपनी सिंचाई प्रणाली में पानी कैसे बचा सकता हूं?"</p>
                      <p>• "सबसे अच्छी उर्वरक प्रथाएं क्या हैं?"</p>
                      <p>• "चावल को कितने पानी की आवश्यकता होती है?"</p>
                      <p>• "फसल की उपज कैसे बढ़ाएं?"</p>
                    </>
                  ) : (
                    <>
                      <p>• "How can I save water in my irrigation system?"</p>
                      <p>• "What are the best fertilizer practices?"</p>
                      <p>• "How much water does rice need?"</p>
                      <p>• "How to optimize crop yield?"</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <div
                  key={`${msg.timestamp}-${msg.sender}-${index}`}
                  className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  data-ocid={`chat.item.${index + 1}`}
                >
                  {msg.sender === "assistant" && (
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      msg.sender === "user"
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isGenerating && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                connecting
                  ? language === "en"
                    ? "Connecting to the backend..."
                    : "बैकएंड से कनेक्ट हो रहा है..."
                  : t("placeholderAsk", language)
              }
              disabled={inputDisabled}
              className="flex-1"
              data-ocid="chat.input"
            />
            <Button
              onClick={handleSendMessage}
              disabled={sendDisabled}
              data-ocid="chat.send_button"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : connecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
