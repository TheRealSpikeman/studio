
'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuizCreator } from '@/contexts/QuizCreatorContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Lightbulb, Rocket, BarChart3, CheckCircle2, Search, Settings, Download, Users as UsersIcon, Briefcase, GraduationCap, HeartHandshake, BookOpenCheck, Zap,
  GitBranch, ArrowRight, Plus, Pencil, Trash2, AlertCircle, Brain, Puzzle, Check, RefreshCw, Bot, Info, Sparkles, User
} from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Question {
  id: string;
  text: string;
}

interface Phase2Question extends Question {
  spectrum: string;
}

const Step3_AdaptiveContent = () => {
    const { toast } = useToast();

    // Local state to manage settings for a live preview
    const [previewSettings, setPreviewSettings] = useState({
      phase1Questions: 18,
      phase2MaxPerSpectrum: 14,
      phase2MaxTotal: 20,
      spectrums: [
        { id: 'adhd', name: 'ADHD', threshold: 70 },
        { id: 'ass', name: 'Autisme', threshold: 68 },
        { id: 'hsp', name: 'HSP', threshold: 62 },
        { id: 'executive', name: 'Executieve Functies', threshold: 65 },
        { id: 'sensory', name: 'Sensorische Verwerking', threshold: 55 },
        { id: 'emotion', name: 'Emotieregulatie', threshold: 50 },
      ]
    });

    const [phase1Questions, setPhase1Questions] = useState<Question[]>([
        { id: 'p1q1', text: 'Hoe reageer je op veel prikkels tegelijk?' },
        { id: 'p1q2', text: 'Hoe ga je om met routineveranderingen?' },
        { id: 'p1q3', text: 'Hoe makkelijk kun je je concentreren op een saaie taak?' },
    ]);
    const [phase2Questions, setPhase2Questions] = useState<Phase2Question[]>([
        { id: 'p2q1', text: 'Welke strategieën helpen bij focus?', spectrum: 'ADHD' },
        { id: 'p2q2', text: 'Hoe herken je overstimulatie?', spectrum: 'HSP' },
        { id: 'p2q3', text: 'Wat doe je als je een grap niet begrijpt?', spectrum: 'ASS' },
    ]);

    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        mode: 'add' | 'edit';
        type: 'phase1' | 'phase2';
        question?: Question | Phase2Question;
        index?: number;
    } | null>(null);

    const [modalQuestionText, setModalQuestionText] = useState('');
    const [modalQuestionSpectrum, setModalQuestionSpectrum] = useState('ADHD');

    const [expandedLists, setExpandedLists] = useState<{phase1: boolean, phase2: boolean}>({ phase1: false, phase2: false });

    // State to hold the calculated preview output
    const [previewOutput, setPreviewOutput] = useState<{ name: string; score: number; triggered: boolean; questionsAssigned: number }[]>([]);
    const [totalPhase2Questions, setTotalPhase2Questions] = useState(0);

    // Update handler for all inputs and sliders
    const handleSettingChange = (field: keyof typeof previewSettings, value: any) => {
      setPreviewSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSpectrumThresholdChange = (id: string, newThreshold: number) => {
      setPreviewSettings(prev => ({
        ...prev,
        spectrums: prev.spectrums.map(spec =>
          spec.id === id ? { ...spec, threshold: newThreshold } : spec
        ),
      }));
    };
    
     const runSimulation = useCallback(() => {
        const simulatedResults = previewSettings.spectrums.map(spec => {
            const score = Math.floor(Math.random() * 71) + 30;
            const triggered = score >= spec.threshold;
            return { name: spec.name, score, triggered };
        });
    
        const triggeredSpectrums = simulatedResults
            .filter(res => res.triggered)
            .sort((a, b) => b.score - a.score); // Prioritize highest scores
    
        let currentTotalQuestions = 0;
        const questionDistribution: Record<string, number> = {};
    
        for (const spectrum of triggeredSpectrums) {
            const spaceRemainingInQuiz = previewSettings.phase2MaxTotal - currentTotalQuestions;
            if (spaceRemainingInQuiz <= 0) {
                questionDistribution[spectrum.name] = 0;
                continue;
            }
            
            const questionsForThisSpectrum = Math.min(previewSettings.phase2MaxPerSpectrum, spaceRemainingInQuiz);
            questionDistribution[spectrum.name] = questionsForThisSpectrum;
            currentTotalQuestions += questionsForThisSpectrum;
        }
        
        const newOutput = simulatedResults.map(res => ({
            ...res,
            questionsAssigned: questionDistribution[res.name] || 0
        }));
    
        setPreviewOutput(newOutput);
        setTotalPhase2Questions(currentTotalQuestions);
    }, [previewSettings]);

    const handleOptimizeThresholds = () => {
        const optimizedThresholds = {
            adhd: 70, ass: 68, hsp: 62, executive: 65, sensory: 55, emotion: 50,
        };
        setPreviewSettings(currentSettings => {
            const newSpectrums = currentSettings.spectrums.map(spec => ({
                ...spec,
                threshold: optimizedThresholds[spec.id as keyof typeof optimizedThresholds] || spec.threshold,
            }));
            return { ...currentSettings, spectrums: newSpectrums };
        });
        toast({ title: "Drempelwaardes geoptimaliseerd", description: "De aanbevolen drempelwaardes zijn ingesteld." });
    };

    useEffect(() => { runSimulation(); }, [runSimulation]);

    const validationChecks = useMemo(() => {
        const checks: {text: string; isValid?: boolean; isWarning?: boolean; isPending?: boolean, tooltip?: string}[] = [];
        checks.push({ text: `Minimaal 15 Fase 1 vragen`, isValid: previewSettings.phase1Questions >= 15 });
        checks.push({ text: 'Algoritme gekalibreerd', isValid: previewSettings.spectrums.some(s => s.threshold > 0 && s.threshold < 100) });
        const hspThreshold = previewSettings.spectrums.find(s => s.id === 'hsp')?.threshold;
        if (hspThreshold !== undefined && hspThreshold < 55) {
            checks.push({ text: `HSP threshold (${hspThreshold}%) mogelijk te laag`, isWarning: true });
        }
        checks.push({ 
            text: 'Expert review pending', 
            isPending: true,
            tooltip: 'Een expert (bijv. een psycholoog) moet de configuratie en vraagstelling nog controleren voordat deze live kan gaan. Deze status is informatief.'
        });
        return checks;
    }, [previewSettings]);

    const openNewQuestionModal = () => {
        setModalConfig({ mode: 'add', type: 'phase1' }); // Default to phase 1
        setModalQuestionText('');
        setModalQuestionSpectrum('ADHD'); // Default spectrum for phase 2
        setIsQuestionModalOpen(true);
    };

    const openEditQuestionModal = (question: Question | Phase2Question, index: number, type: 'phase1' | 'phase2') => {
        setModalConfig({ mode: 'edit', type, question, index });
        setModalQuestionText(question.text);
        if (type === 'phase2') {
            setModalQuestionSpectrum((question as Phase2Question).spectrum);
        }
        setIsQuestionModalOpen(true);
    };

    const handleDeleteQuestion = (id: string, type: 'phase1' | 'phase2') => {
        if (type === 'phase1') {
            setPhase1Questions(prev => prev.filter(q => q.id !== id));
        } else {
            setPhase2Questions(prev => prev.filter(q => q.id !== id));
        }
        toast({ title: "Vraag verwijderd." });
    };

    const handleSaveQuestion = () => {
        if (!modalQuestionText.trim() || !modalConfig) {
            toast({ title: "Fout", description: "Vraagtekst mag niet leeg zijn.", variant: "destructive" });
            return;
        }

        if (modalConfig.mode === 'edit') {
            const { type, index } = modalConfig;
            if (type === 'phase1') {
                setPhase1Questions(prev => prev.map((q, i) => (i === index ? { ...q, text: modalQuestionText } : q)));
            } else {
                setPhase2Questions(prev => prev.map((q, i) => (i === index ? { ...(q as Phase2Question), text: modalQuestionText, spectrum: modalQuestionSpectrum } : q)));
            }
            toast({ title: "Vraag bijgewerkt." });
        } else { // mode === 'add'
            const newId = `q-${Date.now()}`;
            if (modalConfig.type === 'phase1') {
                setPhase1Questions(prev => [...prev, { id: newId, text: modalQuestionText }]);
            } else {
                setPhase2Questions(prev => [...prev, { id: newId, text: modalQuestionText, spectrum: modalQuestionSpectrum }]);
            }
            toast({ title: "Nieuwe vraag toegevoegd." });
        }
        setIsQuestionModalOpen(false);
    };

    const visiblePhase1Questions = expandedLists.phase1 ? phase1Questions : phase1Questions.slice(0, 2);
    const visiblePhase2Questions = expandedLists.phase2 ? phase2Questions : phase2Questions.slice(0, 2);


    return (
        <div className="space-y-6">
            <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700">
                <GitBranch className="h-5 w-5 !text-blue-600" />
                <AlertTitle className="text-blue-700 font-semibold">Adaptive Onboarding Quiz Setup</AlertTitle>
                <AlertDescription className="text-blue-800">
                    <strong>Geen handmatige focus selectie nodig!</strong> Deze quiz detecteert automatisch welke neurodiversiteit spectrums relevant zijn.
                    Hieronder configureer je hoe de detectie werkt en welke vragen gebruikt worden.
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Detection Algorithm</CardTitle>
                        <CardDescription>Configureer hier hoe de quiz automatisch relevante spectrums detecteert.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 border rounded-md bg-muted/50">
                           <h4 className="font-semibold text-sm mb-2 text-primary">Fase 1: Spectrum Detectie</h4>
                           <div className="config-group">
                                <Label htmlFor="phase1-questions" className="text-xs font-medium text-muted-foreground mb-1 block">Aantal Vragen</Label>
                                <Input id="phase1-questions" type="number" value={previewSettings.phase1Questions} onChange={(e) => handleSettingChange('phase1Questions', parseInt(e.target.value, 10) || 0)} />
                                <p className="text-xs text-muted-foreground mt-1">Optimaal: 15-20 voor accuracy vs completion</p>
                           </div>
                        </div>
                         <div className="p-3 border rounded-md bg-muted/50">
                           <h4 className="font-semibold text-sm mb-2 text-primary">Fase 2: Gerichte Verdieping</h4>
                           <div className="grid grid-cols-2 gap-3">
                               <div className="config-group">
                                    <Label htmlFor="phase2-max-per" className="text-xs font-medium text-muted-foreground mb-1 block">Vragen per Verdieping</Label>
                                    <Input id="phase2-max-per" type="number" value={previewSettings.phase2MaxPerSpectrum} onChange={(e) => handleSettingChange('phase2MaxPerSpectrum', parseInt(e.target.value, 10) || 0)} />
                                     <p className="text-xs text-muted-foreground mt-1">Aantal vragen per getriggerde verdieping.</p>
                               </div>
                               <div className="config-group">
                                    <Label htmlFor="phase2-max-total" className="text-xs font-medium text-muted-foreground mb-1 block">Maximum Totaal Vragen (Fase 2)</Label>
                                    <Input id="phase2-max-total" type="number" value={previewSettings.phase2MaxTotal} onChange={(e) => handleSettingChange('phase2MaxTotal', parseInt(e.target.value, 10) || 0)} />
                                    <p className="text-xs text-muted-foreground mt-1">Veiligheidslimiet voor totale quizlengte.</p>
                               </div>
                           </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                       <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Algorithm Preview</CardTitle>
                                <CardDescription>Live simulatie van de detectie.</CardDescription>
                            </div>
                            <Button onClick={runSimulation} variant="outline" size="sm">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Run Simulatie
                            </Button>
                       </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono bg-muted px-2 py-1 rounded">
                            <span>Scores</span><ArrowRight className="h-4 w-4 text-muted-foreground"/><ArrowRight className="h-4 w-4 text-muted-foreground"/>
                            <span>Thresholds</span>
                        </div>
                        <div className="p-3 border rounded-md bg-background text-sm">
                            <p className="font-semibold">Voorbeeld Output:</p>
                            {previewOutput.length > 0 ? previewOutput.map((item, index) => (
                                <p key={item.name} className={cn("text-xs", item.triggered ? "text-green-600 font-medium" : "text-muted-foreground")}>
                                    {item.name}: {item.score}% {item.triggered ? `(✓) → ${item.questionsAssigned} vragen` : `(✗) → Skip`}
                                </p>
                            )) : <p className="text-xs text-muted-foreground">Klik op "Run Simulatie" om een voorbeeld te zien.</p>}
                            <Separator className="my-1"/>
                             <p className="font-semibold mt-1">Totaal Fase 2: {totalPhase2Questions} vragen</p>
                             <p className="text-xs text-muted-foreground italic mt-1">Geprioriteerd op hoogste score, tot max. {previewSettings.phase2MaxTotal} vragen is bereikt.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <div className="flex justify-between items-center mb-3">
                    <div>
                        <h3 className="text-lg font-medium text-foreground">Spectrum Detection Thresholds (%)</h3>
                        <p className="text-sm text-muted-foreground -mt-1">Stel hier de drempelwaarde in om een verdiepende vragenlijst te activeren.</p>
                    </div>
                    <Button onClick={handleOptimizeThresholds} variant="outline" size="sm">
                        <Bot className="mr-2 h-4 w-4" /> Bepaal Optimale Waardes (AI)
                    </Button>
                </div>
                <Card className="p-4">
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 p-0">
                        {previewSettings.spectrums.map(spec => (
                            <div key={spec.id}>
                                <Label htmlFor={`threshold-${spec.id}`} className="text-sm font-medium">{spec.name}</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Slider
                                        value={[spec.threshold]}
                                        onValueChange={(val) => handleSpectrumThresholdChange(spec.id, val[0])}
                                        max={100}
                                        step={1}
                                        id={`threshold-${spec.id}`}
                                    />
                                    <span className="text-sm font-semibold w-10 text-right">{spec.threshold}%</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                   <div>
                    <CardTitle>Question Bank Management</CardTitle>
                    <CardDescription>Beheer hier de vragen die gebruikt worden in de detectie- en verdiepingsfases.</CardDescription>
                   </div>
                    <Button onClick={openNewQuestionModal}><Plus className="mr-2 h-4 w-4"/>Nieuwe Vraag</Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-md bg-muted/30">
                        <h4 className="font-semibold mb-2 flex justify-between">Fase 1: Detectie Vragen <Badge variant="secondary">{phase1Questions.length}</Badge></h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                             {visiblePhase1Questions.map((q, index) => (
                                 <div key={q.id} className="text-xs flex justify-between items-center bg-card p-2 rounded border">
                                     <span className="flex-1 pr-2">{q.text}</span>
                                     <div className="space-x-1 flex-shrink-0">
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => openEditQuestionModal(q, index, 'phase1')}><Pencil className="h-3 w-3"/></Button>
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDeleteQuestion(q.id, 'phase1')}><Trash2 className="h-3 w-3"/></Button>
                                     </div>
                                 </div>
                             ))}
                        </div>
                        {phase1Questions.length > 2 && (
                            <Button variant="link" size="sm" className="text-xs p-0 h-auto mt-2" onClick={() => setExpandedLists(p => ({...p, phase1: !p.phase1}))}>
                                {expandedLists.phase1 ? 'Verberg' : `+ ${phase1Questions.length - 2} meer vragen...`}
                            </Button>
                        )}
                    </div>
                     <div className="p-4 border rounded-md bg-muted/30">
                        <h4 className="font-semibold mb-2 flex justify-between">Fase 2: Verdiepingsvragen <Badge variant="secondary">{phase2Questions.length}</Badge></h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                             {visiblePhase2Questions.map((q, index) => (
                                 <div key={q.id} className="text-xs flex justify-between items-center bg-card p-2 rounded border">
                                     <span className="flex-1 pr-2">[{q.spectrum}] {q.text}</span>
                                     <div className="space-x-1 flex-shrink-0">
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => openEditQuestionModal(q, index, 'phase2')}><Pencil className="h-3 w-3"/></Button>
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDeleteQuestion(q.id, 'phase2')}><Trash2 className="h-3 w-3"/></Button>
                                     </div>
                                 </div>
                             ))}
                        </div>
                        {phase2Questions.length > 2 && (
                            <Button variant="link" size="sm" className="text-xs p-0 h-auto mt-2" onClick={() => setExpandedLists(p => ({...p, phase2: !p.phase2}))}>
                                {expandedLists.phase2 ? 'Verberg' : `+ ${phase2Questions.length - 2} meer vragen...`}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

             <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-700">
                <AlertCircle className="h-5 w-5 !text-yellow-600"/>
                <AlertTitle className="text-yellow-700 font-semibold">Quiz Validation Status</AlertTitle>
                <AlertDescription className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-yellow-800 text-sm">
                    {validationChecks.map((check, index) => (
                        <TooltipProvider key={index}>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <span className="flex items-center gap-1.5 cursor-help">
                                        {check.isValid ? ( <CheckCircle2 className="h-4 w-4 text-green-600"/>
                                        ) : check.isWarning ? ( <AlertCircle className="h-4 w-4 text-orange-600"/>
                                        ) : check.isPending ? ( <AlertCircle className="h-4 w-4 text-red-600"/>
                                        ) : ( <AlertCircle className="h-4 w-4 text-red-600"/> )}
                                        <span className={cn(check.isWarning && "text-orange-700 font-medium", check.isPending && "text-red-700 font-medium")}>
                                            {check.text}
                                        </span>
                                    </span>
                                </TooltipTrigger>
                                {check.tooltip && <TooltipContent><p>{check.tooltip}</p></TooltipContent>}
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </AlertDescription>
            </Alert>

            {isQuestionModalOpen && (
                <Dialog open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{modalConfig?.mode === 'edit' ? 'Vraag Bewerken' : 'Nieuwe Vraag Toevoegen'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                           {modalConfig?.mode === 'add' && (
                               <div>
                                   <Label>Type vraag</Label>
                                   <Select value={modalConfig.type} onValueChange={(v) => setModalConfig(p => p ? {...p, type: v as 'phase1'|'phase2'} : null)}>
                                       <SelectTrigger><SelectValue/></SelectTrigger>
                                       <SelectContent>
                                           <SelectItem value="phase1">Fase 1 (Detectie)</SelectItem>
                                           <SelectItem value="phase2">Fase 2 (Verdieping)</SelectItem>
                                       </SelectContent>
                                   </Select>
                               </div>
                           )}
                           {modalConfig?.type === 'phase2' && (
                               <div>
                                   <Label>Spectrum</Label>
                                   <Select value={modalQuestionSpectrum} onValueChange={setModalQuestionSpectrum}>
                                       <SelectTrigger><SelectValue/></SelectTrigger>
                                       <SelectContent>
                                           {previewSettings.spectrums.map(s => <SelectItem key={s.id} value={s.id.toUpperCase()}>{s.name}</SelectItem>)}
                                       </SelectContent>
                                   </Select>
                               </div>
                           )}
                           <div>
                               <Label htmlFor="question-text-modal">Vraagtekst</Label>
                               <Textarea id="question-text-modal" value={modalQuestionText} onChange={(e) => setModalQuestionText(e.target.value)} />
                           </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsQuestionModalOpen(false)}>Annuleren</Button>
                            <Button onClick={handleSaveQuestion}>Opslaan</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Step3_AdaptiveContent;
