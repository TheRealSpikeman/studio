// src/app/(auth)/login/page.tsx
"use client";

import { LoginForm } from '@/components/auth/login-form';
import { SiteLogo } from '@/components/common/site-logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <LoginForm />
    </div>
  );
}
