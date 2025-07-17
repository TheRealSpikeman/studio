// src/app/dashboard/leerling/welcome/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WelcomeHeader } from '@/components/leerling/welcome/WelcomeHeader';
import { DiscoverySection } from '@/components/leerling/welcome/DiscoverySection';
import { StartQuizCta } from '@/components/leerling/welcome/StartQuizCta';


// Dummy user data - in a real app, this would come from context/auth
const currentUser = {
  name: "Alex", 
  ageGroup: "15-18" as "12-14" | "15-18" | "adult", 
};

const ONBOARDING_KEY_LEERLING = 'onboardingCompleted_leerling_v1';

export default function LeerlingWelcomePage() {
  const router = useRouter();

  const handleCompleteOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY_LEERLING, 'true');
    }
    router.push('/dashboard');
  };

  const neurodiversityLink = currentUser.ageGroup === '12-14' 
    ? "/features/coaching-en-tools" 
    : "/neurodiversiteit";
  
  const startQuizLink = `/quiz/teen-neurodiversity-quiz?ageGroup=${currentUser.ageGroup}`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl text-center">
        
        <WelcomeHeader name={currentUser.name} />
        
        <DiscoverySection />
        
        <StartQuizCta ageGroup={currentUser.ageGroup} startQuizLink={startQuizLink} />
        
        <div className="flex flex-col items-center gap-3">
          <Button onClick={handleCompleteOnboarding} variant="outline" className="w-full max-w-xs sm:max-w-md">
            Ik sla dit over en ga naar mijn (beperkte) dashboard
          </Button>
          <Link href={neurodiversityLink} className="text-xs text-primary hover:underline">
            Wat is neurodiversiteit eigenlijk?
          </Link>
        </div>

      </div>
    </div>
  );
}
