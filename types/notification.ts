// src/types/notification.ts

export type NotificationType = 'info' | 'success' | 'warning' | 'new_feature';
export type NotificationTargetGroup = 'all' | 'ouders' | 'leerlingen' | 'tutors' | 'coaches' | 'admins';

// Dit is het type voor een document in de `notifications` collectie
export interface AdminNotification {
  id?: string; // Firestore document ID, optioneel in data-object
  subject: string;
  message: string;
  targetGroup: NotificationTargetGroup;
  notificationType: NotificationType;
  iconName: string; // Naam van het Lucide-icoon
  status: 'sent' | 'scheduled';
  createdAt: string; // ISO string
  scheduledAt?: string; // ISO string, indien ingepland
  sentAt?: string; // ISO string, wanneer daadwerkelijk verstuurd
}

// Dit is het type dat op de client wordt gebruikt, inclusief de 'isRead' status
export interface Notification extends AdminNotification {
  isRead: boolean;
}
