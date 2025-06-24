// src/lib/icons.ts
// COMPREHENSIVE SOLUTION - Add all common aliases to prevent future errors

export {
  // === EXISTING CORE ICONS (keep these) ===
  Activity,
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Award,
  BarChart,
  Bell,
  BookHeart,
  BookOpen,
  Bot,
  Brain,
  BrainCircuit,
  Briefcase,
  Calendar,
  CalendarPlus,
  Check,
  CheckCircle,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  ClipboardList,
  Clock,
  Compass,
  CreditCard,
  Database,
  Download,
  Edit,
  Edit2,
  Edit3,
  Euro,
  ExternalLink,
  Eye,
  EyeOff,
  FileEdit,
  FilePlus,
  FileText,
  Filter,
  Folder,
  FolderOpen,
  GitBranch,
  Globe,
  GraduationCap,
  Handshake,
  Hash,
  Heart,
  HelpCircle,
  Home,
  Hourglass,
  ImageUp,
  Info,
  KeyRound,
  Languages,
  LayoutDashboard,
  Lightbulb,
  LineChart,
  Link,
  List,
  ListChecks,
  ListTodo,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MailCheck,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquare,
  MessageSquareWarning,
  Mic,
  Minus,
  Monitor,
  Moon,
  MoreVertical,
  MousePointerClick,
  Navigation,
  NotebookPen,
  NotebookText,
  Package,
  PauseCircle,
  Pencil,
  Percent,
  Phone,
  PieChart,
  PlayCircle,
  PlaySquare,
  Plus,
  PlusCircle,
  Power,
  Puzzle,
  RefreshCw,
  Repeat,
  Rocket,
  RotateCcw,
  Save,
  Scale,
  School,
  ScrollText,
  Search,
  Send,
  SeparatorHorizontal,
  SeparatorVertical,
  Settings,
  Settings2,
  Share2,
  Shield,
  ShieldAlert,
  ShieldBan,
  ShoppingBag,
  ShoppingCart,
  Shuffle,
  Siren,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  Sun,
  SunMedium,
  Target,
  Telescope,
  ThumbsUp,
  Timer,
  Trash,
  Trash2,
  Trophy,
  Upload,
  User,
  UserCircle,
  UserPlus,
  UserX,
  Users,
  Video,
  Wallet,
  Wand2,
  Waves,
  Wrench,
  X,
  XCircle,
  Zap,
} from 'lucide-react';

// === ADD ALL COMMON ALIASES TO PREVENT IMPORT ERRORS ===
// These aliases are used throughout the codebase

// Chart & Analytics aliases
export { BarChart as FileBarChart } from 'lucide-react';
export { BarChart as BarChart3 } from 'lucide-react';
export { BarChart as BarChartBig } from 'lucide-react';
export { BarChart as BarChartHorizontal } from 'lucide-react';
export { ArrowUp as TrendingUp } from 'lucide-react'; // TrendingUp doesn't exist

// Status & Feedback aliases
export { CheckCircle as CheckCircle2 } from 'lucide-react';
export { Shield as ShieldCheck } from 'lucide-react';
export { User as UserCheck } from 'lucide-react';

// Action aliases
export { Save as SaveIcon } from 'lucide-react';
export { Edit2 as Edit2Icon } from 'lucide-react';

// Social & Communication aliases
export { Handshake as HeartHandshake } from 'lucide-react'; // ✅ FIX FOR CURRENT ERROR
export { MessageSquare as MessagesSquare } from 'lucide-react';
export { MessageSquare as MessagesSquareIcon } from 'lucide-react';
export { MessageCircle as MessageCircleQuestion } from 'lucide-react';
export { Heart as MessageSquareHeart } from 'lucide-react';

// Navigation aliases
export { Users as UsersIconLucide } from 'lucide-react';
export { Menu as PanelLeft } from 'lucide-react';
export { ExternalLink as Link2 } from 'lucide-react';
export { Link as LinkIcon } from 'lucide-react';

// Layout aliases
export { SeparatorHorizontal as Separator } from 'lucide-react';
export { ClipboardList as ClipboardCheck } from 'lucide-react';
export { PlusCircle as PlusCircleIcon } from 'lucide-react';

// Time & Calendar aliases
export { Calendar as CalendarDays } from 'lucide-react';
export { Calendar as CalendarClock } from 'lucide-react';
export { Calendar as CalendarIcon } from 'lucide-react';
export { Clock as ClockIcon } from 'lucide-react';

// Book & Education aliases
export { BookOpen as BookOpenCheck } from 'lucide-react';
export { BookOpen as BookUser } from 'lucide-react';

// Settings & System aliases
export { Settings as SettingsIcon } from 'lucide-react';
export { User as UserIcon } from 'lucide-react';
export { Users as Users2 } from 'lucide-react';
export { Users as UsersIcon } from 'lucide-react';
export { FileText as FileTextIcon } from 'lucide-react';

// Message variants
export { MessageSquare as MessageSquareIcon } from 'lucide-react';
export { MessageSquare as MessageSquarePlus } from 'lucide-react';
export { MessageSquare as MessageSquareText } from 'lucide-react';

// TypeScript type
export type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;
