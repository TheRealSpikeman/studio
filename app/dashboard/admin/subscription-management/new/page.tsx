// app/dashboard/admin/subscription-management/new/page.tsx
"use client";

import { SubscriptionPlanForm } from '@/components/admin/subscription-management/SubscriptionPlanForm';

export default function NewSubscriptionPlanPage() {
  // This page is now a client component to be consistent with the rest of the flow.
  // The form component handles all logic internally.
  return (
    <SubscriptionPlanForm 
        isNew={true}
    />
  );
}
