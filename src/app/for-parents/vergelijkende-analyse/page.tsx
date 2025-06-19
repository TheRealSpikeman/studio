// src/app/for-parents/vergelijkende-analyse/page.tsx
"use client";

import React, { type ReactNode, type ElementType } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import {
    Search,
    Users as UsersIcon,
    User,
    Bot,
    Target,
    Sparkles,
    Lightbulb,
    MessageCircle,
    ClipboardList,
    ChevronsRightLeft,
    ThumbsUp,
    EyeOff
} from 'lucide-react';

// Helper components defined inline
const StepCard = ({ number, title, description, children }: { number: number, title: string, description: string, children: ReactNode }): JSX.Element => (
  <div className={cn("step flex flex-col md:flex-row items-start md:items-center mb-12 md:mb-16 relative", {"md:flex-row-reverse ": number % 2 === 0})}>
    <div className={cn(
        "step-number bg-primary text-primary-foreground w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg flex-shrink-0 mb-6 md:mb-0",
        {"md:mr-8": number % 2 !== 0, "md:ml-8": number % 2 === 0}
    )}>
      {number}
    </div>
    <div className={cn("step-content flex-1", {"md:mr-8 text-center md:text-left": number % 2 !== 0, "md:ml-8 text-center md:text-left": number % 2 === 0 })}>
      <h2 className="step-title text-2xl md:text-3xl font-bold text-foreground mb-3">{title}</h2>
      <p className="step-description text-lg text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>
      {children}
    </div>
    {/* Connector line removed as per user request */}
  </div>
);

const ParticipantCard = ({ title, Icon, content, isParent = false }: { title: string, Icon: ElementType, content: ReactNode, isParent?: boolean }): JSX.Element => (
  <Card className={cn(
    "participant-card rounded-xl border-2 h-full",
    isParent ? "bg-primary/10 border-primary" : "bg-accent/10 border-accent"
  )}>
    <CardHeader className="pb-3">
      <CardTitle className={cn(
        "participant-title text-lg font-semibold flex items-center gap-2",
        isParent ? "text-primary" : "text-accent"
      )}>
        <Icon className="h-6 w-6" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className={cn(
        "participant-content text-sm leading-normal",
        isParent ? "text-primary/90" : "text-accent/90"
    )}>
      {content}
    </CardContent>
  </Card>
);

const ComparisonInsightCard = ({ title, Icon, items }: { title: string, Icon: ElementType, items: Array<{ type: string, description: string }> }): JSX.Element => (
  <Card className="comparison-card bg-card shadow-lg rounded-xl border border-border h-full">
    <CardHeader className="pb-3">
      <CardTitle className="comparison-title text-xl font-semibold text-foreground flex items-center gap-2">
        <Icon className="h-6 w-6 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="insight-item bg-muted/50 p-3 rounded-md border-l-4 border-primary">
          <p className="insight-type font-medium text-foreground/90 mb-0.5">{item.type}</p>
          <p className="insight-description text-sm text-muted-foreground leading-snug">{item.description}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

const ActionItemCard = ({ title, description }: { title: string, description: string }): JSX.Element => (
  <div className="action-item bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-5 h-full text-accent-foreground">
    <h4 className="action-title font-semibold text-lg mb-1.5">{title}</h4>
    <p className="action-description text-sm opacity-90 leading-normal">{description}</p>
  </div>
);

export default function VergelijkendeAnalysePage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Header Section */}
        <div className="header bg-background text-foreground py-16 px-6 md:py-20 md:px-10 text-center">
            <Search className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">Ouder-Kind Vergelijkende Analyse</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Ontdek verschillen en overeenkomsten in perceptie tussen ouder en kind, en krijg concrete handvatten voor betere communicatie en begrip.
            </p>
        </div>

        <div className="flow-container max-w-5xl mx-auto py-12 md:py-16 px-4">
            {/* Step 1 */}
            <StepCard
              number={1}
              title="Parallelle Onboarding"
              description="Zowel ouder als kind doorlopen hun eigen onboarding quiz, zonder elkaars antwoorden te zien. Dit zorgt voor eerlijke, onbeïnvloede perspectieven."
            >
              <div className="participants grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <ParticipantCard
                  title="Kind - Zelfreflectie Tool"
                  Icon={User}
                  content={
                    <>
                      &quot;Hoe zie ik mezelf?&quot;<br/>
                      • Sterke punten en uitdagingen<br/>
                      • Sociale voorkeuren<br/>
                      • Leer- en communicatiestijl<br/>
                      • Emotionele patronen<br/>
                      • Toekomstdromen en zorgen
                    </>
                  }
                />
                <ParticipantCard
                  title='Ouder - "Ken je Kind" Quiz'
                  Icon={UsersIcon}
                  isParent
                  content={
                    <>
                      &quot;Hoe zie ik mijn kind?&quot;<br/>
                      • Observaties van gedrag<br/>
                      • Sociale interacties<br/>
                      • Leerpatronen thuis<br/>
                      • Emotionele uitingen<br/>
                      • Zorgen en trots momenten
                    </>
                  }
                />
              </div>
            </StepCard>

            {/* Step 2: AI Analysis */}
            <StepCard
              number={2}
              title="AI Vergelijkende Analyse"
              description="Onze AI analyseert beide perspectieven en identificeert patronen, verschillen en overeenkomsten. Deze analyse vormt de basis voor gepersonaliseerde family insights."
            >
                <Card className="ai-analysis bg-muted/50 border border-border rounded-xl p-6 my-6 text-center shadow-lg">
                  <CardHeader className="pb-3">
                      <CardTitle className="text-2xl flex items-center justify-center gap-2 mb-3 text-foreground">
                          <Bot className="h-8 w-8 text-primary" /> AI Verwerking
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">De AI vergelijkt antwoorden op dezelfde thema&apos;s en creëert een diepgaande analyse van:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <Button variant="outline" className="h-auto p-4 text-left flex flex-col items-start w-full bg-card hover:bg-primary/5 hover:border-primary/30">
                              <div className="flex items-center gap-2 mb-1">
                                  <ChevronsRightLeft className="h-5 w-5 text-primary" />
                                  <strong className="text-foreground">Perceptie Gaps</strong>
                              </div>
                              <span className="text-xs text-muted-foreground">Waar zien ouder en kind dingen anders?</span>
                          </Button>
                          <Button variant="outline" className="h-auto p-4 text-left flex flex-col items-start w-full bg-card hover:bg-primary/5 hover:border-primary/30">
                              <div className="flex items-center gap-2 mb-1">
                                  <ThumbsUp className="h-5 w-5 text-primary" />
                                  <strong className="text-foreground">Gedeelde Sterktes</strong>
                              </div>
                              <span className="text-xs text-muted-foreground">Wat zien beiden als positief?</span>
                          </Button>
                          <Button variant="outline" className="h-auto p-4 text-left flex flex-col items-start w-full bg-card hover:bg-primary/5 hover:border-primary/30">
                              <div className="flex items-center gap-2 mb-1">
                                  <EyeOff className="h-5 w-5 text-primary" />
                                  <strong className="text-foreground">Blinde Vlekken</strong>
                              </div>
                              <span className="text-xs text-muted-foreground">Wat mist één van de twee?</span>
                          </Button>
                          <Button variant="outline" className="h-auto p-4 text-left flex flex-col items-start w-full bg-card hover:bg-primary/5 hover:border-primary/30">
                              <div className="flex items-center gap-2 mb-1">
                                  <MessageCircle className="h-5 w-5 text-primary" />
                                  <strong className="text-foreground">Communicatie Kansen</strong>
                              </div>
                              <span className="text-xs text-muted-foreground">Hoe kunnen ze beter afstemmen?</span>
                          </Button>
                      </div>
                  </CardContent>
                </Card>
            </StepCard>

            {/* Step 3 */}
            <StepCard
              number={3}
              title="Gepersonaliseerde Familie Inzichten"
              description="De AI genereert specifieke inzichten die helpen bij het verbeteren van begrip en communicatie binnen het gezin."
            >
              <div className="comparison-grid grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <ComparisonInsightCard
                  title="Perceptie Verschillen"
                  Icon={Target}
                  items={[
                    { type: "Sociale Vaardigheden", description: "Kind ziet zichzelf als socialer dan ouder denkt. Kans om meer sociale activiteiten te stimuleren." },
                    { type: "Academische Stress", description: "Ouder onderschat hoe stressvol school is. Kind heeft meer emotionele ondersteuning nodig." }
                  ]}
                />
                 <ComparisonInsightCard
                  title="Gedeelde Sterktes"
                  Icon={Sparkles}
                  items={[
                    { type: "Creativiteit", description: "Beiden zien creativiteit als topkwaliteit. Uitbreiden van creatieve projecten samen." },
                    { type: "Doorzettingsvermogen", description: "Beide erkennen de vastberadenheid. Gebruiken als basis voor nieuwe uitdagingen." }
                  ]}
                />
                <ComparisonInsightCard
                  title="Blinde Vlekken"
                  Icon={Lightbulb}
                  items={[
                    { type: "Ondersteuningsbehoefte", description: "Kind heeft meer behoefte aan directe feedback dan ouder realiseert." },
                    { type: "Zelfstandigheid", description: "Ouder ziet meer zelfstandigheid dan kind zelf voelt. Meer vertrouwen opbouwen." }
                  ]}
                />
                <ComparisonInsightCard
                  title="Communicatie Tips"
                  Icon={MessageCircle}
                  items={[
                    { type: "Feedback Stijl", description: "Kind reageert beter op specifieke, concrete feedback dan algemene opmerkingen." },
                    { type: "Timing", description: "Belangrijke gesprekken het beste na school, niet direct 's ochtends." }
                  ]}
                />
              </div>
            </StepCard>

            {/* Step 4 */}
            <StepCard
              number={4}
              title="Concreet Familie Actieplan"
              description="Op basis van de analyse krijgt het gezin concrete, haalbare acties om de relatie en communicatie te verbeteren."
            >
              <div className="action-plan bg-accent text-accent-foreground rounded-xl p-6 md:p-8 mt-6 shadow-xl">
                <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
                  <ClipboardList className="h-7 w-7"/> Jouw Familie Actieplan
                </h3>
                <div className="action-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <ActionItemCard title="Dagelijkse Check-in" description="Elke dag 10 minuten één-op-één tijd na school. Kind kan vertellen hoe de dag was zonder meteen advies te krijgen." />
                  <ActionItemCard title="Creatief Project" description="Start een gezamenlijk creatief project (bijv. tekenen, muziek, schrijven) om de gedeelde sterke punt te versterken." />
                  <ActionItemCard title="Sociale Activiteit" description="Organiseer één sociale activiteit per week (vriendjes uitnodigen, familie bezoek) om sociale vaardigheden te stimuleren." />
                  <ActionItemCard title="Feedback Ritual" description='Gebruik het "compliment sandwich" format: positief → verbetering → positief voor constructieve feedback.' />
                  <ActionItemCard title="Stress Check" description='Wekelijkse check: "Wat voelt zwaar deze week?" om academische stress vroeg te signaleren.' />
                  <ActionItemCard title="Zelfstandigheid Boost" description="Geef één nieuwe verantwoordelijkheid per maand en vier successen expliciet om vertrouwen op te bouwen." />
                </div>
              </div>
            </StepCard>
        </div>
           <div className="text-center mt-12 pb-20">
                <Button size="lg" asChild>
                    <Link href="/#pricing">Bekijk onze plannen</Link>
                </Button>
                <p className="mt-4 text-sm text-muted-foreground">
                    De Vergelijkende Analyse is onderdeel van ons &quot;Gezins Gids&quot; en &quot;Premium&quot; abonnement.
                </p>
            </div>
        </main>
      <Footer />
    </div>
  );
}
