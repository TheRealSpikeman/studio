// src/config/dashboard-nav.ts
import {
  LayoutDashboard, 
  ClipboardList, 
  MessageSquare, 
  User, 
  Settings, 
  Users as UsersIcon,
  BookOpen as BookOpenCheck,
  Briefcase, 
  Euro, 
  ListChecks, 
  FilePlus, 
  FileEdit, 
  Clock, 
  HelpCircle, 
  CreditCard, 
  Link as Link2,
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
  Calendar as CalendarDays,
  BookHeart,
  GraduationCap,
  BarChart as BarChartHorizontal,
  BarChart as FileBarChart,
  BrainCircuit,
  Rocket,
  ScrollText,
  Cpu,
  Bell,
  Rss,
  TrendingUp,
} from '@/lib/icons';

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
  { href: '/dashboard/leerling/quizzes', label: 'Zelfreflectie Tools', icon: ClipboardList, leerlingOnly: true },
  { href: '/dashboard/results', label: 'Mijn Resultaten', icon: FileBarChart, leerlingOnly: true },
  { href: '/dashboard/leerling/lessons', label: 'Mijn Lessen', icon: BookOpenCheck, leerlingOnly: true },
  { href: '/dashboard/community', label: 'Community Forum', icon: MessageSquare, leerlingOnly: true },
  
  // Ouder Items
  { href: '/dashboard/ouder/welcome', label: 'Start Ouder Onboarding', icon: PlayCircle, ouderOnly: true, isOuderOnboardingLink: true, sectionTitle: "OUDER PORTAAL" }, 
  { href: '/dashboard/ouder', label: 'Ouder Dashboard', icon: LayoutDashboard, ouderOnly: true, sectionTitle: "OUDER PORTAAL" },
  { href: '/dashboard/ouder/kinderen', label: 'Mijn Kinderen', icon: UsersIcon, ouderOnly: true },
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
  { href: '/dashboard/tutor/students', label: 'Mijn Leerlingen', icon: UsersIcon, tutorOnly: true },

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
    icon: UsersIcon,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/user-management', label: 'Alle Gebruikers', icon: UsersIcon, parent: '#user-management-parent' },
      { href: '/dashboard/admin/ouder-management', label: 'Ouders', icon: UsersIcon, parent: '#user-management-parent' },
      { href: '/dashboard/admin/student-management', label: 'Leerlingen', icon: GraduationCap, parent: '#user-management-parent' },
      { href: '/dashboard/admin/tutor-management', label: 'Tutoren', icon: Briefcase, parent: '#user-management-parent' },
    ]
  },
  {
    href: '#quiz-management-parent',
    label: 'Quizbeheer',
    icon: ListChecks,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/quiz-management', label: 'Alle Quizzen', icon: ListChecks, parent: '#quiz-management-parent' },
      { href: '/dashboard/admin/quiz-management/create', label: 'Nieuwe Quiz', icon: FilePlus, parent: '#quiz-management-parent' },
      { href: '/dashboard/admin/quiz-management/reports', label: 'Rapportages', icon: BarChartHorizontal, parent: '#quiz-management-parent' },
    ]
  },
  {
    href: '#insights-parent',
    label: 'Inzichten',
    icon: TrendingUp,
    adminOnly: true,
    children: [
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
      { href: '/dashboard/admin/subscription-management', label: 'Abonnementen', icon: CreditCard, parent: '#finance-parent' },
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
      { href: '/dashboard/admin/content-management', label: 'Content Pagina\'s', icon: FileEdit, parent: '#platform-parent' },
      { href: '/dashboard/admin/blog', label: 'Blogbeheer', icon: Rss, parent: '#platform-parent', isNew: true },
    ]
  },
  {
    href: '#settings-parent',
    label: 'Instellingen',
    icon: Settings,
    adminOnly: true,
    children: [
      { href: '/dashboard/admin/settings', label: 'Algemeen', icon: Settings, parent: '#settings-parent' },
      { href: '/dashboard/admin/settings/roles', label: 'Rollen & Permissies', icon: UsersIcon, parent: '#settings-parent' },
      { href: '/dashboard/admin/settings/notifications', label: 'Notificaties', icon: Bell, parent: '#settings-parent' },
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
      { href: '/dashboard/admin/documentation/ai-persona', label: 'AI Persona Profiel', icon: Bot, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/platform-guide', label: 'Platform Handleiding', icon: BookUser, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/data-flow', label: 'Data & Inzichten Flow', icon: BrainCircuit, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/customer-journey', label: 'Customer Journey', icon: UsersIcon, parent: '#documentation-parent' },
      { href: '/dashboard/admin/tool-recommendation-logic', label: 'Tool Aanbeveling Logica', icon: GitBranch, parent: '#documentation-parent' },
      { href: '/dashboard/admin/documentation/roadmap', label: 'Roadmap', icon: Rocket, parent: '#documentation-parent', isNew: true },
      { href: '/dashboard/admin/documentation/changelog', label: 'Changelog', icon: ScrollText, parent: '#documentation-parent' },
    ]
  },
  
  { href: '/dashboard/profile', label: 'Profiel', icon: User }, 
];
