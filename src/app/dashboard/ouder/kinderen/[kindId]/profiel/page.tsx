
// src/app/dashboard/ouder/kinderen/[kindId]/profiel/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, Cake, School, GraduationCap, Target, Users as UsersIcon, Share2, Edit, Link2, Info, ShieldAlert, AlertTriangle, HelpCircle, CheckSquare, BookOpen, ImageUp, Trash2, Save } from 'lucide-react';
import { allHomeworkSubjects, type SubjectOption } from '@/lib/quiz-data/subject-data';
import type { User as UserType, AgeGroup } from '@/types/user';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image'; // Import Image component

interface Child extends Pick<UserType, 'id' | 'name' | 'ageGroup' | 'avatarUrl' | 'hulpvraagType' > {
  firstName: string;
  lastName: string;
  age?: number; // Blijft voor weergave, ageGroup is primair voor logica
  childEmail?: string;
  schoolType?: string;
  className?: string;
  helpSubjects?: string[];
  subscriptionStatus: 'actief' | 'geen' | 'verlopen' | 'uitgenodigd';
  lastActivity?: string;
  leerdoelen?: string; // String: "Geselecteerd: doel1, doel2. Overig: andere doelen"
  voorkeurTutor?: string; // String: "Geselecteerd: pref1, pref2. Overig: andere prefs"
  deelResultatenMetTutor?: boolean;
  linkedTutorIds?: string[];
}

interface EditableChildData {
    firstName: string;
    lastName: string;
    ageGroup: AgeGroup;
    childEmail: string;
    schoolType: string;
    className: string;
    helpSubjects: string[];
    hulpvraagType: ('tutor' | 'coach')[];
    selectedLeerdoelen: string[];
    otherLeerdoelen: string;
    selectedTutorPreferences: string[];
    otherTutorPreference: string;
    deelResultatenMetTutor: boolean;
    avatarUrl: string | null;
}

const dummyChildren: Child[] = [
   {
    id: 'child1',
    firstName: 'Sofie',
    lastName: 'de Tester',
    name: 'Sofie de Tester',
    age: 13,
    ageGroup: '12-14',
    avatarUrl: 'https://picsum.photos/seed/sofiechild/80/80',
    subscriptionStatus: 'actief',
    lastActivity: 'Quiz "Basis Neuroprofiel" voltooid',
    childEmail: 'sofie.tester@example.com',
    schoolType: 'HAVO',
    className: '2B',
    helpSubjects: ['wiskunde', 'nederlands'],
    hulpvraagType: ['tutor'],
    leerdoelen: 'Geselecteerd: Beter leren plannen voor toetsen, Omgaan met faalangst. Overig: Kind heeft moeite met beginnen aan taken.',
    voorkeurTutor: 'Geselecteerde voorkeuren: Ervaring met HSP, Geduldig. Overig: Iemand met ervaring met visueel ingestelde leerlingen.',
    deelResultatenMetTutor: true,
    linkedTutorIds: ['tutor1'],
  },
  {
    id: 'child2',
    firstName: 'Max',
    lastName: 'de Tester',
    name: 'Max de Tester',
    age: 16,
    ageGroup: '15-18',
    avatarUrl: 'https://picsum.photos/seed/maxchild/80/80',
    subscriptionStatus: 'actief',
    lastActivity: 'Laatste les: Engels (1 dag geleden)',
    childEmail: 'max.tester@example.com',
    schoolType: 'VWO',
    helpSubjects: ['engels', 'geschiedenis'],
    hulpvraagType: ['tutor', 'coach'],
    leerdoelen: 'Geselecteerd: Concentratie verbeteren tijdens de les. Overig: Verbeteren van spreekvaardigheid Engels en essay schrijven.',
    voorkeurTutor: 'Geselecteerde voorkeuren: Man. Overig: Tutor die ook kan helpen met motivatie.',
    deelResultatenMetTutor: false,
    linkedTutorIds: [],
  },
  {
    id: 'child3',
    firstName: 'Lisa',
    lastName: 'Voorbeeld',
    name: 'Lisa Voorbeeld',
    age: 12,
    ageGroup: '12-14',
    subscriptionStatus: 'uitgenodigd',
    lastActivity: 'Coaching tip van gisteren bekeken',
    childEmail: 'lisa.voorbeeld@example.com',
    helpSubjects: [],
    hulpvraagType: ['coach'],
    leerdoelen: 'Geselecteerd: Zelfvertrouwen vergroten.',
    voorkeurTutor: 'Geselecteerde voorkeuren: Vrouw, Ervaring met faalangst.',
    deelResultatenMetTutor: true,
    linkedTutorIds: ['tutor2', 'tutor3'],
  },
];

const predefinedLeerdoelen = [
  { id: 'plannen', label: "Beter leren plannen voor toetsen" },
  { id: 'faalangst', label: "Omgaan met faalangst" },
  { id: 'concentratie', label: "Concentratie verbeteren tijdens de les" },
  { id: 'zelfvertrouwen', label: "Zelfvertrouwen vergroten" },
  { id: 'motivatie', label: "Motivatie vinden/behouden" },
  { id: 'structuur', label: "Structuur aanbrengen in huiswerk" },
];

const predefinedTutorPreferences = [
  { id: 'ervaring-add-adhd', label: "Ervaring met ADD/ADHD" },
  { id: 'ervaring-ass', label: "Ervaring met ASS" },
  { id: 'ervaring-hsp', label: "Ervaring met HSP" },
  { id: 'ervaring-faalangst', label: "Ervaring met faalangst" },
  { id: 'man', label: "Man" },
  { id: 'vrouw', label: "Vrouw" },
  { id: 'geduldig', label: "Geduldig" },
  { id: 'streng-doch-rechtvaardig', label: "Streng doch rechtvaardig" },
];

const schoolTypes = ["VMBO-T", "HAVO", "VWO", "Gymnasium", "Praktijkonderwijs", "Speciaal Onderwijs", "Anders", "Niet opgegeven"];
const ageGroupOptions: {value: AgeGroup, label: string}[] = [
    {value: '12-14', label: '12-14 jaar'},
    {value: '15-18', label: '15-18 jaar'},
    {value: 'adult', label: 'Volwassene (18+)'} // Should rarely be used for "kind"
];

const predefinedAvatarsForProfile = [
  { id: 'child_avatar1', src: 'https://placehold.co/80x80.png?text=C1', alt: 'Avatar Patroon 1', hint: 'abstract pattern' },
  { id: 'child_avatar2', src: 'https://placehold.co/80x80.png?text=C2', alt: 'Avatar Natuur', hint: 'nature element' },
  { id: 'child_avatar3', src: 'https://placehold.co/80x80.png?text=C3', alt: 'Avatar Dier', hint: 'animal cute' },
  { id: 'child_avatar4', src: 'https://placehold.co/80x80.png?text=C4', alt: 'Avatar Ruimte', hint: 'space cosmic' },
];

const getSubscriptionBadgeVariant = (status: Child['subscriptionStatus']): "default" | "secondary" | "destructive" | "outline" => {
  if (status === 'actief') return 'default';
  if (status === 'geen') return 'secondary';
  if (status === 'uitgenodigd') return 'outline';
  return 'destructive'; 
};
const getSubscriptionBadgeClasses = (status: Child['subscriptionStatus']): string => {
  if (status === 'actief') return 'bg-green-100 text-green-700 border-green-300';
  if (status === 'geen') return 'bg-gray-100 text-gray-700 border-gray-300';
  if (status === 'uitgenodigd') return 'bg-blue-100 text-blue-700 border-blue-300';
  return 'bg-red-100 text-red-700 border-red-300'; 
};

const parseMultiPartString = (str: string | undefined): { selected: string[]; other: string } => {
  if (!str) return { selected: [], other: '' };
  const geselecteerdMatch = str.match(/Geselecteerd:\s*(.*?)(?=\s*\.\s*Overig:|$)/i);
  const overigMatch = str.match(/Overig:\s*(.*)/i);
  
  const selectedItems = geselecteerdMatch ? geselecteerdMatch[1].trim().split(',').map(s => s.trim()).filter(Boolean) : [];
  const otherText = overigMatch ? overigMatch[1].trim() : (geselecteerdMatch ? '' : str); // if no "Geselecteerd" or "Overig" prefix, assume all is "other"

  return {
    selected: selectedItems,
    other: otherText,
  };
};

const formatHulpvraagTypeDetailed = (types?: ('tutor' | 'coach')[]): { selected: string[]; notSelected: string[] } => {
  const currentTypes = types || [];
  const allHulpvraagOptions: { id: 'tutor' | 'coach'; label: string }[] = [
    { id: 'tutor', label: "Hulp bij huiswerk (Tutor)" },
    { id: 'coach', label: "1-op-1 coaching (Coach)" },
  ];
  const selectedLabels = allHulpvraagOptions
    .filter(opt => currentTypes.includes(opt.id))
    .map(opt => opt.label);
  const notSelectedLabels = allHulpvraagOptions
    .filter(opt => !currentTypes.includes(opt.id))
    .map(opt => opt.label);
  if (selectedLabels.length === 0 && notSelectedLabels.length > 0) {
    return { selected: ["Niet gespecificeerd"], notSelected: notSelectedLabels };
  }
  return { selected: selectedLabels, notSelected: notSelectedLabels };
};

export default function KindProfielPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const kindId = params.kindId as string;
  
  const [childData, setChildData] = useState<Child | null>(null);
  const [editableChildData, setEditableChildData] = useState<EditableChildData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(true);
    const allChildren: Child[] = JSON.parse(localStorage.getItem('ouderDashboard_kinderen') || JSON.stringify(dummyChildren));
    const data = allChildren.find(c => c.id === kindId);
    if (data) {
      setChildData(data);
    } else {
      console.error("Kind data niet gevonden voor ID:", kindId);
    }
    setIsLoading(false);
  }, [kindId]);

  const initializeEditableData = () => {
    if (childData) {
      const parsedLeerdoelen = parseMultiPartString(childData.leerdoelen);
      const parsedVoorkeuren = parseMultiPartString(childData.voorkeurTutor);
      setEditableChildData({
        firstName: childData.firstName,
        lastName: childData.lastName,
        ageGroup: childData.ageGroup || '12-14',
        childEmail: childData.childEmail || '',
        schoolType: childData.schoolType || '',
        className: childData.className || '',
        helpSubjects: childData.helpSubjects || [],
        hulpvraagType: childData.hulpvraagType || [],
        selectedLeerdoelen: parsedLeerdoelen.selected,
        otherLeerdoelen: parsedLeerdoelen.other,
        selectedTutorPreferences: parsedVoorkeuren.selected,
        otherTutorPreference: parsedVoorkeuren.other,
        deelResultatenMetTutor: childData.deelResultatenMetTutor || false,
        avatarUrl: childData.avatarUrl || null,
      });
    }
  };

  useEffect(() => {
    if (isEditing) {
      initializeEditableData();
    }
  }, [isEditing, childData]);

  const getInitials = (name?: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';
  const getSubjectName = (subjectId: string) => allHomeworkSubjects.find(s => s.id === subjectId)?.name || subjectId;
  
  const handleInputChange = (field: keyof EditableChildData, value: string | string[] | ('tutor' | 'coach')[] | boolean | null | AgeGroup) => {
    setEditableChildData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleCheckboxChange = (field: 'helpSubjects' | 'hulpvraagType' | 'selectedLeerdoelen' | 'selectedTutorPreferences', itemId: string, checked: boolean) => {
    setEditableChildData(prev => {
        if (!prev) return null;
        const currentArray = prev[field] as string[] || [];
        const newArray = checked 
            ? [...currentArray, itemId] 
            : currentArray.filter(id => id !== itemId);
        return { ...prev, [field]: newArray };
    });
  };
  
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('avatarUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!editableChildData || !childData) return;

    let leerdoelenString = "";
    if (editableChildData.selectedLeerdoelen.length > 0) {
      leerdoelenString += `Geselecteerd: ${editableChildData.selectedLeerdoelen.join(', ')}. `;
    }
    if (editableChildData.otherLeerdoelen) {
      leerdoelenString += `Overig: ${editableChildData.otherLeerdoelen}`;
    }

    let tutorPreferencesString = "";
    if (editableChildData.selectedTutorPreferences.length > 0) {
      tutorPreferencesString += `Geselecteerde voorkeuren: ${editableChildData.selectedTutorPreferences.join(', ')}. `;
    }
    if (editableChildData.otherTutorPreference) {
      tutorPreferencesString += `Overig: ${editableChildData.otherTutorPreference}`;
    }

    const updatedChildData: Child = {
      ...childData,
      firstName: editableChildData.firstName,
      lastName: editableChildData.lastName,
      name: `${editableChildData.firstName} ${editableChildData.lastName}`,
      ageGroup: editableChildData.ageGroup,
      childEmail: editableChildData.childEmail,
      schoolType: editableChildData.schoolType,
      className: editableChildData.className,
      helpSubjects: editableChildData.helpSubjects,
      hulpvraagType: editableChildData.hulpvraagType,
      leerdoelen: leerdoelenString.trim() || undefined,
      voorkeurTutor: tutorPreferencesString.trim() || undefined,
      deelResultatenMetTutor: editableChildData.deelResultatenMetTutor,
      avatarUrl: editableChildData.avatarUrl,
      age: childData.age, // Keep original age if present, ageGroup is primary
    };
    
    setChildData(updatedChildData);
    // Simulate saving to localStorage
    try {
      const allChildrenStored: Child[] = JSON.parse(localStorage.getItem('ouderDashboard_kinderen') || JSON.stringify(dummyChildren));
      const updatedAllChildren = allChildrenStored.map(c => c.id === kindId ? updatedChildData : c);
      localStorage.setItem('ouderDashboard_kinderen', JSON.stringify(updatedAllChildren));
    } catch (e) { console.error("Error updating localStorage", e); }

    toast({ title: "Profiel Opgeslagen", description: `Gegevens voor ${updatedChildData.name} zijn bijgewerkt.` });
    setIsEditing(false);
  };

  const leerdoelenParsed = parseMultiPartString(childData?.leerdoelen);
  const tutorVoorkeurenParsed = parseMultiPartString(childData?.voorkeurTutor);
  const hulpvraagFormatted = formatHulpvraagTypeDetailed(childData?.hulpvraagType);

  if (isLoading) return <div className="p-8 text-center">Profielgegevens laden...</div>;
  if (!childData) return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-2xl font-bold text-destructive mb-2">Profiel Niet Gevonden</h1>
      <p className="text-muted-foreground mb-6">
        De gegevens voor dit kind konden niet worden geladen. Controleer of het kind correct is toegevoegd.
      </p>
      <Button asChild variant="outline">
        <Link href="/dashboard/ouder/kinderen">
          <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Mijn Kinderen
        </Link>
      </Button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-lg bg-card shadow">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={isEditing ? editableChildData?.avatarUrl : childData.avatarUrl} alt={childData.name} data-ai-hint="child person" />
            <AvatarFallback className="text-3xl bg-muted">{getInitials(childData.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{isEditing ? `${editableChildData?.firstName} ${editableChildData?.lastName}` : childData.name}</h1>
            <p className="text-muted-foreground">Profieloverzicht en instellingen.</p>
          </div>
        </div>
        {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}><Edit className="mr-2 h-4 w-4"/> Profiel Bewerken</Button>
        ) : (
            <div className="flex gap-2">
                <Button onClick={handleSaveProfile}><Save className="mr-2 h-4 w-4"/> Opslaan</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Annuleren</Button>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Persoonlijke Gegevens Kaart */}
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><User className="h-6 w-6 text-primary"/>Persoonlijke Gegevens</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
                {isEditing && editableChildData ? (
                    <>
                        <div className="grid grid-cols-1 gap-4">
                            <div><Label htmlFor="firstNameEdit">Voornaam</Label><Input id="firstNameEdit" value={editableChildData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} /></div>
                            <div><Label htmlFor="lastNameEdit">Achternaam</Label><Input id="lastNameEdit" value={editableChildData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} /></div>
                        </div>
                        <div>
                            <Label htmlFor="ageGroupEdit">Leeftijdsgroep</Label>
                            <Select value={editableChildData.ageGroup} onValueChange={(value) => handleInputChange('ageGroup', value as AgeGroup)}>
                                <SelectTrigger id="ageGroupEdit"><SelectValue /></SelectTrigger>
                                <SelectContent>{ageGroupOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div><Label htmlFor="childEmailEdit">E-mail Kind</Label><Input id="childEmailEdit" type="email" value={editableChildData.childEmail} onChange={(e) => handleInputChange('childEmail', e.target.value)} /></div>
                        <div>
                            <Label htmlFor="avatarUrlEdit">Avatar URL (optioneel)</Label>
                            <Input id="avatarUrlEdit" value={editableChildData.avatarUrl || ''} onChange={(e) => handleInputChange('avatarUrl', e.target.value)} placeholder="https://example.com/avatar.png"/>
                        </div>
                        <div className="space-y-2">
                            <Label>Of kies een standaard avatar:</Label>
                            <div className="flex flex-wrap gap-2">
                                {predefinedAvatarsForProfile.map(avatar => (
                                    <button key={avatar.id} onClick={() => handleInputChange('avatarUrl', avatar.src)}
                                        className={`rounded-md overflow-hidden border-2 transition-all hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary w-16 h-16
                                        ${editableChildData.avatarUrl === avatar.src ? 'border-primary ring-2 ring-primary scale-105' : 'border-transparent'}`}>
                                        <Image src={avatar.src} alt={avatar.alt} width={64} height={64} data-ai-hint={avatar.hint} className="object-cover"/>
                                    </button>
                                ))}
                            </div>
                            <Input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarUpload} className="hidden"/>
                            <Button onClick={() => avatarInputRef.current?.click()} variant="outline" size="sm"><ImageUp className="mr-2 h-4 w-4"/>Upload Eigen Foto</Button>
                            {editableChildData.avatarUrl && <Button onClick={() => handleInputChange('avatarUrl', null)} variant="ghost" size="sm" className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Verwijder Huidige Foto</Button>}
                        </div>
                    </>
                ) : (
                    <>
                        <div><strong className="font-medium text-foreground/80">Volledige Naam:</strong> <span className="text-foreground">{childData.firstName} {childData.lastName}</span></div>
                        <div><strong className="font-medium text-foreground/80">Leeftijdscategorie:</strong> <span className="text-foreground">{childData.ageGroup || 'N.v.t.'}</span></div>
                        <div><strong className="font-medium text-foreground/80">E-mail Kind:</strong> <span className="text-foreground">{childData.childEmail || 'Niet opgegeven'}</span></div>
                        <div><strong className="font-medium text-foreground/80">Account Status:</strong> <Badge variant={getSubscriptionBadgeVariant(childData.subscriptionStatus)} className={getSubscriptionBadgeClasses(childData.subscriptionStatus)}>{childData.subscriptionStatus.charAt(0).toUpperCase() + childData.subscriptionStatus.slice(1)}</Badge></div>
                    </>
                )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><School className="h-6 w-6 text-primary"/>Schoolinformatie</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
                {isEditing && editableChildData ? (
                    <>
                        <div>
                            <Label htmlFor="schoolTypeEdit">Schooltype</Label>
                            <Select value={editableChildData.schoolType} onValueChange={(value) => handleInputChange('schoolType', value)}>
                                <SelectTrigger id="schoolTypeEdit"><SelectValue placeholder="Kies schooltype" /></SelectTrigger>
                                <SelectContent>{schoolTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div><Label htmlFor="classNameEdit">Klas</Label><Input id="classNameEdit" value={editableChildData.className} onChange={(e) => handleInputChange('className', e.target.value)} /></div>
                    </>
                ) : (
                    <>
                        <p><strong className="font-medium text-foreground/80">Schooltype:</strong> <span className="text-foreground">{childData.schoolType || 'Niet opgegeven'}</span></p>
                        <p><strong className="font-medium text-foreground/80">Klas:</strong> <span className="text-foreground">{childData.className || 'Niet opgegeven'}</span></p>
                    </>
                )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><HelpCircle className="h-6 w-6 text-primary"/>Persoonlijke Begeleidingsbehoefte</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-sm">
                    {isEditing && editableChildData ? (
                        <>
                            <div>
                                <Label className="font-semibold text-foreground/90 mb-1 block">Type Hulpvraag</Label>
                                <div className="space-y-1">
                                    {(['tutor', 'coach'] as const).map(type => (
                                        <div key={type} className="flex items-center space-x-2">
                                            <Checkbox id={`hulpvraag-${type}`} checked={editableChildData.hulpvraagType.includes(type)} onCheckedChange={(checked) => handleCheckboxChange('hulpvraagType', type, !!checked)} />
                                            <Label htmlFor={`hulpvraag-${type}`} className="font-normal">{type === 'tutor' ? 'Hulp bij huiswerk (Tutor)' : '1-op-1 coaching (Coach)'}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label className="font-semibold text-foreground/90 mb-1 block">Hulp bij Vakken</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {allHomeworkSubjects.map(subject => (
                                    <div key={subject.id} className="flex items-center space-x-2">
                                        <Checkbox id={`subject-${subject.id}`} checked={editableChildData.helpSubjects.includes(subject.id)} onCheckedChange={(checked) => handleCheckboxChange('helpSubjects', subject.id, !!checked)} />
                                        <Label htmlFor={`subject-${subject.id}`} className="font-normal">{subject.name}</Label>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <h4 className="font-semibold text-foreground/90 mb-1">Type Hulpvraag</h4>
                                {hulpvraagFormatted.selected.length > 0 && hulpvraagFormatted.selected[0] !== "Niet gespecificeerd" ? (
                                    <p><strong className="font-medium text-foreground/80">Geselecteerd:</strong> <span className="text-foreground">{hulpvraagFormatted.selected.join(', ')}</span></p>
                                ) : (<p><strong className="font-medium text-foreground/80">Geselecteerd:</strong> <span className="text-muted-foreground">Niet gespecificeerd</span></p>)}
                                {hulpvraagFormatted.notSelected.length > 0 && (<p className="mt-1"><strong className="font-medium text-muted-foreground/80">Niet geselecteerd:</strong> <span className="text-muted-foreground">{hulpvraagFormatted.notSelected.join(', ')}</span></p>)}
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground/90 mb-1 flex items-center gap-1"><BookOpen className="h-4 w-4"/>Hulp bij Vakken</h4>
                                {childData.helpSubjects && childData.helpSubjects.length > 0 ? (<ul className="list-disc list-inside space-y-1 pl-2 text-foreground">{childData.helpSubjects.map(id => <li key={id}>{getSubjectName(id)}</li>)}</ul>) 
                                : (<p className="text-muted-foreground">Geen specifieke hulpvakken opgegeven.</p>)}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
            
             <Card className="shadow-lg">
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Target className="h-6 w-6 text-primary"/>Leerdoelen &amp; Aandachtspunten</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-4">
                    {isEditing && editableChildData ? (
                        <>
                            <div>
                                <Label className="font-semibold text-foreground/90 mb-1 block">Selecteer leerdoelen</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {predefinedLeerdoelen.map(doel => (
                                    <div key={doel.id} className="flex items-center space-x-2">
                                        <Checkbox id={`leerdoel-${doel.id}`} checked={editableChildData.selectedLeerdoelen.includes(doel.label)} onCheckedChange={(checked) => handleCheckboxChange('selectedLeerdoelen', doel.label, !!checked)} />
                                        <Label htmlFor={`leerdoel-${doel.id}`} className="font-normal">{doel.label}</Label>
                                    </div>
                                ))}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="otherLeerdoelenEdit">Andere leerdoelen/toelichting</Label>
                                <Textarea id="otherLeerdoelenEdit" value={editableChildData.otherLeerdoelen} onChange={(e) => handleInputChange('otherLeerdoelen', e.target.value)} rows={3} />
                            </div>
                        </>
                    ) : (
                        <>
                            {leerdoelenParsed.selected.length > 0 && (<p><strong className="font-medium text-foreground/80">Geselecteerd:</strong> <span className="text-muted-foreground">{leerdoelenParsed.selected.join(', ')}</span></p>)}
                            {leerdoelenParsed.other && (<p><strong className="font-medium text-foreground/80">Overig:</strong> <span className="text-muted-foreground whitespace-pre-line">{leerdoelenParsed.other}</span></p>)}
                            {leerdoelenParsed.selected.length === 0 && !leerdoelenParsed.other && (<p className="text-muted-foreground">Niet opgegeven.</p>)}
                        </>
                    )}
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><UsersIcon className="h-6 w-6 text-primary"/>Voorkeuren Begeleider</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-4">
                     {isEditing && editableChildData ? (
                        <>
                            <div>
                                <Label className="font-semibold text-foreground/90 mb-1 block">Selecteer voorkeuren</Label>
                                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {predefinedTutorPreferences.map(pref => (
                                    <div key={pref.id} className="flex items-center space-x-2">
                                        <Checkbox id={`pref-${pref.id}`} checked={editableChildData.selectedTutorPreferences.includes(pref.label)} onCheckedChange={(checked) => handleCheckboxChange('selectedTutorPreferences', pref.label, !!checked)} />
                                        <Label htmlFor={`pref-${pref.id}`} className="font-normal">{pref.label}</Label>
                                    </div>
                                ))}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="otherTutorPreferenceEdit">Andere voorkeuren/toelichting</Label>
                                <Textarea id="otherTutorPreferenceEdit" value={editableChildData.otherTutorPreference} onChange={(e) => handleInputChange('otherTutorPreference', e.target.value)} rows={2} />
                            </div>
                        </>
                    ) : (
                        <>
                            {tutorVoorkeurenParsed.selected.length > 0 && (<p><strong className="font-medium text-foreground/80">Geselecteerd:</strong> <span className="text-muted-foreground">{tutorVoorkeurenParsed.selected.join(', ')}</span></p>)}
                            {tutorVoorkeurenParsed.other && (<p><strong className="font-medium text-foreground/80">Overig:</strong> <span className="text-muted-foreground whitespace-pre-line">{tutorVoorkeurenParsed.other}</span></p>)}
                            {tutorVoorkeurenParsed.selected.length === 0 && !tutorVoorkeurenParsed.other && (<p className="text-muted-foreground">Geen specifieke voorkeuren opgegeven.</p>)}
                        </>
                    )}
                </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Share2 className="h-6 w-6 text-primary"/>Privacy &amp; Delen</CardTitle></CardHeader>
                <CardContent className="text-sm">
                    {isEditing && editableChildData ? (
                        <div className="flex items-center space-x-2">
                            <Switch id="deelResultatenEdit" checked={editableChildData.deelResultatenMetTutor} onCheckedChange={(checked) => handleInputChange('deelResultatenMetTutor', checked)} />
                            <Label htmlFor="deelResultatenEdit">Quizresultaten delen met begeleiders</Label>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-foreground/80">Quizresultaten delen met begeleiders:</p>
                            <Badge variant={childData.deelResultatenMetTutor ? "default" : "secondary"} className={childData.deelResultatenMetTutor ? 'bg-green-100 text-green-700 border-green-300' : ''}>
                            {childData.deelResultatenMetTutor ? 'Ja' : 'Nee'}
                            </Badge>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
