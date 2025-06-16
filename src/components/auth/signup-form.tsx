// src/components/auth/signup-form.tsx
"use client";

import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({ message: "Voer een geldig e-mailadres in." }),
  password: z.string().min(8, { message: "Wachtwoord moet minimaal 8 tekens lang zijn." }),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(value => value === true, {
    message: "Je moet akkoord gaan met de voorwaarden.",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Wachtwoorden komen niet overeen.",
  path: ["confirmPassword"],
});

export function SignupForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Signup values (parent registration):", values);
    // TODO: Implement actual signup logic:
    // 1. Call backend to create parent user with 'niet geverifieerd' status.
    // 2. Backend sends verification email.
    // 3. On success, redirect to verify-email page.
    // 4. After verification, parent can add children and manage subscriptions from their dashboard.
    
    const plan = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get('plan') : null;
    if (plan) {
        // Ouder registreert met een specifiek plan intentie
        // De daadwerkelijke plan-activatie en betaling gebeurt na e-mail verificatie en inloggen in het dashboard.
        router.push(`/verify-email?plan=${plan}&newRegistration=true`);
    } else {
        // Standaard ouder registratie zonder directe plan selectie
        router.push('/verify-email?newRegistration=true');
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Ouder Account Aanmaken</CardTitle>
        <CardDescription>Start hier om MindNavigator voor uw gezin te gebruiken.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uw e-mailadres</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="ouder@email.com" {...field} className="pl-10" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wachtwoord</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input type="password" placeholder="Minimaal 8 tekens" {...field} className="pl-10" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bevestig wachtwoord</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input type="password" placeholder="Herhaal wachtwoord" {...field} className="pl-10" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="agreeToTerms"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="agreeToTerms" className="cursor-pointer">
                      Ik ga akkoord met de{' '}
                      <Button variant="link" asChild className="p-0 h-auto">
                        <Link href="/terms" target="_blank">algemene voorwaarden</Link>
                      </Button>
                       {' '}en het{' '}
                       <Button variant="link" asChild className="p-0 h-auto">
                         <Link href="/privacy" target="_blank">privacybeleid</Link>
                       </Button>.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !form.formState.isValid}>
              Ouderaccount Aanmaken
            </Button>
            <p className="pt-1 text-xs text-muted-foreground text-center">
              Na aanmelding ontvangt u een e-mail om uw account te verifiëren.
            </p>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Al een account?{' '}
          <Button variant="link" asChild className="px-0">
            <Link href="/login">Inloggen</Link>
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}
