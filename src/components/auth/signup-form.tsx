
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, UserCircleIcon } from 'lucide-react'; // Replaced Cake with UserCircleIcon for age group
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ageGroupValues = ["12-14", "15-18", "ouder-18"] as const;

const formSchema = z.object({
  email: z.string().email({ message: "Voer een geldig e-mailadres in." }),
  password: z.string().min(8, { message: "Wachtwoord moet minimaal 8 tekens lang zijn." }),
  confirmPassword: z.string(),
  ageGroup: z.enum(ageGroupValues, {
    required_error: "Selecteer een leeftijdsgroep.",
  }),
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
      ageGroup: undefined, // Will be one of "12-14", "15-18", "ouder-18"
      agreeToTerms: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement actual signup logic:
    // 1. Call backend to create user with 'niet geverifieerd' status.
    // 2. Backend sends verification email.
    // 3. On success, redirect.
    // 4. If ageGroup is "ouder-18", potentially trigger a different flow or require parent details.
    console.log("Signup values (including ageGroup):", values); 
    // For now, redirect to email verification page
    // If a paid plan was selected and user is < 18, redirect to parental approval
    const plan = new URLSearchParams(window.location.search).get('plan');
    if (plan && (values.ageGroup === '12-14' || values.ageGroup === '15-18')) {
        router.push(`/parental-approval?plan=${plan}`);
    } else {
        router.push('/verify-email');
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Account aanmaken</CardTitle>
        <CardDescription>Start je reis met MindNavigator.</CardDescription>
      </CardHeader>
      <CardContent>
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
              name="ageGroup"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="flex items-center gap-1">
                     <UserCircleIcon className="h-4 w-4 text-muted-foreground"/>
                     Leeftijdsgroep
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="12-14" id="age-12-14" />
                        </FormControl>
                        <FormLabel htmlFor="age-12-14" className="font-normal cursor-pointer">
                          Ik ben 12–14 jaar
                          <FormDescription className="!mt-0.5">
                            Kies deze optie als je in groep 8, brugklas of klas 2–3 zit.
                          </FormDescription>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="15-18" id="age-15-18" />
                        </FormControl>
                        <FormLabel htmlFor="age-15-18" className="font-normal cursor-pointer">
                          Ik ben 15–18 jaar
                           <FormDescription className="!mt-0.5">
                            Kies deze optie als je in de bovenbouw zit of je eindexamen doet.
                          </FormDescription>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="ouder-18" id="age-ouder-18" />
                        </FormControl>
                        <FormLabel htmlFor="age-ouder-18" className="font-normal cursor-pointer">
                          Ik ben ouder dan 18 jaar (ouder/verzorger)
                          <FormDescription className="!mt-0.5">
                            Selecteer dit als u een ouder/verzorger bent die een account aanmaakt.
                          </FormDescription>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
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
              Aanmelden
            </Button>
            <p className="pt-1 text-xs text-muted-foreground text-center">
              Na aanmelding ontvang je een e-mail om je account te verifiëren.
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

