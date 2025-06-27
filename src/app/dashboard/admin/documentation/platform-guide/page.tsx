// src/app/dashboard/admin/documentation/platform-guide/page.tsx
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard, Users, Brain, Handshake, BookOpen, Cpu, FileBarChart, CreditCard, Bot, Shield, GitBranch, ExternalLink, BookHeart, ArrowLeft, MessageSquare
} from '@/lib/icons';
import Link from "next/link";

const xmlExample = `
<changes>
  <description>[Provide a concise summary of the overall changes being made]</description>
  <change>
    <file>[Provide the ABSOLUTE, FULL path to the file being modified]</file>
    <content><![CDATA[Provide the ENTIRE, FINAL, intended content of the file here. Do NOT provide diffs or partial snippets. Ensure all code is properly escaped within the CDATA section.