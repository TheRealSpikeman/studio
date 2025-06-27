
// src/app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Cake, Save, KeyRound, Eye, EyeOff, Wand2, Settings, BookOpenCheck, Briefcase, School, Users as UsersLucide, GraduationCap, Contact, MapPin, Phone, ImageUp, Trash2, ListChecks } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { allHomeworkSubjects } from '@/lib/quiz-data/subject-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

const LOCAL_STORAGE_STUDENT_FOCUS_SUBJECTS_KEY = 'mindnavigator_student_focus_subjects';

const initialUserData = {
  name: "Alex de Tester",
  email: "alex.tester@example.com",
  age: 16 as number | undefined,
  ageGroup: '15-18' as '12-14' | '15-18' | 'adult',
  profileImageUrl: "https://picsum.photos/seed/alex-avatar/128/128" as string | null,
  subscription: {
    planName: "Coaching Maandelijks" as string | null,
    status: 'active' as 'none' | 'active' | 'pending_parental_approval' | 'cancelled' | 'past_due',
    nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL') as string | null,
  },
  schoolName: 'Voorbeeld School',
  className: 'Klas 3B',
  schoolType: 'HAVO',
  helpSubjectsFromParent: ['nederlands', 'wiskunde', 'engels'] as string[], 
  street: 'Voorbeeldstraat',
  houseNumber: '123',
  postalCode: '1234 AB',
  city: 'Voorbeeldstad',
  country: 'Nederland',
  phoneNumber: '+31612345678', // Voorbeeld met landcode
};

const profileAgeOptions = Array.from({ length: (20 - 10) + 1 }, (_, i) => (i + 10).toString());
const NO_AGE_SPECIFIED_VALUE = "_NO_AGE_SPECIFIED_";

const schoolTypes = ["VMBO-T", "HAVO", "VWO", "Gymnasium", "Praktijkonderwijs", "Speciaal Onderwijs", "Anders"];

const predefinedAvatarsForProfile = [
  { id: 'profile_avatar1', src: 'https://placehold.co/80x80.png?text=P1', alt: 'Abstract Geometrisch', hint: 'abstract geometric' },
  { id: 'profile_avatar2', src: 'https://placehold.co/80x80.png?text=P2', alt: 'Natuur', hint: 'nature landscape' },
  { id: 'profile_avatar3', src: 'https://placehold.co/80x80.png?text=P3', alt: 'Dier', hint: 'animal portrait' },
  { id: 'profile_avatar4', src: 'https://placehold.co/80x80.png?text=P4', alt: 'Ruimte', hint: 'space galaxy' },
  { id: 'profile_avatar5', src: 'https://placehold.co/80x80.png?text=P5', alt: 'Stad', hint: 'city skyline' },
  { id: 'profile_avatar6', src: 'https://placehold.co/80x80.png?text=P6', alt: 'Eten', hint: 'food delicious' },
];

const countryCodeOptions = [
  { value: '+31', label: 'NL (+31)' },
  { value: '+32', label: 'BE (+32)' },
  { value: '+49', label: 'DE (+49)' },
  { value: '+44', label: 'UK (+44)' },
  { value: '+33', label: 'FR (+33)' },
];

const countryOptionsList = [
  { value: 'Nederland', label: 'Nederland' },
  { value: 'België', label: 'België' },
  { value: 'Duitsland', label: 'Duitsland' },
  { value: 'Verenigd Koninkrijk', label: 'Verenigd Koninkrijk' },
  { value: 'Frankrijk', label: 'Frankrijk' },
  { value: 'Anders', label: 'Anders (specificeer indien nodig)'},
];


export default function ProfilePage() {
  const { user } = useAuth();
  const currentDashboardRole = user?.role;

  const [userName, setUserName] = useState(initialUserData.name);
  const [userEmail, setUserEmail] = useState(initialUserData.email);
  const [userAgeString, setUserAgeString] = useState<string>(initialUserData.age?.toString() || NO_AGE_SPECIFIED_VALUE);
  const [userAgeGroup, setUserAgeGroup] = useState<'12-14' | '15-18' | 'adult'>(initialUserData.ageGroup);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(initialUserData.profileImageUrl);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [studentFocusSubjects, setStudentFocusSubjects] = useState<string[]>([]);

  const [schoolName, setSchoolName] = useState(initialUserData.schoolName);
  const [className, setClassName] = useState(initialUserData.className);
  const [schoolType, setSchoolType] = useState(initialUserData.schoolType);

  const [street, setStreet] = useState(initialUserData.street);
  const [houseNumber, setHouseNumber] = useState(initialUserData.houseNumber);
  const [postalCode, setPostalCode] = useState(initialUserData.postalCode);
  const [city, setCity] = useState(initialUserData.city);
  const [country, setCountry] = useState(initialUserData.country);
  
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodeOptions[0].value);
  const [basePhoneNumber, setBasePhoneNumber] = useState('');

  const parseAndSetPhoneNumber = (fullNumberFromData: string | undefined) => {
    const fullNum = fullNumberFromData || '';
    let foundCode = false;
    for (const opt of countryCodeOptions) {
      if (fullNum.startsWith(opt.value)) {
        setSelectedCountryCode(opt.value);
        setBasePhoneNumber(fullNum.substring(opt.value.length).replace(/\D/g, ''));
        foundCode = true;
        break;
      }
    }
    if (!foundCode) {
      setSelectedCountryCode(countryCodeOptions[0].value); // Default to NL
      setBasePhoneNumber(fullNum.replace(/\D/g, '')); // Strip non-digits
    }
  };

  useEffect(() => {
    if (currentDashboardRole === 'leerling') {
      const storedFocusSubjects = localStorage.getItem(LOCAL_STORAGE_STUDENT_FOCUS_SUBJECTS_KEY);
      if (storedFocusSubjects) {
        setStudentFocusSubjects(JSON.parse(storedFocusSubjects));
      } else {
        setStudentFocusSubjects(initialUserData.helpSubjectsFromParent || []);
      }
    }
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
        } else if (currentDashboardRole === 'ouder') {
            setStreet(initialUserData.street);
            setHouseNumber(initialUserData.houseNumber);
            setPostalCode(initialUserData.postalCode);
            setCity(initialUserData.city);
            setCountry(initialUserData.country);
            parseAndSetPhoneNumber(initialUserData.phoneNumber);
        }
    }
  }, [isEditing, currentDashboardRole]);

  useEffect(() => {
    if (userAgeString && userAgeString !== NO_AGE_SPECIFIED_VALUE) {
      const ageNum = parseInt(userAgeString, 10);
      if (!isNaN(ageNum)) {
        if (ageNum >= 10 && ageNum <= 11) setUserAgeGroup('adult');
        else if (ageNum >= 12 && ageNum <= 14) setUserAgeGroup('12-14');
        else if (ageNum >= 15 && ageNum <= 18) setUserAgeGroup('15-18');
        else if (ageNum >= 19 && ageNum <= 20) setUserAgeGroup('adult');
        else setUserAgeGroup('adult');
      }
    } else {
      setUserAgeGroup(initialUserData.ageGroup);
    }
  }, [userAgeString]);
  
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPredefinedAvatar = (avatarSrc: string) => {
    setProfileImageUrl(avatarSrc);
  };

  const handleRemoveImage = () => {
    setProfileImageUrl(null);
  };

  const handleStudentFocusSubjectChange = (subjectId: string, checked: boolean) => {
    setStudentFocusSubjects(prev =>
      checked ? [...prev, subjectId] : prev.filter(id => id !== subjectId)
    );
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
        profileDataToSave.ageGroup = userAgeGroup;
        profileDataToSave.schoolName = schoolName;
        profileDataToSave.className = className;
        profileDataToSave.schoolType = schoolType;
        profileDataToSave.studentFocusSubjects = studentFocusSubjects; 
        localStorage.setItem(LOCAL_STORAGE_STUDENT_FOCUS_SUBJECTS_KEY, JSON.stringify(studentFocusSubjects));
    } else if (currentDashboardRole === 'ouder') {
        profileDataToSave.street = street;
        profileDataToSave.houseNumber = houseNumber;
        profileDataToSave.postalCode = postalCode;
        profileDataToSave.city = city;
        profileDataToSave.country = country;
        profileDataToSave.phoneNumber = selectedCountryCode + basePhoneNumber;
    }

    console.log("Profiel opgeslagen:", profileDataToSave);
    initialUserData.name = userName;
    initialUserData.email = userEmail;
    initialUserData.profileImageUrl = profileImageUrl;
    if (currentDashboardRole === 'leerling') {
      initialUserData.age = ageToSave;
      initialUserData.ageGroup = userAgeGroup;
      initialUserData.schoolName = schoolName;
      initialUserData.className = className;
      initialUserData.schoolType = schoolType;
    } else if (currentDashboardRole === 'ouder') {
      initialUserData.street = street;
      initialUserData.houseNumber = houseNumber;
      initialUserData.postalCode = postalCode;
      initialUserData.city = city;
      initialUserData.country = country;
      initialUserData.phoneNumber = selectedCountryCode + basePhoneNumber;
    }

    toast({
      title: "Profiel Opgeslagen",
      description: "Je profielgegevens en voorkeuren zijn bijgewerkt.",
      variant: "default",
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUserName(initialUserData.name);
    setUserEmail(initialUserData.email);
    setUserAgeString(initialUserData.age?.toString() || NO_AGE_SPECIFIED_VALUE);
    setUserAgeGroup(initialUserData.ageGroup);
    setProfileImageUrl(initialUserData.profileImageUrl);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    
    if (currentDashboardRole === 'leerling') {
      const storedFocusSubjects = localStorage.getItem(LOCAL_STORAGE_STUDENT_FOCUS_SUBJECTS_KEY);
      setStudentFocusSubjects(storedFocusSubjects ? JSON.parse(storedFocusSubjects) : (initialUserData.helpSubjectsFromParent || []));
      setSchoolName(initialUserData.schoolName);
      setClassName(initialUserData.className);
      setSchoolType(initialUserData.schoolType);
    }
    setStreet(initialUserData.street);
    setHouseNumber(initialUserData.houseNumber);
    setPostalCode(initialUserData.postalCode);
    setCity(initialUserData.city);
    setCountry(initialUserData.country);
    parseAndSetPhoneNumber(initialUserData.phoneNumber);
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
              disabled 
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

      {currentDashboardRole === 'ouder' && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Contact- &amp; Adresgegevens
            </CardTitle>
            <CardDescription>
              Deze gegevens worden gebruikt voor communicatie en eventuele facturatie.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="street">Straat</Label>
                <Input id="street" value={street} onChange={(e) => setStreet(e.target.value)} disabled={!isEditing} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="houseNumber">Huisnummer</Label>
                <Input id="houseNumber" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} disabled={!isEditing} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="postalCode">Postcode</Label>
                <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} disabled={!isEditing} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="city">Plaats</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} disabled={!isEditing} className="mt-1" />
              </div>
            </div>
            <div>
                <Label htmlFor="country">Land</Label>
                {isEditing ? (
                  <Select value={country} onValueChange={setCountry} disabled={!isEditing}>
                    <SelectTrigger id="country" className="mt-1 pl-10 relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <SelectValue placeholder="Selecteer een land" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryOptionsList.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id="countryDisplay" value={country} disabled className="mt-1" />
                )}
            </div>
            <div>
              <Label htmlFor="phoneNumber" className="flex items-center gap-1">
                <Phone className="h-4 w-4 text-muted-foreground" /> Telefoonnummer
              </Label>
              <div className="flex gap-2 mt-1">
                <div className="w-1/3">
                  <Select
                    value={selectedCountryCode}
                    onValueChange={setSelectedCountryCode}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="countryCode" className="pl-10 relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <SelectValue placeholder="Landcode" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodeOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-grow">
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={basePhoneNumber}
                    onChange={(e) => setBasePhoneNumber(e.target.value.replace(/\D/g, ''))}
                    disabled={!isEditing}
                    placeholder="Bijv. 612345678"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {isEditing && (
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
                        <AvatarImage src={profileImageUrl || undefined} alt={userName} data-ai-hint="person avatar profile" />
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
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        {profileImageUrl && (
                            <Button onClick={handleRemoveImage} variant="destructive" className="w-full">
                            <Trash2 className="mr-2 h-4 w-4" /> Verwijder Foto
                            </Button>
                        )}
                    </div>
                </div>

                <div>
                    <Label>Of kies een avatar:</Label>
                    <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {predefinedAvatarsForProfile.map(avatar => (
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
