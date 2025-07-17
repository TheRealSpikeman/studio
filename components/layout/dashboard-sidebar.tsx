
// src/components/layout/dashboard-sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteLogo } from '@/components/common/site-logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState, useEffect, Fragment, useMemo } from 'react';
import {
  PanelLeft,
  PanelRight,
} from '@/lib/icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { navItems } from '@/config/dashboard-nav'; // Import centralized nav config

const ONBOARDING_KEY_OUDER = 'onboardingCompleted_ouder_v1';
const ONBOARDING_KEY_LEERLING = 'onboardingCompleted_leerling_v1';

const getInitials = (name?: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

export function SidebarNavContent({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (isCollapsed: boolean) => void; }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const currentDashboardRole = user?.role || 'leerling';
  const [isOuderOnboardingPending, setIsOuderOnboardingPending] = useState(true);
  const [isLeerlingOnboardingPending, setIsLeerlingOnboardingPending] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOuderOnboardingPending(!(localStorage.getItem(ONBOARDING_KEY_OUDER) === 'true'));
      setIsLeerlingOnboardingPending(!(localStorage.getItem(ONBOARDING_KEY_LEERLING) === 'true'));
    }
  }, [currentDashboardRole, pathname]); // Re-check on path change to update sidebar after onboarding

  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => {
      const roleFlags = {
        admin: !!item.adminOnly,
        tutor: !!item.tutorOnly,
        coach: !!item.coachOnly,
        leerling: !!item.leerlingOnly,
        ouder: !!item.ouderOnly,
      };
      const hasNoSpecificRole = Object.values(roleFlags).every(v => !v);
      const isForCurrentRole = hasNoSpecificRole || roleFlags[currentDashboardRole];

      if (!isForCurrentRole) return false;

      if (currentDashboardRole === 'ouder') {
        if (item.alwaysShowWhenOnboarding) return true;
        if (item.isOuderOnboardingLink) return isOuderOnboardingPending;
        return !isOuderOnboardingPending;
      }
      if (currentDashboardRole === 'leerling') {
        if (item.href === '/dashboard/leerling/welcome') return isLeerlingOnboardingPending;
        if (item.href !== '/dashboard/leerling/welcome' && item.leerlingOnly) return !isLeerlingOnboardingPending;
      }
      return true;
    });
  }, [currentDashboardRole, isOuderOnboardingPending, isLeerlingOnboardingPending]);

  const defaultOpenAccordionItems = useMemo(() => {
    const activeParent = filteredNavItems.find(item =>
      item.children?.some(child => pathname.startsWith(child.href))
    );
    return activeParent ? [activeParent.href] : [];
  }, [pathname, filteredNavItems]);

  let currentSectionTitleDisplayed: string | null = null;
  
  const baseLinkClasses = "flex items-center gap-3 rounded-md w-full px-3 py-1.5 text-sm font-medium transition-colors";
  const hoverClasses = "hover:bg-[#f8f9fa] dark:hover:bg-muted";
  const activeLinkClasses = "bg-primary/10 text-primary font-semibold";
  const inactiveLinkClasses = "text-foreground";
  const sublinkInactiveClasses = "text-muted-foreground hover:text-primary";

  return (
    <TooltipProvider>
        <div className="flex h-full max-h-screen flex-col">
        <div className={cn("flex h-16 items-center border-b shrink-0", isCollapsed ? "justify-center px-2" : "px-4")}>
            <SiteLogo isCollapsed={isCollapsed} />
        </div>
        <div className={cn("p-4 border-b shrink-0", isCollapsed && "flex justify-center")}>
             <div className="space-y-1">
                {!isCollapsed && user ? (
                    <>
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
                    </>
                ) : user ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl || undefined} alt={user.name} data-ai-hint="user avatar" />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                ) : null }
             </div>
        </div>
        <ScrollArea className="flex-1">
            <nav className="py-2 pl-2 pr-4 space-y-0.5">
            <Accordion type="multiple" defaultValue={defaultOpenAccordionItems} className="w-full space-y-0.5">
                {filteredNavItems.map((item) => {
                let renderSectionHeader = false;
                if (item.sectionTitle && item.sectionTitle !== currentSectionTitleDisplayed) {
                    renderSectionHeader = true;
                    currentSectionTitleDisplayed = item.sectionTitle;
                }

                const isDirectlyActive = !item.children && pathname === item.href;
                const isParentOfActivePage = item.children?.some(child => pathname.startsWith(child.href));

                const NavItemWrapper = ({ children }: { children: React.ReactNode }) =>
                    isCollapsed ? (
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>{children}</TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-4">
                        {item.label}
                        {item.isNew && <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-300">Nieuw</Badge>}
                        </TooltipContent>
                    </Tooltip>
                    ) : (
                    <>{children}</>
                    );

                return (
                    <Fragment key={item.href}>
                    {renderSectionHeader && !isCollapsed && (
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground/70 tracking-wider px-3 pt-3 pb-1">
                        {item.sectionTitle}
                        </h4>
                    )}
                    {item.children && item.children.length > 0 ? (
                        <AccordionItem value={item.href} className="border-none">
                            <NavItemWrapper>
                                <AccordionTrigger className={cn(
                                    baseLinkClasses, "hover:no-underline",
                                    isCollapsed ? "justify-center" : "justify-between",
                                    isParentOfActivePage && !isCollapsed ? 'text-primary' : 'text-foreground hover:text-primary',
                                    hoverClasses
                                )}>
                                    <div className="flex items-center gap-3">
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                                    </div>
                                    {!isCollapsed && item.isNew && <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 leading-tight bg-green-100 text-green-700 border-green-300">Nieuw</Badge>}
                                </AccordionTrigger>
                            </NavItemWrapper>
                            <AccordionContent className="pt-1 pb-1">
                                <div className={cn("flex flex-col space-y-0.5", !isCollapsed && "border-l-2 border-muted-foreground/30 ml-3 pl-4")}>
                                {item.children.map(child => {
                                    const isChildActive = pathname === child.href;
                                    return (
                                    <Link key={child.href} href={child.href} className={cn(
                                        baseLinkClasses, 'py-1.5',
                                        isChildActive ? activeLinkClasses : cn(sublinkInactiveClasses, 'hover:bg-[#f8f9fa] dark:hover:bg-muted'),
                                        isCollapsed && "justify-center"
                                    )}>
                                        <child.icon className="h-4 w-4 shrink-0" />
                                        {!isCollapsed && <span className="truncate">{child.label}</span>}
                                        {!isCollapsed && child.isNew && <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 leading-tight bg-green-100 text-green-700 border-green-300">Nieuw</Badge>}
                                    </Link>
                                    );
                                })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ) : (
                        <NavItemWrapper>
                            <Link href={item.href} className={cn(
                                baseLinkClasses,
                                isDirectlyActive ? activeLinkClasses : cn(inactiveLinkClasses, hoverClasses),
                                isCollapsed && "justify-center"
                            )}>
                            <item.icon className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                            {!isCollapsed && item.isNew && <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 leading-tight bg-green-100 text-green-700 border-green-300">Nieuw</Badge>}
                            </Link>
                        </NavItemWrapper>
                    )}
                    </Fragment>
                );
                })}
            </Accordion>
            </nav>
        </ScrollArea>
        <div className={cn("mt-auto p-4 border-t shrink-0", isCollapsed && "flex justify-center")}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" className={cn("w-full justify-center", isCollapsed && "w-auto")} onClick={() => setIsCollapsed(!isCollapsed)}>
                        {isCollapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
                        <span className="sr-only">{isCollapsed ? 'Menu uitklappen' : 'Menu inklappen'}</span>
                    </Button>
                </TooltipTrigger>
                {isCollapsed && (
                    <TooltipContent side="right">
                        <p>{isCollapsed ? 'Menu uitklappen' : 'Menu inklappen'}</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </div>
        </div>
    </TooltipProvider>
  );
}

export function DashboardSidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (isCollapsed: boolean) => void; }) {
  return (
    <aside className={cn(
        "hidden md:flex h-screen flex-col fixed inset-y-0 z-40 border-r bg-card transition-all duration-300 ease-in-out print-hide",
        isCollapsed ? "w-20" : "w-72"
    )}>
      <SidebarNavContent isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
    </aside>
  );
}
