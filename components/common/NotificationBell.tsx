// src/components/common/NotificationBell.tsx
"use client";

import { type ElementType } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, CheckCircle2, Rocket, Wrench, Info, AlertTriangle, Sparkles } from '@/lib/icons';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationType } from '@/types/notification';
import { cn } from '@/lib/utils';


// Map icon names from data to actual components
const iconMap: { [key: string]: ElementType } = {
  Rocket,
  Wrench,
  CheckCircle2,
  Info,
  AlertTriangle,
  Sparkles,
  Bell, // Fallback icon
};

// Define styles for each notification type
const notificationTypeStyles: Record<NotificationType, { unread: string; icon: string }> = {
  info: {
    unread: 'bg-blue-500/10 hover:bg-blue-500/15 border-blue-500/30',
    icon: 'text-blue-500',
  },
  success: {
    unread: 'bg-green-500/10 hover:bg-green-500/15 border-green-500/30',
    icon: 'text-green-500',
  },
  warning: {
    unread: 'bg-orange-500/10 hover:bg-orange-500/15 border-orange-500/30',
    icon: 'text-orange-500',
  },
  new_feature: {
    unread: 'bg-purple-500/10 hover:bg-purple-500/15 border-purple-500/30',
    icon: 'text-purple-500',
  },
};


export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleMarkAllAsReadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    markAllAsRead();
  };

  const handleMarkAsReadClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="flex justify-between items-center px-3 pt-2 pb-1.5">
          Notificaties
           {unreadCount > 0 && <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={handleMarkAllAsReadClick}><CheckCircle2 className="mr-1 h-3 w-3"/>Markeer als gelezen</Button>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2 space-y-2">
          {notifications.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">Geen notificaties.</p>
          ) : (
            notifications.slice(0, 5).map((notification) => { // Show max 5 in dropdown
              const Icon = iconMap[notification.iconName] || Bell;
              const styles = notificationTypeStyles[notification.notificationType] || { unread: 'bg-gray-500/10 hover:bg-gray-500/15 border-gray-500/30', icon: 'text-gray-500' };

              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                      'flex items-start gap-3 p-2.5 cursor-pointer border rounded-md h-auto',
                      !notification.isRead ? styles.unread : 'opacity-70 hover:bg-muted/50 border-border'
                  )}
                  onSelect={(e) => {
                      e.preventDefault();
                      if(notification.id) handleMarkAsReadClick(notification.id);
                  }}
                  style={{ whiteSpace: 'normal' }} // Allow text to wrap
                >
                  <Icon className={cn('h-5 w-5 mt-1 flex-shrink-0', styles.icon)} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{notification.subject}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: nl })}
                    </p>
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="p-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/notifications">Bekijk alle notificaties</Link>
            </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
