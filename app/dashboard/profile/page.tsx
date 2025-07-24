// app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect, useTransition } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from './_actions';
import { updateUserEmail } from './email_actions';
import { changePassword } from './password_actions';
import type { User } from '@/types/user';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRound, Save, KeyRound, Phone, MapPin, Bell, DollarSign, AlertTriangle, Globe } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"


// Helper to parse phone number
const parsePhoneNumber = (phone: string | undefined) => {
    if (phone?.startsWith('+32')) {
        return { countryCode: '+32', number: phone.substring(3) };
    }
    // Default to NL
    if (phone?.startsWith('+31')) {
        return { countryCode: '+31', number: phone.substring(3) };
    }
    return { countryCode: '+31', number: phone || '' };
};

export default function ProfilePage() {
  const { user, isLoading, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showEmailConfirmDialog, setShowEmailConfirmDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: ''});
  const [billingSameAsPersonal, setBillingSameAsPersonal] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '', email: '', 
    phone: { countryCode: '+31', number: '' },
    birthDate: '',
    address: { street: '', city: '', zip: '', country: 'Nederland' },
    billingAddress: { street: '', city: '', zip: '', country: 'Nederland' },
    communicationPreferences: { email: true, sms: false },
  });

  const originalEmail = user?.email || '';

  useEffect(() => {
    if (user) {
      const personalAddress = user.address || { street: '', city: '', zip: '', country: 'Nederland' };
      const billingAddress = user.billingAddress || { street: '', city: '', zip: '', country: 'Nederland' };
      setFormData({
        name: user.name || '', email: user.email || '', 
        phone: parsePhoneNumber(user.phone),
        birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
        address: personalAddress,
        billingAddress: billingAddress,
        communicationPreferences: user.communicationPreferences || { email: true, sms: false },
      });

      const addressesAreSame = JSON.stringify(personalAddress) === JSON.stringify(billingAddress);
      setBillingSameAsPersonal(addressesAreSame);
    }
  }, [user, isEditing]);
  
  useEffect(() => {
    if (billingSameAsPersonal) {
      setFormData(prev => ({...prev, billingAddress: prev.address}));
    }
  }, [billingSameAsPersonal, formData.address]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({...prev, [name]: value}));
  }

  const handlePhoneChange = (part: 'countryCode' | 'number', value: string) => {
    const sanitizedValue = part === 'number' ? value.replace(/\D/g, '') : value;
    setFormData(prev => ({...prev, phone: { ...prev.phone, [part]: sanitizedValue }}));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
  };

  const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, billingAddress: { ...prev.billingAddress, [name]: value } }));
  }

  const handleBillingCountryChange = (value: string) => {
      setFormData(prev => ({...prev, billingAddress: {...prev.billingAddress, country: value}}))
  }
  
  const handleCountryChange = (value: string) => {
      setFormData(prev => ({...prev, address: {...prev.address, country: value}}))
  }

  const handleCommChange = (name: 'email' | 'sms', checked: boolean) => {
    setFormData(prev => ({ ...prev, communicationPreferences: { ...prev.communicationPreferences, [name]: checked } }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    if (formData.email !== originalEmail) {
        setShowEmailConfirmDialog(true);
    } else {
        await saveProfileData();
    }
  };

  const saveProfileData = async (newEmail?: string) => {
    if (!user) return;
    
    const fullPhoneNumber = `${formData.phone.countryCode}${formData.phone.number}`;
    
    const profileData = { 
        ...formData,
        phone: fullPhoneNumber
    };
    delete profileData.email;

    startTransition(async () => {
      let emailResult;
      if (newEmail && newEmail !== originalEmail) {
        emailResult = await updateUserEmail(user.id, newEmail);
        if (!emailResult.success) {
            toast({ title: "Email Wijzigen Mislukt", description: emailResult.error, variant: "destructive" });
            return; 
        }
      }

      // @ts-ignore
      const result = await updateUserProfile(user.id, profileData);
      
      if (result.success) {
        await refreshUser();
        if (emailResult?.success) {
            toast({ title: "Profiel Opgeslagen & Email Verificatie Verzonden", description: "Controleer je nieuwe emailadres om de wijziging te bevestigen.", variant: "default" });
        } else {
            toast({ title: "Profiel Opgeslagen", variant: "default" });
        }
        setIsEditing(false);
      } else {
        toast({ title: "Fout", description: result.error, variant: "destructive" });
      }
    });
  };

  const handleChangePassword = async () => {
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: "Fout", description: "De nieuwe wachtwoorden komen niet overeen.", variant: "destructive" });
      return;
    }
    
    startTransition(async () => {
        const result = await changePassword(user.id, passwordData.newPassword);
        if (result.success) {
            toast({ title: "Wachtwoord Gewijzigd", description: "Je wachtwoord is succesvol bijgewerkt.", variant: "default" });
            setShowPasswordDialog(false);
        } else {
            toast({ title: "Fout", description: result.error, variant: "destructive" });
        }
    })
  }

  const confirmEmailChange = async () => {
      setShowEmailConfirmDialog(false);
      await saveProfileData(formData.email);
  }

  const today = new Date().toISOString().split('T')[0];

  if (isLoading) return <div>Profiel wordt geladen...</div>;

  return (
    <div className="space-y-6">
       <AlertDialog open={showEmailConfirmDialog} onOpenChange={setShowEmailConfirmDialog}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/>Bevestig Email Wijziging</AlertDialogTitle>
            <AlertDialogDescription>
                Je staat op het punt je inlog-e-mailadres te wijzigen van <strong>{originalEmail}</strong> naar <strong>{formData.email}</strong>.
                Na deze wijziging moet je met je nieuwe e-mailadres inloggen. Er wordt een verificatielink naar je nieuwe adres gestuurd.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEmailChange}>Doorgaan</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>

        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Wachtwoord Wijzigen</DialogTitle>
                    <DialogDescription>
                        Voer je nieuwe wachtwoord in om het te wijzigen.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">Nieuw Wachtwoord</Label>
                        <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Bevestig Nieuw Wachtwoord</Label>
                        <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange}/>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Annuleren</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleChangePassword} disabled={isPending}>{isPending ? "Opslaan..." : "Wachtwoord Opslaan"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
            <UserRound className="h-6 w-6 text-primary" />
            Mijn Profiel ({user?.role})
        </h2>
        {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Profiel Bewerken</Button>
        ) : (
            <div className="flex gap-2">
                 <Button onClick={handleSave} disabled={isPending}><Save className="mr-2 h-4 w-4"/>{isPending ? 'Opslaan...' : 'Opslaan'}</Button>
                 <Button variant="outline" onClick={() => setIsEditing(false)}>Annuleren</Button>
            </div>
        )}
      </div>

      <p className="text-muted-foreground">
        Bekijk en bewerk hier je persoonlijke gegevens en voorkeuren.
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 grid auto-rows-min gap-6">
          <Card>
            <CardHeader><CardTitle>Persoonlijke & Adres Informatie</CardTitle></CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                     <div className='flex flex-col items-start'>
                        <span className='font-semibold'>{formData.name}</span>
                        <span className='text-sm text-muted-foreground'>{user?.email}</span>
                     </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-1">
                    <div className="grid gap-4 md:grid-cols-2 pt-4">
                        <div className="space-y-2"><Label htmlFor="name">Volledige Naam</Label><Input id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div className="space-y-2"><Label htmlFor="email">E-mailadres</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} /></div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefoonnummer</Label>
                            <div className="flex gap-2">
                                <Select value={formData.phone.countryCode} onValueChange={(value) => handlePhoneChange('countryCode', value)} disabled={!isEditing}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+31">NL +31</SelectItem>
                                        <SelectItem value="+32">BE +32</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input id="phone" type="tel" value={formData.phone.number} onChange={(e) => handlePhoneChange('number', e.target.value)} disabled={!isEditing} placeholder="612345678" />
                            </div>
                        </div>

                        <div className="space-y-2"><Label htmlFor="birthDate">Geboortedatum</Label><Input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleInputChange} disabled={!isEditing} max={today} /></div>
                        <div className="space-y-2 md:col-span-2"><Label htmlFor="street">Straat en huisnummer</Label><Input id="street" name="street" value={formData.address.street} onChange={handleAddressChange} disabled={!isEditing} placeholder="Voorbeeldstraat 123" /></div>
                        <div className="space-y-2"><Label htmlFor="zip">Postcode</Label><Input id="zip" name="zip" value={formData.address.zip} onChange={handleAddressChange} disabled={!isEditing} placeholder="1234 AB" /></div>
                        <div className="space-y-2"><Label htmlFor="city">Stad</Label><Input id="city" name="city" value={formData.address.city} onChange={handleAddressChange} disabled={!isEditing} placeholder="Amsterdam" /></div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Land</Label>
                            <Select value={formData.address.country} onValueChange={handleCountryChange} disabled={!isEditing}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecteer een land" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Nederland">Nederland</SelectItem>
                                    <SelectItem value="België">België</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 grid auto-rows-min gap-6">
           <Card>
             <CardHeader><CardTitle>Beveiliging</CardTitle></CardHeader>
             <CardContent>
                <Button variant="outline" className="w-full" onClick={() => setShowPasswordDialog(true)}>Wachtwoord Wijzigen</Button>
            </CardContent>
           </Card>

           <Card>
             <CardHeader><CardTitle>Communicatievoorkeuren</CardTitle></CardHeader>
             <CardContent className="space-y-4">
               <div className="flex items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><Label>E-mail Notificaties</Label></div><Switch checked={formData.communicationPreferences.email} onCheckedChange={(c) => handleCommChange('email', c)} disabled={!isEditing} /></div>
               <div className="flex items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><Label>SMS Notificaties</Label></div><Switch checked={formData.communicationPreferences.sms} onCheckedChange={(c) => handleCommChange('sms', c)} disabled={!isEditing} /></div>
             </CardContent>
           </Card>

           <Card>
                <CardHeader>
                    <CardTitle>Abonnement & Facturatie</CardTitle>
                    <CardDescription>
                        Beheer hier je factuurgegevens.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {user?.role !== 'admin' ? (
                    <>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="billingSameAsPersonal" checked={billingSameAsPersonal} onCheckedChange={(checked) => setBillingSameAsPersonal(Boolean(checked))} disabled={!isEditing}/>
                            <Label htmlFor="billingSameAsPersonal" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Mijn factuuradres is hetzelfde als mijn persoonlijke adres.
                            </Label>
                        </div>

                        {!billingSameAsPersonal && (
                            <div className="grid gap-4 pt-4 animate-in fade-in-0">
                                <div className="space-y-2"><Label htmlFor="billingStreet">Straat en huisnummer</Label><Input id="billingStreet" name="street" value={formData.billingAddress.street} onChange={handleBillingAddressChange} disabled={!isEditing} /></div>
                                <div className="space-y-2"><Label htmlFor="billingZip">Postcode</Label><Input id="billingZip" name="zip" value={formData.billingAddress.zip} onChange={handleBillingAddressChange} disabled={!isEditing} /></div>
                                <div className="space-y-2"><Label htmlFor="billingCity">Stad</Label><Input id="billingCity" name="city" value={formData.billingAddress.city} onChange={handleBillingAddressChange} disabled={!isEditing} /></div>
                                <div className="space-y-2">
                                    <Label htmlFor="billingCountry">Land</Label>
                                    <Select value={formData.billingAddress.country} onValueChange={handleBillingCountryChange} disabled={!isEditing}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecteer een land" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Nederland">Nederland</SelectItem>
                                            <SelectItem value="België">België</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </>
                   ) : (
                     <p className="text-sm text-muted-foreground">Admins hebben geen abonnement.</p>
                   )}
                </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
