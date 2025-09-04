import { getGeminiConfig } from "../config/geminiConfig";

export interface GeminiRequest {
  prompt: string;
}

export interface GeminiResponse {
  success: boolean;
  content: string;
  error?: string;
}

export const generateContent = async (request: GeminiRequest): Promise<GeminiResponse> => {
  const config = getGeminiConfig();
  
  try {
    const response = await fetch(
      `${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: request.prompt }]
          }],
          generationConfig: {
            temperature: config.temperature,
            topP: config.topP,
            topK: config.topK,
            maxOutputTokens: config.maxOutputTokens,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return { success: true, content };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      content: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
