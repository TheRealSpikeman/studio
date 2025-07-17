// src/app/dashboard/notifications/page.tsx
"use client";

import { useState, useEffect, type ElementType } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Bell, ArrowLeft, CheckCircle2, Rocket, Wrench, Info, AlertTriangle, Sparkles, Loader2 } from '@/lib/icons';
import { useNotifications } from '@/hooks/useNotifications'; // Import the hook
import type { Notification, NotificationType } from '@/types/notification';

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

export default function AllNotificationsPage() {
  // Use the global state hook
  const { notifications, isLoading, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Alle Notificaties
          </h1>
          <p className="text-muted-foreground">
            Een overzicht van al uw ontvangen berichten en updates.
          </p>
        </div>
        <Button variant="outline" asChild>
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Dashboard
            </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Overzicht</CardTitle>
              <CardDescription>
                {isLoading ? "Notificaties laden..." : `U heeft ${notifications.length} notificaties.`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Alles als gelezen markeren
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
            {!isLoading && notifications.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                U heeft geen notificaties.
              </p>
            )}
            {!isLoading && notifications.map((notification) => {
              const Icon = iconMap[notification.iconName] || Bell;
              const styles = notificationTypeStyles[notification.notificationType] || notificationTypeStyles.info;
              return (
                <div
                  key={notification.id}
                  onClick={() => notification.id && markAsRead(notification.id)}
                  className={cn(
                    "flex items-start gap-4 rounded-lg border p-4 transition-all duration-200",
                    !notification.isRead ? styles.unread : 'opacity-70 hover:opacity-100 border-border bg-card',
                    !notification.isRead && 'cursor-pointer'
                  )}
                >
                  <Icon className={cn('h-6 w-6 mt-1 flex-shrink-0', styles.icon)} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-foreground">{notification.subject}</p>
                      {notification.isRead && (
                        <Badge variant="outline" className="text-xs font-normal">Gelezen</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(notification.createdAt), 'Pp', { locale: nl })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
