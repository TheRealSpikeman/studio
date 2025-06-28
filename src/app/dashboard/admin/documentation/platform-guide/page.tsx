// src/app/dashboard/admin/documentation/platform-guide/page.tsx
"use client";

import React, { type ReactNode, type ElementType } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BookUser,
  Users,
  ListChecks,
  Euro,
  Cpu,
  Settings,
  Bot,
  ArrowLeft
} from '@/lib/icons';

// This is the variable that was causing the error. It's now correctly formatted as a string.
const xmlExample = `<changes>
  <description>[Provide a concise summary of the overall changes being made]</description>
  <change>
    <file>[Provide the ABSOLUTE, FULL path to the file being modified]</file>
    <content><![CDATA[Provide the ENTIRE, FINAL, intended content of the file here. Do NOT provide diffs or partial snippets. Ensure all code is properly escaped within the CDATA section.