// src/components/dashboard/coaching/MediaAndProgressSection.tsx
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaySquare, BarChartBig, Users, Library, Trophy } from '@/lib/icons';
import { COACHING_CONFIG } from '@/lib/constants/coaching';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface MediaAndProgressSectionProps {
    selectedDate: Date | undefined;
}
export const MediaAndProgressSection = ({ selectedDate }: MediaAndProgressSectionProps) => {
    const videoSeedForSelectedDate = selectedDate ? COACHING_CONFIG.getVideoSeedForDate(selectedDate) : "defaultvideo";
    const formattedDate = selectedDate ? `voor ${format(selectedDate, 'PPP', { locale: nl })}` : '';

    return (
        <>
            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                        <PlaySquare className="h-6 w-6 text-primary" />
                        Video Tip {formattedDate}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        {selectedDate ? (
                        <Image 
                            src={`https://placehold.co/400x225.png`}
                            alt="Video tip thumbnail" 
                            width={400} 
                            height={225} 
                            className="rounded-md mb-2 mx-auto" 
                            data-ai-hint="coaching video"
                            key={videoSeedForSelectedDate} 
                        />
                        ) : (
                        <div className="h-[225px] w-full max-w-[400px] mx-auto bg-muted rounded-md flex items-center justify-center text-muted-foreground mb-2">
                            Selecteer een datum
                        </div>
                        )}
                        <p className="text-muted-foreground">Een korte video (1-2 min) met extra inzichten over de tip van vandaag.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" disabled>Bekijk Video (binnenkort)</Button>
                    </CardFooter>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChartBig className="h-6 w-6 text-primary" />Voortgangsrapporten</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p className="text-muted-foreground">Gedetailleerde grafieken en analyses van je voortgang (binnenkort beschikbaar).</p>
                    <div className="h-40 bg-muted rounded-md mt-4 flex items-center justify-center text-muted-foreground italic">
                        Grafiek placeholder
                    </div>
                    </CardContent>
                    <CardFooter><Button variant="outline" className="w-full" disabled>Bekijk Rapporten</Button></CardFooter>
                </Card>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6 text-primary" />Community Forum</CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-muted-foreground">Deel je ervaringen, stel vragen en steun anderen in onze community (binnenkort).</p></CardContent>
                    <CardFooter><Button variant="outline" className="w-full" disabled>Ga naar Forum</Button></CardFooter>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500" />Wekelijkse Challenge</CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-muted-foreground">Doe mee aan de "Mindfulness Momenten" challenge deze week (binnenkort)!</p></CardContent>
                    <CardFooter><Button variant="outline" className="w-full" disabled>Bekijk Challenge</Button></CardFooter>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Library className="h-6 w-6 text-primary" />Media Bibliotheek</CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-muted-foreground">Vind extra oefeningen, video's en audio om je groei te ondersteunen (binnenkort).</p></CardContent>
                    <CardFooter><Button variant="outline" className="w-full" disabled>Verken Bibliotheek</Button></CardFooter>
                </Card>
            </div>
        </>
    );
}
