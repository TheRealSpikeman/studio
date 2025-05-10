// src/app/word-tutor/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BecomeTutorHero } from '@/components/page/word-tutor/BecomeTutorHero';
import { BecomeTutorBenefits } from '@/components/page/word-tutor/BecomeTutorBenefits';
import { BecomeTutorFaq } from '@/components/page/word-tutor/BecomeTutorFaq';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Simulate user data and role for redirection logic
// In a real app, this would come from an authentication context
const MOCKED_CURRENT_USER = {
  isLoggedIn: false, // Set to true to test logged-in scenarios
  role: 'tutor' as 'tutor' | 'leerling' | 'admin',
  status: 'pending_onboarding' as 'pending_onboarding' | 'pending_approval' | 'actief' | 'rejected',
};


export default function BecomeTutorPage() {
  const router = useRouter();

  useEffect(() => {
    // This is conceptual. In a real app, you'd use an auth hook.
    if (MOCKED_CURRENT_USER.isLoggedIn && MOCKED_CURRENT_USER.role === 'tutor') {
      if (MOCKED_CURRENT_USER.status === 'pending_onboarding' || MOCKED_CURRENT_USER.status === 'pending_approval') {
        router.push('/dashboard/tutor/onboarding');
      } else if (MOCKED_CURRENT_USER.status === 'actief') {
        router.push('/dashboard/tutor');
      }
      // If rejected, they might see this page or a specific message page.
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/20 to-background">
          <BecomeTutorHero />
          <BecomeTutorBenefits />
          {/* Removed BecomeTutorApplicationForm, linking to new page from hero */}
          <div className="py-16 md:py-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-8">
              Klaar om te starten?
            </h2>
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow px-8 py-6 text-lg">
              <Link href="/tutor-application">
                Meld je nu aan als Tutor
              </Link>
            </Button>
          </div>
          <BecomeTutorFaq />
      </main>
      <Footer />
    </div>
  );
}
