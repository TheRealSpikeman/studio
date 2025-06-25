// src/app/dashboard/layout.tsx
"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Settings, 
  LogOut, 
  BarChart3, 
  Calendar,
  MessageCircle,
  Users as UsersIcon, // Renamed to avoid conflict with User from lucide-react
  Menu,
  Loader2
} from 'lucide-react';

function DashboardLayoutUI({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigation items for MindNavigator
  const navigationItems = [
    {
      name: 'Overzicht',
      href: '/dashboard',
      icon: BarChart3,
    },
    {
      name: 'Sessies',
      href: '/dashboard/sessions',
      icon: Calendar,
    },
    {
      name: 'Coaches',
      href: '/dashboard/coaches',
      icon: UsersIcon,
    },
    {
      name: 'Berichten',
      href: '/dashboard/messages',
      icon: MessageCircle,
    },
    {
      name: 'Profiel',
      href: '/dashboard/profile',
      icon: User,
    }
  ];

  useEffect(() => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleNavigation = (href: string) => {
    router.push(href);
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col",
        "lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-center h-16 px-4 border-b shrink-0">
          <SiteLogo />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2 shrink-0">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => handleNavigation('/dashboard/settings')}
          >
            <Settings className="w-5 h-5 mr-3" />
            Instellingen
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Uitloggen
          </Button>
        </div>
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col h-screen">
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <button
              className="lg:hidden text-gray-500 hover:text-gray-600 p-2 -ml-2"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4 ml-auto">
              <span className="text-sm text-gray-600 hidden sm:block">Welkom terug, {user?.name || 'gast'}!</span>
              {/* Other header items like notifications can go here */}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// The main export wraps the UI in the AuthProvider
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayoutUI>{children}</DashboardLayoutUI>
    </AuthProvider>
  );
}
