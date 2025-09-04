import { getGeminiConfig } from "../config/geminiConfig";

export interface GeminiRequest {
  prompt: string;
}

export interface GeminiResponse {
  success: boolean;
  content: string;
  error?: string;
  metadata?: {
    responseTime: number;
    finishReason?: string;
    safetyRatings?: any[];
  };
}

export const generateContent = async (request: GeminiRequest): Promise<GeminiResponse> => {
  const config = getGeminiConfig();
  
  // Enhanced validation and logging
  console.log('🚀 Starting Gemini API request');
  console.log('📊 Prompt length:', request.prompt?.length || 0);
  console.log('⚙️ Model config:', {
    model: config.model,
    maxTokens: config.maxOutputTokens,
    temperature: config.temperature
  });
  
  // Validate prompt
  if (!request.prompt || request.prompt.trim().length === 0) {
    return {
      success: false,
      content: "",
      error: "Empty or invalid prompt provided"
    };
  }
  
  // Check prompt length (rough token estimation: 1 token ≈ 4 characters)
  const estimatedTokens = Math.ceil(request.prompt.length / 4);
  const maxInputTokens = 30000; // Conservative limit for Gemini 2.0 Flash
  
  if (estimatedTokens > maxInputTokens) {
    console.warn(`⚠️ Prompt may be too long: ${estimatedTokens} estimated tokens`);
    return {
      success: false,
      content: "",
      error: `Prompt too long: ${estimatedTokens} tokens (max: ${maxInputTokens})`
    };
  }
  
  try {
    const requestBody = {
      contents: [{
        parts: [{ text: request.prompt }]
      }],
      generationConfig: {
        temperature: config.temperature,
        topP: config.topP,
        topK: config.topK,
        maxOutputTokens: config.maxOutputTokens,
        candidateCount: 1,
        stopSequences: []
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };
    
    console.log('📤 Sending request to Gemini API...');
    const startTime = Date.now();
    
    const response = await fetch(
      `${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "User-Agent": "WahoAI-TravelApp/1.0"
        },
        body: JSON.stringify(requestBody),
      }
    );
    
    const responseTime = Date.now() - startTime;
    console.log(`⏱️ API response time: ${responseTime}ms`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP ${response.status}:`, errorText);
      
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData?.error?.message || errorMessage;
      } catch {
        // Use default error message if JSON parsing fails
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('📥 Received response from Gemini API');
    
    // Enhanced response validation
    if (!data) {
      throw new Error("Empty response from Gemini API");
    }
    
    if (data.error) {
      throw new Error(`Gemini API Error: ${data.error.message || 'Unknown API error'}`);
    }
    
    if (!data.candidates || data.candidates.length === 0) {
      console.warn('⚠️ No candidates in response:', data);
      throw new Error("No content candidates returned by Gemini API");
    }
    
    const candidate = data.candidates[0];
    
    // Check for safety filtering
    if (candidate.finishReason === 'SAFETY') {
      console.warn('⚠️ Content blocked by safety filters');
      throw new Error("Content blocked by safety filters. Please try a different prompt.");
    }
    
    if (candidate.finishReason === 'RECITATION') {
      console.warn('⚠️ Content blocked due to recitation');
      throw new Error("Content blocked due to recitation concerns.");
    }
    
    const content = candidate?.content?.parts?.[0]?.text || "";
    
    if (!content || content.trim().length === 0) {
      console.warn('⚠️ Empty content in response');
      throw new Error("Empty content returned by Gemini API");
    }
    
    console.log('✅ Successfully received content:', content.length, 'characters');
    console.log('🔍 Content preview:', content.substring(0, 200));
    
    return { 
      success: true, 
      content: content.trim(),
      metadata: {
        responseTime,
        finishReason: candidate.finishReason,
        safetyRatings: candidate.safetyRatings
      }
    };
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    
    // Enhanced error categorization
    let errorMessage = "Unknown error occurred";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Categorize common errors
      if (errorMessage.includes('fetch')) {
        errorMessage = "Network error: Unable to connect to Gemini API";
      } else if (errorMessage.includes('API_KEY')) {
        errorMessage = "Invalid API key. Please check your Gemini API configuration.";
      } else if (errorMessage.includes('QUOTA')) {
        errorMessage = "API quota exceeded. Please try again later.";
      } else if (errorMessage.includes('RATE_LIMIT')) {
        errorMessage = "Rate limit exceeded. Please wait before making another request.";
      }
    }
    
    return {
      success: false,
      content: "",
      error: errorMessage,
    };
  }
};

// Helper function to validate JSON response
export const validateJSONResponse = (content: string): boolean => {
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) && parsed.length > 0;
  } catch {
    return false;
  }
};

// Helper function to estimate token count
export const estimateTokenCount = (text: string): number => {
  // More accurate token estimation for Gemini
  // Average: 1 token ≈ 3.5-4 characters for English text
  return Math.ceil(text.length / 3.5);
};
