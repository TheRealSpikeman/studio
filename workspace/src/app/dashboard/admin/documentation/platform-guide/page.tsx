
// src/app/dashboard/admin/documentation/platform-guide/page.tsx
"use client";

import React from 'react';
import {
  BookHeart,
  LayoutDashboard,
  Users,
  Brain,
  Handshake,
  BookOpen,
  GitBranch,
  CreditCard,
  FileBarChart,
  Bot,
  Cpu,
  ArrowLeft,
  ExternalLink
} from '@/lib/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// This is the correct way to handle a multi-line string in JSX
const xmlExample = `<changes>
  <description>[Provide a concise summary of the overall changes being made]</description>
  <change>
    <file>[Provide the ABSOLUTE, FULL path to the file being modified]</file>
    <content><![CDATA[Provide the ENTIRE, FINAL, intended content of the file here. Do NOT provide diffs or partial snippets. Ensure all code is properly escaped within the CDATA section.