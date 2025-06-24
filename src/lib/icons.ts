// src/lib/icons.ts
// DEFINITIEVE FIX - Alle icons die de app gebruikt, met robuuste aliassen.

import {
  Activity, AlertCircle, AlertTriangle, Archive, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Award, BarChart, Bell, BookHeart, BookOpen, Bookmark, Bot, Brain, BrainCircuit, Briefcase,
  Cake, Calendar, CalendarDays, CalendarPlus, Camera, Check, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Circle, ClipboardList, Clock, Coffee, Compass,
  Contact, Cookie, Copy, Copyright, Cpu, CreditCard, Database, Download, Edit, Edit2, Edit3, Euro, ExternalLink, Eye, EyeOff, Facebook, File, FileEdit, FilePlus,
  FileText, Filter, Fingerprint, Flag, Folder, FolderOpen, Gamepad2, Gauge, Gavel, GitBranch, Globe, GraduationCap, Handshake, Hash, Heart, HelpCircle, Home,
  Hourglass, Image, ImageUp, Info, Instagram, KeyRound, Languages, LayoutDashboard, LifeBuoy, Lightbulb, LineChart, Link, Link2Off, Linkedin, List, ListChecks,
  ListTodo, Loader2, Lock, LogOut, Mail, MailCheck, MapPin, Menu, MessageCircle, MessageCircleQuestion, MessageSquare, Mic, MicOff, Milestone, Minus, Monitor, Moon,
  MoreVertical, MousePointerClick, Navigation, NotebookPen, Package, Pause, PauseCircle, Pencil, Percent, Phone, PieChart, Play, PlayCircle, Plus, PlusCircle, Power,
  Puzzle, RefreshCw, Repeat, Rocket, RotateCcw, Save, Scale, School, ScrollText, Search, Send, SeparatorHorizontal, SeparatorVertical, Settings, Settings2, Share2,
  Shield, ShieldAlert, ShieldBan, ShoppingBag, ShoppingCart, Shuffle, Siren, SlidersHorizontal, Smile, Sparkles, Star, Stethoscope, Stop, Sun, SunMedium, Target, Telescope,
  ThumbsUp, Timer, Trash, Trash2, TrendingDown, Trophy, Twitter, Upload, User, UserCircle, UserPlus, UserX, Users, Video, Volume2, VolumeOff, Wallet, Wand2, Waves,
  Wrench, X, XCircle,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

// =======================================================
// === HANDMATIGE ALIASES VOOR RUNTIME COMPATIBILITEIT ===
// =======================================================
// Dit lost "ReferenceError: ... is not defined" op.

// Dashboard-sidebar.tsx aliases:
export const FileBarChart = BarChart;
export const UsersIconLucide = Users;
export const BookOpenCheck = BookOpen;
export const MessagesSquareIcon = MessageSquare;
export const HeartHandshake = Handshake;
export const CalendarClock = Calendar;
export const BookUser = BookOpen;
export const PanelLeft = Menu;
export const SaveIcon = Save;
export const BarChartHorizontal = BarChart;

// Andere veelgebruikte aliases:
export const UserCheck = User;
export const ShieldCheck = Shield;
export const Link2 = ExternalLink;
export const BarChart3 = BarChart;
export const BarChartBig = BarChart;
export const CalendarIcon = Calendar;
export const CheckCircle2 = CheckCircle;
export const ClipboardCheck = ClipboardList;
export const ClockIcon = Clock;
export const SettingsIcon = Settings;
export const UserIcon = User;
export const Users2 = Users;
export const UsersIcon = Users;
export const Edit2Icon = Edit2;
export const FileTextIcon = FileText;
export const PlusCircleIcon = PlusCircle;
export const LinkIcon = Link;
export const MessageSquareHeart = Heart;
export const MessageSquarePlus = MessageSquare;
export const MessageSquareText = MessageSquare;
export const Separator = SeparatorHorizontal;

// Fallback voor ontbrekend icon
export const TrendingUp = ArrowUp;

// Type export voor TypeScript
export type IconType = ComponentType<SVGProps<SVGSVGElement>>;


// ===========================================
// === HOOFD EXPORT BLOK VOOR TREE-SHAKING ===
// ===========================================
// Exporteert alle geldige icons uit lucide-react plus de Separator alias.

export {
  // Directe exports uit lucide-react
  Activity, AlertCircle, AlertTriangle, Archive, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Award, BarChart, Bell, BookHeart, BookOpen, Bookmark, Bot, Brain, BrainCircuit, Briefcase,
  Cake, Calendar, CalendarDays, CalendarPlus, Camera, Check, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Circle, ClipboardList, Clock, Coffee, Compass,
  Contact, Cookie, Copy, Copyright, Cpu, CreditCard, Database, Download, Edit, Edit2, Edit3, Euro, ExternalLink, Eye, EyeOff, Facebook, File, FileEdit, FilePlus,
  FileText, Filter, Fingerprint, Flag, Folder, FolderOpen, Gamepad2, Gauge, Gavel, GitBranch, Globe, GraduationCap, Handshake, Hash, Heart, HelpCircle, Home,
  Hourglass, Image, ImageUp, Info, Instagram, KeyRound, Languages, LayoutDashboard, LifeBuoy, Lightbulb, LineChart, Link, Link2Off, Linkedin, List, ListChecks,
  ListTodo, Loader2, Lock, LogOut, Mail, MailCheck, MapPin, Menu, MessageCircle, MessageCircleQuestion, MessageSquare, Mic, MicOff, Milestone, Minus, Monitor, Moon,
  MoreVertical, MousePointerClick, Navigation, NotebookPen, Package, Pause, PauseCircle, Pencil, Percent, Phone, PieChart, Play, PlayCircle, Plus, PlusCircle, Power,
  Puzzle, RefreshCw, Repeat, Rocket, RotateCcw, Save, Scale, School, ScrollText, Search, Send, SeparatorHorizontal, SeparatorVertical, Settings, Settings2, Share2,
  Shield, ShieldAlert, ShieldBan, ShoppingBag, ShoppingCart, Shuffle, Siren, SlidersHorizontal, Smile, Sparkles, Star, Stethoscope, Stop, Sun, SunMedium, Target, Telescope,
  ThumbsUp, Timer, Trash, Trash2, TrendingDown, Trophy, Twitter, Upload, User, UserCircle, UserPlus, UserX, Users, Video, Volume2, VolumeOff, Wallet, Wand2, Waves,
  Wrench, X, XCircle
};
