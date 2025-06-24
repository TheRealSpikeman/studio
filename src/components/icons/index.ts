// src/components/icons/index.ts
/**
 * Barrel file for all icon exports.
 * This is the single source of truth for icons in the application.
 */

// Export all icons from their categories
export * from './categories/action-icons';
export * from './categories/business-icons';
export * from './categories/mind-navigator-icons';
export * from './categories/navigation-icons';
export * from './categories/status-icons';
export * from './categories/general-icons'; // For icons that don't fit a specific category

// --- ALIASES for backward compatibility ---
// This is where we handle the problematic aliases to ensure components don't break.
// By defining them here, we keep the components clean.

import {
  BarChart,
  Users,
  BookOpen,
  MessageSquare,
  ArrowUp,
  ExternalLink,
  User,
  Shield,
  Handshake,
  Menu,
  Save,
  Calendar,
  Settings,
  Clock,
  CheckCircle,
  ClipboardList,
  Edit2,
  FileText,
  PlusCircle,
  Heart,
  SeparatorHorizontal,
} from 'lucide-react';

// Explicit alias exports to prevent runtime errors
export const FileBarChart = BarChart;
export const BarChart3 = BarChart;
export const BarChartBig = BarChart;
export const BarChartHorizontal = BarChart;

export const UsersIconLucide = Users;
export const Users2 = Users;
export const UsersIcon = Users;

export const BookOpenCheck = BookOpen;
export const BookUser = BookOpen;

export const MessagesSquare = MessageSquare;
export const MessagesSquareIcon = MessageSquare;
export const MessageCircleQuestion = MessageSquare;
export const MessageSquarePlus = MessageSquare;
export const MessageSquareText = MessageSquare;
export const MessageSquareHeart = Heart; // Heart might be a better representation for this alias

export const TrendingUp = ArrowUp; // Fallback since TrendingUp doesn't exist

export const Link2 = ExternalLink;
export const LinkIcon = Link;

export const UserCheck = User;
export const UserIcon = User;

export const ShieldCheck = Shield;

export const HeartHandshake = Handshake;

export const PanelLeft = Menu;

export const SaveIcon = Save;

export const CalendarDays = Calendar;
export const CalendarClock = Calendar;
export const CalendarIcon = Calendar;

export const SettingsIcon = Settings;
export const ClockIcon = Clock;
export const CheckCircle2 = CheckCircle;
export const ClipboardCheck = ClipboardList;
export const Edit2Icon = Edit2;
export const FileTextIcon = FileText;
export const PlusCircleIcon = PlusCircle;

export const Separator = SeparatorHorizontal;

// Main type export
export type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;
