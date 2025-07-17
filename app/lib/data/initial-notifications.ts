// src/lib/data/initial-notifications.ts
import type { AdminNotification } from '@/types/notification';

// This data can be used to seed the Firestore database if needed.
export const initialNotifications: Omit<AdminNotification, 'id' | 'createdAt'>[] = [
  {
    iconName: 'Rocket',
    subject: 'Nieuwe Feature: AI Blog Schrijver!',
    message: 'Genereer nu volledige blogartikelen met onze nieuwe AI-assistent in het admin dashboard.',
    notificationType: 'new_feature',
    targetGroup: 'admins',
    status: 'sent',
    sentAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
  },
  {
    iconName: 'Wrench',
    subject: 'Gepland Onderhoud',
    message: 'Aanstaande donderdag om 02:00 is er kort onderhoud gepland. De downtime zal maximaal 10 minuten zijn.',
    notificationType: 'warning',
    targetGroup: 'all',
    status: 'scheduled',
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(), // In 2 days
  },
  {
    iconName: 'CheckCircle2',
    subject: 'Welkom bij MindNavigator!',
    message: 'Je account is succesvol aangemaakt. Ontdek het platform en start je eerste quiz.',
    notificationType: 'success',
    targetGroup: 'leerlingen',
    status: 'sent',
    sentAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
  },
   {
    iconName: 'Info',
    subject: 'Tip: Wist je dat...',
    message: '...je de quizresultaten kunt downloaden als PDF? Handig om te delen met een begeleider.',
    notificationType: 'info',
    targetGroup: 'all',
    status: 'sent',
    sentAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  },
];
