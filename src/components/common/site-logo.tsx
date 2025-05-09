import Link from 'next/link';
import { Brain } from 'lucide-react'; // Using Brain icon as a placeholder

type SiteLogoProps = {
  className?: string;
};

export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-xl font-bold text-primary ${className}`}>
      <Brain className="h-7 w-7" />
      <span>NeuroDiversity Navigator</span>
    </Link>
  );
}
