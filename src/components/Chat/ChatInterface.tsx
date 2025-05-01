
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/Auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Send, Paperclip, Bot, ThumbsUp, ThumbsDown, Settings, RefreshCw, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  getGeminiResponse, 
  isGeminiConfigured, 
  clearConversation, 
  getConversationHistory 
} from "@/lib/gemini";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";

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
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system-1",
      content: "Hello! I'm your AI assistant powered by Gemini. How can I help you today?",
      isUser: false,
      timestamp: new Date().toISOString(),
      isAi: true
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState<string>(`chat-${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isGeminiEnabled] = useState<boolean>(isGeminiConfigured());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if Gemini is configured and prompt user if not
  useEffect(() => {
    if (!isGeminiConfigured()) {
      toast({
        title: "AI Not Configured",
        description: "Please set up your Gemini API key to enhance the chat experience.",
        action: (
          <Button variant="outline" size="sm" onClick={() => navigate('/ai-settings')}>
            Configure
          </Button>
        ),
      });
    }
  }, []);

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
        // Get response from Gemini with conversation context
        const aiResponse = await getGeminiResponse(input, conversationId);
        
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
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            content: "It looks like the AI isn't fully configured yet. Please set up your Gemini API key in the AI Settings to enable intelligent responses.",
            isUser: false,
            timestamp: new Date().toISOString(),
            isAi: true
          }
        ]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleOpenAiSettings = () => {
    navigate('/ai-settings');
  };
  
  const handleNewConversation = () => {
    clearConversation(conversationId);
    setMessages([
      {
        id: "system-1",
        content: "Hello! I'm your AI assistant powered by Gemini. How can I help you today?",
        isUser: false,
        timestamp: new Date().toISOString(),
        isAi: true
      }
    ]);
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
                <CardTitle className="text-lg">AI Assistant</CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleNewConversation} title="New Conversation">
                <Trash size={16} />
              </Button>
              <Badge variant="outline" className={`${isGeminiEnabled ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                {isGeminiEnabled ? 'Gemini AI' : 'Not Configured'}
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
                  
                  <div className="text-sm whitespace-pre-wrap break-words prose prose-sm dark:prose-invert max-w-none">
                    {msg.isAi ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                  
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
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message or ask a question..."
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
