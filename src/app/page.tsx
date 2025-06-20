
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { AssessmentSection } from '@/components/landing/assessment-section'; 
import { PlatformFeaturesSection } from '@/components/landing/platform-features-section'; 
import { ComparativeAnalysisPromoSection } from '@/components/landing/comparative-analysis-promo'; // Nieuwe import
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { FinalCtaSection } from '@/components/landing/final-cta-section';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AssessmentSection /> 
        <PlatformFeaturesSection /> 
        <ComparativeAnalysisPromoSection /> {/* Nieuwe sectie hier toegevoegd */}
        <PricingSection />
        <TestimonialsSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
