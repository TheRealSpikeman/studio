// src/app/contact/page.tsx
"use client"; 

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, User, MessageSquare as MessageSquareIcon, ListFilter } from '@/lib/icons';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const contactCategories = [
    { value: "algemeen", label: "Algemene Vraag" },
    { value: "technisch", label: "Technisch Probleem" },
    { value: "feedback", label: "Feedback & Suggesties" },
    { value: "abonnementen", label: "Abonnementen & Betalingen" },
    { value: "partnerschap", label: "Partnerschap & Samenwerking" },
    { value: "anders", label: "Anders..." },
];

const MAX_MESSAGE_LENGTH = 1000;

function ContactForm() {
    const { toast } = useToast();
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [messageLength, setMessageLength] = useState(0);
    
    const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageLength(event.target.value.length);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const category = selectedCategory;
        const message = formData.get('message') as string;

        console.log("Contact form submission (simulated):", { name, email, category, subject, message });
        
        toast({
          title: "Bericht Ontvangen!",
          description: "Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.",
          variant: "default", 
        });
        
        event.currentTarget.reset(); 
        setSelectedCategory(undefined); 
        setMessageLength(0);
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
                <Label htmlFor="category" className="mb-2 block text-sm font-medium">Categorie van uw vraag</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory} name="category">
                    <SelectTrigger className="pl-10 relative">
                         <ListFilter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <SelectValue placeholder="Selecteer een categorie" />
                    </SelectTrigger>
                    <SelectContent>
                        {contactCategories.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="subject" className="mb-2 block text-sm font-medium">Onderwerp</Label>
                <Input type="text" id="subject" name="subject" placeholder="Onderwerp van uw bericht" required />
            </div>
            <div>
                <div className="flex justify-between items-baseline">
                    <Label htmlFor="message" className="mb-2 block text-sm font-medium">Bericht</Label>
                    <span className="text-xs text-muted-foreground">
                        {messageLength}/{MAX_MESSAGE_LENGTH}
                    </span>
                </div>
                 <div className="relative">
                    <MessageSquareIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea 
                        id="message" 
                        name="message" 
                        rows={5} 
                        placeholder="Typ hier uw bericht..." 
                        required 
                        className="pl-10"
                        maxLength={MAX_MESSAGE_LENGTH}
                        onChange={handleMessageChange} 
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Maximaal {MAX_MESSAGE_LENGTH} tekens toegestaan.</p>
            </div>
            <Button type="submit" className="w-full">Verstuur bericht</Button>
        </form>
    );
}


export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center py-12 md:py-16 lg:py-20 bg-gradient-to-b from-background via-secondary/10 to-background">
        <div className="container max-w-2xl">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <Mail className="mx-auto h-12 w-12 text-primary mb-3" />
              <CardTitle className="text-3xl font-bold">Neem contact op</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">Heeft u vragen of opmerkingen? Wij horen graag van u.</CardDescription>
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
