// app/terms/page.tsx
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TermsPageContent } from '@/components/legal/TermsPageContent';


export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
        <TermsPageContent />
      </main>
      <Footer />
    </div>
  );
}
