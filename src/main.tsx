
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx'
import { AuthProvider } from '@/components/Auth/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { PWAInstallPrompt } from '@/components/PWA/PWAInstallPrompt';
import './index.css'

// Configure the QueryClient with appropriate default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize the React application
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
  window.addEventListener('load', async () => {
    try {
      // Force update service worker on page load - crucial for PWA updates
      navigator.serviceWorker.ready.then((registration) => {
        registration.update();
      });

      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
        updateViaCache: 'none' // Prevent the browser from using cached service worker
      });
      console.log('📱 ServiceWorker registration successful with scope: ', registration.scope);
      
      // Check for updates and notify user when a new version is available
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('📱 New content is available; please refresh.');
              // You could show a toast or notification here
            }
          });
        }
      });
    } catch (error) {
      console.error('❌ ServiceWorker registration failed: ', error);
    }
  });
      
  // Handle case when service worker has an update available
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('📱 New service worker controller, page will reload');
    window.location.reload();
  });

  // Log service worker status for debugging
  if (navigator.serviceWorker.controller) {
    console.log('📱 This page is currently controlled by a service worker');
  } else {
    console.log('📱 This page is not currently controlled by a service worker');
  }
}

// Add debug logging for PWA installability
window.addEventListener('load', () => {
  // Check if beforeinstallprompt is supported
  console.log('📱 Checking PWA install capability...');
  
  // Log if device supports PWA installation
  if ('BeforeInstallPromptEvent' in window) {
    console.log('📱 Browser supports PWA installation');
  } else {
    console.log('📱 Browser may not support PWA installation prompt directly');
    // Check specific browsers for additional information
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome')) {
      console.log('📱 Chrome detected. Make sure the app meets all PWA criteria.');
    } else if (userAgent.includes('safari')) {
      console.log('📱 Safari detected. Users need to use "Add to Home Screen" in the share menu.');
    } else if (userAgent.includes('firefox')) {
      console.log('📱 Firefox detected. May have different installation mechanisms.');
    }
  }

  // Log if running as installed PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('📱 Application is running in standalone mode (installed)');
  } else {
    console.log('📱 Application is running in browser mode (not installed)');
  }
});
