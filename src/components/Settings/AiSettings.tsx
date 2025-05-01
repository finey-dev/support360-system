
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";
import { setGeminiApiKey, getGeminiApiKey, isGeminiConfigured } from "@/lib/gemini";
import { useNavigate } from "react-router-dom";

export const AiSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState<string>(getGeminiApiKey() || '');
  const [aiEnabled, setAiEnabled] = useState<boolean>(isGeminiConfigured());
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  
  useEffect(() => {
    // If no API key is set and this is first visit, show instructions
    if (!isGeminiConfigured() && !localStorage.getItem('instructions_seen')) {
      setShowInstructions(true);
      localStorage.setItem('instructions_seen', 'true');
    }
  }, []);
  
  const handleSaveSettings = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "API key cannot be empty if AI is enabled.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsValidating(true);
      setGeminiApiKey(apiKey.trim());
      setAiEnabled(true);
      
      toast({
        title: "Settings saved",
        description: "Your Gemini API key has been saved successfully.",
      });
      
      // Navigate to the chat interface after successful setup
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      toast({
        title: "Invalid API key",
        description: "Please check your API key and try again.",
        variant: "destructive"
      });
      setAiEnabled(false);
    } finally {
      setIsValidating(false);
    }
  };
  
  return (
    <div className="space-y-6 animate-in">
      <PageHeader 
        title="AI Settings" 
        description="Configure Google's Gemini AI for your chatbot experience"
      />
      
      {showInstructions && (
        <Alert className="bg-support-50 border-support-200 text-support-800">
          <AlertCircle className="h-4 w-4 text-support-500" />
          <AlertDescription className="space-y-3">
            <p className="font-medium">Welcome to the AI chatbot setup!</p>
            <p>To use the AI-powered chatbot, you need to provide a Google Gemini API key.</p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-support-600 underline">Google AI Studio</a> to create a free API key</li>
              <li>Sign in with your Google account</li>
              <li>Create a new API key and copy it</li>
              <li>Paste the API key below</li>
            </ol>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => setShowInstructions(false)}
            >
              <Check className="mr-2 h-4 w-4" />
              Got it
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Gemini AI Configuration</CardTitle>
          <CardDescription>
            Connect to Google's Gemini AI for an enhanced conversational experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-enabled" className="flex flex-col gap-1">
              <span>Enable Gemini AI</span>
              <span className="font-normal text-xs text-muted-foreground">
                Use Google's Gemini AI to power the support chatbot
              </span>
            </Label>
            <Switch 
              id="ai-enabled" 
              checked={aiEnabled}
              onCheckedChange={setAiEnabled}
              disabled={!apiKey || isValidating}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-key">Gemini API Key</Label>
            <Input 
              id="api-key" 
              type="password"
              placeholder="Enter your Gemini API key" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-muted-foreground text-xs mt-1">
              Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>Model Configuration</Label>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">Model: gemini-pro</p>
              <p className="text-xs text-muted-foreground mt-1">Optimized for chat-based applications with conversation memory</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={isValidating || !apiKey.trim()}
          >
            {isValidating ? "Validating..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
