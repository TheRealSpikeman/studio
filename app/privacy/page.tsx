// app/privacy/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PrivacyPageContent } from '@/components/legal/PrivacyPageContent';

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
        <PrivacyPageContent />
      </main>
      <Footer />
    </div>
  );
}
