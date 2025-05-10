import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/landing/hero-section';
// import { FeaturesSection } from '@/components/landing/features-section'; // Replaced by ServicesSection for now
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { QuizPreviewSection } from '@/components/landing/quiz-preview-section';
import { FaqSection } from '@/components/landing/faq-section';
import { ServicesSection } from '@/components/landing/services-section';
import { FinalCtaSection } from '@/components/landing/final-cta-section';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection /> {/* New section for services */}
        <PricingSection />
        <TestimonialsSection />
        <QuizPreviewSection />
        <FinalCtaSection /> {/* New final CTA section */}
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
