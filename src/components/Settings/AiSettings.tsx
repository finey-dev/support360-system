
import { useState } from "react";
import { PageHeader } from "@/components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { setGeminiApiKey, getGeminiApiKey, isGeminiConfigured } from "@/lib/gemini";

export const AiSettings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>(getGeminiApiKey() || '');
  const [aiEnabled, setAiEnabled] = useState<boolean>(isGeminiConfigured());
  const [isValidating, setIsValidating] = useState<boolean>(false);
  
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
        description="Configure AI integration for the support chatbot"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Gemini AI Configuration</CardTitle>
          <CardDescription>
            Connect to Google's Gemini AI for enhanced chatbot capabilities
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
              Get your API key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Model Configuration</Label>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">Model: gemini-pro</p>
              <p className="text-xs text-muted-foreground mt-1">Best for text-based conversations and general knowledge</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveSettings}
            disabled={isValidating}
          >
            {isValidating ? "Validating..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
