export const GEMINI_CONFIG = {
  apiKey: "AIzaSyCd2hSt8qYxmd6XgS8LDPjYDVbPQ62JWJ4", // Replace with your actual API key
  baseUrl: "https://generativelanguage.googleapis.com/v1beta",
  model: "gemini-2.5-pro", // Upgraded to Gemini 2.5 Pro for higher token limits
  maxOutputTokens: 1000000, // Gemini 2.5 Pro supports up to 1M output tokens
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
};

export const getGeminiConfig = () => GEMINI_CONFIG;