
// src/app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Cake, Save, Share2, ImageUp, KeyRound, Eye, EyeOff, Wand2, CreditCard } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import Image from 'next/image';


// Dummy user data - in a real app, this would come from context/API
const initialUserData = {
  name: "Alex de Tester",
  email: "alex.tester@example.com",
  age: 30 as number | undefined, // Default age for adult
  socialMedia: [] as string[],
  profileImageUrl: null as string | null,
  subscription: {
    planName: "Coaching Maandelijks" as string | null,
    status: 'active' as 'none' | 'active' | 'pending_parental_approval' | 'cancelled' | 'past_due',
    nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL') as string | null,
  }
};
// Example for underage pending:
// const initialUserData = {
//   name: "Junior Tester",
//   email: "junior.tester@example.com",
//   age: 15 as number | undefined,
//   socialMedia: [] as string[],
//   profileImageUrl: null as string | null,
//   subscription: {
//     planName: "Coaching Jaarlijks" as string | null,
//     status: 'pending_parental_approval' as 'none' | 'active' | 'pending_parental_approval' | 'cancelled' | 'past_due',
//     nextBillingDate: null, // No billing date until parent approves
//   }
// };


const ageOptions = Array.from({ length: 89 }, (_, i) => (i + 12).toString()); // Ages 12 to 100
const NO_AGE_SPECIFIED_VALUE = "_NO_AGE_SPECIFIED_";

const socialMediaOptions = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'x-twitter', label: 'X (Twitter)' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'snapchat', label: 'Snapchat' },
  { id: 'pinterest', label: 'Pinterest' },
  { id: 'reddit', label: 'Reddit' },
  { id: 'youtube', label: 'YouTube' },
];

const predefinedAvatars = [
  { id: 'avatar1', src: 'https://picsum.photos/seed/avatar1/200/200', alt: 'Abstract geometrisch patroon', hint: 'abstract geometric' },
  { id: 'avatar2', src: 'https://picsum.photos/seed/avatar2/200/200', alt: 'Natuur landschap', hint: 'nature landscape' },
  { id: 'avatar3', src: 'https://picsum.photos/seed/avatar3/200/200', alt: 'Dieren portret', hint: 'animal portrait' },
  { id: 'avatar4', src: 'https://picsum.photos/seed/avatar4/200/200', alt: 'Ruimte en sterrenstelsels', hint: 'space galaxy' },
  { id: 'avatar5', src: 'https://picsum.photos/seed/avatar5/200/200', alt: 'Stadsgezicht skyline', hint: 'city skyline' },
  { id: 'avatar6', src: 'https://picsum.photos/seed/avatar6/200/200', alt: 'Lekker eten', hint: 'food delicious' },
];

export default function ProfilePage() {
  const [userName, setUserName] = useState(initialUserData.name);
  const [userEmail, setUserEmail] = useState(initialUserData.email);
  const [userAge, setUserAge] = useState<string>(initialUserData.age?.toString() || NO_AGE_SPECIFIED_VALUE);
  const [selectedSocialMedia, setSelectedSocialMedia] = useState<string[]>(initialUserData.socialMedia);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(initialUserData.profileImageUrl);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Subscription state
  const [subscriptionPlan, setSubscriptionPlan] = useState(initialUserData.subscription.planName);
  const [subscriptionStatus, setSubscriptionStatus] = useState(initialUserData.subscription.status);
  const [subscriptionNextBillingDate, setSubscriptionNextBillingDate] = useState(initialUserData.subscription.nextBillingDate);


  useEffect(() => {
    // Reset form to initial data when not editing or when component mounts with initial data
    // This is simplified; in a real app, you'd fetch user data and subscription data
    if (!isEditing) {
        setUserName(initialUserData.name);
        setUserEmail(initialUserData.email);
        setUserAge(initialUserData.age?.toString() || NO_AGE_SPECIFIED_VALUE);
        setSelectedSocialMedia(initialUserData.socialMedia);
        setProfileImageUrl(initialUserData.profileImageUrl);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        // Reset subscription details
        setSubscriptionPlan(initialUserData.subscription.planName);
        setSubscriptionStatus(initialUserData.subscription.status);
        setSubscriptionNextBillingDate(initialUserData.subscription.nextBillingDate);
    }
  }, [isEditing]);

  const handleSocialMediaChange = (socialMediaId: string) => {
    setSelectedSocialMedia(prev => 
      prev.includes(socialMediaId) 
        ? prev.filter(id => id !== socialMediaId) 
        : [...prev, socialMediaId]
    );
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
        setIsAvatarDialogOpen(false); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectAvatar = (avatarSrc: string) => {
    setProfileImageUrl(avatarSrc);
    setIsAvatarDialogOpen(false); 
  };

  const handleSaveProfile = () => {
    let ageToSave: number | undefined = undefined;
    if (userAge && userAge !== NO_AGE_SPECIFIED_VALUE) {
      const parsedAge = parseInt(userAge, 10);
      if (!isNaN(parsedAge)) {
        ageToSave = parsedAge;
      }
    }
    
    // TODO: Implement actual backend save logic
    console.log("Profile saved:", { 
      name: userName, 
      email: userEmail, 
      age: ageToSave,
      socialMedia: selectedSocialMedia,
      profileImageUrl: profileImageUrl, 
    });
    toast({
      title: "Profiel Opgeslagen",
      description: "Je profielgegevens zijn bijgewerkt.",
      variant: "default",
    });
    setIsEditing(false); // Exit editing mode after save
  };

  const handleCancelEdit = () => {
    // useEffect will handle resetting fields to initialUserData
    setIsEditing(false);
  };

  function generateStrongPassword(length = 12): string {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{};':\",./<>?";
    const allChars = uppercase + lowercase + numbers + symbols;

    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }

  const handleSuggestPassword = () => {
    const suggested = generateStrongPassword();
    setNewPassword(suggested);
    setConfirmNewPassword(suggested);
    toast({
      title: "Wachtwoord gesuggereerd",
      description: "Een sterk wachtwoord is ingevuld. Kopieer en bewaar het op een veilige plek als je het wilt gebruiken.",
    });
  };

  const handleChangePassword = () => {
    if (!currentPassword) {
      toast({ title: "Fout", description: "Huidig wachtwoord is vereist.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Fout", description: "Nieuw wachtwoord moet minimaal 8 tekens lang zijn.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Fout", description: "Nieuwe wachtwoorden komen niet overeen.", variant: "destructive" });
      return;
    }

    // TODO: Implement actual backend password change logic
    console.log("Password change attempted:", { currentPassword, newPassword });
    toast({
      title: "Wachtwoord Wijziging",
      description: "Wachtwoordwijziging aangevraagd. (Dummy implementatie)",
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };


  const userInitials = userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  const getSubscriptionStatusText = (status: typeof subscriptionStatus) => {
    switch (status) {
      case 'active': return 'Actief';
      case 'pending_parental_approval': return 'Wacht op goedkeuring ouder';
      case 'cancelled': return 'Geannuleerd';
      case 'past_due': return 'Betaling mislukt';
      case 'none':
      default: return 'Geen abonnement';
    }
  };


  return (
    <div className="space-y-8">
      <section className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-foreground">Mijn Profiel</h1>
            <p className="text-muted-foreground">
            Bekijk en bewerk hier je persoonlijke gegevens en voorkeuren.
            </p>
        </div>
        {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
                Profiel Bewerken
            </Button>
        ) : (
            <div className="flex gap-2">
                 <Button onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4"/>
                    Profiel Opslaan
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>
                    Annuleren
                </Button>
            </div>
        )}
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-6 w-6 text-primary" />
            Profielfoto
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Avatar className="h-32 w-32 border-2 border-primary/50 shadow-md">
            <AvatarImage src={profileImageUrl || undefined} alt={userName || 'Profielfoto'} data-ai-hint="profile person" />
            <AvatarFallback className="text-3xl bg-muted">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <ImageUp className="mr-2 h-4 w-4" />
                    Wijzig Foto/Avatar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Profielfoto Wijzigen</DialogTitle>
                    <DialogDescription>
                      Upload een nieuwe foto of kies een van onze avatars.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Upload een foto</h4>
                      <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                        <ImageUp className="mr-2 h-4 w-4" /> Blader door bestanden
                      </Button>
                      <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        onChange={handleProfileImageUpload} 
                        className="hidden" 
                      />
                    </div>
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Of</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold">Kies een avatar</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {predefinedAvatars.map(avatar => (
                            <button
                              key={avatar.id}
                              onClick={() => handleSelectAvatar(avatar.src)}
                              className={`rounded-full overflow-hidden border-2 transition-all hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary
                                ${profileImageUrl === avatar.src ? 'border-primary ring-2 ring-primary scale-105' : 'border-transparent'}`}
                              title={avatar.alt}
                            >
                              <Image 
                                src={avatar.src} 
                                alt={avatar.alt} 
                                width={80} 
                                height={80} 
                                className="aspect-square object-cover" 
                                data-ai-hint={avatar.hint}
                              />
                            </button>
                          ))}
                        </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Annuleren</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {profileImageUrl && (
                <Button variant="destructive" onClick={() => setProfileImageUrl(null)}>
                  Verwijder Foto
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-6 w-6 text-primary" />
            Persoonlijke Gegevens
          </CardTitle>
          <CardDescription>
            Deze informatie helpt ons om je ervaring te personaliseren.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="userName">Volledige Naam</Label>
            <Input 
              id="userName" 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="userEmail">E-mailadres</Label>
            <Input 
              id="userEmail" 
              type="email" 
              value={userEmail} 
              onChange={(e) => setUserEmail(e.target.value)}
              disabled // Email typically not editable for existing accounts
              className="mt-1"
            />
             {!isEditing && <p className="text-xs text-muted-foreground mt-1">E-mailadres kan niet gewijzigd worden.</p>}
          </div>
          <div>
            <Label htmlFor="userAge" className="flex items-center gap-1">
                <Cake className="h-4 w-4 text-muted-foreground"/>
                Leeftijd
            </Label>
            {isEditing ? (
              <Select
                value={userAge === NO_AGE_SPECIFIED_VALUE || userAge === undefined ? NO_AGE_SPECIFIED_VALUE : userAge.toString()} 
                onValueChange={(value) => {
                  setUserAge(value === NO_AGE_SPECIFIED_VALUE ? NO_AGE_SPECIFIED_VALUE : value);
                }}
                disabled={!isEditing}
              >
                <SelectTrigger id="userAge" className="mt-1">
                  <SelectValue placeholder="Selecteer je leeftijd" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_AGE_SPECIFIED_VALUE}>Niet opgegeven</SelectItem>
                  {ageOptions.map(age => (
                    <SelectItem key={age} value={age}>{age}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="userAgeDisplay"
                type="text"
                value={userAge && userAge !== NO_AGE_SPECIFIED_VALUE ? userAge : "Niet opgegeven"}
                disabled
                className="mt-1"
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {isEditing && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-6 w-6 text-primary" />
              Wachtwoord Wijzigen
            </CardTitle>
            <CardDescription>
              Werk hier je accountwachtwoord bij.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="currentPassword">Huidig Wachtwoord</Label>
              <div className="relative mt-1">
                <Input 
                  id="currentPassword" 
                  type={showCurrentPassword ? "text" : "password"} 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? "Verberg huidig wachtwoord" : "Toon huidig wachtwoord"}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="newPassword">Nieuw Wachtwoord</Label>
              <div className="relative mt-1">
                <Input 
                  id="newPassword" 
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="pr-10"
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Verberg nieuw wachtwoord" : "Toon nieuw wachtwoord"}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmNewPassword">Bevestig Nieuw Wachtwoord</Label>
              <div className="relative mt-1">
                <Input 
                  id="confirmNewPassword" 
                  type={showConfirmNewPassword ? "text" : "password"} 
                  value={confirmNewPassword} 
                  onChange={(e) => setConfirmNewPassword(e.target.value)} 
                  className="pr-10"
                  autoComplete="new-password"
                />
                 <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  aria-label={showConfirmNewPassword ? "Verberg bevestig nieuw wachtwoord" : "Toon bevestig nieuw wachtwoord"}
                >
                  {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
             <Button type="button" variant="outline" onClick={handleSuggestPassword} className="w-full sm:w-auto">
                <Wand2 className="mr-2 h-4 w-4" />
                Suggereer Sterk Wachtwoord
            </Button>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button onClick={handleChangePassword}>
                <Save className="mr-2 h-4 w-4" />
                Wachtwoord Opslaan
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-6 w-6 text-primary" />
            Social Media Voorkeuren
          </CardTitle>
          <CardDescription>
            Geef aan welke social media platforms je gebruikt. Deze informatie kan ons helpen relevantere content of functies aan te bieden (optioneel).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialMediaOptions.map(option => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`social-${option.id}`}
                  checked={selectedSocialMedia.includes(option.id)}
                  onCheckedChange={() => isEditing && handleSocialMediaChange(option.id)}
                  disabled={!isEditing}
                />
                <Label 
                  htmlFor={`social-${option.id}`}
                  className={`font-normal ${!isEditing ? 'cursor-not-allowed text-muted-foreground' : 'cursor-pointer'}`}
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
           {!isEditing && selectedSocialMedia.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Nog geen social media voorkeuren opgegeven. Klik op "Profiel Bewerken" om selecties te maken.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Abonnementsgegevens
          </CardTitle>
          <CardDescription>
            Beheer hier je MindNavigator abonnement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subscriptionPlan">Huidig Plan</Label>
            <Input id="subscriptionPlan" value={subscriptionPlan || "Geen"} disabled className="mt-1 bg-muted/30" />
          </div>
          <div>
            <Label htmlFor="subscriptionStatus">Status</Label>
            <Input id="subscriptionStatus" value={getSubscriptionStatusText(subscriptionStatus)} disabled className="mt-1 bg-muted/30" />
          </div>
          {subscriptionStatus === 'active' && subscriptionNextBillingDate && (
            <div>
              <Label htmlFor="subscriptionNextBillingDate">Volgende Factuurdatum</Label>
              <Input id="subscriptionNextBillingDate" value={subscriptionNextBillingDate} disabled className="mt-1 bg-muted/30" />
            </div>
          )}
           {subscriptionStatus === 'pending_parental_approval' && (
             <p className="text-sm text-accent p-3 bg-accent/10 rounded-md border border-accent/30">
               Je abonnement "{subscriptionPlan}" wacht op goedkeuring en betaling door je ouder/verzorger.
               Vraag hen om de e-mail te controleren die we hebben gestuurd.
             </p>
           )}
        </CardContent>
        <CardFooter>
          {subscriptionStatus === 'none' || subscriptionStatus === 'cancelled' || subscriptionStatus === 'past_due' ? (
            <Button asChild className="w-full sm:w-auto">
                <Link href="/#pricing">Bekijk abonnementen</Link>
            </Button>
          ) : subscriptionStatus === 'pending_parental_approval' ? (
            <Button disabled className="w-full sm:w-auto">Wacht op goedkeuring</Button>
          ) : (
            <Button disabled className="w-full sm:w-auto">Beheer abonnement (binnenkort)</Button>
          )}
        </CardFooter>
      </Card>

    </div>
  );
}
