// src/app/parental-approval/page.tsx
'use client'; // Belangrijk: dit markeert het als een Client Component

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
import { Suspense } from 'react'; // Importeer Suspense!

// Dit kan helpen, maar Suspense is de directe oplossing voor de useSearchParams build fout
export const dynamic = 'force-dynamic';

const parentApprovalSchema = z.object({
  parentName: z.string().min(2, { message: "Naam van ouder/verzorger is vereist." }),
  parentEmail: z.string().email({ message: "Voer een geldig e-mailadres in." }),
});

type ParentApprovalFormData = z.infer<typeof parentApprovalSchema>;

// Mapping plan IDs to human-readable names
const planNames: { [key: string]: string } = {
  monthly: "Coaching Maandelijks",
  annual: "Coaching Jaarlijks",
  // Voeg andere plan IDs toe indien nodig
};

// --- NIEUWE COMPONENT voor de inhoud die useSearchParams gebruikt ---
// Deze component bevat de logica en UI van de pagina
function ParentalApprovalContent() {
  // Hooks die client-side toegang nodig hebben
  const router = useRouter();
  const searchParams = useSearchParams(); // useSearchParams wordt hier aangeroepen

  const planId = searchParams.get("plan");
  // Zorg ervoor dat planName 'Geselecteerd Plan' is als planId null is (hoewel we dat hieronder afvangen)
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
    // 3. Create the child's account with status 'pending_parental_approval'
    // 4. Send verification email to child's email (if provided separately, or use parent's email for now if child's email isn't collected yet in this flow)
    console.log("Parental approval form submitted for new user signup:", values, "for plan:", planName);
    toast({
      title: "Verzoek verzonden",
      description: `Een betalingsverzoek voor het ${planName} abonnement is naar ${values.parentEmail} gestuurd. Vraag hen om hun e-mail te controleren. Het account voor de jongere wordt aangemaakt zodra de betaling is voltooid.`,
      duration: 9000,
    });
    // TODO: Update child's user record to indicate 'pending_parental_approval' for the plan.
    // Redirect to a specific pending page or login page after a delay.
    router.push("/verify-email");
  };

  // Deze check blijft belangrijk om een zinvolle foutmelding te tonen als de planId ontbreekt
  // Dit scenario zou idealiter worden voorkomen door de navigatie naar deze pagina.
  // Deze fallback wordt nu getoond zodra de Suspense component geladen is op de client.
  if (!planId) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
         {/* SiteLogo hier laten als je wilt dat deze ook in de foutstaat zichtbaar is */}
         {/* <div className="absolute top-8 left-8">
            <SiteLogo />
          </div> */}
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

  // Hoofdweergave van de pagina
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-primary mb-3" />
        <CardTitle className="text-2xl font-bold">Bijna klaar!</CardTitle>
        <CardDescription>
          Om het "{planName}" abonnement voor je kind te activeren, is jouw toestemming en betaling nodig. Vul hieronder je gegevens in. We sturen je dan een beveiligde link om de betaling af te ronden.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="parentName">Jouw volledige naam (ouder/verzorger)</Label>
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
            <Label htmlFor="parentEmail">Jouw e-mailadres (ouder/verzorger)</Label>
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
            Verstuur betalingsverzoek naar mijn e-mail
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
         Nadat de betaling is voltooid, wordt het account voor je kind aangemaakt en ontvangen zij instructies om in te loggen (indien apart e-mailadres voor kind is opgegeven bij registratie, anders via jouw e-mail).
           <Button variant="link" asChild className="px-0 block mx-auto mt-1">
              <Link href="/">Terug naar home</Link>
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}

// --- De hoofd pagina component dient als wrapper met Suspense ---
// Dit is de component die standaard wordt geëxporteerd voor de route
export default function ParentalApprovalPage() {
  return (
    // De basisstructuur die direct wordt gerenderd (kan ook server-side)
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      {/* Elementen die altijd zichtbaar moeten zijn, ook tijdens het laden */}
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>

      {/* Deel van de pagina dat client-side moet laden en useSearchParams gebruikt */}
      <Suspense fallback={
        // Dit wordt getoond terwijl ParentalApprovalContent wordt geladen
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Laden...</CardTitle>
            <CardDescription>Even geduld aub terwijl we de pagina laden.</CardDescription>
          </CardHeader>
        </Card>
      }>
        {/* Hier wordt de daadwerkelijke inhoud geladen */}
        <ParentalApprovalContent />
      </Suspense>
    </div>
  );
}
