
"use client";

import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, User as UserIcon, Loader2, AlertTriangle, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { UserRoleType } from '@/types/user';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LegalDocumentDialog } from '@/components/common/LegalDocumentDialog';
import { PrivacyPolicyContent, TermsContent } from '@/components/legal/LegalContent';

const formSchema = z.object({
  userType: z.enum(['ouder', 'leerling_12_15', 'leerling_16_18'], {
    required_error: "Selecteer een accounttype.",
  }),
  name: z.string().min(2, { message: "Naam moet minimaal 2 tekens lang zijn."}),
  email: z.string().email({ message: "Voer een geldig e-mailadres in." }),
  parentEmail: z.string().email({ message: "Voer een geldig e-mailadres van een ouder in." }).optional().or(z.literal('')),
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
    if (data.userType === 'leerling_12_15') {
        if (!data.parentEmail || data.parentEmail.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "E-mailadres van een ouder/verzorger is vereist voor gebruikers onder de 16.",
                path: ["parentEmail"],
            });
        }
    }
});


export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, isFirebaseConfigured } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const plan = searchParams.get('plan');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: undefined,
      name: "",
      email: "",
      parentEmail: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });
  
  const watchUserType = form.watch("userType");
  const requiresParentalConsent = watchUserType === 'leerling_12_15';

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isFirebaseConfigured) {
        toast({ title: "Configuratie Fout", description: "Kan geen account aanmaken, Firebase is niet geconfigureerd.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    
    let role: UserRoleType = values.userType === 'ouder' ? 'ouder' : 'leerling';
    let ageGroup: '12-14' | '15-18' | 'adult' | undefined = undefined;

    if (values.userType === 'leerling_12_15') ageGroup = '12-14';
    if (values.userType === 'leerling_16_18') ageGroup = '15-18';
    
    const signupData = {
        email: values.email,
        pass: values.password,
        name: values.name,
        role: role,
        ageGroup: ageGroup,
        parentEmail: requiresParentalConsent ? values.parentEmail : undefined
    };
    
    const result = await signup(signupData);

    if (result.success) {
      let redirectUrl = '';
      if (role === 'ouder') {
          redirectUrl = `/verify-email?userType=parent&newRegistration=true`;
          if (plan) redirectUrl += `&plan=${plan}`;
      } else { // leerling
          if (requiresParentalConsent) {
              // Redirect to parental approval pending page
              redirectUrl = `/verify-email?userType=teen&flow=parent_approval_pending&teenEmail=${encodeURIComponent(values.email)}`;
          } else {
              const userType = ageGroup === '15-18' ? 'teen' : 'adult';
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

  return (
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Account Aanmaken</CardTitle>
          <CardDescription>
            Maak je MindNavigator account.
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
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ik ben een...</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer een accounttype" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="leerling_12_15">Leerling (12-15 jaar)</SelectItem>
                        <SelectItem value="leerling_16_18">Leerling (16-18 jaar)</SelectItem>
                        <SelectItem value="ouder">Ouder / Verzorger</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
             
              {requiresParentalConsent && (
                 <FormField
                    control={form.control}
                    name="parentEmail"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>E-mailadres Ouder/Verzorger</FormLabel>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <FormControl><Input type="email" placeholder="ouder@email.com" {...field} className="pl-10" /></FormControl>
                        </div>
                        <FormDescription className="text-xs">
                            We sturen een e-mail naar dit adres om toestemming te vragen voor je account.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wachtwoord</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl><Input type={showPassword ? 'text' : 'password'} placeholder="Minimaal 8 tekens" {...field} className="pl-10 pr-10" /></FormControl>
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bevestig wachtwoord</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl><Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Herhaal wachtwoord" {...field} className="pl-10 pr-10" /></FormControl>
                       <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Verberg bevestig wachtwoord" : "Toon bevestig wachtwoord"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
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
                        <LegalDocumentDialog
                            title="Algemene Voorwaarden"
                            triggerNode={<Button type="button" variant="link" asChild className="p-0 h-auto -my-1"><span className="cursor-pointer">algemene voorwaarden</span></Button>}
                        >
                            <TermsContent />
                        </LegalDocumentDialog>
                        {' '}en het{' '}
                        <LegalDocumentDialog
                            title="Privacybeleid"
                            triggerNode={<Button type="button" variant="link" asChild className="p-0 h-auto -my-1"><span className="cursor-pointer">privacybeleid</span></Button>}
                        >
                            <PrivacyPolicyContent />
                        </LegalDocumentDialog>.
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
