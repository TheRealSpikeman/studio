// app/layout.tsx
import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { CookieConsentBanner } from '@/components/common/CookieConsentBanner';
import { MaintenanceModeHandler } from '@/components/layout/MaintenanceModeHandler';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${GeistSans.variable} font-sans antialiased`}>
        <AuthProvider>
          <MaintenanceModeHandler>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </MaintenanceModeHandler>
        </AuthProvider>
        <Toaster />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
