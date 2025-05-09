import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BecomeTutorHero } from '@/components/page/word-tutor/BecomeTutorHero';
import { BecomeTutorBenefits } from '@/components/page/word-tutor/BecomeTutorBenefits';
import { BecomeTutorApplicationForm } from '@/components/page/word-tutor/BecomeTutorApplicationForm';
import { BecomeTutorFaq } from '@/components/page/word-tutor/BecomeTutorFaq';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function BecomeTutorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/20 to-background">
          <BecomeTutorHero />
          <BecomeTutorBenefits />
          <BecomeTutorApplicationForm />
          <BecomeTutorFaq />
      </main>
      <Footer />
    </div>
  );
}
