// app/cookies/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CookiePageContent } from '@/components/legal/CookiePageContent';

export default function CookiePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
        <CookiePageContent />
      </main>
      <Footer />
    </div>
  );
}
