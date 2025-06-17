// src/app/dashboard/community/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessagesSquare, Users, Hash, FileText, MessageCircle, HelpCircle, Sparkles } from 'lucide-react';

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

// Placeholder Brain icon for categories
function Brain(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7v0A2.5 2.5 0 0 1 7 4.5v0A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7v0A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 14.5 2Z" />
      <path d="M12 17.5A2.5 2.5 0 0 1 9.5 20v0A2.5 2.5 0 0 1 7 17.5v0A2.5 2.5 0 0 1 9.5 15v0A2.5 2.5 0 0 1 12 17.5Z" />
      <path d="M17 17.5A2.5 2.5 0 0 1 14.5 20v0A2.5 2.5 0 0 1 12 17.5v0A2.5 2.5 0 0 1 14.5 15v0A2.5 2.5 0 0 1 17 17.5Z" />
      <path d="M17 4.5v1.5" />
      <path d="M14.5 7V9" />
      <path d="M12 4.5v3" />
      <path d="M9.5 7V9" />
      <path d="M7 4.5v1.5" />
      <path d="M7 17.5v-1.5" />
      <path d="M9.5 15v-3" />
      <path d="M12 17.5v-5" />
      <path d="M14.5 15v-3" />
      <path d="M17 17.5v-1.5" />
    </svg>
  )
}


export default function CommunityPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <MessagesSquare className="mx-auto h-16 w-16 text-primary mb-4" />
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
            Dit is dé plek om in contact te komen met andere MindNavigator gebruikers. De volledige forumfunctionaliteit is binnenkort beschikbaar!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Hash className="h-5 w-5 text-accent"/>
              Populaire Onderwerpen (Binnenkort)
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
                    <Button variant="outline" size="sm" disabled>Bekijk Discussies</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent"/>
              Recente Discussies (Binnenkort)
            </h3>
            <div className="space-y-3">
              {placeholderPosts.map(post => (
                <Card key={post.id} className="p-4 bg-card border hover:shadow-sm transition-shadow">
                  <h4 className="font-semibold text-md text-primary hover:underline cursor-not-allowed">{post.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    In: {post.category} | Door: {post.author}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                     <p className="text-xs text-muted-foreground">{post.replies} reacties | Laatste: {post.lastReply}</p>
                     <Button variant="link" size="sm" className="p-0 h-auto text-primary" disabled>Lees meer &raquo;</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center pt-8 border-t">
            <p className="text-lg font-semibold text-accent mb-2">Forum Binnenkort Live!</p>
            <p className="text-muted-foreground">
              We werken hard om deze community ruimte voor jullie te openen. Hier kun je binnenkort:
            </p>
            <ul className="list-disc list-inside text-muted-foreground text-left max-w-md mx-auto mt-3 space-y-1.5">
              <li>Ervaringen en tips uitwisselen.</li>
              <li>Vragen stellen aan elkaar.</li>
              <li>Deelnemen aan groepsdiscussies.</li>
              <li>Ondersteuning vinden en bieden.</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="justify-center pt-6 pb-8">
            <Button disabled size="lg" className="bg-primary text-primary-foreground">Nieuw Topic Starten (Binnenkort)</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
