
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx'
import { AuthProvider } from '@/components/Auth/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import './index.css'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
          <Toaster />
          <PWAInstallPrompt />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      },
      error => {
        console.log('ServiceWorker registration failed: ', error);
      }
    );
  });
}

// PWA Install Prompt Component
function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [installPromptEvent, setInstallPromptEvent] = React.useState<any>(null);

  React.useEffect(() => {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPromptEvent(e);
      // Show the install button
      setShowPrompt(true);
    });
    
    // Check if the app is already installed
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      console.log('PWA was installed');
    });
  }, []);

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
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto p-4 bg-white shadow-lg rounded-lg z-50 border flex items-center justify-between">
      <div>
        <h3 className="font-medium">Install Support360</h3>
        <p className="text-sm text-muted-foreground">Add to your home screen for quick access</p>
      </div>
      <div className="flex gap-2">
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
