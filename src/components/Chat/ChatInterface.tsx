
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/Auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Send, Paperclip, Bot, ThumbsUp, ThumbsDown, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { createMessage } from "@/lib/db";
import { getGeminiResponse, isGeminiConfigured } from "@/lib/gemini";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  isAi?: boolean;
}

export const ChatInterface = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system-1",
      content: "Hello! I'm your support assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date().toISOString(),
      isAi: true
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isGeminiEnabled] = useState<boolean>(isGeminiConfigured());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Check if we should use Gemini AI
    if (isGeminiConfigured()) {
      try {
        // Get response from Gemini
        const aiResponse = await getGeminiResponse(input);
        
        // Add the AI response to messages
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            content: aiResponse,
            isUser: false,
            timestamp: new Date().toISOString(),
            isAi: true
          }
        ]);
      } catch (error) {
        console.error("Error with Gemini:", error);
        
        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            content: "Sorry, I encountered an issue processing your request. Please try again later.",
            isUser: false,
            timestamp: new Date().toISOString(),
            isAi: true
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Use the fallback system (simulated AI responses)
      // Simulate AI response with escalation detection
      setTimeout(() => {
        let aiResponse: Message;
        
        // Check for keywords that might require agent escalation
        const needsEscalation = input.toLowerCase().includes("agent") || 
                              input.toLowerCase().includes("human") || 
                              input.toLowerCase().includes("refund") ||
                              input.toLowerCase().includes("frustrated");
        
        if (needsEscalation) {
          aiResponse = {
            id: `ai-${Date.now()}`,
            content: "I understand you'd like to speak with a human agent. I'm connecting you with one of our support representatives now. They'll be with you shortly.",
            isUser: false,
            timestamp: new Date().toISOString(),
            isAi: true
          };
          
          // In a real app, we would create a ticket and escalate to an agent
          // For the demo, we'll just show a message
          setTimeout(() => {
            setMessages((prev) => [
              ...prev, 
              {
                id: `system-${Date.now()}`,
                content: "You have been connected to Agent Sarah. She will respond to you within 10 minutes.",
                isUser: false,
                timestamp: new Date().toISOString()
              }
            ]);
          }, 2000);
        } else {
          // Standard AI response
          // In a real app, this would call the Gemini API
          const responses = [
            "I'd be happy to help you with that. Could you provide a few more details?",
            "Thank you for the information. Based on what you've shared, I recommend checking our knowledge base for article #42 which addresses this specific issue.",
            "I understand your concern. This is a common question, and the solution is to reset your account preferences in the Settings menu.",
            "Let me look that up for you. According to our documentation, you'll need to clear your browser cache and cookies, then log in again.",
            "Thank you for your patience. I'm checking our database for the most up-to-date information on this topic."
          ];
          
          aiResponse = {
            id: `ai-${Date.now()}`,
            content: responses[Math.floor(Math.random() * responses.length)],
            isUser: false,
            timestamp: new Date().toISOString(),
            isAi: true
          };
        }
        
        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleOpenAiSettings = () => {
    navigate('/ai-settings');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="https://avatars.dicebear.com/api/bottts/support.svg" alt="AI Assistant" />
                <AvatarFallback><Bot size={16} /></AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Support Assistant</CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${isGeminiEnabled ? 'bg-green-100 text-green-800' : 'bg-support-100 text-support-800'}`}>
                {isGeminiEnabled ? 'Gemini AI' : 'AI-Powered'}
              </Badge>
              <Button variant="ghost" size="icon" onClick={handleOpenAiSettings} title="AI Settings">
                <Settings size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow overflow-auto pb-0">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.isUser
                      ? "bg-support-600 text-white"
                      : msg.isAi 
                        ? "bg-accent border border-border" 
                        : "bg-muted"
                  }`}
                >
                  {!msg.isUser && (
                    <div className="flex gap-2 items-center mb-1">
                      <Avatar className="h-6 w-6">
                        {msg.isAi ? (
                          <>
                            <AvatarImage src="https://avatars.dicebear.com/api/bottts/support.svg" alt="AI Assistant" />
                            <AvatarFallback><Bot size={12} /></AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src="https://avatars.dicebear.com/api/avataaars/sarah.svg" alt="Agent" />
                            <AvatarFallback>SA</AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <span className="text-xs font-medium">
                        {msg.isAi ? (isGeminiEnabled ? "Gemini AI" : "AI Assistant") : "Agent Sarah"}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  
                  {msg.isAi && (
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsUp size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsDown size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-accent border border-border rounded-lg p-4">
                  <div className="flex space-x-2 items-center">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="https://avatars.dicebear.com/api/bottts/support.svg" alt="AI Assistant" />
                      <AvatarFallback><Bot size={12} /></AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{isGeminiEnabled ? "Gemini AI" : "AI Assistant"}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-support-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-support-500 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-support-500 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        
        <Separator className="my-2" />
        
        <CardFooter className="pt-2">
          <form onSubmit={handleSendMessage} className="flex w-full gap-2">
            <Button variant="outline" size="icon" type="button">
              <Paperclip size={18} />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              disabled={isLoading}
            />
            <Button type="submit" disabled={!input.trim() || isLoading}>
              <Send size={18} className="mr-2" />
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};
