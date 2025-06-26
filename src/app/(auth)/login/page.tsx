import { LoginForm } from '@/components/auth/login-form';
import { SiteLogo } from '@/components/common/site-logo';
import Link from 'next/link';
import { LoginDebugTest } from '@/components/auth/LoginDebugTest';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <LoginForm />
      <div className="mt-8 w-full max-w-2xl">
        <LoginDebugTest />
      </div>
    </div>
  );
}
