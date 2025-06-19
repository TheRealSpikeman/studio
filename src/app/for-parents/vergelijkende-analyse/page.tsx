
"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
    Search, Users, Bot, Target, Sparkles, Lightbulb, MessageCircle, ClipboardList, 
    ArrowRight, ArrowLeft, ChevronDown, Settings, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const StepCard = ({ number, title, description, children, isLast = false }: { number: number, title: string, description: string, children: React.ReactNode, isLast?: boolean }) => (
  <div className="step flex flex-col md:flex-row items-center md:items-start mb-16 relative">
    <div className="step-number bg-gradient-to-br from-primary to-accent text-primary-foreground w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg flex-shrink-0 mb-6 md:mb-0 md:mr-8">
      {number}
    </div>
    <div className="step-content flex-1 text-center md:text-left">
      <h2 className="step-title text-2xl md:text-3xl font-bold text-foreground mb-3">{title}</h2>
      <p className="step-description text-lg text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>
      {children}
    </div>
    {!isLast && (
      <div className="connector absolute left-1/2 -bottom-8 md:left-10 md:top-full md:-bottom-0 md:h-auto w-1 h-8 md:w-auto md:h-16 bg-gradient-to-b from-primary via-accent to-transparent md:bg-gradient-to-r transform -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 hidden md:block"></div>
    )}
  </div>
);

const ParticipantCard = ({ title, Icon, content, isParent = false }: { title: string, Icon: React.ElementType, content: React.ReactNode, isParent?: boolean }) => (
  <Card className={cn(
    "participant-card rounded-xl border-2",
    isParent ? "bg-yellow-50 border-yellow-400" : "bg-blue-50 border-blue-400"
  )}>
    <CardHeader className="pb-3">
      <CardTitle className={cn(
        "participant-title text-lg font-semibold flex items-center gap-2",
        isParent ? "text-yellow-700" : "text-blue-700"
      )}>
        <Icon className="h-6 w-6" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className={cn(
        "participant-content text-sm leading-normal",
        isParent ? "text-yellow-800" : "text-blue-800"
    )}>
      {content}
    </CardContent>
  </Card>
);

const ComparisonInsightCard = ({ title, Icon, items }: { title: string, Icon: React.ElementType, items: Array<{ type: string, description: string }> }) => (
  <Card className="comparison-card bg-card shadow-lg rounded-xl border border-border">
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

const ActionItemCard = ({ title, description }: { title: string, description: string }) => (
  <div className="action-item bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-5">
    <h4 className="action-title font-semibold text-lg mb-1.5">{title}</h4>
    <p className="action-description text-sm opacity-90 leading-normal">{description}</p>
  </div>
);

export default function VergelijkendeAnalysePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="header bg-gradient-to-br from-slate-800 to-slate-900 text-white py-16 px-6 md:py-20 md:px-10 text-center">
            <Search className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Ouder-Kind Vergelijkende Analyse</h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Ontdek verschillen en overeenkomsten in perceptie tussen ouder en kind, en krijg concrete handvatten voor betere communicatie en begrip.
            </p>
        </div>

        <div className="container mx-auto py-12 md:py-16 px-4">
          <div className="flow-container max-w-5xl mx-auto">
            <StepCard
              number={1}
              title="Parallelle Onboarding"
              description="Zowel ouder als kind doorlopen hun eigen onboarding quiz, zonder elkaars antwoorden te zien. Dit zorgt voor eerlijke, onbeïnvloede perspectieven."
            >
              <div className="participants grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <ParticipantCard 
                  title="Kind - Zelfreflectie Tool" 
                  Icon={Users}
                  content={
                    <>
                      "Hoe zie ik mezelf?"<br/>
                      • Sterke punten en uitdagingen<br/>
                      • Sociale voorkeuren<br/>
                      • Leer- en communicatiestijl<br/>
                      • Emotionele patronen<br/>
                      • Toekomstdromen en zorgen
                    </>
                  }
                />
                <ParticipantCard 
                  title="Ouder - \"Ken je Kind\" Quiz" 
                  Icon={Users} 
                  isParent
                  content={
                    <>
                      "Hoe zie ik mijn kind?"<br/>
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

            <StepCard
              number={2}
              title="AI Vergelijkende Analyse"
              description="Onze AI analyseert beide perspectieven en identificeert patronen, verschillen en overeenkomsten. Deze analyse vormt de basis voor gepersonaliseerde family insights."
            >
              <Card className="ai-analysis bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-xl p-6 my-6 text-center shadow-lg">
                <CardHeader className="pb-3">
                    <CardTitle className="text-2xl flex items-center justify-center gap-2 mb-3">
                        <Bot className="h-8 w-8" /> AI Verwerking
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm">De AI vergelijkt antwoorden op dezelfde thema's en creëert een diepgaande analyse van:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-4">
                        <div className="bg-white/10 p-3 rounded-md"><strong>Perceptie Gaps:</strong> Waar zien ouder en kind dingen anders?</div>
                        <div className="bg-white/10 p-3 rounded-md"><strong>Gedeelde Sterktes:</strong> Wat zien beiden als positief?</div>
                        <div className="bg-white/10 p-3 rounded-md"><strong>Blinde Vlekken:</strong> Wat mist één van de twee?</div>
                        <div className="bg-white/10 p-3 rounded-md"><strong>Communicatie Kansen:</strong> Hoe kunnen ze beter afstemmen?</div>
                    </div>
                </CardContent>
              </Card>
            </StepCard>

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

            <StepCard
              number={4}
              title="Concreet Familie Actieplan"
              description="Op basis van de analyse krijgt het gezin concrete, haalbare acties om de relatie en communicatie te verbeteren."
              isLast={true}
            >
              <div className="action-plan bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl p-6 md:p-8 mt-6 shadow-xl">
                <h3 className="text-2xl font-bold mb-6 text-center">📋 Jouw Familie Actieplan</h3>
                <div className="action-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <ActionItemCard title="Dagelijkse Check-in" description="Elke dag 10 minuten één-op-één tijd na school. Kind kan vertellen hoe de dag was zonder meteen advies te krijgen." />
                  <ActionItemCard title="Creatief Project" description="Start een gezamenlijk creatief project (bijv. tekenen, muziek, schrijven) om de gedeelde sterke punt te versterken." />
                  <ActionItemCard title="Sociale Activiteit" description="Organiseer één sociale activiteit per week (vriendjes uitnodigen, familie bezoek) om sociale vaardigheden te stimuleren." />
                  <ActionItemCard title="Feedback Ritual" description="Gebruik het \"compliment sandwich\" format: positief → verbetering → positief voor constructieve feedback." />
                  <ActionItemCard title="Stress Check" description="Wekelijkse check: \"Wat voelt zwaar deze week?\" om academische stress vroeg te signaleren." />
                  <ActionItemCard title="Zelfstandigheid Boost" description="Geef één nieuwe verantwoordelijkheid per maand en vier successen expliciet om vertrouwen op te bouwen." />
                </div>
              </div>
            </StepCard>
          </div>
           <div className="text-center mt-12">
                <Button size="lg" asChild>
                    <Link href="/#pricing">Bekijk onze plannen</Link>
                </Button>
                <p className="mt-4 text-sm text-muted-foreground">
                    De Vergelijkende Analyse is onderdeel van ons "Gezins Gids" en "Premium" abonnement.
                </p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

    