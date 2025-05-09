
import { useState } from "react";
import { PageHeader } from "@/components/Layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Settings, Users, MessageSquare, Database, Shield } from "lucide-react";

export const SystemSettings = () => {
  const { toast } = useToast();
  
  // General settings
  const [companyName, setCompanyName] = useState("SUPPORTLINE");
  const [supportEmail, setSupportEmail] = useState("support@SUPPORTLINE.com");
  const [supportPhone, setSupportPhone] = useState("+1 (800) 123-4567");
  
  // Avatar settings
  const [avatarStyle, setAvatarStyle] = useState("avataaars");
  const [avatarBackground, setAvatarBackground] = useState("#f5f5f5");
  
  // Chatbot settings
  const [chatbotEnabled, setChatbotEnabled] = useState(true);
  const [chatbotThreshold, setChatbotThreshold] = useState(0.7);
  const [chatbotModel, setChatbotModel] = useState("gemini-2.0");
  
  // Database settings
  const [dataRetentionDays, setDataRetentionDays] = useState(365);
  const [backupEnabled, setBackupEnabled] = useState(true);
  const [seedingEnabled, setSeedingEnabled] = useState(true);
  
  // Security settings
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(60);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [passwordExpiryDays, setPasswordExpiryDays] = useState(90);
  
  const handleSaveSettings = () => {
    // In a real app, this would save the settings to the database
    toast({
      title: "Settings saved",
      description: "Your system settings have been updated.",
    });
  };
  
  return (
    <div className="space-y-6 animate-in">
      <PageHeader 
        title="System Settings" 
        description="Configure your support center settings"
      />
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="avatars" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Avatars</span>
          </TabsTrigger>
          <TabsTrigger value="chatbot" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chatbot</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Database</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your support center general settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input 
                  id="company-name" 
                  placeholder="Enter your company name" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input 
                  id="support-email" 
                  type="email" 
                  placeholder="Enter your support email" 
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="support-phone">Support Phone Number</Label>
                <Input 
                  id="support-phone" 
                  placeholder="Enter your support phone number" 
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Default Timezone</Label>
                <Select defaultValue="America/New_York">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">GMT/UTC (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="avatars">
          <Card>
            <CardHeader>
              <CardTitle>Avatar Settings</CardTitle>
              <CardDescription>Configure user avatar generation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="avatar-style">Avatar Style</Label>
                <Select 
                  value={avatarStyle}
                  onValueChange={setAvatarStyle}
                >
                  <SelectTrigger id="avatar-style">
                    <SelectValue placeholder="Select avatar style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="avataaars">Avataaars (Default)</SelectItem>
                    <SelectItem value="bottts">Bottts (Robot style)</SelectItem>
                    <SelectItem value="jdenticon">Jdenticon (Abstract)</SelectItem>
                    <SelectItem value="identicon">Identicon (Geometric)</SelectItem>
                    <SelectItem value="gridy">Gridy (Minimalist)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground text-xs mt-1">
                  Preview: <img 
                    src={`https://avatars.dicebear.com/api/${avatarStyle}/example.svg`}
                    alt="Avatar preview"
                    className="inline-block h-8 w-8 rounded-full ml-2 bg-muted"
                  />
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar-background">Avatar Background</Label>
                <div className="flex gap-2 items-center">
                  <Input 
                    id="avatar-background" 
                    type="color" 
                    className="w-16 h-10 p-1"
                    value={avatarBackground}
                    onChange={(e) => setAvatarBackground(e.target.value)}
                  />
                  <Input 
                    value={avatarBackground}
                    onChange={(e) => setAvatarBackground(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="chatbot">
          <Card>
            <CardHeader>
              <CardTitle>Chatbot Settings</CardTitle>
              <CardDescription>Configure AI chatbot behavior and integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="chatbot-enabled" className="flex flex-col gap-1">
                  <span>Enable AI Chatbot</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Allow customers to interact with the AI chatbot
                  </span>
                </Label>
                <Switch 
                  id="chatbot-enabled" 
                  checked={chatbotEnabled}
                  onCheckedChange={setChatbotEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chatbot-model">AI Model</Label>
                <Select 
                  value={chatbotModel}
                  onValueChange={setChatbotModel}
                  disabled={!chatbotEnabled}
                >
                  <SelectTrigger id="chatbot-model">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
                    <SelectItem value="gemini-2.0">Gemini 2.0 (Recommended)</SelectItem>
                    <SelectItem value="text-davinci-003">OpenAI Davinci</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="chatbot-threshold">Escalation Threshold ({chatbotThreshold})</Label>
                </div>
                <Input 
                  id="chatbot-threshold" 
                  type="range" 
                  min={0.1} 
                  max={0.9} 
                  step={0.1}
                  value={chatbotThreshold}
                  onChange={(e) => setChatbotThreshold(parseFloat(e.target.value))}
                  disabled={!chatbotEnabled}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>More AI handling</span>
                  <span>More agent escalation</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frustration-words">Frustration Keywords</Label>
                <Input 
                  id="frustration-words"
                  placeholder="Words that trigger agent escalation"
                  defaultValue="frustrated, angry, upset, help, human, agent, manager"
                  disabled={!chatbotEnabled}
                />
                <p className="text-muted-foreground text-xs mt-1">
                  Comma-separated words that will trigger escalation to human agent
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={!chatbotEnabled}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Settings</CardTitle>
              <CardDescription>Configure database behavior and data management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                <Input 
                  id="data-retention" 
                  type="number" 
                  min={30} 
                  value={dataRetentionDays}
                  onChange={(e) => setDataRetentionDays(parseInt(e.target.value))}
                />
                <p className="text-muted-foreground text-xs mt-1">
                  Tickets older than this will be archived
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="backup-enabled" className="flex flex-col gap-1">
                  <span>Enable Automated Backups</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Create daily backups of your database
                  </span>
                </Label>
                <Switch 
                  id="backup-enabled" 
                  checked={backupEnabled}
                  onCheckedChange={setBackupEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="seed-data" className="flex flex-col gap-1">
                  <span>Enable Data Seeding</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Populate the database with sample data for testing
                  </span>
                </Label>
                <Switch 
                  id="seed-data" 
                  checked={seedingEnabled}
                  onCheckedChange={setSeedingEnabled}
                />
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Database Management</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    Backup Now
                  </Button>
                  <Button variant="outline" size="sm">
                    Restore Backup
                  </Button>
                  <Button variant="destructive" size="sm">
                    Reset Database
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input 
                  id="session-timeout" 
                  type="number" 
                  min={15} 
                  value={sessionTimeoutMinutes}
                  onChange={(e) => setSessionTimeoutMinutes(parseInt(e.target.value))}
                />
                <p className="text-muted-foreground text-xs mt-1">
                  Users will be logged out after this period of inactivity
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="two-factor" className="flex flex-col gap-1">
                  <span>Require Two-Factor Authentication</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Enforce 2FA for all admin and agent accounts
                  </span>
                </Label>
                <Switch 
                  id="two-factor" 
                  checked={twoFactorRequired}
                  onCheckedChange={setTwoFactorRequired}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                <Input 
                  id="password-expiry" 
                  type="number" 
                  min={30} 
                  value={passwordExpiryDays}
                  onChange={(e) => setPasswordExpiryDays(parseInt(e.target.value))}
                />
                <p className="text-muted-foreground text-xs mt-1">
                  Users will be prompted to change passwords after this period
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allowed-domains">Allowed Email Domains</Label>
                <Input 
                  id="allowed-domains"
                  placeholder="Comma-separated list of domains"
                  defaultValue="example.com,SUPPORTLINE.com"
                />
                <p className="text-muted-foreground text-xs mt-1">
                  Only users with these email domains can register
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
