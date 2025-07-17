// src/app/dashboard/admin/subscription-management/new/page.tsx
import { SubscriptionPlanForm } from '@/components/admin/subscription-management/SubscriptionPlanForm';

export default function NewSubscriptionPlanPage() {
  // This page now simply acts as a wrapper for the reusable form component.
  // The 'isNew' prop tells the form to render in "create" mode.
  return <SubscriptionPlanForm isNew={true} />;
}
