
// src/app/dashboard/community/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Hash, FileText, MessageCircle, HelpCircle, Sparkles, PlusCircleIcon, Brain } from '@/lib/icons';
import Link from 'next/link';

const placeholderCategories = [
  { id: 'general', name: 'Algemene Discussie', icon: MessageCircle, description: 'Praat over alledaagse dingen, school en meer.' },
  { id: 'neurodiversity', name: 'Neurodiversiteit Ervaringen', icon: Brain, description: 'Deel je ervaringen en stel vragen over ADD, HSP, etc.' },
  { id: 'study-tips', name: 'Studie & Focus Tips', icon: Sparkles, description: 'Wissel tips uit voor betere concentratie en planning.' },
  { id: 'ask-for-help', name: 'Vraag & Antwoord', icon: HelpCircle, description: 'Stel vragen aan de community of help anderen.' },
];

const placeholderPosts = [
  { id: 'post1', title: 'Hoe gaan jullie om met examenstress?', category: 'Studie & Focus Tips', author: 'Eva_16', replies: 5, lastReply: '1 uur geleden' },
  { id: 'post2', title: 'Tips voor concentratie in een drukke klas (ADD)', category: 'Neurodiversiteit Ervaringen', author: 'Tom_B', replies: 12, lastReply: '3 uur geleden' },
  { id: 'post3', title: 'Leuke (rustige) hobby_s voor HSP_ers?', category: 'Algemene Discussie', author: 'Sara_HSP', replies: 8, lastReply: 'Gisteren' },
];

export default function CommunityPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <MessageSquare className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl font-bold text-foreground">MindNavigator Community Forum</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Maak contact, deel ervaringen en leer van anderen.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Welkom bij de Community!
          </CardTitle>
          <CardDescription>
            Dit is dé plek om in contact te komen met andere MindNavigator gebruikers. Start een discussie, deel je gedachten of help een ander!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Hash className="h-5 w-5 text-accent"/>
              Populaire Onderwerpen
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {placeholderCategories.map(category => (
                <Card key={category.id} className="bg-muted/50 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-md font-medium flex items-center gap-2">
                      <category.icon className="h-5 w-5 text-primary/80" />
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </CardContent>
                  <CardFooter className="pt-3">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="#">Bekijk Discussies</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent"/>
              Recente Discussies
            </h3>
            <div className="space-y-3">
              {placeholderPosts.map(post => (
                <Card key={post.id} className="p-4 bg-card border hover:shadow-sm transition-shadow">
                  <h4 className="font-semibold text-md text-primary hover:underline cursor-pointer">
                    <Link href="#">{post.title}</Link>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    In: {post.category} | Door: {post.author}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                     <p className="text-xs text-muted-foreground">{post.replies} reacties | Laatste: {post.lastReply}</p>
                     <Button variant="link" size="sm" className="p-0 h-auto text-primary" asChild>
                        <Link href="#">Lees meer &raquo;</Link>
                     </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center pt-8 border-t">
            <h2 className="text-xl font-semibold text-accent mb-2">Jouw Forum Acties</h2>
            <p className="text-muted-foreground mb-4">
              Klaar om deel te nemen?
            </p>
            <Button size="lg" asChild className="bg-primary text-primary-foreground">
              <Link href="#"><PlusCircleIcon className="mr-2 h-5 w-5"/>Nieuw Topic Starten</Link>
            </Button>
             <p className="text-xs text-muted-foreground mt-4">
              Let op: dit is een gesimuleerde omgeving. Interacties zijn placeholders.
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-center pt-6 pb-8">
            {/* Footer content can be added here if needed, or remove CardFooter if not used */}
        </CardFooter>
      </Card>
    </div>
  );
}
