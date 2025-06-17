// src/app/(auth)/signup/page.tsx
"use client";

import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { Mail, Lock, User as UserIcon, CalendarIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, subYears, isValid } from 'date-fns';
import { nl } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const calculateAge = (birthdate: Date | undefined): number | null => {
  if (!birthdate || !isValid(birthdate)) return null;
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const m = today.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Naam is vereist."}),
  email: z.string().email({ message: "Voer een geldig e-mailadres in." }),
  birthdate: z.date({
    required_error: "Geboortedatum is vereist.",
    invalid_type_error: "Selecteer een geldige geboortedatum.",
  }),
  password: z.string().min(8, { message: "Wachtwoord moet minimaal 8 tekens lang zijn." }),
  confirmPassword: z.string(),
  isParent: z.boolean().default(false),
  agreeToTerms: z.boolean().refine(value => value === true, {
    message: "Je moet akkoord gaan met de voorwaarden.",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Wachtwoorden komen niet overeen.",
  path: ["confirmPassword"],
});

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      birthdate: undefined,
      password: "",
      confirmPassword: "",
      isParent: true, // Default to parent registration on this page
      agreeToTerms: false,
    },
  });
  
  const watchIsParent = form.watch("isParent");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Signup values:", values);
    const age = calculateAge(values.birthdate);

    // For now, all signups from this page are considered parent signups
    // The age check for parental approval will happen when a *child* is added by the parent.
    // This form is now explicitly for the parent.
    
    console.log("Parent account registration submitted for:", values.email);
    // TODO: Implement actual parent signup logic
    // 1. Call backend to create parent user with 'niet geverifieerd' status.
    // 2. Backend sends verification email.
    // 3. On success, redirect to verify-email page.
    
    let redirectUrl = '/verify-email?newRegistration=true&userType=parent';
    if (plan) {
      redirectUrl += `&plan=${plan}`;
    }
    router.push(redirectUrl);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Account Aanmaken (Ouder)</CardTitle>
          <CardDescription>
            Maak een account aan om MindNavigator voor uw gezin te gebruiken.
            {plan && <span className="block mt-1 text-sm font-medium text-primary">Geselecteerd plan: {plan}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uw volledige naam</FormLabel>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl><Input placeholder="Uw naam" {...field} className="pl-10" /></FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uw e-mailadres</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl><Input placeholder="ouder@email.com" {...field} className="pl-10" /></FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Uw geboortedatum</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: nl })
                              ) : (
                                <span>Kies een datum</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown-buttons"
                            fromYear={1950}
                            toYear={subYears(new Date(), 18).getFullYear()} // Ouders moeten min. 18 zijn
                            initialFocus
                            locale={nl}
                          />
                        </PopoverContent>
                      </Popover>
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
                      <FormControl><Input type="password" placeholder="Minimaal 8 tekens" {...field} className="pl-10" /></FormControl>
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
                      <FormControl><Input type="password" placeholder="Herhaal wachtwoord" {...field} className="pl-10" /></FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="isParent"
                render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 opacity-0 h-0 overflow-hidden">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} defaultChecked={true} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Ik ben een ouder/verzorger</FormLabel>
                        <FormMessage />
                    </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} id="agreeToTerms"/></FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="agreeToTerms" className="cursor-pointer">
                        Ik ga akkoord met de{' '}
                        <Button variant="link" asChild className="p-0 h-auto"><Link href="/terms" target="_blank">algemene voorwaarden</Link></Button>
                        {' '}en het{' '}
                        <Button variant="link" asChild className="p-0 h-auto"><Link href="/privacy" target="_blank">privacybeleid</Link></Button>.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !form.formState.isValid}>
                Ouder Account Aanmaken
              </Button>
              <p className="pt-1 text-xs text-muted-foreground text-center">
                Na aanmelding ontvangt u een e-mail om uw account te verifiëren. Hierna kunt u kinderen toevoegen.
              </p>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Al een account?{' '}
            <Button variant="link" asChild className="px-0"><Link href="/login">Inloggen</Link></Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
