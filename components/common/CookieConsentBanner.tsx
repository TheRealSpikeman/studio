'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cookie } from '@/lib/icons';
import { cn } from '@/lib/utils';

const USER_CONSENT_KEY = 'mindnavigator_cookie_consent';
const ADMIN_ENABLED_KEY = 'mindnavigator_cookie_banner_enabled';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const userConsent = localStorage.getItem(USER_CONSENT_KEY);
      const isAdminEnabled = localStorage.getItem(ADMIN_ENABLED_KEY) !== 'false'; // Default to true if not set

      if (isAdminEnabled && userConsent !== 'granted' && userConsent !== 'denied') {
        setIsVisible(true);
      }
    } catch (e) {
      console.error('Could not access localStorage:', e);
    }
  }, []);

  const handleConsent = (decision: 'granted' | 'denied') => {
    try {
      localStorage.setItem(USER_CONSENT_KEY, decision);
      setIsVisible(false);
    } catch (e) {
      console.error('Could not set localStorage:', e);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 p-4 bg-card/95 backdrop-blur-sm border-t shadow-2xl print-hide",
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=visible]:slide-in-from-bottom-full data-[state=hidden]:slide-out-to-bottom-full transition-all duration-500"
      )}
      data-state={isVisible ? 'visible' : 'hidden'}
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cookie className="h-8 w-8 text-primary flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Wij gebruiken cookies om uw ervaring te verbeteren en voor analyitische doeleinden. Lees ons{' '}
            <Link href="/cookies" className="underline text-primary hover:text-primary/80">
              cookiebeleid
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0 w-full sm:w-auto">
          <Button variant="outline" onClick={() => handleConsent('denied')} className="flex-1">
            Weigeren
          </Button>
          <Button onClick={() => handleConsent('granted')} className="flex-1">
            Accepteren
          </Button>
        </div>
      </div>
    </div>
  );
}
