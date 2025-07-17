// src/components/dashboard/results/SingleScoreChart.tsx
"use client";

import { useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Lightbulb, Triangle, Info } from '@/lib/icons';

interface SingleScoreChartProps {
  score: number;
  maxScore?: number;
  scoreLabel: string;
  audience?: string;
}

interface InterpretationContent {
    low: string;
    medium: string;
    high: string;
    very_high: string;
}

interface InterpretationSet {
    label: string;
    self: InterpretationContent;
    parent: InterpretationContent;
}

const scoreInterpretations: Record<string, InterpretationSet> = {
  'Prikkels & Omgeving': {
    label: 'Gevoeligheid voor Prikkels',
    self: {
      low: 'Je lijkt comfortabel in de meeste omgevingen en raakt niet snel overbelast door drukte, geluid of licht.',
      medium: 'Je bent soms gevoelig voor prikkels. In drukke of nieuwe situaties kan dit tot uiting komen, maar over het algemeen is er een goede balans.',
      high: 'Je ervaart prikkels intenser dan gemiddeld. Het is waarschijnlijk belangrijk om rekening te houden met rustmomenten na drukke activiteiten.',
      very_high: 'Je bent zeer gevoelig voor prikkels. Drukte, lawaai en onverwachte gebeurtenissen kunnen snel tot overbelasting leiden. Structuur en voorspelbaarheid zijn essentieel.',
    },
    parent: {
      low: 'Uw observaties duiden op een lage gevoeligheid voor prikkels. Uw kind lijkt comfortabel in de meeste omgevingen en raakt niet snel overbelast door drukte, geluid of licht.',
      medium: 'U observeert dat uw kind soms gevoelig is voor prikkels. In drukke of nieuwe situaties kan dit tot uiting komen, maar over het algemeen is er een goede balans.',
      high: 'Uw observaties wijzen erop dat uw kind prikkels intenser ervaart dan gemiddeld. Het is waarschijnlijk belangrijk om rekening te houden met rustmomenten na drukke activiteiten.',
      very_high: 'U observeert dat uw kind zeer gevoelig is voor prikkels. Drukte, lawaai en onverwachte gebeurtenissen kunnen snel tot overbelasting leiden.',
    }
  },
  'Omgaan met Examenvrees': {
    label: 'Mate van Examenvrees',
    self: {
        low: 'Je ervaart een gezonde spanning voor toetsen, wat normaal is en je scherp houdt. Examenvrees lijkt geen belemmering te vormen voor je prestaties.',
        medium: 'Je ervaart een merkbare spanning voor examens, wat soms kan leiden tot uitstelgedrag of nervositeit. Basisstrategieën voor stressmanagement kunnen zeer nuttig zijn.',
        high: 'Examenvrees is een significant aandachtspunt voor je. De spanning is hoog en kan je prestaties beïnvloeden. Het is waardevol om hier gerichte strategieën voor te leren.',
        very_high: 'Je ervaart een intense mate van examenvrees die mogelijk kan leiden tot black-outs of het volledig vermijden van toetsmomenten. Gerichte ondersteuning is sterk aan te raden.',
    },
    parent: {
        low: 'Uw kind lijkt een gezonde spanning voor toetsen te ervaren. Examenvrees lijkt geen belemmering voor prestaties te vormen.',
        medium: 'U observeert dat uw kind merkbare spanning ervaart voor examens, wat soms kan leiden tot uitstelgedrag of nervositeit.',
        high: 'Examenvrees lijkt een significant aandachtspunt. De spanning is hoog en kan de prestaties van uw kind beïnvloeden.',
        very_high: 'U observeert een intense mate van examenvrees die mogelijk kan leiden tot black-outs of het vermijden van toetsmomenten.',
    }
  },
  'Vriendschappen & Sociaal': {
    label: 'Jouw Sociale Stijl',
    self: {
        low: 'Je voelt je comfortabel in sociale situaties en legt makkelijk contact. Vriendschappen zijn een bron van energie.',
        medium: 'Je vindt sociale contacten prettig, maar hebt ook tijd voor jezelf nodig. Je kiest je vrienden bewust.',
        high: 'Sociale situaties kunnen soms energie kosten. Je hebt een voorkeur voor diepgaande gesprekken in kleine groepen.',
        very_high: 'Je vindt sociale interacties vaak complex en vermoeiend. Duidelijke communicatie en voorspelbaarheid zijn voor jou erg belangrijk in vriendschappen.',
    },
    parent: {
        low: 'Uw kind lijkt zich comfortabel te voelen in sociale situaties en legt makkelijk contact. Vriendschappen zijn een bron van energie.',
        medium: 'Uw kind vindt sociale contacten prettig, maar heeft ook tijd voor zichzelf nodig en kiest vrienden bewust.',
        high: 'U observeert dat sociale situaties soms energie kosten. Uw kind heeft mogelijk een voorkeur voor diepgaande gesprekken in kleine groepen.',
        very_high: 'U observeert dat uw kind sociale interacties vaak complex en vermoeiend vindt. Duidelijke communicatie en voorspelbaarheid lijken belangrijk.',
    }
  },
  'Leren & School': {
    label: 'Invloed op Leren & School',
    self: {
        low: 'De kenmerken van dit thema lijken een kleine rol te spelen in jouw leerervaring. Jouw aanpak op school is over het algemeen effectief.',
        medium: 'Kenmerken van dit thema zijn regelmatig van invloed op jouw schoolervaring, soms als ondersteuning, soms als uitdaging.',
        high: 'Dit thema heeft een duidelijke invloed op hoe jij leert en presteert. Gerichte strategieën kunnen je helpen je doelen makkelijker te bereiken.',
        very_high: 'De kenmerken van dit thema zijn sterk bepalend voor jouw school- en leerervaring. Een specifieke, op jou afgestemde aanpak is essentieel voor je succes.',
    },
    parent: {
        low: 'De kenmerken van dit thema lijken een kleine rol te spelen in de leerervaring van uw kind. De aanpak op school lijkt effectief.',
        medium: 'U observeert dat kenmerken van dit thema regelmatig van invloed zijn op de schoolervaring van uw kind.',
        high: 'Dit thema heeft een duidelijke invloed op hoe uw kind leert en presteert. Gerichte strategieën kunnen helpen.',
        very_high: 'U observeert dat de kenmerken van dit thema sterk bepalend zijn voor de school- en leerervaring van uw kind.',
    }
  },
  'default': {
    label: 'Herkenning van Kenmerken',
    self: {
      low: 'Je herkent de kenmerken binnen dit thema in lichte mate. Ze spelen een kleine rol in je dagelijks leven.',
      medium: 'Je herkent de kenmerken van dit thema regelmatig. Ze zijn een merkbaar onderdeel van je ervaring, maar niet altijd op de voorgrond.',
      high: 'Je herkent de kenmerken van dit thema sterk. Ze spelen een duidelijke en belangrijke rol in hoe je functioneert en de wereld ervaart.',
      very_high: 'Je herkent de kenmerken van dit thema zeer sterk. Ze zijn een centraal en bepalend onderdeel van je dagelijkse leven en ervaringen.',
    },
    parent: {
      low: 'U herkent de kenmerken binnen dit thema in lichte mate bij uw kind. Ze spelen een kleine rol in het dagelijks leven van uw kind.',
      medium: 'U herkent de kenmerken van dit thema regelmatig bij uw kind. Ze zijn een merkbaar onderdeel van de ervaring van uw kind, maar niet altijd op de voorgrond.',
      high: 'U herkent de kenmerken van dit thema sterk bij uw kind. Ze spelen een duidelijke en belangrijke rol in hoe uw kind functioneert en de wereld ervaart.',
      very_high: 'U herkent de kenmerken van dit thema zeer sterk bij uw kind. Ze zijn een centraal en bepalend onderdeel van het dagelijks leven van uw kind.',
    }
  },
};


export function SingleScoreChart({ score, maxScore = 4, scoreLabel, audience }: SingleScoreChartProps) {
  const isParentView = audience?.toLowerCase().includes('ouder');
  const percentage = Math.min(100, Math.max(0, ((score - 1) / (maxScore - 1)) * 100));

  const levelInfo = useMemo(() => {
    // 1.0-1.75 = Laag, 1.75-2.5 = Gemiddeld, 2.5-3.25 = Hoog, 3.25-4.0 = Zeer Hoog
    if (score <= 1.75) return { level: 'Laag', key: 'low' as const, color: 'text-green-600', bgColor: 'bg-green-500' };
    if (score <= 2.5) return { level: 'Gemiddeld', key: 'medium' as const, color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
    if (score <= 3.25) return { level: 'Hoog', key: 'high' as const, color: 'text-orange-600', bgColor: 'bg-orange-500' };
    return { level: 'Zeer Hoog', key: 'very_high' as const, color: 'text-red-600', bgColor: 'bg-red-500' };
  }, [score]);
  
  const interpretationData = scoreInterpretations[scoreLabel] || scoreInterpretations.default;
  const viewType = isParentView ? 'parent' : 'self';
  
  const interpretationText = interpretationData[viewType][levelInfo.key];
  
  const scoreCalculationText = isParentView
    ? `De score van ${score.toFixed(1)} (op een schaal van 1 tot ${maxScore}) is het gemiddelde van al uw antwoorden op de vragen in deze quiz. "Nooit" telt als 1 punt, "Soms" als 2, "Vaak" als 3, en "Altijd" als 4. Een hogere score betekent dat u de kenmerken van dit thema vaker bij uw kind herkent.`
    : `Je score van ${score.toFixed(1)} (op een schaal van 1 tot ${maxScore}) is het gemiddelde van al je antwoorden op de vragen in deze quiz. "Nooit" telt als 1 punt, "Soms" als 2, "Vaak" als 3, en "Altijd" als 4. Een hogere score betekent dat je de kenmerken van dit thema vaker herkent.`;

  const dynamicDescription = isParentView ? `Uw observatiescore op het hoofdonderwerp van deze quiz.` : `Jouw score op het hoofdonderwerp van deze quiz.`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">{scoreLabel}</h2>
        <p className="text-sm text-muted-foreground mt-1">{dynamicDescription}</p>
      </div>
      
      {/* Score Meter Visual */}
      <div>
        <div className="relative h-12">
          {/* The new gradient bar */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-full h-3 rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(to right, #e8f5e8, #b8e6b8, #ffe4b8, #ffb8b8)',
            }}
          >
            {/* Subtle zone indicators */}
            <div className="absolute h-full w-px bg-slate-400/40" style={{ left: '25%' }} />
            <div className="absolute h-full w-px bg-slate-400/40" style={{ left: '50%' }} />
            <div className="absolute h-full w-px bg-slate-400/40" style={{ left: '75%' }} />
          </div>

          {/* The score marker */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out" 
            style={{ left: `calc(${percentage}% - 8px)` }} // Offset by half marker width
          >
            <div className="relative flex flex-col items-center">
                <span className={cn("text-sm font-bold mb-1", levelInfo.color)}>{score.toFixed(1)}</span>
                <Triangle className="h-4 w-4 fill-current text-foreground" style={{ transform: 'rotate(180deg)'}} />
            </div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
          <span>Laag</span>
          <span>Gemiddeld</span>
          <span>Hoog</span>
          <span>Zeer Hoog</span>
        </div>
      </div>
      
      <Alert variant="default" className="bg-muted/50 border-border/50">
          <Lightbulb className={cn("h-5 w-5", levelInfo.color)} />
          <AlertTitleUi className={cn("font-semibold", levelInfo.color)}>
              Interpretatie: {levelInfo.level} Herkenning van Kenmerken
          </AlertTitleUi>
          <AlertDescription className="text-muted-foreground">
              {interpretationText}
          </AlertDescription>
      </Alert>

      <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
          <Info className="h-5 w-5 !text-blue-600"/>
          <AlertTitleUi className="text-blue-700 font-semibold">Hoe wordt deze score berekend?</AlertTitleUi>
          <AlertDescription className="text-blue-800/90 text-sm">
            {scoreCalculationText}
          </AlertDescription>
      </Alert>
    </div>
  );
}
