// src/app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Cake, Save, Share2 } from 'lucide-react'; // Added Share2 for social media
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox'; // Added Checkbox

// Dummy user data - in a real app, this would come from context/API
const initialUserData = {
  name: "Alex de Tester",
  email: "alex.tester@example.com",
  age: undefined as number | undefined, // Age can be undefined initially
  socialMedia: [] as string[], // Added socialMedia array
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

export default function ProfilePage() {
  const [userName, setUserName] = useState(initialUserData.name);
  const [userEmail, setUserEmail] = useState(initialUserData.email);
  const [userAge, setUserAge] = useState<string>(initialUserData.age?.toString() || '');
  const [selectedSocialMedia, setSelectedSocialMedia] = useState<string[]>(initialUserData.socialMedia);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Simulate fetching user data on component mount
  useEffect(() => {
    // In a real app, fetch data here:
    // const fetchedUser = await fetchUserData();
    // setUserName(fetchedUser.name);
    // setUserEmail(fetchedUser.email);
    // setUserAge(fetchedUser.age ? fetchedUser.age.toString() : '');
    // setSelectedSocialMedia(fetchedUser.socialMedia || []);
  }, []);

  const handleSocialMediaChange = (socialMediaId: string) => {
    setSelectedSocialMedia(prev => 
      prev.includes(socialMediaId) 
        ? prev.filter(id => id !== socialMediaId) 
        : [...prev, socialMediaId]
    );
  };

  const handleSaveProfile = () => {
    // TODO: Implement actual backend logic to save user data
    const ageValue = userAge ? parseInt(userAge, 10) : undefined;
    
    console.log("Profile saved:", { 
      name: userName, 
      email: userEmail, 
      age: ageValue,
      socialMedia: selectedSocialMedia 
    });
    toast({
      title: "Profiel Opgeslagen",
      description: "Je profielgegevens zijn bijgewerkt.",
      variant: "default",
    });
    setIsEditing(false); // Exit editing mode after save
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Mijn Profiel</h1>
        <p className="text-muted-foreground">
          Bekijk en bewerk hier je persoonlijke gegevens en voorkeuren.
        </p>
      </section>

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
                  {/* <SelectItem value="">Selecteer je leeftijd</SelectItem> // Removed this line */}
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
        {/* Footer might not be needed here if save is global, or add a separate save for this section */}
      </Card>
    </div>
  );
}
