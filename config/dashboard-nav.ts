

// src/config/dashboard-nav.ts
import {
  LayoutDashboard, 
  ClipboardList, 
  MessageSquare, 
  User, 
  Settings, 
  Users,
  BookOpenCheck,
  Briefcase, 
  Euro, 
  ListChecks, 
  FilePlus, 
  FileEdit, 
  Clock, 
  HelpCircle, 
  CreditCard, 
  Link2,
  UserCheck,
  ShieldCheck,
  Package, 
  Handshake,
  PlayCircle, 
  MessageCircleQuestion,
  BookUser,
  GitBranch, 
  Bot, 
  Wrench, 
  CalendarPlus, 
  CalendarDays,
  BookHeart,
  GraduationCap,
  BarChartHorizontal,
  FileBarChart,
  BrainCircuit,
  Rocket,
  ScrollText,
  Cpu,
  Bell,
  Rss,
  TrendingUp,
  ImageUp,
  ClipboardCheck,
  History,
  Mail,
  Edit,
  FileText,
  PlusCircle,
  HeartHandshake,
  Gavel,
  BarChart3,
  Globe,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  tutorOnly?: boolean;
  coachOnly?: boolean; 
  leerlingOnly?: boolean;
  ouderOnly?: boolean;
  sectionTitle?: string;
  children?: NavItem[];
  parent?: string;
  isOuderOnboardingLink?: boolean;
  alwaysShowWhenOnboarding?: boolean; 
  isNew?: boolean;
}

export const navItems: NavItem[] = [
  // Leerling Items
  { href: '/dashboard/leerling/welcome', label: 'Welkom!', icon: PlayCircle, leerlingOnly: true, sectionTitle: "Leerling Portaal" },
  {
    href: '#dashboard-parent',
    label: 'Dashboard',
    icon: LayoutDashboard,
    leerlingOnly: true,
    children: [
      { href: '/dashboard/leerling', label: 'Overzicht', icon: LayoutDashboard, parent: '#dashboard-parent' },
      { href: '/dashboard/coaching', label: 'Dagelijkse Coaching', icon: MessageSquare, parent: '#dashboard-parent' },
      { href: '/dashboard/tools', label: 'Aanbevolen Tools', icon: Wrench, parent: '#dashboard-parent' },
      { href: '/dashboard/coaching/settings', label: 'Instellingen', icon: Settings, parent: '#dashboard-parent' },
    ]
  },
  { href: '/dashboard/notifications', label: 'Notificaties', icon: Bell, leerlingOnly: true, isNew: true },
  { href: '/dashboard/leerling/quizzes', label: 'Zelfreflectie Tools', icon: ClipboardList, leerlingOnly: true },
  { href: '/dashboard/results', label: 'Mijn Resultaten', icon: FileBarChart, leerlingOnly: true },
  { href: '/dashboard/leerling/lessons', label: 'Mijn Lessen', icon: BookOpenCheck, leerlingOnly: true },
  { href: '/dashboard/community', label: 'Community Forum', icon: MessageSquare, leerlingOnly: true },
  
  // Ouder Items
  { href: '/dashboard/ouder/welcome', label: 'Start Ouder Onboarding', icon: PlayCircle, ouderOnly: true, isOuderOnboardingLink: true, sectionTitle: "OUDER PORTAAL" }, 
  { href: '/dashboard/ouder', label: 'Ouder Dashboard', icon: LayoutDashboard, ouderOnly: true, sectionTitle: "OUDER PORTAAL" },
  { href: '/dashboard/ouder/kinderen', label: 'Mijn Kinderen', icon: Users, ouderOnly: true },
  { href: '/dashboard/ouder/quizzes', label: 'Vragenlijsten', icon: FileText, ouderOnly: true },
  { 
    href: '#ouder-lessen-parent', 
    label: 'Lessen Kinderen', 
    icon: BookOpenCheck, 
    ouderOnly: true, 
    children: [
        { href: '/dashboard/ouder/lessen/plannen', label: 'Les Plannen', icon: CalendarPlus, parent: '#ouder-lessen-parent' },
        { href: '/dashboard/ouder/lessen/aankomend', label: 'Aankomende Lessen', icon: CalendarDays, parent: '#ouder-lessen-parent' },
        { href: '/dashboard/ouder/lessen/overzicht', label: 'Lessen Overzicht', icon: CalendarDays, parent: '#ouder-lessen-parent' },
    ]
  },
  { href: '/dashboard/ouder/zoek-professional', label: 'Zoek Begeleiding', icon: Link2, ouderOnly: true },
  { href: '/dashboard/ouder/gekoppelde-professionals', label: 'Mijn Begeleiders', icon: UserCheck, ouderOnly: true },
  { href: '/dashboard/ouder/abonnementen', label: 'Abonnementen', icon: Euro, ouderOnly: true },
  { href: '/dashboard/ouder/facturatie', label: 'Facturatie', icon: CreditCard, ouderOnly: true },
  { href: '/dashboard/ouder/berichten', label: 'Berichten', icon: MessageSquare, ouderOnly: true },
  { href: '/dashboard/ouder/privacy-instellingen', label: 'Privacy & Delen', icon: ShieldCheck, ouderOnly: true },
  { href: '/dashboard/ouder/faq', label: 'FAQ Ouders', icon: HelpCircle, ouderOnly: true, alwaysShowWhenOnboarding: true },
  { href: '/dashboard/ouder/ouderrichtlijnen', label: 'Ouderrichtlijnen', icon: BookHeart, ouderOnly: true, alwaysShowWhenOnboarding: true },

  // Tutor specific section
  { href: '/dashboard/tutor', label: 'Tutor Dashboard', icon: LayoutDashboard, tutorOnly: true, sectionTitle: "TUTOR PORTAAL" },
  { href: '/dashboard/tutor/availability', label: 'Mijn Beschikbaarheid', icon: Clock, tutorOnly: true },
  { href: '/dashboard/tutor/lessons', label: 'Alle Lessen (Tutor)', icon: BookOpenCheck, tutorOnly: true },
  { href: '/dashboard/tutor/students', label: 'Mijn Leerlingen', icon: Users, tutorOnly: true },

  // Coach specific section
  { href: '/dashboard/coach', label: 'Coach Dashboard', icon: LayoutDashboard, coachOnly: true, sectionTitle: "COACH PORTAAL" },
  { href: '/dashboard/coach/availability', label: 'Mijn Beschikbaarheid (Coach)', icon: Clock, coachOnly: true },
  { href: '/dashboard/coach/lessons', label: 'Mijn Sessies', icon: BookOpenCheck, coachOnly: true },
  { href: '/dashboard/coach/students', label: 'Mijn Cliënten', icon: Handshake, coachOnly: true },
  { href: '/dashboard/coach/tools', label: 'Coach Tools', icon: Wrench, coachOnly: true },

  // Admin specific section
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard, adminOnly: true, sectionTitle: "ADMIN DASHBOARD" },
  {
    href: '#user-management-parent',
    label: 'Gebruikersbeheer',
    icon: Users,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/user-management', label: 'Alle Gebruikers', icon: Users, parent: '#user-management-parent' },
      { href: '/dashboard/admin/ouder-management', label: 'Ouders', icon: Users, parent: '#user-management-parent' },
      { href: '/dashboard/admin/student-management', label: 'Leerlingen', icon: GraduationCap, parent: '#user-management-parent' },
      { href: '/dashboard/admin/tutor-management', label: 'Tutoren', icon: Briefcase, parent: '#user-management-parent' },
      { href: '/dashboard/admin/coach-management', label: 'Coaches', icon: HeartHandshake, parent: '#user-management-parent' },
    ]
  },
  {
    href: '#quiz-management-parent',
    label: 'Quizbeheer',
    icon: ListChecks,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/quiz-management', label: 'Overzicht', icon: ListChecks, parent: '#quiz-management-parent' },
      { href: '/dashboard/admin/quiz-management/create', label: 'Nieuwe Quiz', icon: PlusCircle, parent: '#quiz-management-parent' },
    ]
  },
  {
    href: '#insights-parent',
    label: 'Inzichten',
    icon: TrendingUp,
    adminOnly: true,
    isNew: true,
    children: [
      { href: '/dashboard/admin/insights/quiz-reports', label: 'Quiz Rapporten', icon: FileBarChart, parent: '#insights-parent', isNew: true },
      { href: '/dashboard/admin/reporting', label: 'Platform Rapportages', icon: FileBarChart, parent: '#insights-parent' },
      { href: '/dashboard/admin/feedback-overview', label: 'Feedback Overzicht', icon: MessageCircleQuestion, parent: '#insights-parent' },
    ]
  },
  {
    href: '#finance-parent',
    label: 'Financieel Beheer',
    icon: Euro,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/finance', label: 'Betalingen', icon: Euro, parent: '#finance-parent' },
    ]
  },
  {
    href: '#platform-parent',
    label: 'Platformbeheer',
    icon: Cpu,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/feature-management', label: 'Functionaliteiten', icon: Package, parent: '#platform-parent' },
      { href: '/dashboard/admin/tool-management', label: 'Toolbeheer', icon: Wrench, parent: '#platform-parent' },
    ]
  },
  {
    href: '#blog-management-parent',
    label: 'Blogbeheer',
    icon: Rss,
    adminOnly: true,
    isNew: true,
    children: [
        { href: '/dashboard/admin/blog', label: 'Artikelen', icon: Rss, parent: '#blog-management-parent' },
        { href: '/dashboard/admin/blog/new', label: 'Nieuw Artikel', icon: FileText, parent: '#blog-management-parent' },
        { href: '/dashboard/admin/blog/tags', label: 'Tags Beheren', icon: ListChecks, parent: '#blog-management-parent', isNew: true },
    ]
  },
  {
    href: '#settings-parent',
    label: 'Instellingen',
    icon: Settings,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/settings', label: 'Algemeen', icon: Settings, parent: '#settings-parent' },
      { href: '/dashboard/admin/settings/roles', label: 'Rollen & Permissies', icon: Users, parent: '#settings-parent' },
      { href: "/dashboard/admin/settings/personas", label: "AI Persona's", icon: Bot, parent: '#settings-parent' },
      { href: '/dashboard/admin/settings/avatars', label: 'Standaard Avatars', icon: ImageUp, parent: '#settings-parent', isNew: true },
      { href: '/dashboard/admin/settings/notifications', label: 'Notificaties', icon: Bell, parent: '#settings-parent' },
      { href: '/dashboard/admin/settings/notification-history', label: 'Notificatie Historie', icon: History, parent: '#settings-parent', isNew: true },
      { href: '/dashboard/admin/settings/email-templates', label: 'E-mail Beheer', icon: Mail, parent: '#settings-parent', isNew: true },
      { href: '/dashboard/admin/settings/security', label: 'Beveiliging', icon: ShieldCheck, parent: '#settings-parent' },
    ]
  },
  {
    href: '#documentation-parent',
    label: 'Documentatie',
    icon: BookHeart,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/documentation', label: 'Overzicht', icon: BookHeart, parent: '#documentation-parent' },
      { href: '/dashboard/admin/testing', label: 'Test Checklist', icon: ClipboardCheck, parent: '#documentation-parent', isNew: true },
      { href: '/dashboard/admin/documentation/activity-log', label: 'Activiteitenlogboek', icon: BarChartHorizontal, parent: '#documentation-parent', isNew: true },
      { href: '/dashboard/admin/documentation/platform-status', label: 'Platform Status', icon: Rocket, parent: '#documentation-parent', isNew: true },
      { href: '/dashboard/admin/documentation/prompt-templates', label: 'AI Prompt Templates', icon: Bot, parent: '#documentation-parent', isNew: true, },
      { href: '/dashboard/admin/documentation/ai-validation', label: 'AI Validatie & Kwaliteit', icon: Gavel, parent: '#documentation-parent', isNew: true, },
      { href: '/dashboard/admin/documentation/data-flow', label: 'Data & Inzichten Flow', icon: BrainCircuit, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/customer-journey', label: 'Customer Journey', icon: Users, parent: '#documentation-parent' },
      { href: '/dashboard/admin/tool-recommendation-logic', label: 'Tool Aanbeveling Logica', icon: GitBranch, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/roadmap', label: 'Roadmap', icon: Rocket, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/changelog', label: 'Changelog', icon: ScrollText, parent: '#documentation-parent' },
    ]
  },
  
  // General Profile Link
  { href: '/dashboard/profile', label: 'Profiel', icon: User, sectionTitle: 'Account' },
  { href: '/dashboard/notifications', label: 'Notificaties', icon: Bell, isNew: true },
];
