
// src/app/parental-approval/page.tsx
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Mail, Lock, User as UserIcon, ShieldCheck, Info, ExternalLink, AlertTriangle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SiteLogo } from '@/components/common/site-logo';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import { Suspense } from 'react';

const parentApprovalFormSchema = z.object({
  parentName: z.string().min(2, { message: "Uw volledige naam is vereist." }),
  parentEmail: z.string().email({ message: "Voer een geldig e-mailadres in." }),
  parentPassword: z.string().min(8, { message: "Wachtwoord moet minimaal 8 tekens lang zijn." }),
  confirmParentPassword: z.string(),
  agreeToTerms: z.boolean().refine(value => value === true, {
    message: "U moet akkoord gaan met de voorwaarden.",
  }),
}).refine(data => data.parentPassword === data.confirmParentPassword, {
  message: "Wachtwoorden komen niet overeen.",
  path: ["confirmParentPassword"],
});

type ParentApprovalFormData = z.infer<typeof parentApprovalFormSchema>;

function ApprovalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teenEmail = searchParams.get("teenEmail"); 
  const teenName = searchParams.get("teenName") || "Uw kind"; 
  // const approvalToken = searchParams.get("token"); // Zou gebruikt worden voor backend validatie

  const form = useForm<ParentApprovalFormData>({
    resolver: zodResolver(parentApprovalFormSchema),
    defaultValues: {
      parentName: "",
      parentEmail: "",
      parentPassword: "",
      confirmParentPassword: "",
      agreeToTerms: false,
    },
  });

  function onSubmit(values: ParentApprovalFormData) {
    console.log("Parent approval and account creation (simulation):", values, "for teen:", teenEmail);
    // TODO: Implement actual backend logic:
    // 1. Validate approvalToken (if used).
    // 2. Create parent user account (status 'niet geverifieerd').
    // 3. Update teen's account status to 'actief' (of 'wacht_op_eigen_verificatie' als tiener ook moet verifiëren).
    // 4. Link parent and teen accounts.
    // 5. Send verification email to parent.
    // 6. Redirect parent to /verify-email.

    // Simulate success:
    router.push(`/verify-email?parentApproved=true&teenEmail=${encodeURIComponent(teenEmail || 'onbekend')}&userType=parent&newRegistration=true`);
  }
  
  if (!teenEmail) { 
    return (
        <Card className="w-full max-w-lg shadow-xl text-center">
            <CardHeader>
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-3" />
                <CardTitle className="text-2xl font-bold text-destructive">Ongeldige Link</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Deze goedkeuringslink is niet compleet. De informatie over het kind ontbreekt. Vraag uw kind om de uitnodiging opnieuw te sturen of neem contact op met support.
                </p>
                <Button asChild className="mt-6"><Link href="/">Terug naar Home</Link></Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardHeader className="text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-primary mb-3" />
        <CardTitle className="text-2xl font-bold">Goedkeuring & Ouder Account Aanmaken</CardTitle>
        <CardDescription>
          {teenName} ({teenEmail}) wil graag MindNavigator gebruiken. Geef hieronder toestemming en maak uw eigen ouderaccount aan om {teenName} te ondersteunen.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="default" className="bg-primary/5 border-primary/20 text-primary-foreground">
          <Info className="h-5 w-5 !text-primary" />
          <AlertTitleUi className="text-primary font-semibold">Over MindNavigator</AlertTitleUi>
          <AlertDescription className="text-foreground/80">
            MindNavigator helpt jongeren (12-18 jaar) hun neurodiversiteit te begrijpen en te benutten via zelfreflectie tools en coaching. We bieden een veilige omgeving voor zelfontdekking.
            Lees meer op onze <Link href="/about" target="_blank" className="font-semibold underline hover:text-primary/80">Over Ons</Link> pagina en bekijk ons <Link href="/privacy" target="_blank" className="font-semibold underline hover:text-primary/80">Privacybeleid</Link>.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="parentName"
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
              name="parentEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uw e-mailadres</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl><Input type="email" placeholder="ouder@email.com" {...field} className="pl-10" /></FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wachtwoord voor uw ouderaccount</FormLabel>
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
              name="confirmParentPassword"
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
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} id="agreeToTermsParent"/></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="agreeToTermsParent" className="cursor-pointer">
                      Ik geef toestemming voor het gebruik van MindNavigator door {teenName} en ik ga akkoord met de{' '}
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
              Goedkeuren & Ouder Account Aanmaken
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col items-center text-center space-y-1">
         <p className="text-xs text-muted-foreground">
          Na het aanmaken van uw account, dient u uw e-mailadres te verifiëren.
        </p>
        <p className="text-xs text-muted-foreground">
          Vragen? <Link href="/contact" className="underline hover:text-primary">Neem contact op</Link>.
        </p>
      </CardFooter>
    </Card>
  );
}

export default function ParentalApprovalPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <Suspense fallback={<div>Pagina laden...</div>}>
        <ApprovalContent />
      </Suspense>
    </div>
  );
}
