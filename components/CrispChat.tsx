'use client';

import { useEffect } from 'react';

export default function CrispChat() {
  useEffect(() => {
    const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

    if (!crispWebsiteId) {
      console.warn('Crisp Website ID is not configured');
      return;
    }

    let disposed = false;
    let hasLoaded = false;
    let loadTimeout: ReturnType<typeof setTimeout> | null = null;

    const loadCrisp = () => {
      if (disposed || hasLoaded) return;
      hasLoaded = true;

      window.$crisp = [];
      window.CRISP_WEBSITE_ID = crispWebsiteId;
      // Force blue theme (Crisp only supports predefined themes, not hex)
      window.$crisp.push(['do', 'setColorTheme', ['blue']]);

      const script = document.createElement('script');
      script.src = 'https://client.crisp.chat/l.js';
      script.async = true;
      script.onload = () => {
        // Re-apply after script loads to override any dashboard setting
        if (window.$crisp) {
          window.$crisp.push(['do', 'setColorTheme', ['blue']]);
        }
      };
      document.head.appendChild(script);
    };

    const scheduleLoad = () => {
      if ('requestIdleCallback' in window) {
        (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number })
          .requestIdleCallback(loadCrisp, { timeout: 4000 });
      } else {
        loadTimeout = setTimeout(loadCrisp, 2500);
      }
    };

    const onFirstInteraction = () => {
      loadCrisp();
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    };

    window.addEventListener('pointerdown', onFirstInteraction, { once: true });
    window.addEventListener('keydown', onFirstInteraction, { once: true });
    if (document.readyState === 'complete') {
      scheduleLoad();
    } else {
      window.addEventListener('load', scheduleLoad, { once: true });
    }

    return () => {
      disposed = true;
      if (loadTimeout) clearTimeout(loadTimeout);
      window.removeEventListener('load', scheduleLoad);
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
      const existingScript = document.querySelector('script[src="https://client.crisp.chat/l.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
}

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}
