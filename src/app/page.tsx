
"use client";

import { HeroSection } from '@/components/landing/hero-section';
import { PlatformFeaturesSection } from '@/components/landing/platform-features-section';
import { AssessmentSection } from '@/components/landing/assessment-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { FaqSection } from '@/components/landing/faq-section';
import { FinalCtaSection } from '@/components/landing/final-cta-section';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ComparativeAnalysisPromoSection } from '@/components/landing/comparative-analysis-promo';


export default function LandingPage() {
  return (
    <>
      <Header />
      <HeroSection />
      <ComparativeAnalysisPromoSection />
      <PlatformFeaturesSection />
      <AssessmentSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCtaSection />
      <Footer />
    </>
  );
}
