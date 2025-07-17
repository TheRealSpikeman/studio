import Link from 'next/link';
import { Brain } from '@/lib/icons'; 
import { cn } from '@/lib/utils';

type SiteLogoProps = {
  className?: string;
  iconClassName?: string; 
  textClassName?: string;
  isCollapsed?: boolean;
};

export function SiteLogo({ className, iconClassName, textClassName, isCollapsed = false }: SiteLogoProps) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 text-xl font-bold text-primary', className)}>
      <Brain className={cn("h-7 w-7", iconClassName)} />
      {!isCollapsed && <span className={textClassName}>MindNavigator</span>}
    </Link>
  );
}
