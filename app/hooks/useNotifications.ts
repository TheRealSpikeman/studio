// src/hooks/useNotifications.ts
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/types/notification';

const READ_NOTIFICATIONS_STORAGE_KEY = 'mindnavigator_read_notifications_v2';

// --- Global State Management ---
interface State {
  notifications: Notification[];
  isLoading: boolean;
}

type Action =
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'MARK_READ'; payload: { id: string } }
  | { type: 'MARK_ALL_READ' };

let memoryState: State = { notifications: [], isLoading: true };
const listeners: Array<(state: State) => void> = [];

const getReadIdsFromStorage = (): Set<string> => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(READ_NOTIFICATIONS_STORAGE_KEY) : null;
      return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
};

const setReadIdsInStorage = (readIds: Set<string>): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(READ_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(Array.from(readIds)));
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload, isLoading: false };
    case 'MARK_READ': {
      const readIds = getReadIdsFromStorage();
      readIds.add(action.payload.id);
      setReadIdsInStorage(readIds);
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload.id ? { ...n, isRead: true } : n
        ),
      };
    }
    case 'MARK_ALL_READ': {
      const readIds = getReadIdsFromStorage();
      state.notifications.forEach(n => n.id && readIds.add(n.id));
      setReadIdsInStorage(readIds);
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      };
    }
    default:
      return state;
  }
};

const dispatch = (action: Action) => {
  memoryState = reducer(memoryState, action);
  listeners.forEach(listener => listener(memoryState));
};

// --- Hook ---

let hasFetchedInitialData = false;

export function useNotifications() {
  const { user } = useAuth();
  const [state, setState] = useState<State>(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const fetchAndProcessNotifications = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const serverNotifications = await notificationService.getAllNotifications();
    const readIds = getReadIdsFromStorage();

    const enrichedNotifications = serverNotifications
      .filter(n => {
        if (!user) return n.targetGroup === 'all';
        return n.targetGroup === 'all' || n.targetGroup === user.role;
      })
      .map(n => ({
        ...n,
        isRead: readIds.has(n.id!),
      }));

    dispatch({ type: 'SET_NOTIFICATIONS', payload: enrichedNotifications });
    hasFetchedInitialData = true;
  }, [user]);

  useEffect(() => {
    // Fetch only on first mount across all components, or when user changes.
    // The state itself is shared, so we don't need to refetch in every component.
    if (!hasFetchedInitialData || state.notifications.length === 0) {
      fetchAndProcessNotifications();
    }
  }, [fetchAndProcessNotifications, user]); // User dependency is important for role filtering

  const markAsRead = useCallback((notificationId: string) => {
    dispatch({ type: 'MARK_READ', payload: { id: notificationId } });
  }, []);

  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_READ' });
  }, []);
  
  const unreadCount = useMemo(() => state.notifications.filter(n => !n.isRead).length, [state.notifications]);

  return {
    notifications: state.notifications,
    unreadCount,
    isLoading: state.isLoading,
    markAsRead,
    markAllAsRead,
    refresh: fetchAndProcessNotifications,
  };
}
