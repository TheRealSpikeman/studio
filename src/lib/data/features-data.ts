// src/lib/data/features-data.ts
import type { ElementType } from 'react';
import { Search, ClipboardList, MessageSquareText, BarChart3 } from 'lucide-react';

export interface FeaturePoint {
  text: string;
}

export interface FeatureCategory {
  id: string;
  title: string;
  icon: ElementType;
  features: FeaturePoint[];
}

export const detailedFeatureList: FeatureCategory[] = [
  {
    id: "self_reflection",
    title: "Zelfreflectie-instrumenten",
    icon: Search,
    features: [
      { text: "Interactieve tools om gedragspatronen en denkwijzen te herkennen en begrijpen" },
    ],
  },
  {
    id: "planning_tools",
    title: "Huiswerk & Planning Tools",
    icon: ClipboardList,
    features: [
      { text: "Digitale planner voor overzicht van taken en deadlines" },
      { text: "Pomodoro-timer voor gefocust werken in blokken" },
      { text: "Praktische focustechnieken en concentratie-oefeningen" },
    ],
  },
  {
    id: "coaching_hub",
    title: "Dagelijkse Coaching Hub",
    icon: MessageSquareText,
    features: [
      { text: "Dagelijkse motivatie en tips op maat" },
      { text: "Praktische oefeningen voor zelfvertrouwen en vaardigheden" },
      { text: "Interactieve coaching modules" },
    ],
  },
  {
    id: "personal_insights",
    title: "Persoonlijke Inzichten",
    icon: BarChart3,
    features: [
      { text: "Uitgebreide rapporten over persoonlijke sterke punten" },
      { text: "Voortgangsoverzichten en reflectie-samenvattingen" },
    ],
  },
];
