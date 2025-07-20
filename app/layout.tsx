// app/layout.tsx
import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from '@/components/providers/AppProviders';
import { AuthProvider } from '@/contexts/AuthContext'; // Importing AuthProvider
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
          <AppProviders>
            <MaintenanceModeHandler>
              {children}
            </MaintenanceModeHandler>
          </AppProviders>
        </AuthProvider>
        <Toaster />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
