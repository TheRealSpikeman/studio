// src/components/admin/documentation/platform-guide/GuideSection.tsx
"use client";

import type { FC, ReactNode } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from '@/components/ui/card';

interface GuideSectionProps {
  id: string;
  title: string;
  icon: React.ElementType;
  children: ReactNode;
}

export const GuideSection: FC<GuideSectionProps> = ({ id, title, icon: Icon, children }) => {
  return (
    <Card className="shadow-sm">
        <Accordion type="single" defaultValue={id} collapsible>
            <AccordionItem value={id} className="border-b-0">
                <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline [&[data-state=open]>svg]:text-primary">
                    <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        {title}
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0 border-t">
                    <div className="pt-4 text-muted-foreground space-y-4">
                        {children}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </Card>
  );
};
