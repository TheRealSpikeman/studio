// src/app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Cake, Save, Share2, ImageUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import Image from 'next/image';


// Dummy user data - in a real app, this would come from context/API
const initialUserData = {
  name: "Alex de Tester",
  email: "alex.tester@example.com",
  age: undefined as number | undefined, 
  socialMedia: [] as string[],
  profileImageUrl: null as string | null, // Added profileImageUrl
};

const ageOptions = Array.from({ length: 89 }, (_, i) => (i + 12).toString()); // Ages 12 to 100

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
  const [userAge, setUserAge] = useState<string>(initialUserData.age?.toString() || '');
  const [selectedSocialMedia, setSelectedSocialMedia] = useState<string[]>(initialUserData.socialMedia);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(initialUserData.profileImageUrl);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  // Simulate fetching user data on component mount
  useEffect(() => {
    // In a real app, fetch data here:
    // const fetchedUser = await fetchUserData();
    // setUserName(fetchedUser.name);
    // setUserEmail(fetchedUser.email);
    // setUserAge(fetchedUser.age ? fetchedUser.age.toString() : '');
    // setSelectedSocialMedia(fetchedUser.socialMedia || []);
    // setProfileImageUrl(fetchedUser.profileImageUrl || null);
  }, []);

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
        setIsAvatarDialogOpen(false); // Close dialog after upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectAvatar = (avatarSrc: string) => {
    setProfileImageUrl(avatarSrc);
    setIsAvatarDialogOpen(false); // Close dialog after selection
  };

  const handleSaveProfile = () => {
    const ageValue = userAge ? parseInt(userAge, 10) : undefined;
    
    console.log("Profile saved:", { 
      name: userName, 
      email: userEmail, 
      age: ageValue,
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

  const userInitials = userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';


  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Mijn Profiel</h1>
        <p className="text-muted-foreground">
          Bekijk en bewerk hier je persoonlijke gegevens en voorkeuren.
        </p>
      </section>

      {/* Profile Picture Section */}
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
                    {/* Upload section */}
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
                    
                    {/* Separator */}
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Of
                        </span>
                      </div>
                    </div>

                    {/* Avatar selection section */}
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
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="userAge" className="flex items-center gap-1">
                <Cake className="h-4 w-4 text-muted-foreground"/>
                Leeftijd
            </Label>
            {isEditing ? (
              <Select
                value={userAge}
                onValueChange={setUserAge}
                disabled={!isEditing}
              >
                <SelectTrigger id="userAge" className="mt-1">
                  <SelectValue placeholder="Selecteer je leeftijd" />
                </SelectTrigger>
                <SelectContent>
                  {ageOptions.map(age => (
                    <SelectItem key={age} value={age}>{age}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="userAgeDisplay"
                type="text"
                value={userAge || "Niet opgegeven"}
                disabled
                className="mt-1"
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          {isEditing ? (
            <div className="flex gap-2">
              <Button onClick={handleSaveProfile}>
                <Save className="mr-2 h-4 w-4"/>
                Opslaan
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Annuleren
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Profiel Bewerken
            </Button>
          )}
        </CardFooter>
      </Card>

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
    </div>
  );
}
