import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { SiteLogo } from '@/components/common/site-logo';

// A simple client component for form handling, can be expanded with react-hook-form
function ForgotPasswordForm() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // TODO: Implement forgot password logic (e.g., send reset link)
        alert("Als dit e-mailadres in ons systeem voorkomt, is er een link voor het opnieuw instellen van het wachtwoord verzonden.");
        // event.target.reset(); // Optionally reset form
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="email" className="mb-2 block text-sm font-medium">E-mailadres</Label>
                 <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="email" id="email" name="email" placeholder="Voer uw e-mailadres in" required className="pl-10" />
                </div>
            </div>
            <Button type="submit" className="w-full">Verstuur resetlink</Button>
        </form>
    );
}


export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Wachtwoord vergeten?</CardTitle>
          <CardDescription>
            Voer uw e-mailadres in. Als het account bestaat, sturen we u een link om uw wachtwoord opnieuw in te stellen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Weet u het weer?{' '}
            <Button variant="link" asChild className="px-0">
                <Link href="/login">Terug naar Inloggen</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
