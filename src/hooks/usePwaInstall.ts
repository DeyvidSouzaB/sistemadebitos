/// <reference types="vite/client" />
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA app
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    setIsInstalled(isStandalone);

    // Detect device type
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isMobileDevice = isIosDevice || /android|mobile|blackberry|iemobile|opera mini/.test(userAgent);

    setIsIos(isIosDevice);
    setIsMobile(isMobileDevice);

    if (isIosDevice && !isStandalone) {
      setIsInstallable(true);
    }

    // Listen for Chrome/Edge/Android beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Service Worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Falha ao registrar ServiceWorker do PWA:', err);
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Function to create and trigger automatic download of Desktop Internet Shortcut (.url)
  const downloadDesktopShortcut = () => {
    const appUrl = window.location.origin;
    const shortcutContent = `[InternetShortcut]
URL=${appUrl}
IDList=
HotKey=0
IconIndex=0
IconFile=${appUrl}/pwa-192x192.png
[{000214A0-0000-0000-C000-000000000466}]
Prop3=19,11
`;
    const blob = new Blob([shortcutContent], { type: 'application/x-mswinurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PAGMEFY - Atalho do Sistema.url';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const triggerInstall = async () => {
    if (deferredPrompt) {
      // 1. Browser natively supports 1-click PWA installation
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Erro ao acionar instalação do PWA:', err);
        if (!isMobile) {
          downloadDesktopShortcut();
        }
        setShowInstallModal(true);
      }
    } else if (!isMobile) {
      // 2. Desktop user without prompt: Automatically download .url shortcut & open guide
      downloadDesktopShortcut();
      setShowInstallModal(true);
    } else {
      // 3. Mobile user (iOS/Android): Open guided step-by-step modal
      setShowInstallModal(true);
    }
  };

  return {
    isInstallable,
    isInstalled,
    isIos,
    isMobile,
    triggerInstall,
    showInstallModal,
    setShowInstallModal,
  };
}
