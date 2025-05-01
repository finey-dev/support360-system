
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the Gemini API with the API key
let apiKey: string | null = localStorage.getItem('gemini_api_key');
let genAI: GoogleGenerativeAI | null = null;

// Initialize the Gemini client if the API key is available
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

// Configure the safety settings for the model
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Get response from Gemini AI
export async function getGeminiResponse(prompt: string): Promise<string> {
  if (!apiKey || !genAI) {
    return "AI is not configured. Please add your Gemini API key in the AI Settings.";
  }

  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}

// Set a new API key
export function setGeminiApiKey(key: string): void {
  if (!key) return;
  
  try {
    // Test the API key by creating a client
    const testClient = new GoogleGenerativeAI(key);
    
    // If no error is thrown, save the key
    localStorage.setItem('gemini_api_key', key);
    apiKey = key;
    genAI = testClient;
    
    console.log("Gemini API key has been saved");
  } catch (error) {
    console.error("Invalid Gemini API key:", error);
    throw new Error("Invalid API key format");
  }
}

// Check if API key is configured
export function isGeminiConfigured(): boolean {
  return !!apiKey && !!genAI;
}

// Get the API key
export function getGeminiApiKey(): string | null {
  return apiKey;
}
