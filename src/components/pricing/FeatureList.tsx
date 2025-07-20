// src/components/pricing/FeatureList.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { detailedFeatureList } from '@/lib/data/features-data';

export function FeatureList() {
  return (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <CardTitle>Beschrijving</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {detailedFeatureList.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.id}>
                <h3 className="flex items-center gap-3 text-lg font-semibold text-foreground mb-2">
                  <IconComponent className="h-5 w-5 text-primary" />
                  {category.title}
                </h3>
                <ul className="space-y-1 pl-8 text-muted-foreground">
                  {category.features.map((feature, index) => (
                    <li key={index} className="list-disc list-outside">
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
