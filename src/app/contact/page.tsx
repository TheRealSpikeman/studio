import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, User, MessageSquareIcon } from 'lucide-react';


// A simple client component for form handling, can be expanded with react-hook-form
function ContactForm() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // TODO: Implement form submission logic (e.g., send email, save to DB)
        alert("Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op.");
        // event.target.reset(); // Optionally reset form
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="name" className="mb-2 block text-sm font-medium">Naam</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="text" id="name" name="name" placeholder="Uw naam" required className="pl-10" />
                </div>
            </div>
            <div>
                <Label htmlFor="email" className="mb-2 block text-sm font-medium">E-mailadres</Label>
                 <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="email" id="email" name="email" placeholder="uw@email.com" required className="pl-10" />
                </div>
            </div>
            <div>
                <Label htmlFor="subject" className="mb-2 block text-sm font-medium">Onderwerp</Label>
                <Input type="text" id="subject" name="subject" placeholder="Onderwerp van uw bericht" required />
            </div>
            <div>
                <Label htmlFor="message" className="mb-2 block text-sm font-medium">Bericht</Label>
                 <div className="relative">
                    <MessageSquareIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea id="message" name="message" rows={5} placeholder="Typ hier uw bericht..." required className="pl-10" />
                </div>
            </div>
            <Button type="submit" className="w-full">Verstuur bericht</Button>
        </form>
    );
}


export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16 lg:py-20">
        <div className="container max-w-2xl">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Neem contact op</CardTitle>
              <CardDescription>Heeft u vragen of opmerkingen? Wij horen graag van u.</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
