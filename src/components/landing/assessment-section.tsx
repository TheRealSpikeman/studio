// src/components/landing/assessment-section.tsx
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AssessmentSection() {
  return (
    <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16 md:py-20">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            🧭 Uw Persoonlijke MindNavigator Reis Begint Met Zelfontdekking
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Elke tiener is uniek. Daarom start iedereen - gratis of premium - met 
            een interactieve online assessment die in 15 minuten het persoonlijke 
            profiel van uw kind onthult.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-foreground">
              ✨ Wat Ontdekt Uw Kind?
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl pt-1">📊</span>
                <div>
                  <strong className="text-foreground">Persoonlijke score</strong>
                  <p className="text-muted-foreground">Op leerstijl, sterke punten en voorkeuren</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-2xl pt-1">🎯</span>
                <div>
                  <strong className="text-foreground">Automatisch dashboard</strong>
                  <p className="text-muted-foreground">Samengesteld op basis van assessment resultaten</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-2xl pt-1">🧠</span>
                <div>
                  <strong className="text-foreground">Gepersonaliseerd trainingsmateriaal</strong>
                  <p className="text-muted-foreground">Afgestemd op hun unieke ontwikkeling</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-2xl pt-1">📈</span>
                <div>
                  <strong className="text-foreground">Startpunt voor groei</strong>
                  <p className="text-muted-foreground">Gepersonaliseerde route naar verbetering</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-card/60 rounded-lg border border-primary/20">
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
                    <span className="text-xl">📝</span>
                  </div>
                  <div>
                    <strong className="text-foreground">Interactieve Tool</strong>
                    <p className="text-muted-foreground text-sm">15 minuten vriendelijke vragen</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <strong className="text-foreground">Direct Inzicht</strong>
                    <p className="text-muted-foreground text-sm">Persoonlijke insights & sterke punten</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <strong className="text-foreground">Platform op Maat</strong>
                    <p className="text-muted-foreground text-sm">Tools & coaching afgestemd</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                <strong className="text-primary">1.200+</strong> jongeren ontdekten al hun persoonlijke profiel
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              <Link href="/quizzes?ageGroup=15-18">Begin Assessment (Gratis)</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary/5 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              <Link href="/quiz/teen-neurodiversity-quiz/results?ageGroup=15-18">Bekijk Voorbeeldresultaat</Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-3">
            ⏱️ Duurt 15 minuten • 🔒 Volledig privé • ✨ Direct resultaat
          </p>
        </div>

      </div>
    </section>
  );
}
