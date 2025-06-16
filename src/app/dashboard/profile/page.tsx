// src/app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Cake, Save, ImageUp, KeyRound, Eye, EyeOff, Wand2, CreditCard, Settings, BookOpenCheck, Languages, Calculator, Globe, FlaskConical, History, Briefcase, School, Users as UsersLucide, GraduationCap, Contact } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import Image from 'next/image';
import Link from 'next/link';
import { useDashboardRole, UserRoleType } from '@/contexts/DashboardRoleContext';

const initialUserData = {
  name: "Alex de Tester",
  email: "alex.tester@example.com",
  age: 16 as number | undefined, // Example age
  ageGroup: '15-18' as '12-14' | '15-18' | 'adult',
  profileImageUrl: null as string | null,
  subscription: {
    planName: "Coaching Maandelijks" as string | null,
    status: 'active' as 'none' | 'active' | 'pending_parental_approval' | 'cancelled' | 'past_due',
    nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL') as string | null,
  },
  schoolName: 'Voorbeeld School',
  className: 'Klas 3B',
  schoolType: 'HAVO',
  helpSubjects: ['wiskunde', 'nederlands'] as string[],
};

const profileAgeOptions = Array.from({ length: (80 - 12) + 1 }, (_, i) => (i + 12).toString());
const NO_AGE_SPECIFIED_VALUE = "_NO_AGE_SPECIFIED_";

const predefinedAvatars = [
  { id: 'avatar1', src: 'https://placehold.co/200x200.png?text=A1', alt: 'Abstract geometrisch patroon', hint: 'abstract geometric' },
  { id: 'avatar2', src: 'https://placehold.co/200x200.png?text=A2', alt: 'Natuur landschap', hint: 'nature landscape' },
  { id: 'avatar3', src: 'https://placehold.co/200x200.png?text=A3', alt: 'Dieren portret', hint: 'animal portrait' },
  { id: 'avatar4', src: 'https://placehold.co/200x200.png?text=A4', alt: 'Ruimte en sterrenstelsels', hint: 'space galaxy' },
  { id: 'avatar5', src: 'https://placehold.co/200x200.png?text=A5', alt: 'Stadsgezicht skyline', hint: 'city skyline' },
  { id: 'avatar6', src: 'https://placehold.co/200x200.png?text=A6', alt: 'Lekker eten', hint: 'food delicious' },
];

const allHomeworkSubjects = [
  { id: 'nederlands', name: 'Nederlands', icon: Languages },
  { id: 'wiskunde', name: 'Wiskunde', icon: Calculator },
  { id: 'engels', name: 'Engels', icon: Languages },
  { id: 'geschiedenis', name: 'Geschiedenis', icon: History },
  { id: 'biologie', name: 'Biologie', icon: FlaskConical },
  { id: 'aardrijkskunde', name: 'Aardrijkskunde', icon: Globe },
  { id: 'natuurkunde', name: 'Natuurkunde', icon: FlaskConical },
  { id: 'scheikunde', name: 'Scheikunde', icon: FlaskConical },
  { id: 'economie', name: 'Economie', icon: UsersLucide },
  { id: 'frans', name: 'Frans', icon: Languages },
  { id: 'duits', name: 'Duits', icon: Languages },
];
const LOCAL_STORAGE_HIDDEN_SUBJECTS_KEY = 'mindnavigator_hidden_subjects';
const schoolTypes = ["VMBO-T", "HAVO", "VWO", "Gymnasium", "Praktijkonderwijs", "Speciaal Onderwijs", "Anders"];


export default function ProfilePage() {
  const { currentDashboardRole } = useDashboardRole();

  const [userName, setUserName] = useState(initialUserData.name);
  const [userEmail, setUserEmail] = useState(initialUserData.email);
  const [userAgeString, setUserAgeString] = useState<string>(initialUserData.age?.toString() || NO_AGE_SPECIFIED_VALUE);
  const [userAgeGroup, setUserAgeGroup] = useState<'12-14' | '15-18' | 'adult'>(initialUserData.ageGroup);

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

  const [hiddenHomeworkSubjects, setHiddenHomeworkSubjects] = useState<string[]>([]);

  const [schoolName, setSchoolName] = useState(initialUserData.schoolName);
  const [className, setClassName] = useState(initialUserData.className);
  const [schoolType, setSchoolType] = useState(initialUserData.schoolType);
  const [helpSubjects, setHelpSubjects] = useState<string[]>(initialUserData.helpSubjects);

  useEffect(() => {
    if (!isEditing) {
        setUserName(initialUserData.name);
        setUserEmail(initialUserData.email);
        setUserAgeString(initialUserData.age?.toString() || NO_AGE_SPECIFIED_VALUE);
        setUserAgeGroup(initialUserData.ageGroup);
        setProfileImageUrl(initialUserData.profileImageUrl);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        if (currentDashboardRole === 'leerling') {
            setSchoolName(initialUserData.schoolName);
            setClassName(initialUserData.className);
            setSchoolType(initialUserData.schoolType);
            setHelpSubjects(initialUserData.helpSubjects);
        }
    }
    const storedHiddenSubjects = localStorage.getItem(LOCAL_STORAGE_HIDDEN_SUBJECTS_KEY);
    if (storedHiddenSubjects) {
      setHiddenHomeworkSubjects(JSON.parse(storedHiddenSubjects));
    }
  }, [isEditing, currentDashboardRole]);

  useEffect(() => {
    // Derive ageGroup whenever userAgeString changes
    if (userAgeString && userAgeString !== NO_AGE_SPECIFIED_VALUE) {
      const ageNum = parseInt(userAgeString, 10);
      if (!isNaN(ageNum)) {
        if (ageNum >= 12 && ageNum <= 14) setUserAgeGroup('12-14');
        else if (ageNum >= 15 && ageNum <= 18) setUserAgeGroup('15-18');
        else setUserAgeGroup('adult');
      }
    } else {
      setUserAgeGroup(initialUserData.ageGroup); // Reset to default or handle as "not specified"
    }
  }, [userAgeString]);


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
    if (userAgeString && userAgeString !== NO_AGE_SPECIFIED_VALUE) {
      const parsedAge = parseInt(userAgeString, 10);
      if (!isNaN(parsedAge)) {
        ageToSave = parsedAge;
      }
    }

    const profileDataToSave: any = {
      name: userName,
      email: userEmail,
      profileImageUrl: profileImageUrl,
      role: currentDashboardRole,
    };

    if (currentDashboardRole === 'leerling') {
        profileDataToSave.age = ageToSave;
        // ageGroup is already updated via useEffect from userAgeString
        profileDataToSave.ageGroup = userAgeGroup;
        profileDataToSave.schoolName = schoolName;
        profileDataToSave.className = className;
        profileDataToSave.schoolType = schoolType;
        profileDataToSave.helpSubjects = helpSubjects;
    }

    console.log("Profiel opgeslagen:", profileDataToSave);
    localStorage.setItem(LOCAL_STORAGE_HIDDEN_SUBJECTS_KEY, JSON.stringify(hiddenHomeworkSubjects));
    toast({
      title: "Profiel Opgeslagen",
      description: "Je profielgegevens en voorkeuren zijn bijgewerkt.",
      variant: "default",
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    const storedHiddenSubjects = localStorage.getItem(LOCAL_STORAGE_HIDDEN_SUBJECTS_KEY);
    if (storedHiddenSubjects) {
      setHiddenHomeworkSubjects(JSON.parse(storedHiddenSubjects));
    }
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

  const handleHomeworkSubjectVisibilityChange = (subjectId: string, checked: boolean) => {
    setHiddenHomeworkSubjects(prev => {
      const newHidden = checked ? prev.filter(id => id !== subjectId) : [...prev, subjectId];
      return newHidden;
    });
  };

  const handleHelpSubjectChange = (subjectId: string, checked: boolean) => {
    setHelpSubjects(prev =>
      checked ? [...prev, subjectId] : prev.filter(id => id !== subjectId)
    );
  };

  return (
    <div className="space-y-8">
      <section className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-foreground capitalize">Mijn Profiel ({currentDashboardRole})</h1>
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
          {currentDashboardRole === 'leerling' && (
            <div>
                <Label htmlFor="userAgeSelect" className="flex items-center gap-1">
                    <Cake className="h-4 w-4 text-muted-foreground"/>
                    Leeftijd (voor quiz afstemming)
                </Label>
                {isEditing ? (
                <Select
                    value={userAgeString}
                    onValueChange={setUserAgeString}
                    disabled={!isEditing}
                >
                    <SelectTrigger id="userAgeSelect" className="mt-1">
                    <SelectValue placeholder="Selecteer je leeftijd" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value={NO_AGE_SPECIFIED_VALUE}>Niet opgegeven</SelectItem>
                    {profileAgeOptions.map(ageOpt => (
                        <SelectItem key={ageOpt} value={ageOpt}>{ageOpt} jaar</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                ) : (
                <Input
                    id="userAgeDisplay"
                    type="text"
                    value={userAgeString && userAgeString !== NO_AGE_SPECIFIED_VALUE ? `${userAgeString} jaar (groep: ${userAgeGroup})` : "Niet opgegeven"}
                    disabled
                    className="mt-1"
                />
                )}
            </div>
          )}
        </CardContent>
      </Card>

      {currentDashboardRole === 'leerling' && (
        <>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-6 w-6 text-primary" />
                Schoolinformatie
              </CardTitle>
              <CardDescription>Deze gegevens helpen ons om eventuele schoolspecifieke content aan te bieden.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="schoolName">Naam school</Label>
                <Input id="schoolName" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} disabled={!isEditing} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="className">Klas</Label>
                <Input id="className" placeholder="Bijv. 3A, VWO 5" value={className} onChange={(e) => setClassName(e.target.value)} disabled={!isEditing} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="schoolType">Type school</Label>
                <Select value={schoolType} onValueChange={setSchoolType} disabled={!isEditing}>
                  <SelectTrigger id="schoolType" className="mt-1">
                    <SelectValue placeholder="Selecteer schooltype" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                Hulp bij Vakken
              </CardTitle>
              <CardDescription>Geef aan voor welke vakken je extra ondersteuning of tips kunt gebruiken.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {allHomeworkSubjects.map(subject => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`help-${subject.id}`}
                      checked={helpSubjects.includes(subject.id)}
                      onCheckedChange={(checked) => isEditing && handleHelpSubjectChange(subject.id, !!checked)}
                      disabled={!isEditing}
                    />
                    <Label
                      htmlFor={`help-${subject.id}`}
                      className={`font-normal flex items-center gap-2 ${!isEditing ? 'cursor-not-allowed text-muted-foreground' : 'cursor-pointer'}`}
                    >
                      <subject.icon className="h-5 w-5" /> {subject.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

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

      {currentDashboardRole === 'tutor' && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              Profiel & Documenten (Tutor)
            </CardTitle>
            <CardDescription>
              Beheer hier je tutor-specifieke documenten en betaalgegevens.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Update je CV, VOG en betaalgegevens. (Functionaliteit binnenkort beschikbaar)
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Beheer Tutor Documenten
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentDashboardRole === 'ouder' && (
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Contact className="h-6 w-6 text-primary" />
              Kinderen Beheren (Ouder)
            </CardTitle>
            <CardDescription>
              Voeg kinderen toe aan uw account en beheer hun instellingen.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Link href="/dashboard/ouder/kinderen" passHref>
                <Button variant="outline" className="w-full">
                 Naar Mijn Kinderen Overzicht
                </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {currentDashboardRole !== 'tutor' && currentDashboardRole !== 'ouder' && (
          <Card className="shadow-lg" id="subject-visibility-settings">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenCheck className="h-6 w-6 text-primary" />
                Zichtbaarheid Vakken Huiswerkbegeleiding
              </CardTitle>
              <CardDescription>
                Kies welke vakken je wilt zien in het huiswerkbegeleidingsoverzicht.
                {isEditing ? '' : ' Klik op "Profiel Bewerken" om dit aan te passen.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {allHomeworkSubjects.map(subject => (
                  <div key={subject.id} className="flex items-center space-x-2 p-2 rounded-md border border-transparent hover:border-muted-foreground/20">
                    <Checkbox
                      id={`subject-visibility-${subject.id}`}
                      checked={!hiddenHomeworkSubjects.includes(subject.id)}
                      onCheckedChange={(checked) => isEditing && handleHomeworkSubjectVisibilityChange(subject.id, !!checked)}
                      disabled={!isEditing}
                    />
                    <Label
                      htmlFor={`subject-visibility-${subject.id}`}
                      className={`font-normal flex items-center gap-2 ${!isEditing ? 'cursor-not-allowed text-muted-foreground' : 'cursor-pointer'}`}
                    >
                      <subject.icon className="h-5 w-5" />
                      {subject.name}
                    </Label>
                  </div>
                ))}
              </div>
              {!isEditing && currentDashboardRole === 'leerling' && (
                <p className="text-sm text-muted-foreground italic mt-2">
                  Ga naar <Link href="/dashboard/homework-assistance" className="text-primary hover:underline">Huiswerkbegeleiding</Link> om vakken direct te verbergen.
                </p>
              )}
            </CardContent>
            {isEditing && (
              <CardFooter className="border-t pt-6">
                <Button onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    Voorkeuren Opslaan
                </Button>
              </CardFooter>
            )}
          </Card>
      )}

    </div>
  );
}
