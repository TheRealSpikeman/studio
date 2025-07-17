// src/app/dashboard/tutor/onboarding/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SiteLogo } from '@/components/common/site-logo'; 
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

const MOCKED_TUTOR_ONBOARDING_USER = {
  email: "tutor.test@example.com", 
  status: 'pending_onboarding' as 'pending_onboarding' | 'pending_approval' | 'actief',
};

const subjectOptions = [
  { id: "nederlands", label: "Nederlands" }, { id: "wiskunde", label: "Wiskunde" },
  { id: "engels", label: "Engels" }, { id: "geschiedenis", label: "Geschiedenis" },
  { id: "aardrijkskunde", label: "Aardrijkskunde" }, { id: "biologie", label: "Biologie" },
  { id: "scheikunde", label: "Scheikunde" }, { id: "natuurkunde", label: "Natuurkunde" },
  { id: "economie", label: "Economie" }, { id: "frans", label: "Frans" },
  { id: "duits", label: "Duits" }, { id: "overig", label: "Overig (specificeer in bio)" },
];

const TOTAL_STEPS = 5;

export default function TutorOnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    subjects: [] as string[],
    hourlyRate: 20,
    cvFile: null as File | null,
    vogFile: null as File | null,
    agreeToTerms: false,
    availability: '',
    bio: '',
  });

  useEffect(() => {
    // Redirect if user status is not suitable for this page.
    if (MOCKED_TUTOR_ONBOARDING_USER.status === 'actief') {
        toast({ title: "Profiel al actief", description: "U wordt doorgestuurd naar uw dashboard.", duration: 3000 });
        router.replace('/dashboard/tutor');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubjectsChange = (subjectId: string) => {
    setFormData(prev => {
      const newSubjects = prev.subjects.includes(subjectId)
        ? prev.subjects.filter(s => s !== subjectId)
        : [...prev.subjects, subjectId];
      return { ...prev, subjects: newSubjects };
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'cvFile' | 'vogFile') => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [fieldName]: e.target.files![0] }));
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmitForReview = () => {
    console.log("Submitting tutor profile for review:", formData, "User:", MOCKED_TUTOR_ONBOARDING_USER.email);
    MOCKED_TUTOR_ONBOARDING_USER.status = 'pending_approval'; 
    toast({
      title: "Profiel ingediend voor beoordeling",
      description: "Je profiel is compleet ingevuld. Onze administrators gaan je aanvraag nu beoordelen. Dit kan 1–2 werkdagen duren.",
      duration: 7000,
    });
    router.push('/dashboard/tutor'); 
  };
  
  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: 
        return (
          <div className="space-y-4">
            <CardTitle className="text-xl">Stap 1: Wachtwoord Instellen</CardTitle>
            <p className="text-sm text-muted-foreground">Kies een sterk, nieuw wachtwoord voor je account.</p>
            <div>
              <Label htmlFor="password">Nieuw wachtwoord</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Bevestig nieuw wachtwoord</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} />
            </div>
             {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-destructive">Wachtwoorden komen niet overeen.</p>
            )}
          </div>
        );
      case 2: 
        return (
          <div className="space-y-6">
            <CardTitle className="text-xl">Stap 2: Vakken & Uurtarief</CardTitle>
            <div>
              <Label>In welke vakken wil je bijles geven?</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {subjectOptions.map(opt => (
                  <div key={opt.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`subject-${opt.id}`} 
                      checked={formData.subjects.includes(opt.id)}
                      onCheckedChange={() => handleSubjectsChange(opt.id)}
                    />
                    <Label htmlFor={`subject-${opt.id}`} className="font-normal cursor-pointer">{opt.label}</Label>
                  </div>
                ))}
              </div>
               {formData.subjects.length === 0 && <p className="text-sm text-destructive mt-1">Selecteer minimaal één vak.</p>}
            </div>
            <div>
              <Label htmlFor="hourlyRate">Gewenst uurtarief (excl. 10% servicekosten, min €10)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                <Input id="hourlyRate" name="hourlyRate" type="number" min="10" value={formData.hourlyRate} onChange={handleInputChange} className="pl-7" />
              </div>
            </div>
            <div>
                <Label htmlFor="bio">Korte bio / motivatie (min. 50 tekens)</Label>
                <Textarea id="bio" name="bio" placeholder="Vertel iets over jezelf, je ervaring en waarom je een goede tutor zou zijn..." value={formData.bio} onChange={handleInputChange} rows={4} />
                 {formData.bio.length > 0 && formData.bio.length < 50 && <p className="text-sm text-destructive mt-1">Bio is te kort.</p>}
            </div>
          </div>
        );
      case 3: 
        return (
          <div className="space-y-6">
            <CardTitle className="text-xl">Stap 3: Documenten Uploaden</CardTitle>
            <div>
              <Label htmlFor="cvFile">Upload CV (PDF, max 5MB)</Label>
              <Input id="cvFile" name="cvFile" type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'cvFile')} className="pt-1.5"/>
              {formData.cvFile && <p className="text-xs text-muted-foreground mt-1">Geselecteerd: {formData.cvFile.name}</p>}
            </div>
            <div>
              <Label htmlFor="vogFile">Upload VOG (PDF, max 5MB, niet ouder dan 2 jaar)</Label>
              <Input id="vogFile" name="vogFile" type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'vogFile')} className="pt-1.5"/>
               {formData.vogFile && <p className="text-xs text-muted-foreground mt-1">Geselecteerd: {formData.vogFile.name}</p>}
            </div>
            <div className="flex items-start space-x-2 pt-2">
                <Checkbox id="agreeToTerms" name="agreeToTerms" checked={formData.agreeToTerms} onCheckedChange={(checked) => setFormData(prev => ({...prev, agreeToTerms: !!checked}))} />
                <Label htmlFor="agreeToTerms" className="text-sm font-normal cursor-pointer">
                Ik heb de tutor-voorwaarden gelezen en ga akkoord met de 10% servicekosten.
                </Label>
            </div>
          </div>
        );
      case 4: 
        return (
          <div className="space-y-4">
            <CardTitle className="text-xl">Stap 4: Beschikbaarheid</CardTitle>
            <p className="text-sm text-muted-foreground">Geef een indicatie van je wekelijkse beschikbaarheid. Je kunt dit later verfijnen.</p>
            <Textarea 
              id="availability" 
              name="availability" 
              placeholder="Bijv: Maandagavond (18-21u), woensdagmiddag (14-17u), zaterdag (hele dag flexibel)." 
              value={formData.availability} 
              onChange={handleInputChange} 
              rows={5} 
            />
          </div>
        );
      case 5: 
        return (
          <div className="space-y-4">
            <CardTitle className="text-xl flex items-center gap-2"><CheckCircle2 className="text-green-500 h-6 w-6" />Stap 5: Bevestiging</CardTitle>
            <p className="text-muted-foreground">Controleer je gegevens. Als alles klopt, kun je je profiel indienen voor beoordeling.</p>
            <div className="space-y-1 text-sm p-3 border rounded-md bg-muted/50">
              <p><strong>E-mail:</strong> {MOCKED_TUTOR_ONBOARDING_USER.email}</p>
              <p><strong>Vakken:</strong> {formData.subjects.join(', ') || 'Nog niet geselecteerd'}</p>
              <p><strong>Uurtarief:</strong> €{formData.hourlyRate}</p>
              <p><strong>Bio:</strong> {formData.bio.substring(0,50) || 'Nog niet ingevuld'}{formData.bio.length > 50 ? '...' : ''}</p>
              <p><strong>CV:</strong> {formData.cvFile?.name || 'Nog niet geüpload'}</p>
              <p><strong>VOG:</strong> {formData.vogFile?.name || 'Nog niet geüpload'}</p>
              <p><strong>Beschikbaarheid:</strong> {formData.availability.substring(0,50) || 'Nog niet ingevuld'}{formData.availability.length > 50 ? '...' : ''}</p>
              <p><strong>Akkoord voorwaarden:</strong> {formData.agreeToTerms ? 'Ja' : 'Nee'}</p>
            </div>
            {!formData.agreeToTerms && <p className="text-destructive text-sm"><ShieldAlert className="inline h-4 w-4 mr-1"/>Je moet akkoord gaan met de voorwaarden.</p>}
          </div>
        );
      default:
        return <p>Ongeldige stap.</p>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <div className="absolute top-8 left-8">
            <SiteLogo />
        </div>
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Voltooi je Tutor Profiel</CardTitle>
          <CardDescription className="text-center">
            Welkom {MOCKED_TUTOR_ONBOARDING_USER.email}! Doorloop de stappen om je profiel compleet te maken.
          </CardDescription>
          <Progress value={progressPercentage} className="mt-4" />
          <p className="text-xs text-muted-foreground text-center mt-1">Stap {currentStep} van {TOTAL_STEPS}</p>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
        <CardFooter className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Vorige
          </Button>
          {currentStep < TOTAL_STEPS ? (
            <Button onClick={nextStep}>
              Volgende <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmitForReview} disabled={!formData.agreeToTerms}>
              Dien in voor Beoordeling
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
