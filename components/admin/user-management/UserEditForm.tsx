// components/admin/user-management/UserEditForm.tsx
"use client";

import { useState, useTransition } from 'react';
import type { User, UserStatus } from '@/types/user';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { useToast } from '@/hooks/use-toast';
import { Shield, Mail, Link as LinkIcon, Euro, Cpu, User as UserIcon, Home, MessageSquarePlus } from 'lucide-react';
import { updateUserAction } from '@/dashboard/admin/user-management/_actions';

const userStatuses: UserStatus[] = [
  'actief', 'niet geverifieerd', 'geblokkeerd', 'pending_onboarding', 'pending_approval', 'rejected', 'wacht_op_ouder_goedkeuring',
];

const statusTranslations: Record<UserStatus, string> = {
  'actief': 'Actief', 'niet geverifieerd': 'Niet Geverifieerd', 'geblokkeerd': 'Geblokkeerd',
  'pending_onboarding': 'Onboarding Vereist', 'pending_approval': 'Wacht op Goedkeuring', 'rejected': 'Afgekeurd',
  'wacht_op_ouder_goedkeuring': 'Wacht op Ouderlijke Goedkeuring',
};

interface UserEditFormProps {
    user: User;
}

export function UserEditForm({ user: initialUser }: UserEditFormProps) {
  const [user, setUser] = useState<User>(initialUser);
  const [note, setNote] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [field, subField] = name.split('.');
  
    if (subField) {
      setUser(prevUser => ({
        ...prevUser,
        [field]: {
          // @ts-ignore
          ...prevUser[field],
          [subField]: value,
        },
      }));
    } else {
      setUser(prevUser => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };


  const handleStatusChange = (newStatus: UserStatus) => {
    setUser(prev => ({ ...prev, status: newStatus }));
  };

  const handleSaveChanges = async () => {
    startTransition(async () => {
      const result = await updateUserAction(user.id, user);
      if (result.success) {
        toast({ title: "Succesvol Opgeslagen", description: `Gegevens voor ${user.name} zijn bijgewerkt.`, variant: "success" });
      } else {
        toast({ title: "Opslaan Mislukt", description: result.error, variant: "destructive" });
      }
    });
  };
  
  const handleSaveNote = () => {
    // In a real app, this would call a server action to save the note to a subcollection.
    console.log(`Saving note for user ${user.id}: "${note}"`);
    toast({
        title: "Notitie Opgeslagen (Simulatie)",
        description: `De notitie is toegevoegd aan de historie van de gebruiker.`,
    });
    setNote(''); // Clear the textarea after saving
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left Column */}
      <div className="lg:col-span-2 grid auto-rows-min gap-6">
        <Card>
          <CardHeader>
             <div className="flex items-center gap-3"><UserIcon className="h-6 w-6" /><CardTitle>Profiel</CardTitle></div>
             <CardDescription>Basis profielinformatie van de gebruiker.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="name">Volledige Naam</Label><Input id="name" value={user.name} readOnly /></div>
            <div className="space-y-2"><Label htmlFor="email">E-mailadres</Label><Input id="email" type="email" value={user.email} readOnly /></div>
          </CardContent>
        </Card>
        
        <Card>
          <Accordion type="single" collapsible>
            <AccordionItem value="address">
              <AccordionTrigger className="px-6">
                <div className="flex items-center gap-3"><Home className="h-6 w-6" /><CardTitle>Adresinformatie</CardTitle></div>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <div className="grid gap-4 md:grid-cols-2 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Straat en huisnummer</Label>
                    <Input id="street" name="address.street" value={user.address?.street || ''} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Stad</Label>
                    <Input id="city" name="address.city" value={user.address?.city || ''} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Postcode</Label>
                    <Input id="zip" name="address.zip" value={user.address?.zip || ''} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Land</Label>
                    <Input id="country" name="address.country" value={user.address?.country || ''} onChange={handleInputChange} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card>
           <CardHeader>
             <div className="flex items-center gap-3"><Euro className="h-6 w-6" /><CardTitle>Abonnement & Financiën</CardTitle></div>
             <CardDescription>Overzicht van het huidige abonnement, facturen en betaalmethodes.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">Abonnementsdetails en financiële informatie verschijnt hier.</p>
          </CardContent>
        </Card>

         <Card>
           <CardHeader>
             <div className="flex items-center gap-3"><LinkIcon className="h-6 w-6" /><CardTitle>Gekoppelde Kinderen</CardTitle></div>
             <CardDescription>Overzicht van accounts die aan deze ouder gekoppeld zijn.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">Een lijst met gekoppelde kinderaccounts verschijnt hier.</p>
          </CardContent>
        </Card>
      </div>

      {/* Right Column (Actions, Status & Notes) */}
      <div className="lg:col-span-1 grid auto-rows-min gap-6">
        <Card>
          <CardHeader>
             <div className="flex items-center gap-3"><Shield className="h-6 w-6" /><CardTitle>Account Status & Acties</CardTitle></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label htmlFor="status">Account Status</Label>
              <Select value={user.status} onValueChange={handleStatusChange}>
                <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                <SelectContent>{userStatuses.map(s => <SelectItem key={s} value={s}>{statusTranslations[s]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
             <Button variant="outline" className="w-full"><Mail className="mr-2 h-4 w-4"/> Stuur Wachtwoord Reset</Button>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveChanges} className="w-full" disabled={isPending}>{isPending ? 'Opslaan...' : 'Wijzigingen Opslaan'}</Button>
          </CardFooter>
        </Card>

        <Card>
           <CardHeader>
             <div className="flex items-center gap-3"><MessageSquarePlus className="h-6 w-6" /><CardTitle>Interne Notities</CardTitle></div>
             <CardDescription>Voeg een notitie toe aan de historie van deze gebruiker. Deze notities zijn niet zichtbaar voor de gebruiker.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea placeholder="Typ hier uw notitie..." value={note} onChange={(e) => setNote(e.target.value)} />
             {/* Note history would be displayed here */}
          </CardContent>
           <CardFooter>
            <Button onClick={handleSaveNote} className="w-full" disabled={!note.trim()}>Notitie Opslaan</Button>
          </CardFooter>
        </Card>

         <Card>
           <CardHeader>
             <div className="flex items-center gap-3"><Cpu className="h-6 w-6" /><CardTitle>Technische Data</CardTitle></div>
          </CardHeader>
          <CardContent className="space-y-2">
             <div className="space-y-1"><Label className="text-xs text-muted-foreground">User ID</Label><p className="text-xs font-mono">{user.id}</p></div>
             <div className="space-y-1"><Label className="text-xs text-muted-foreground">Rol</Label><p className="text-xs font-mono">{user.role}</p></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
