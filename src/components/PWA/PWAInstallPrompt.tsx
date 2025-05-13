
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Function to check if the app meets criteria for installation
    const checkInstallability = async () => {
      if (!('navigator' in window) || !navigator.serviceWorker) {
        console.log('Service Worker API not supported');
        return;
      }

      // Check if already in standalone mode (installed)
      const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                                (window.navigator as any).standalone === true;
      
      if (isInStandaloneMode) {
        console.log('App is already installed in standalone mode');
        return;
      }

      // Log PWA status for debugging
      if ('BeforeInstallPromptEvent' in window) {
        console.log('Browser supports BeforeInstallPromptEvent');
      } else {
        console.log('Browser does not support BeforeInstallPromptEvent');
      }
    };

    checkInstallability();
    
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      
      // Log that the event was captured
      console.log('📱 beforeinstallprompt event was captured');
      
      // Stash the event so it can be triggered later
      setInstallPromptEvent(e as BeforeInstallPromptEvent);
      
      // Show the install button
      setShowPrompt(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Handle app installed event
    const handleAppInstalled = () => {
      setShowPrompt(false);
      toast({
        title: "HelpDesk Installed",
        description: "The app was successfully installed to your device.",
      });
      console.log('📱 PWA was installed successfully');
    };
    
    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = () => {
    if (!installPromptEvent) {
      console.log('No install prompt event saved');
      return;
    }
    
    console.log('🚀 Prompting for installation...');
    // Show the install prompt
    installPromptEvent.prompt();
    
    // Wait for the user to respond to the prompt
    installPromptEvent.userChoice.then((choiceResult: { outcome: 'accepted' | 'dismissed' }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
        toast({
          title: "Installing HelpDesk",
          description: "Thanks for installing our app!",
        });
      } else {
        console.log('❌ User dismissed the install prompt');
      }
      // Clear the saved prompt since it can't be used again
      setInstallPromptEvent(null);
      setShowPrompt(false);
    });
  };

  // Manual install button that users can click anytime
  const renderManualInstallButton = () => (
    <button 
      className="fixed bottom-4 right-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium shadow-lg"
      onClick={handleInstallClick}
    >
      Install HelpDesk
    </button>
  );

  if (!showPrompt && installPromptEvent) {
    return renderManualInstallButton(); 
  }

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
