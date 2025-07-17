
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

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.3 512 0 398.5 0 256S111.3 0 244 0c71.2 0 130.9 29.1 176.3 75.3l-68.5 63.2C317.8 112.5 282.8 96 244 96c-89.8 0-163.4 73.6-163.4 164s73.6 164 163.4 164c98.2 0 135-70.4 140.8-106.9H244v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.8z"></path>
    </svg>
  );
}

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M12.15,2.56a5.2,5.2,0,0,0-4.33,2.65,5.43,5.43,0,0,0-1.6,4.25,3.64,3.64,0,0,0,.68,2.37,8.3,8.3,0,0,0,2,2.44A10.8,10.8,0,0,0,12,16.35a11.14,11.14,0,0,0,3-1.63,8.59,8.59,0,0,0,2.1-2.61,4.2,4.2,0,0,0-1.46-5.4,5.1,5.1,0,0,0-3.82-1.85A1.36,1.36,0,0,0,12.15,2.56Zm1.48-1.56a4.5,4.5,0,0,1,3.31,1.56,1.4,1.4,0,0,1,.4,1,1.35,1.35,0,0,1-.53.94,4.55,4.55,0,0,1-3.18,1.42A4.4,4.4,0,0,1,9.81,4.6a1.36,1.36,0,0,1-.4-1A1.4,1.4,0,0,1,9.94,2,4.5,4.5,0,0,1,13.63,1Z" />
        </svg>
    );
}

export function LoginForm() {
  const { login, loginWithGoogle, loginWithApple, isLoading: isAuthLoading, isFirebaseConfigured } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "", 
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isFirebaseConfigured) {
        toast({ title: "Configuratie Fout", description: "Kan niet inloggen, Firebase is niet geconfigureerd.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    const success = await login(values.email, values.password);
    if (!success) {
      setIsSubmitting(false);
    }
  }

  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured) {
        toast({ title: "Configuratie Fout", description: "Kan niet inloggen, Firebase is niet geconfigureerd.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    const success = await loginWithGoogle();
    if (!success) {
      setIsSubmitting(false);
    }
  };

  const handleAppleLogin = async () => {
    if (!isFirebaseConfigured) {
      toast({ title: "Configuratie Fout", description: "Kan niet inloggen, Firebase is niet geconfigureerd.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const success = await loginWithApple();
    if (!success) {
      setIsSubmitting(false);
    }
  };


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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mailadres</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="jouw@email.com" {...field} className="pl-10" />
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
                      <Input type={showPassword ? "text" : "password"} placeholder="Wachtwoord" {...field} className="pl-10 pr-10" />
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
            <div className="flex items-center justify-between">
              <div/>
              <Button variant="link" asChild className="px-0 text-sm h-auto py-0">
                <Link href="/forgot-password">Wachtwoord vergeten?</Link>
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || isAuthLoading || !isFirebaseConfigured}>
              {(isSubmitting || isAuthLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Inloggen
            </Button>
          </form>
        </Form>
        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                    Of ga verder met
                </span>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isSubmitting || isAuthLoading || !isFirebaseConfigured}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
            </Button>
            <Button variant="outline" className="w-full" onClick={handleAppleLogin} disabled={isSubmitting || isAuthLoading || !isFirebaseConfigured}>
                <AppleIcon className="mr-2 h-4 w-4" />
                Apple
            </Button>
        </div>
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
