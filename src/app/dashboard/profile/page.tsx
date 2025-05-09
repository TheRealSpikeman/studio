// src/app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Cake, Save } from 'lucide-react';

// Dummy user data - in a real app, this would come from context/API
const initialUserData = {
  name: "Alex de Tester",
  email: "alex.tester@example.com",
  age: undefined as number | undefined, // Age can be undefined initially
};

export default function ProfilePage() {
  const [userName, setUserName] = useState(initialUserData.name);
  const [userEmail, setUserEmail] = useState(initialUserData.email);
  const [userAge, setUserAge] = useState<string>(initialUserData.age?.toString() || '');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Simulate fetching user data on component mount
  useEffect(() => {
    // In a real app, fetch data here:
    // const fetchedUser = await fetchUserData();
    // setUserName(fetchedUser.name);
    // setUserEmail(fetchedUser.email);
    // setUserAge(fetchedUser.age ? fetchedUser.age.toString() : '');
  }, []);

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers or empty string
    if (/^\d*$/.test(value)) {
      setUserAge(value);
    }
  };

  const handleSaveProfile = () => {
    // TODO: Implement actual backend logic to save user data
    const ageValue = parseInt(userAge, 10);
    if (userAge !== '' && (isNaN(ageValue) || ageValue <= 0 || ageValue > 120)) {
        toast({
            title: "Ongeldige leeftijd",
            description: "Voer een geldige leeftijd in.",
            variant: "destructive",
        });
        return;
    }
    console.log("Profile saved:", { name: userName, email: userEmail, age: userAge ? ageValue : undefined });
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
          Bekijk en bewerk hier je persoonlijke gegevens.
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
            <Input 
              id="userAge" 
              type="text" // Use text to allow empty string and then parse
              inputMode="numeric" // Hint for mobile keyboards
              value={userAge} 
              onChange={handleAgeChange}
              placeholder="Voer je leeftijd in"
              disabled={!isEditing}
              className="mt-1"
            />
             {userAge !== '' && (isNaN(parseInt(userAge, 10)) || parseInt(userAge, 10) <=0 || parseInt(userAge, 10) > 120) && isEditing && (
                <p className="text-sm text-destructive mt-1">Voer een geldige leeftijd in (bijv. 1 tot 120).</p>
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

      {/* Placeholder for other profile sections, e.g., Preferences, Account Security */}
      {/*
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Voorkeuren</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Hier komen instellingen voor bijvoorbeeld notificaties.</p>
        </CardContent>
      </Card>
      */}
    </div>
  );
}
