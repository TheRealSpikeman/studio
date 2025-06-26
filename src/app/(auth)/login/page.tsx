// src/app/(auth)/login/page.tsx
"use client"; // Make the whole page a client component to use the debug tool easily

import { LoginForm } from '@/components/auth/login-form';
import { SiteLogo } from '@/components/common/site-logo';
import { LoginDebugTest } from '@/components/auth/LoginDebugTest';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <LoginForm />

      {/* Add the debug component below the login form for testing */}
      <div className="mt-8 w-full max-w-2xl">
        <Suspense fallback={<div>Loading Debug Tool...</div>}>
          <LoginDebugTest />
        </Suspense>
      </div>
    </div>
  );
}
