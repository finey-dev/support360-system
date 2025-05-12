
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is already installed');
      return; // Don't show prompt if already installed
    }
    
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPromptEvent(e);
      // Show the install button
      setShowPrompt(true);
      console.log('Before install prompt fired');
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Handle app installed event
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      toast({
        title: "HelpDesk Installed",
        description: "The app was successfully installed to your device.",
      });
      console.log('PWA was installed');
    });
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [toast]);

  const handleInstallClick = () => {
    if (!installPromptEvent) {
      return;
    }
    
    // Show the install prompt
    installPromptEvent.prompt();
    
    // Wait for the user to respond to the prompt
    installPromptEvent.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        toast({
          title: "Installing HelpDesk",
          description: "Thanks for installing our app!",
        });
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the saved prompt since it can't be used again
      setInstallPromptEvent(null);
      setShowPrompt(false);
    });
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 border flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div>
        <h3 className="font-medium">Install HelpDesk</h3>
        <p className="text-sm text-muted-foreground">Add to your home screen for quick access</p>
      </div>
      <div className="flex gap-2 self-end md:self-auto">
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          onClick={handleInstallClick}
        >
          Install
        </button>
        <button 
          className="px-4 py-2 bg-muted text-muted-foreground rounded-md text-sm font-medium"
          onClick={() => setShowPrompt(false)}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
