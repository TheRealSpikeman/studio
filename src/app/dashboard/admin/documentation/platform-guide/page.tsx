// src/app/dashboard/admin/documentation/platform-guide/page.tsx
"use client";

import React from 'react';
import {
  BookUser,
  Users,
  ListChecks,
  Euro,
  Cpu,
  Settings,
  Bot,
  ArrowLeft,
} from '@/lib/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const xmlExample = `<changes>
  <description>[Een korte samenvatting van de wijzigingen]</description>
  <change>
    <file>[Het volledige, absolute pad naar het bestand]</file>
    <content><![CDATA[De volledige, definitieve inhoud van het bestand hier. Geen diffs of snippets. Zorg ervoor dat alle code correct is ge-escaped.