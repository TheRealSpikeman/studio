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
import { Mail, Lock, User as UserIcon, CalendarIcon, Loader2, AlertTriangle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, subYears, isValid, differenceInYears } from 'date-fns';
import { nl } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { UserRoleType } from '@/types/user';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const calculateAge = (birthdate: Date | undefined): number | null => {
  if (!birthdate || !isValid(birthdate)) return null;
  return differenceInYears(new Date(), birthdate);
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Naam moet minimaal 2 tekens lang zijn."}),
  email: z.string().email({ message: "Voer een geldig e-mailadres in." }),
  isParent: z.boolean().default(false),
  birthdate: z.date({
    required_error: "Geboortedatum is vereist.",
    invalid_type_error: "Selecteer een geldige geboortedatum.",
  }),
  password: z.string().min(8, { message: "Wachtwoord moet minimaal 8 tekens lang zijn." }),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(value => value === true, {
    message: "Je moet akkoord gaan met de voorwaarden.",
  }),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Wachtwoorden komen niet overeen.",
            path: ["confirmPassword"],
        });
    }
    const age = calculateAge(data.birthdate);
    if (age === null && data.birthdate) { 
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecteer een geldige geboortedatum.",
            path: ["birthdate"],
        });
        return;
    }
    if (age !== null) {
        if (data.isParent) {
            if (age < 18) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Ouders/verzorgers moeten minimaal 18 jaar oud zijn.",
                path: ["birthdate"],
            });
            }
        } else { // Tiener/Jongvolwassene
            if (age < 12) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Je moet minimaal 12 jaar oud zijn om je te registreren.",
                path: ["birthdate"],
            });
            }
        }
    }
});

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, isFirebaseConfigured } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const plan = searchParams.get('plan');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      isParent: false,
      birthdate: undefined,
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });
  
  const watchIsParent = form.watch("isParent");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isFirebaseConfigured) {
        toast({ title: "Configuratie Fout", description: "Kan geen account aanmaken, Firebase is niet geconfigureerd.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    const age = calculateAge(values.birthdate);

    let role: UserRoleType = values.isParent ? 'ouder' : 'leerling';
    let ageGroup: '12-14' | '15-18' | 'adult' | undefined = undefined;

    if (!values.isParent && age !== null) {
        if (age >= 12 && age <= 14) ageGroup = '12-14';
        else if (age >= 15 && age <= 18) ageGroup = '15-18';
        else if (age > 18) ageGroup = 'adult';
    }
    
    const signupData = {
        email: values.email,
        pass: values.password,
        name: values.name,
        role: role,
        ageGroup: ageGroup,
    };
    
    const result = await signup(signupData);

    if (result.success) {
      let redirectUrl = '';
      if (role === 'ouder') {
          redirectUrl = `/verify-email?userType=parent&newRegistration=true`;
          if (plan) redirectUrl += `&plan=${plan}`;
      } else { // leerling
          if (age !== null && age < 16) {
              redirectUrl = `/verify-email?userType=teen&flow=parent_approval_pending&teenEmail=${encodeURIComponent(values.email)}`;
          } else {
              const userType = (age !== null && age >= 18) ? 'adult' : 'teen';
              redirectUrl = `/verify-email?userType=${userType}&newRegistration=true`;
              if (plan) redirectUrl += `&plan=${plan}`;
          }
      }
       router.push(redirectUrl);
    } else {
      toast({
        title: "Registratie Mislukt",
        description: result.error || "Er is een onbekende fout opgetreden. Probeer het opnieuw.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  const currentYear = new Date().getFullYear();
  const defaultParentBirthDate = subYears(new Date(), 30);
  const defaultTeenBirthDate = subYears(new Date(), 15);

  return (
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Account Aanmaken</CardTitle>
          <CardDescription>
            Maak je MindNavigator account. Ben je ouder/verzorger? Vink de optie hieronder aan.
            {plan && <span className="block mt-1 text-sm font-medium text-primary">Geselecteerd plan: {plan}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isFirebaseConfigured && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Firebase is niet geconfigureerd!</AlertTitle>
              <AlertDescription>
                Vul de `NEXT_PUBLIC_FIREBASE_*` variabelen in het `.env` bestand in om een account aan te maken.
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volledige naam</FormLabel>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl><Input placeholder="Je naam" {...field} className="pl-10" /></FormControl>
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
                    <FormLabel>E-mailadres</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl><Input type="email" placeholder="jouw@email.com" {...field} className="pl-10" /></FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isParent"
                render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 py-2">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} id="isParentCheckbox" />
                        </FormControl>
                        <FormLabel htmlFor="isParentCheckbox" className="font-normal cursor-pointer">Ik registreer als ouder/verzorger</FormLabel>
                        <FormMessage />
                    </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Geboortedatum {watchIsParent ? "(van ouder/verzorger)" : "(van tiener/jongere)"}</FormLabel>
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
                            key={watchIsParent ? 'parent-calendar' : 'teen-calendar'}
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            defaultMonth={watchIsParent ? defaultParentBirthDate : defaultTeenBirthDate}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown-buttons"
                            fromYear={watchIsParent ? currentYear - 100 : currentYear - 25}
                            toYear={watchIsParent ? currentYear - 18 : currentYear - 12}
                            initialFocus
                            locale={nl}
                            className="rounded-md border"
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
              <Button type="submit" className="w-full" disabled={isLoading || !isFirebaseConfigured || !form.formState.isValid}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Account Aanmaken
              </Button>
              <p className="pt-1 text-xs text-muted-foreground text-center">
                {watchIsParent 
                  ? "Na aanmelding ontvangt u een e-mail om uw account te verifiëren. Hierna kunt u kinderen toevoegen."
                  : "Afhankelijk van je leeftijd, kan ouderlijke toestemming nodig zijn. Je ontvangt een e-mail om je account te activeren."
                }
              </p>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Al een account?{' '}
            <Button variant="link" asChild className="px-0"><Link href="/login">Inloggen</Link></Button>
          </p>
        </CardContent>
      </Card>
  );
}
