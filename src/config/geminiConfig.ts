export const GEMINI_CONFIG = {
  apiKey: "AIzaSyCTah0Ob9ssJ5GSMqu5stz1r8M2GAhWBKg", // Replace with your actual API key
  baseUrl: "https://generativelanguage.googleapis.com/v1beta",
  model: "gemini-2.0-flash",
  maxOutputTokens: 8192, // Official Gemini 2.0 Flash limit
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
};

export const getGeminiConfig = () => GEMINI_CONFIG;