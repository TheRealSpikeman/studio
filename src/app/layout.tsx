
// src/app/layout.tsx
"use client"; // Required for AuthProvider context to work at the root

import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';

// Metadata can still be defined in a Client Component Root Layout
// export const metadata: Metadata = { ... }; 
// To avoid build errors in this context, we will omit it for now.

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${GeistSans.variable} font-sans antialiased`}>
        <AuthProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
