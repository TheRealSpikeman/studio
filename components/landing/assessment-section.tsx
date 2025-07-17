
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  FileText, 
  BarChart as FileBarChart, 
  Target, 
  TrendingUp,
  Brain, 
  Compass, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  ArrowRight 
} from '@/lib/icons';

export function AssessmentSection() {
  return (
    <section className="py-12 md:py-16 bg-secondary/30">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
            <Compass className="h-8 w-8 text-primary" />
            Start de Zelfontdekkingsreis van Uw Kind
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Elke tiener is uniek. Daarom start iedereen – gratis of premium – met een interactieve online assessment (ca. 15 min.) die direct het persoonlijke profiel van uw kind onthult.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-end">
          
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
              <Compass className="h-7 w-7 text-primary" /> 
              Wat Ontdekt Uw Kind Precies?
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FileBarChart className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Persoonlijk Profiel</strong>
                  <p className="text-muted-foreground">Duidelijkheid over leerstijl, unieke sterktes, en typische voorkeuren.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Target className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Dashboard op Maat</strong>
                  <p className="text-muted-foreground">Een persoonlijk dashboard samengesteld op basis van de assessment resultaten.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Brain className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Gepersonaliseerde Content</strong>
                  <p className="text-muted-foreground">Coaching, tools en materialen afgestemd op hun unieke ontwikkeling.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Fundament voor Groei</strong>
                  <p className="text-muted-foreground">Een solide startpunt voor een gepersonaliseerde route naar zelfverbetering.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border shadow-sm">
              <p className="text-foreground/80 italic">
                💫 "De assessment gaf me eindelijk inzicht in hoe ik het beste leer en wat mijn sterke punten zijn. Ik voel me nu veel zelfverzekerder!"
              </p>
              <p className="text-sm text-muted-foreground mt-2">- Max, 16 jaar</p>
            </div>
          </div>

          <div>
            <div className="bg-card rounded-xl shadow-lg p-8">
              <h4 className="text-xl font-semibold mb-6 text-center text-foreground">
                Zo Eenvoudig Werkt Het Voor Uw Kind:
              </h4>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <strong className="text-foreground">Interactieve Tool</strong>
                    <p className="text-muted-foreground text-sm">Beantwoord ca. 15 min. kindvriendelijke vragen.</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileBarChart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <strong className="text-foreground">Direct Inzicht</strong>
                    <p className="text-muted-foreground text-sm">Ontvang een persoonlijk overzicht & ontdek sterke punten.</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                     <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <strong className="text-foreground">Platform op Maat</strong>
                    <p className="text-muted-foreground text-sm">Krijg tools & coaching die écht bij uw kind passen.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border/50 text-center">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-primary">1.200+</strong> jongeren ontdekten al hun persoonlijke profiel.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
              <Link href="/signup?plan=free_start">Start de Gratis Assessment <ArrowRight className="ml-2 h-5 w-5"/></Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Slechts 15 minuten</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Volledig privé</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Direct resultaat</span>
          </p>
        </div>

      </div>
    </section>
  );
}
