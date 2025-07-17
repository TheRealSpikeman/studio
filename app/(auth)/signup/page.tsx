
// src/app/(auth)/signup/page.tsx
import { Suspense } from 'react';
import { SignupForm } from '@/components/auth/signup-form';
import { SiteLogo } from '@/components/common/site-logo';
import { Skeleton } from '@/components/ui/skeleton';

function SignupPageSkeleton() {
    return (
        <div className="w-full max-w-lg space-y-6">
            <div className="text-center space-y-2">
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto" />
            </div>
            <div className="space-y-6 p-6">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    )
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <Suspense fallback={<SignupPageSkeleton />}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
