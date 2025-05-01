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

// Chat history storage for conversation context
interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

// Store conversation history by conversation ID
const chatHistories: Record<string, ChatMessage[]> = {};

// Get response from Gemini AI with conversation history
export async function getGeminiResponse(prompt: string, conversationId: string = 'default'): Promise<string> {
  if (!apiKey || !genAI) {
    return "AI is not configured. Please add your Gemini API key in the AI Settings.";
  }

  try {
    // Initialize chat history for this conversation if it doesn't exist
    if (!chatHistories[conversationId]) {
      chatHistories[conversationId] = [];
    }
    
    // Add user message to history
    chatHistories[conversationId].push({ 
      role: "user", 
      parts: [{ text: prompt }]
    });
    
    // For chat functionality, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings });
    
    // Create a chat session
    const chat = model.startChat({
      history: chatHistories[conversationId].slice(0, -1), // All previous messages
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    });
    
    // Generate content based on the latest prompt
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Add model response to history
    chatHistories[conversationId].push({ 
      role: "model", 
      parts: [{ text: text }]
    });
    
    // Limit history size to prevent token limits (keep last 10 messages)
    if (chatHistories[conversationId].length > 20) {
      chatHistories[conversationId] = chatHistories[conversationId].slice(-20);
    }
    
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
    
    // Reset chat histories when API key changes
    Object.keys(chatHistories).forEach(id => {
      chatHistories[id] = [];
    });
    
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

// Clear conversation history
export function clearConversation(conversationId: string = 'default'): void {
  if (chatHistories[conversationId]) {
    chatHistories[conversationId] = [];
  }
}

// Get conversation history
export function getConversationHistory(conversationId: string = 'default'): ChatMessage[] {
  return chatHistories[conversationId] || [];
}
