// lib/icons.ts
"use client";
import type { ElementType } from 'react';

// This file centralizes all icon imports from lucide-react.
// To add a new icon, add it to the import list and then to the re-export list.

import { 
  Activity, Award, AlertCircle, AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, BarChart, BarChart3, BarChartBig,
  BarChartHorizontal, Bell, BookHeart, BookOpen, BookOpenCheck, BookUser, Bot, Brain, BrainCircuit, Briefcase, Cake,
  Calendar, CalendarCheck, CalendarDays, CalendarPlus, Calculator, CaseLower, Check, CheckCircle, CheckCircle2,
  CheckSquare, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsLeftRight, Circle, ClipboardCheck,
  ClipboardList, Clock, Coffee, Compass, Cookie, Copy, Cpu, CreditCard, Database, Download, Edit,
  Edit2, Edit3, Euro, ExternalLink, Eye, EyeOff, Facebook, FileBarChart, FileClock, FileEdit,
  FileInput, FilePlus, FileText, Filter, Fingerprint, FlaskConical, FolderOpen, Gamepad2,
  Gauge, Gavel, GitBranch, Globe, GraduationCap, Handshake, Hash, HeartHandshake, HelpCircle, History, Home,
  Hourglass, ImageIcon, ImageUp, Info, Instagram, KeyRound, Languages, LayoutDashboard, Library,
  LifeBuoy, Lightbulb, LineChart, Link, Link2, Link2Off, Linkedin, List, ListChecks, ListFilter,
  ListTodo, Loader2, Lock, LogOut, Mail, MailCheck, MapPin, Menu, MessageCircle, MessageCircleQuestion,
  MessageSquare, MessageSquareHeart, MessageSquarePlus, MessageSquareText, MessagesSquare, Mic, Milestone,
  Minus, Monitor, MoreVertical, NotebookPen, Package, PanelLeft, PanelRight, Pause, PauseCircle, Pencil, Percent,
  Phone, PieChart, Play, PlayCircle, PlaySquare, Plus, PlusCircle, Puzzle, RefreshCw, Repeat, Rocket,
  RotateCcw, Rss, Save, Scale, School, ScrollText, Search, Send, Settings,
  Settings2, Share2, Sheet, Shield, ShieldAlert, ShieldBan, ShieldCheck, ShoppingCart, SlidersHorizontal, Smile,
  Sparkles, Star, Stethoscope, Sun, Tablet, Target, Telescope, ThumbsUp, Timer, Trash2, Triangle, TrendingDown,
  TrendingUp, Trophy, Twitter, UploadCloud, User, UserCheck, UserCog, UserMinus, UserPlus,
  UserRound, UserSquare, UserX, Users, Users2, Video, Volume2, Wallet, Wand2, Waves, Workflow,
  Wrench, X, XCircle, XSquare, Zap, type LucideIcon
} from 'lucide-react';

// Create Aliases
export const ClockIcon = Clock;
export const Edit2Icon = Edit2;
export const FileTextIcon = FileText;
export const HomeIcon = Home;
export const LinkIcon = Link;
export const SaveIcon = Save;
export const SettingsIcon = Settings;
export const UserIcon = User;
export const UsersIcon = Users;
export const PlusCircleIcon = PlusCircle;

// Re-export all icons
export { 
  Activity, Award, AlertCircle, AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, BarChart, BarChart3, BarChartBig,
  BarChartHorizontal, Bell, BookHeart, BookOpen, BookOpenCheck, BookUser, Bot, Brain, BrainCircuit, Briefcase, Cake,
  Calendar, CalendarCheck, CalendarDays, CalendarPlus, Calculator, CaseLower, Check, CheckCircle, CheckCircle2,
  CheckSquare, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsLeftRight, Circle, ClipboardCheck,
  ClipboardList, Clock, Coffee, Compass, Cookie, Copy, Cpu, CreditCard, Database, Download, Edit,
  Edit2, Edit3, Euro, ExternalLink, Eye, EyeOff, Facebook, FileBarChart, FileClock, FileEdit,
  FileInput, FilePlus, FileText, Filter, Fingerprint, FlaskConical, FolderOpen, Gamepad2,
  Gauge, Gavel, GitBranch, Globe, GraduationCap, Handshake, Hash, HeartHandshake, HelpCircle, History, Home,
  Hourglass, ImageIcon, ImageUp, Info, Instagram, KeyRound, Languages, LayoutDashboard, Library,
  LifeBuoy, Lightbulb, LineChart, Link, Link2, Link2Off, Linkedin, List, ListChecks, ListFilter,
  ListTodo, Loader2, Lock, LogOut, Mail, MailCheck, MapPin, Menu, MessageCircle, MessageCircleQuestion,
  MessageSquare, MessageSquareHeart, MessageSquarePlus, MessageSquareText, MessagesSquare, Mic, Milestone,
  Minus, Monitor, MoreVertical, NotebookPen, Package, PanelLeft, PanelRight, Pause, PauseCircle, Pencil, Percent,
  Phone, PieChart, Play, PlayCircle, PlaySquare, Plus, PlusCircle, Puzzle, RefreshCw, Repeat, Rocket,
  RotateCcw, Rss, Save, Scale, School, ScrollText, Search, Send, Settings,
  Settings2, Share2, Sheet, Shield, ShieldAlert, ShieldBan, ShieldCheck, ShoppingCart, SlidersHorizontal, Smile,
  Sparkles, Star, Stethoscope, Sun, Tablet, Target, Telescope, ThumbsUp, Timer, Trash2, Triangle, TrendingDown,
  TrendingUp, Trophy, Twitter, UploadCloud, User, UserCheck, UserCog, UserMinus, UserPlus,
  UserRound, UserSquare, UserX, Users, Users2, Video, Volume2, Wallet, Wand2, Waves, Workflow,
  Wrench, X, XCircle, XSquare, Zap,
};

export type IconType = React.ElementType;

export const iconMap: Record<string, LucideIcon> = {
  Database, GitBranch, Wrench, Sparkles, Rss, CheckCircle, Package, Rocket, Users, Bot, ScrollText,
};
