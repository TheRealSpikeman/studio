// src/app/tutor-application/page.tsx
"use client";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteLogo } from "@/components/common/site-logo";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const applicationSchema = z.object({
  fullName: z.string().min(2, { message: "Volledige naam is vereist." }),
  email: z.string().email({ message: "Voer een geldig e-mailadres in." }),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function TutorApplicationPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const onSubmit = (values: ApplicationFormData) => {
    // TODO: Implement actual backend logic:
    // 1. Save application with status 'pending_onboarding'.
    // 2. Generate temporary password.
    // 3. Create inactive user account.
    // 4. Send email with temporary password and link to /dashboard/tutor/onboarding.
    console.log("Tutor application submitted:", values);
    // Simulate backend processing
    toast({
      title: "Aanvraag ontvangen!",
      description: "Bedankt voor je aanmelding. Controleer je e-mail voor instructies om je profiel te voltooien en je wachtwoord in te stellen.",
      duration: 7000,
    });
    // In a real app, you might redirect to a success page or login page.
    // For now, we'll just reset the form.
    form.reset();
    // Potentially redirect to login page or a specific "check your email" page.
    // router.push('/login?message=tutor_application_received');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Word Tutor bij MindNavigator</CardTitle>
          <CardDescription>Start je aanmelding. Na het invullen van je naam en e-mail ontvang je instructies om je profiel verder aan te vullen.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volledige naam</FormLabel>
                    <FormControl>
                      <Input placeholder="Je volledige naam" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="email" placeholder="jouw@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                Verstuur aanvraag
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Al een tutor account?{' '}
            <Button variant="link" asChild className="px-0">
                <Link href="/login">Inloggen</Link>
            </Button>
          </p>
           <p className="mt-2 text-center text-sm text-muted-foreground">
            <Button variant="link" asChild className="px-0">
                <Link href="/word-tutor">Terug naar informatiepagina</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
