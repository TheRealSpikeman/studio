// src/app/invest/page.tsx
"use client";

import { useState } from 'react';
import { InvestmentProposal } from './InvestmentProposal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteLogo } from '@/components/common/site-logo';
import { KeyRound, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CORRECT_PASSWORD = "MindNavigator2026";

export default function InvestPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      toast({
        title: "Toegang verleend",
        description: "Welkom bij het MindNavigator investeringsvoorstel.",
      });
    } else {
      setError('Ongeldig wachtwoord. Probeer het opnieuw.');
    }
  };

  if (isAuthenticated) {
    return <InvestmentProposal />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <Card className="w-full max-w-md shadow-xl text-center">
        <CardHeader>
          <KeyRound className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl font-bold">Toegang Beveiligd</CardTitle>
          <CardDescription>
            Deze pagina is alleen voor genodigden. Voer het wachtwoord in om verder te gaan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Wachtwoord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center"
            />
            {error && (
              <p className="text-sm text-destructive flex items-center justify-center gap-2">
                <ShieldAlert className="h-4 w-4" /> {error}
              </p>
            )}
            <Button type="submit" className="w-full">
              Bekijk Voorstel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
