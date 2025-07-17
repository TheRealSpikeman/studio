
// src/components/dashboard/profile/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserRound, Cake, Save, KeyRound, Eye, EyeOff, Wand2, Settings, BookOpenCheck, Briefcase, School, Users as UsersLucide, GraduationCap, MapPin, Phone, ImageUp, Trash2, ListChecks } from '@/lib/icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { allHomeworkSubjects } from '@/lib/quiz-data/subject-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';

const LOCAL_STORAGE_STUDENT_FOCUS_SUBJECTS_KEY = 'mindnavigator_student_focus_subjects';
const LOCAL_STORAGE_AVATARS_KEY = 'mindnavigator_predefined_avatars';

interface PredefinedAvatar {
  id: string;
  src: string;
  alt: string;
  hint: string;
}

const defaultPredefinedAvatars: PredefinedAvatar[] = [
  { id: 'avatar1', src: 'https://picsum.photos/seed/avatar1/80/80', alt: 'Abstract Geometrisch', hint: 'abstract geometric' },
  { id: 'avatar2', src: 'https://picsum.photos/seed/avatar2/80/80', alt: 'Natuur', hint: 'nature landscape' },
  { id: 'avatar3', src: 'https://picsum.photos/seed/avatar3/80/80', alt: 'Dier', hint: 'animal portrait' },
  { id: 'avatar4', src: 'https://picsum.photos/seed/avatar4/80/80', alt: 'Ruimte', hint: 'space galaxy' },
  { id: 'avatar5', src: 'https://picsum.photos/seed/avatar5/80/80', alt: 'Stad', hint: 'city skyline' },
  { id: 'avatar6', src: 'https://picsum.photos/seed/avatar6/80/80', alt: 'Eten', hint: 'food delicious' },
];

const profileAgeOptions = Array.from({ length: (20 - 10) + 1 }, (_, i) => (i + 10).toString());
const NO_AGE_SPECIFIED_VALUE = "_NO_AGE_SPECIFIED_";
const schoolTypes = ["VMBO-T", "HAVO", "VWO", "Gymnasium", "Praktijkonderwijs", "Speciaal Onderwijs", "Anders"];
const countryCodeOptions = [
  { value: '+31', label: 'NL (+31)' }, { value: '+32', label: 'BE (+32)' },
  { value: '+49', label: 'DE (+49)' }, { value: '+44', label: 'UK (+44)' },
  { value: '+33', label: 'FR (+33)' },
];
const countryOptionsList = [
  { value: 'Nederland', label: 'Nederland' }, { value: 'België', label: 'België' },
  { value: 'Duitsland', label: 'Duitsland' }, { value: 'Verenigd Koninkrijk', label: 'Verenigd Koninkrijk' },
  { value: 'Frankrijk', label: 'Frankrijk' }, { value: 'Anders', label: 'Anders (specificeer indien nodig)'},
];

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  // States for form fields
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAgeString, setUserAgeString] = useState<string>(NO_AGE_SPECIFIED_VALUE);
  const [userAgeGroup, setUserAgeGroup] = useState<'12-14' | '15-18' | 'adult' | undefined>(undefined);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState('');
  const [className, setClassName] = useState('');
  const [schoolType, setSchoolType] = useState('');
  const [studentFocusSubjects, setStudentFocusSubjects] = useState<string[]>([]);
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodeOptions[0].value);
  const [basePhoneNumber, setBasePhoneNumber] = useState('');

  // New state for avatars
  const [predefinedAvatars, setPredefinedAvatars] = useState<PredefinedAvatar[]>([]);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(true);


  // States for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const currentDashboardRole = user?.role;

  const populateFormWithUserData = (currentUser: typeof user) => {
    if (!currentUser) return;
    setUserName(currentUser.name || '');
    setUserEmail(currentUser.email || '');
    setProfileImageUrl(currentUser.avatarUrl || null);

    if(currentUser.role === 'leerling' || currentUser.role === 'ouder') {
      try {
        const storedAvatars = localStorage.getItem(LOCAL_STORAGE_AVATARS_KEY);
        if (storedAvatars) {
          setPredefinedAvatars(JSON.parse(storedAvatars));
        } else {
          setPredefinedAvatars(defaultPredefinedAvatars);
          localStorage.setItem(LOCAL_STORAGE_AVATARS_KEY, JSON.stringify(defaultPredefinedAvatars));
        }
      } catch (e) {
        console.error("Failed to load avatars", e);
      }
      setIsLoadingAvatars(false);
    } else {
        setIsLoadingAvatars(false);
    }

    if(currentUser.role === 'leerling') {
      setUserAgeString(currentUser.age?.toString() || NO_AGE_SPECIFIED_VALUE);
      setUserAgeGroup(currentUser.ageGroup);
      setSchoolName(currentUser.schoolName || '');
      setClassName(currentUser.className || '');
      setSchoolType(currentUser.schoolType || '');
      const storedFocusSubjects = localStorage.getItem(LOCAL_STORAGE_STUDENT_FOCUS_SUBJECTS_KEY);
      setStudentFocusSubjects(storedFocusSubjects ? JSON.parse(storedFocusSubjects) : (currentUser.helpSubjects || []));
    }
  };

  useEffect(() => {
    populateFormWithUserData(user);
  }, [user]);

  useEffect(() => {
    if (!isEditing) {
      populateFormWithUserData(user); // Reset form on cancel
      setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
    }
  }, [isEditing, user]);

  const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setProfileImageUrl(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPredefinedAvatar = (avatarSrc: string) => setProfileImageUrl(avatarSrc);
  const handleRemoveImage = () => setProfileImageUrl(null);
  const handleStudentFocusSubjectChange = (subjectId: string, checked: boolean) => {
    setStudentFocusSubjects(prev => checked ? [...prev, subjectId] : prev.filter(id => id !== subjectId));
  };
  
  const handleSaveProfile = () => {
    if (!user) return;
    // In a real app, this would update the Firestore document
    console.log("Profiel opslaan voor:", { id: user.id, name: userName, email: userEmail });
    toast({ title: "Profiel Opgeslagen", description: "Je profielgegevens zijn bijgewerkt (simulatie)." });
    setIsEditing(false);
  };
  
  const handleSuggestPassword = () => {
    const suggested = "SuggereerSterkWachtwoord123!"; // Simplified for demo
    setNewPassword(suggested);
    setConfirmNewPassword(suggested);
    toast({ title: "Wachtwoord gesuggereerd", description: "Een sterk wachtwoord is ingevuld." });
  };

  const handleChangePassword = () => {
    if (!currentPassword) {
      toast({ title: "Fout", description: "Huidig wachtwoord is vereist.", variant: "destructive" }); return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Fout", description: "Nieuw wachtwoord moet minimaal 8 tekens lang zijn.", variant: "destructive" }); return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Fout", description: "Nieuwe wachtwoorden komen niet overeen.", variant: "destructive" }); return;
    }
    console.log("Password change attempted for user:", user?.email);
    toast({ title: "Wachtwoord Wijziging", description: "Wachtwoordwijziging aangevraagd (simulatie)." });
    setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
  };

  if (isLoading) {
      return <div>Laden...</div>
  }

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
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Annuleren
                </Button>
            </div>
        )}
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-6 w-6 text-primary" />
            Persoonlijke Gegevens
          </CardTitle>
          <CardDescription>
            Deze informatie helpt ons om je ervaring te personaliseren.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="userName">Volledige Naam</Label>
            <Input id="userName" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} disabled={!isEditing} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="userEmail">E-mailadres</Label>
            <Input id="userEmail" type="email" value={userEmail} disabled className="mt-1" />
            {!isEditing && <p className="text-xs text-muted-foreground mt-1">E-mailadres kan niet gewijzigd worden.</p>}
          </div>
          {currentDashboardRole === 'leerling' && (
            <div>
                <Label htmlFor="userAgeSelect" className="flex items-center gap-1">
                    <Cake className="h-4 w-4 text-muted-foreground"/>
                    Leeftijd (voor quiz afstemming)
                </Label>
                {isEditing ? (
                <Select value={userAgeString} onValueChange={setUserAgeString} disabled={!isEditing}>
                    <SelectTrigger id="userAgeSelect" className="mt-1 pl-10 relative">
                      <Cake className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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

      {(isEditing) && (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <ImageUp className="h-6 w-6 text-primary" />
                Profielfoto
                </CardTitle>
                <CardDescription>Upload een nieuwe foto of kies een standaard avatar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Avatar className="h-24 w-24 text-2xl">
                        <AvatarImage src={profileImageUrl || undefined} alt={userName} data-ai-hint="user avatar"/>
                        <AvatarFallback className="bg-muted">{getInitials(userName)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-3 w-full sm:w-auto">
                        <Button onClick={() => profileImageInputRef.current?.click()} variant="outline" className="w-full">
                            <ImageUp className="mr-2 h-4 w-4" /> Upload Foto
                        </Button>
                        <Input 
                            type="file" 
                            accept="image/*" 
                            ref={profileImageInputRef} 
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                        {profileImageUrl && (
                            <Button onClick={handleRemoveImage} variant="destructive" className="w-full">
                            <Trash2 className="mr-2 h-4 w-4" /> Verwijder Foto
                            </Button>
                        )}
                    </div>
                </div>

                {(currentDashboardRole === 'leerling' || currentDashboardRole === 'ouder') && !isLoadingAvatars && predefinedAvatars.length > 0 && (
                  <div>
                      <Label>Of kies een avatar:</Label>
                      <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {predefinedAvatars.map(avatar => (
                          <button
                              key={avatar.id}
                              onClick={() => handleSelectPredefinedAvatar(avatar.src)}
                              className={`rounded-md overflow-hidden border-2 transition-all hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary w-16 h-16
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
                )}
            </CardContent>
        </Card>
      )}


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
                  <SelectTrigger id="schoolType" className="mt-1 pl-10 relative">
                    <School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <SelectValue placeholder="Selecteer schooltype" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg" id="subject-visibility-settings">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-6 w-6 text-primary" />
                Mijn Focus Vakken (voor Tests & Oefeningen)
              </CardTitle>
              <CardDescription>
                Selecteer hier de vakken waarvoor je extra oefeningen, tips of tests wilt zien. Jouw selectie is persoonlijk en helpt ons relevante content aan te bieden.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {allHomeworkSubjects.map(subject => (
                  <div key={subject.id} className="flex items-center space-x-2 p-2 rounded-md border border-transparent">
                    <Checkbox
                      id={`focus-subject-${subject.id}`}
                      checked={studentFocusSubjects.includes(subject.id)}
                      onCheckedChange={(checked) => handleStudentFocusSubjectChange(subject.id, !!checked)}
                      disabled={!isEditing}
                    />
                    <Label
                      htmlFor={`focus-subject-${subject.id}`}
                      className={`font-normal flex items-center gap-2 ${!isEditing ? 'cursor-not-allowed text-muted-foreground' : 'cursor-pointer'}`}
                    >
                      <subject.icon className="h-5 w-5" />
                      {subject.name}
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
                <Input id="currentPassword" type={showCurrentPassword ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="pr-10" autoComplete="current-password" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2" onClick={() => setShowCurrentPassword(!showCurrentPassword)} aria-label={showCurrentPassword ? "Verberg huidig wachtwoord" : "Toon huidig wachtwoord"}>
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="newPassword">Nieuw Wachtwoord</Label>
              <div className="relative mt-1">
                <Input id="newPassword" type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pr-10" autoComplete="new-password" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2" onClick={() => setShowNewPassword(!showNewPassword)} aria-label={showNewPassword ? "Verberg nieuw wachtwoord" : "Toon nieuw wachtwoord"}>
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmNewPassword">Bevestig Nieuw Wachtwoord</Label>
              <div className="relative mt-1">
                <Input id="confirmNewPassword" type={showConfirmNewPassword ? "text" : "password"} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="pr-10" autoComplete="new-password" />
                 <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} aria-label={showConfirmNewPassword ? "Verberg bevestig nieuw wachtwoord" : "Toon bevestig nieuw wachtwoord"}>
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
              Profiel &amp; Documenten (Tutor)
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
    </div>
  );
}
