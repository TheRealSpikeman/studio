import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { ParentBenefitsSection } from '@/components/landing/parent-benefits-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { QuizPreviewSection } from '@/components/landing/quiz-preview-section';
import { FaqSection } from '@/components/landing/faq-section';
import { FinalCtaSection } from '@/components/landing/final-cta-section';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ParentBenefitsSection />
        <PricingSection />
        <TestimonialsSection />
        <QuizPreviewSection />
        <FinalCtaSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
