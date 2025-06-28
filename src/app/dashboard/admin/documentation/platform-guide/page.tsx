
// src/app/dashboard/admin/documentation/platform-guide/page.tsx
"use client";

import React from 'react';
import {
  BookUser,
  LayoutDashboard,
  Users,
  Briefcase,
  GraduationCap,
  ListChecks,
  Euro,
  Cpu,
  Settings,
  Bot,
  ArrowLeft,
  BookHeart,
} from '@/lib/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const GuideSection = ({ title, icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => {
  const Icon = icon;
  return (
    <AccordionItem value={title} className="border bg-card rounded-lg shadow-sm">
      <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline [&[data-state=open]>svg]:text-primary">
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 text-primary" />
          {title}
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-4 pt-0 border-t">
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

// This is the correct way to handle a multi-line string in JSX
const xmlExample = `<changes>
  <description>[Provide a concise summary of the overall changes being made]</description>
  <change>
    <file>[Provide the ABSOLUTE, FULL path to the file being modified]</file>
    <content><![CDATA[Provide the ENTIRE, FINAL, intended content of the file here. Do NOT provide diffs or partial snippets. Ensure all code is properly escaped within the CDATA section.