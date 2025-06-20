
// src/app/coach-application/page.tsx
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

export default function CoachApplicationPage() {
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
    console.log("Coach application submitted:", values);
    toast({
      title: "Aanvraag ontvangen!",
      description: "Bedankt voor je aanmelding als coach. Controleer je e-mail voor instructies om je profiel te voltooien.",
      duration: 7000,
    });
    form.reset();
    // router.push('/login?message=coach_application_received'); 
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Word Coach bij MindNavigator</CardTitle>
          <CardDescription>Start hier je aanmelding. Na het invullen van je naam en e-mailadres ontvang je instructies om je profiel verder aan te vullen met je kwalificaties en ervaring.</CardDescription>
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
                      <Input type="email" placeholder="jouw.coach@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                Verstuur aanvraag Coach
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Al een coach account?{' '}
            <Button variant="link" asChild className="px-0">
                <Link href="/login">Inloggen</Link>
            </Button>
          </p>
           <p className="mt-2 text-center text-sm text-muted-foreground">
            <Button variant="link" asChild className="px-0">
                <Link href="/word-coach">Terug naar informatiepagina voor coaches</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
