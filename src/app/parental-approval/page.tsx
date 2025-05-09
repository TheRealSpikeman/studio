
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, User, ShieldAlert } from "lucide-react";
import { SiteLogo } from "@/components/common/site-logo";

const parentApprovalSchema = z.object({
  parentName: z.string().min(2, { message: "Naam van ouder/verzorger is vereist." }),
  parentEmail: z.string().email({ message: "Voer een geldig e-mailadres in." }),
});

type ParentApprovalFormData = z.infer<typeof parentApprovalSchema>;

// Mapping plan IDs to human-readable names
const planNames: { [key: string]: string } = {
  monthly: "Coaching Maandelijks",
  annual: "Coaching Jaarlijks",
  // Add other plan IDs if necessary
};

export default function ParentalApprovalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");
  const planName = planId ? (planNames[planId] || "Geselecteerd Plan") : "Geselecteerd Plan";
  const { toast } = useToast();

  const form = useForm<ParentApprovalFormData>({
    resolver: zodResolver(parentApprovalSchema),
    defaultValues: {
      parentName: "",
      parentEmail: "",
    },
  });

  const onSubmit = (values: ParentApprovalFormData) => {
    // TODO: Implement actual backend logic to:
    // 1. Securely store this request (e.g., associate with the child's user ID and plan).
    // 2. Send a unique, secure payment link to the parent's email.
    console.log("Parental approval form submitted for new user:", values, "for plan:", planName);
    toast({
      title: "Verzoek verzonden",
      description: `Een betalingsverzoek voor het ${planName} abonnement is naar ${values.parentEmail} gestuurd. Vraag je ouder/verzorger om hun e-mail te controleren.`,
      duration: 7000,
    });
    // TODO: Update child's user record to indicate 'pending_parental_approval' for the plan.
    // Redirect to dashboard or a specific pending page.
    router.push("/dashboard"); 
  };

  if (!planId) {
    // Handle case where planId is missing, though ideally user should always arrive here with one.
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
         <div className="absolute top-8 left-8">
            <SiteLogo />
          </div>
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Fout: Plan niet gespecificeerd</CardTitle>
            <CardDescription>
              Er is geen abonnement geselecteerd. Ga terug en kies een plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/#pricing">Bekijk Prijzen</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-2xl font-bold">Bijna klaar!</CardTitle>
          <CardDescription>
            Je account is aangemaakt! Om je "{planName}" abonnement te activeren, is toestemming en betaling door een ouder/verzorger nodig. Vul hieronder hun gegevens in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="parentName">Naam ouder/verzorger</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="parentName"
                  placeholder="Volledige naam"
                  {...form.register("parentName")}
                  className="pl-10"
                />
              </div>
              {form.formState.errors.parentName && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.parentName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="parentEmail">E-mailadres ouder/verzorger</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="parentEmail"
                  type="email"
                  placeholder="ouder@email.com"
                  {...form.register("parentEmail")}
                  className="pl-10"
                />
              </div>
              {form.formState.errors.parentEmail && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.parentEmail.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Verstuur betalingsverzoek naar ouder
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Geen ouder/verzorger in de buurt? Je kunt deze stap later voltooien via je dashboard.
            <Button variant="link" asChild className="px-0 block mx-auto mt-1">
                <Link href="/dashboard">Ga naar Dashboard</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
