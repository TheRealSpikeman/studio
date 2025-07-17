// src/components/dashboard/results/ClaimReportForm.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, CheckCircle, AlertTriangle } from '@/lib/icons';
import type { QuizResult } from '@/types/dashboard';

export function ClaimReportForm({ result }: { result: QuizResult }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setFeedbackMessage('Vul een geldig e-mailadres in.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setFeedbackMessage('');

    try {
      const response = await fetch('/api/quiz/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, result }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || 'Er is iets misgegaan op de server.');
      }

      setStatus('success');
      setFeedbackMessage('Controleer uw inbox (en spamfolder) voor de link om uw account aan te maken.');
      
    } catch (err) {
      setStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Onbekende fout.';
      setFeedbackMessage(`Fout: ${errorMessage}`);
    }
  };

  if (status === 'success') {
    return (
       <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
          <CardTitle className="text-xl text-green-800 dark:text-green-200">E-mail is onderweg!</CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            {feedbackMessage}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (status === 'error') {
     return (
       <Card className="bg-destructive/5 border-destructive/20 dark:bg-red-950 dark:border-red-800">
        <CardHeader className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-2" />
          <CardTitle className="text-xl text-red-800 dark:text-red-200">Er is een Fout Opgetreden</CardTitle>
          <CardDescription className="text-destructive dark:text-red-300">
            {feedbackMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
            <Button variant="outline" onClick={() => setStatus('idle')}>Probeer het opnieuw</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle>Sla uw Rapport op</CardTitle>
        <CardDescription>
          Voer uw e-mailadres in om dit rapport op te slaan, te printen en toegang te krijgen tot meer tools.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="uw.email@adres.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="pl-10"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={status === 'loading'}>
            {status === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Moment...
              </>
            ) : (
              'Ontvang Volledig Rapport per E-mail'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
