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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Loader2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email({ message: "Voer een geldig e-mailadres in." }),
  password: z.string().min(1, { message: "Wachtwoord is vereist." }),
});

export function LoginForm() {
  const { login, isFirebaseConfigured } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "leerling@example.com",
      password: "password", // Pre-fill with demo password
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isFirebaseConfigured) {
        toast({ title: "Configuratie Fout", description: "Kan niet inloggen, Firebase is niet geconfigureerd.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    const success = await login(values.email, values.password);
    if (!success) {
      toast({
        title: "Inloggen Mislukt",
        description: "Controleer uw e-mailadres en wachtwoord. Hint: gebruik 'password' als wachtwoord en een van de demo-e-mails (bijv. leerling@example.com).",
        variant: "destructive",
      });
    }
    // No need to set loading to false on success, as the page will redirect.
    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Inloggen</CardTitle>
        <CardDescription>Log in op je MindNavigator account.</CardDescription>
      </CardHeader>
      <CardContent>
        {!isFirebaseConfigured && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Firebase is niet geconfigureerd!</AlertTitle>
            <AlertDescription>
              Vul de `NEXT_PUBLIC_FIREBASE_*` variabelen in het `.env` bestand in om in te loggen.
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mailadres</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="bijv. leerling@example.com" {...field} className="pl-10" />
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
                      <Input type={showPassword ? "text" : "password"} placeholder="Hint: 'password'" {...field} className="pl-10 pr-10" />
                    </FormControl>
                     <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-right">
              <Button variant="link" asChild className="px-0 text-sm">
                <Link href="/forgot-password">Wachtwoord vergeten?</Link>
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !isFirebaseConfigured}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Inloggen
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Nog geen account?{' '}
          <Button variant="link" asChild className="px-0">
            <Link href="/signup">Aanmelden</Link>
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}
