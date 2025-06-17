import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { AssessmentSection } from '@/components/landing/assessment-section'; // Nieuwe import
import { PlatformFeaturesSection } from '@/components/landing/platform-features-section'; // Hernoemde import
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { QuizPreviewSection } from '@/components/landing/quiz-preview-section';
import { FinalCtaSection } from '@/components/landing/final-cta-section';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AssessmentSection /> {/* Nieuwe sectie hier */}
        <PlatformFeaturesSection /> {/* Hernoemde en aangepaste sectie */}
        <PricingSection />
        <TestimonialsSection />
        <QuizPreviewSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
