// src/app/dashboard/admin/documentation/platform-guide/page.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BookHeart } from '@/lib/icons';

// Import de nieuwe section components
import { GuideSection } from '@/components/admin/documentation/platform-guide/GuideSection';
import { IntroductionSection } from '@/components/admin/documentation/platform-guide/sections/IntroductionSection';
import { XmlChangesSection } from '@/components/admin/documentation/platform-guide/sections/XmlChangesSection';
import { TechStackSection } from '@/components/admin/documentation/platform-guide/sections/TechStackSection';
import { AiFlowsSection } from '@/components/admin/documentation/platform-guide/sections/AiFlowsSection';
import { ContributingSection } from '@/components/admin/documentation/platform-guide/sections/ContributingSection';


export default function PlatformGuidePage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BookHeart className="h-8 w-8 text-primary" />
          Platform Handleiding
        </h1>
         <Button asChild variant="outline">
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug naar Documentatie
          </Link>
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Deze handleiding biedt een technisch overzicht van de kernconcepten en de architectuur van het MindNavigator-platform, opgebouwd uit modulaire secties.
      </p>

      {/* Render each section component */}
      <IntroductionSection />
      <XmlChangesSection />
      <TechStackSection />
      <AiFlowsSection />
      <ContributingSection />
      
    </div>
  );
}
