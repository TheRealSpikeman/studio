// app/page.tsx
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { PlatformFeaturesSection } from '@/components/landing/platform-features-section';
import { AssessmentSection } from '@/components/landing/assessment-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { FinalCtaSection } from '@/components/landing/final-cta-section';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PlatformFeaturesSection />
        <AssessmentSection />
        <TestimonialsSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
