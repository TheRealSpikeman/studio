// src/app/dashboard/admin/documentation/platform-guide/page.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { ElementType, ReactNode } from 'react';
import {
  ArrowLeft, BookUser, Users, ListChecks, Euro, Cpu, Settings, Bot
} from '@/lib/icons';

// Helper component for consistent section styling
const GuideSection = ({ title, icon: Icon, children }: { title: string, icon: ElementType, children: React.ReactNode }) => (
  <AccordionItem value={title} className="border rounded-lg bg-card shadow-sm">
    <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary" />
        {title}
      </div>
    </AccordionTrigger>
    <AccordionContent className="p-4 pt-0 border-t">
      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
        {children}
      </div>
    </AccordionContent>
  </AccordionItem>
);

const xmlExample = `<changes>
  <description>[Een korte samenvatting van de wijzigingen]</description>
  <change>
    <file>[Het volledige, absolute pad naar het bestand]</file>
    <content><![CDATA[De volledige, definitieve inhoud van het bestand hier. Geen diffs of snippets. Zorg ervoor dat alle code correct is ge-escaped.