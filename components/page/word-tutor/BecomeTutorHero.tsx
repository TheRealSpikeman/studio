
// src/components/page/word-tutor/BecomeTutorHero.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EditableImage } from '@/components/common/EditableImage';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export function BecomeTutorHero() {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState('https://placehold.co/800x600.png');

  const handleImageSave = (newUrl: string) => {
    setImageUrl(newUrl);
    toast({
      title: 'Afbeelding opgeslagen!',
      description: 'De afbeelding is bijgewerkt.',
    });
  };

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-primary/5">
      <div className="container mx-auto grid grid-cols-1 items-center justify-items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
        <div className="flex flex-col items-center text-center md:items-start md:text-left max-w-xl lg:max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Word Tutor bij <span className="text-primary">MindNavigator</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Help jongeren van 12–18 jaar succes te boeken op school, bepaal je eigen tarief en werk op tijden die jou uitkomen. Maak een positieve impact!
          </p>
          <div className="mt-10">
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow px-8 py-6 text-lg">
              <Link href="/tutor-application">
                Meld je nu aan
              </Link>
            </Button>
          </div>
        </div>
        <EditableImage
          wrapperClassName="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl w-full max-w-md md:max-w-lg lg:max-w-xl"
          src={imageUrl}
          alt="Vriendelijke tutor die online lesgeeft aan een student."
          fill
          style={{ objectFit: 'cover' }}
          data-ai-hint="tutor teaching online"
          priority
          onSave={handleImageSave}
          uploadPath="images/website"
        />
      </div>
    </section>
  );
}
