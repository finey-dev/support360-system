
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Function to check if app is already installed
    const checkIfStandalone = () => {
      const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                                (window.navigator as any).standalone === true;
      setIsStandalone(isInStandaloneMode);
      console.log('📱 Is app running in standalone mode?', isInStandaloneMode);
      return isInStandaloneMode;
    };
    
    // Check immediately if running in standalone mode
    if (checkIfStandalone()) {
      console.log('📱 App is already installed');
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome from automatically showing the prompt
      e.preventDefault();
      
      // Store the event for later use
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
      
      // Show install banner (after a short delay)
      setTimeout(() => {
        setShowInstallBanner(true);
      }, 3000);

      console.log('📱 beforeinstallprompt event was captured and saved!');
    };
    
    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      
      toast({
        title: "HelpDesk Installed",
        description: "The app was successfully installed to your device.",
      });
      
      console.log('📱 App was installed successfully');
    };
    
    // Create listener for media query change (for standalone mode detection)
    const mediaQueryList = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      checkIfStandalone();
    };
    
    // Register event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    mediaQueryList.addEventListener('change', handleDisplayModeChange);
    
    // Debug info for Safari on iOS
    if (navigator.userAgent.match(/iPhone|iPad|iPod/)) {
      console.log('📱 iOS detected - use "Add to Home Screen" in share menu');
      // Add a delay before showing iOS instructions
      setTimeout(() => {
        if (!checkIfStandalone()) {
          setShowInstallBanner(true);
        }
      }, 5000);
    }

    // Debug PWA eligibility
    console.log('📱 Checking PWA eligibility criteria:');
    console.log(`📱 - Service worker registered: ${Boolean(navigator.serviceWorker)}`);
    console.log(`📱 - HTTPS: ${window.location.protocol === 'https:'}`);
    console.log(`📱 - Manifest exists with proper icons: Should be true`);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQueryList.removeEventListener('change', handleDisplayModeChange);
    };
  }, [toast]);

  const handleInstallClick = () => {
    if (!deferredPrompt) {
      console.log('📱 No install prompt event saved, but trying to install anyway');
      
      // For iOS devices, show instructions
      if (navigator.userAgent.match(/iPhone|iPad|iPod/)) {
        toast({
          title: "Install HelpDesk",
          description: "On iOS: click the share button and select 'Add to Home Screen'",
          duration: 10000,
        });
        return;
      }
      
      // For other browsers that don't support beforeinstallprompt
      toast({
        title: "Installation",
        description: "Use your browser's install option or menu to add this app to your home screen",
        duration: 10000,
      });
      return;
    }
    
    console.log('📱 Prompting for installation...');
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
        toast({
          title: "Installing HelpDesk",
          description: "Thanks for installing our app!",
        });
      } else {
        console.log('❌ User dismissed the install prompt');
      }
      // Clear the saved prompt as it can't be used again
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    });
  };

  // Show instruction banner for iOS
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  if (isStandalone) {
    return null; // Already installed
  }

  // Only show the PWA prompt if:
  // 1. Not already in standalone mode (i.e., already installed)
  // 2. Either we have a deferredPrompt (Chrome, Edge, etc.) OR it's iOS (which needs manual instructions)
  // 3. The banner should be shown (based on timing logic)
  if (!showInstallBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 border flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div>
        <h3 className="font-medium">Install HelpDesk App</h3>
        {isIOS ? (
          <p className="text-sm text-muted-foreground">Tap the share icon and then "Add to Home Screen"</p>
        ) : (
          <p className="text-sm text-muted-foreground">Add to your home screen for quick access</p>
        )}
      </div>
      <div className="flex gap-2 self-end md:self-auto">
        {!isIOS && (
          <Button 
            className="px-4 py-2 bg-primary text-primary-foreground"
            onClick={handleInstallClick}
          >
            Install
          </Button>
        )}
        <Button 
          variant="outline"
          className="px-4 py-2" 
          onClick={() => setShowInstallBanner(false)}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}
