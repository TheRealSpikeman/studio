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
    <content><![CDATA[Provide the ENTIRE, FINAL, intended content of the file here. Do NOT provide diffs or partial snippets. Ensure all code is properly escaped within the CDATA section.]]></content>
  </change>
</changes>`;

export default function PlatformGuidePage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/dashboard/admin/documentation" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Documentation
          </Link>
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BookHeart className="h-8 w-8 text-primary" />
          Platform Integration Guide
        </h1>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">XML Template Example</h2>
        <pre className="whitespace-pre-wrap bg-white p-4 rounded border overflow-x-auto text-sm">
          <code>{xmlExample}</code>
        </pre>
      </div>

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Integration Overview
          </h3>
          <p className="text-gray-600 mb-4">
            This guide covers the complete integration process for connecting external platforms 
            with our system using the standardized XML format shown above.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="getting-started">
            <AccordionTrigger className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Getting Started
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>Follow these steps to begin your platform integration:</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Review the XML template format above</li>
                  <li>Prepare your file modifications according to the template</li>
                  <li>Test your changes in a development environment</li>
                  <li>Submit your integration for review</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="best-practices">
            <AccordionTrigger className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Best Practices
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>Follow these guidelines for optimal integration:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Always provide complete file content, not diffs</li>
                  <li>Use absolute file paths for accuracy</li>
                  <li>Escape special characters within CDATA sections</li>
                  <li>Include comprehensive change descriptions</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}