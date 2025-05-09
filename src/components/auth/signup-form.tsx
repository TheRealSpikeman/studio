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
import { Mail, Lock, User, Cake } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({ message: "Voer een geldig e-mailadres in." }),
  password: z.string().min(8, { message: "Wachtwoord moet minimaal 8 tekens lang zijn." }),
  confirmPassword: z.string(),
  age: z.coerce.number().int("Leeftijd moet een geheel getal zijn.").min(1, "Leeftijd is vereist.").max(120, "Ongeldige leeftijd."),
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
      age: undefined,
      agreeToTerms: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement actual signup logic, including saving age
    console.log(values);
    // For now, redirect to email verification page
    router.push('/verify-email');
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Account aanmaken</CardTitle>
        <CardDescription>Start je reis met NeuroDiversity Navigator.</CardDescription>
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
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leeftijd</FormLabel>
                  <div className="relative">
                    <Cake className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Je leeftijd"
                        name={field.name}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        disabled={field.disabled}
                        value={field.value ?? ''} // Ensures controlled input, maps undefined to empty string
                        onChange={event => {
                          // RHF's field.onChange expects the actual value type (number for age)
                          // +event.target.value converts empty string to 0, string numbers to numbers
                          field.onChange(+event.target.value);
                        }}
                        className="pl-10"
                      />
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
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Ik ga akkoord met de{' '}
                      <Button variant="link" asChild className="p-0 h-auto">
                        <Link href="/terms">algemene voorwaarden</Link>
                      </Button>
                       {' '}en het{' '}
                       <Button variant="link" asChild className="p-0 h-auto">
                         <Link href="/privacy">privacybeleid</Link>
                       </Button>.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Aanmelden</Button>
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
