
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, BarChart3, Target, TrendingUp, Brain, Compass, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react'; 

export function AssessmentSection() {
  return (
    <section className="pt-8 pb-12 md:pt-12 md:pb-16 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
            <Compass className="h-8 w-8 text-primary" />
            Uw Persoonlijke MindNavigator Reis Begint Met Zelfontdekking
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Elke tiener is uniek. Daarom start iedereen - gratis of premium - met 
            een interactieve online assessment die in 15 minuten het persoonlijke 
            profiel van uw kind onthult.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-end">
          
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
              <Compass className="h-7 w-7 text-primary" /> 
              Wat Ontdekt Uw Kind?
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <BarChart3 className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Persoonlijke score</strong>
                  <p className="text-muted-foreground">Op leerstijl, sterke punten en voorkeuren</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Target className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Automatisch dashboard</strong>
                  <p className="text-muted-foreground">Samengesteld op basis van assessment resultaten</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Brain className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Gepersonaliseerd trainingsmateriaal</strong>
                  <p className="text-muted-foreground">Afgestemd op hun unieke ontwikkeling</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Startpunt voor groei</strong>
                  <p className="text-muted-foreground">Gepersonaliseerde route naar verbetering</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border shadow-sm">
              <p className="text-foreground/80 italic">
                💫 "De assessment gaf me eindelijk inzicht in hoe ik het beste leer en wat mijn sterke punten zijn"
              </p>
              <p className="text-sm text-muted-foreground mt-2">- Max, 16 jaar</p>
            </div>
          </div>

          <div>
            <div className="bg-card rounded-xl shadow-lg p-8">
              <h4 className="text-xl font-semibold mb-6 text-center text-foreground">
                Zo Eenvoudig Werkt Het
              </h4>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <strong className="text-foreground">Interactieve Tool</strong>
                    <p className="text-muted-foreground text-sm">15 minuten vriendelijke vragen</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <strong className="text-foreground">Direct Inzicht</strong>
                    <p className="text-muted-foreground text-sm">Persoonlijke insights & sterke punten</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                     <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <strong className="text-foreground">Platform op Maat</strong>
                    <p className="text-muted-foreground text-sm">Tools & coaching afgestemd</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border/50 text-center">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-primary">1.200+</strong> jongeren ontdekten al hun persoonlijke profiel
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
              <Link href="/quizzes">Begin Assessment (Gratis)</Link>
            </Button>
            <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary/5 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
              <Link href="/quiz/teen-neurodiversity-quiz/results?ageGroup=15-18">Bekijk Voorbeeldresultaat</Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Duurt 15 minuten</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Volledig privé</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Direct resultaat</span>
          </p>
        </div>

      </div>
    </section>
  );
}
