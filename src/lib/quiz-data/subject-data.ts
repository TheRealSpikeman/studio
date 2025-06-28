// src/lib/quiz-data/subject-data.ts
import { Languages, Calculator, Globe, FlaskConical, History, Users, GraduationCap } from '@/lib/icons';
import type { ElementType } from 'react';

export interface SubjectOption {
  id: string;
  name: string;
  icon: ElementType;
}

export const allHomeworkSubjects: SubjectOption[] = [
  { id: 'nederlands', name: 'Nederlands', icon: Languages },
  { id: 'wiskunde', name: 'Wiskunde', icon: Calculator },
  { id: 'engels', name: 'Engels', icon: Languages },
  { id: 'geschiedenis', name: 'Geschiedenis', icon: History },
  { id: 'biologie', name: 'Biologie', icon: FlaskConical },
  { id: 'aardrijkskunde', name: 'Aardrijkskunde', icon: Globe },
  { id: 'natuurkunde', name: 'Natuurkunde', icon: FlaskConical }, // Assuming FlaskConical is okay for Physics too
  { id: 'scheikunde', name: 'Scheikunde', icon: FlaskConical }, // Assuming FlaskConical is okay for Chemistry too
  { id: 'economie', name: 'Economie', icon: Users }, // Using Users as a generic icon for now
  { id: 'frans', name: 'Frans', icon: Languages },
  { id: 'duits', name: 'Duits', icon: Languages },
];
