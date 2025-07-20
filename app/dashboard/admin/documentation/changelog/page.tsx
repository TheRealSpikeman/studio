// src/app/dashboard/admin/documentation/changelog/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ScrollText, CheckCircle, Wrench, ShieldCheck, Users, Bot, Sparkles, Rocket, Package, Rss, HeartHandshake, Briefcase, GraduationCap, Database, GitBranch, Loader2 } from '@/lib/icons';
import { Badge } from '@/components/ui/badge';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useEffect, type ElementType } from 'react';
import type { ChangelogEntry } from '@/types/changelog';
import { getChangelogEntries } from '../../../../services/changelogService'; // Restored service import

const iconMap: { [key: string]: ElementType } = {
  Database, GitBranch, Wrench, Sparkles, Rss, CheckCircle, Package, Rocket, Users, Bot, ScrollText,
};

export default function ChangelogPage() {
  const [changelogData, setChangelogData] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChangelog = async () => {
      setIsLoading(true);
      try {
        const entries = await getChangelogEntries();
        // Assuming getChangelogEntries returns entries sorted by date descending
        setChangelogData(entries);
      } catch (error) {
        console.error("Failed to fetch changelog:", error);
        // Optionally set some error state to show in the UI
      } finally {
        setIsLoading(false);
      }
    };
    fetchChangelog();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <ScrollText className="h-8 w-8 text-primary" />
          Changelog & Platform Updates
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/documentation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Documentatie
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary"/>
            Demo Login Informatie
          </CardTitle>
          <CardDescription>
            Gebruik de volgende gegevens om in te loggen als verschillende rollen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rol</TableHead>
                <TableHead>E-mailadres</TableHead>
                <TableHead>Wachtwoord</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-muted-foreground"/>Admin</TableCell>
                <TableCell><code className="bg-muted px-2 py-1 rounded-sm text-sm">bosch.rgm@gmail.com</code></TableCell>
                <TableCell><code className="bg-muted px-2 py-1 rounded-sm text-sm">password</code></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground"/>Ouder</TableCell>
                <TableCell><code className="bg-muted px-2 py-1 rounded-sm text-sm">ouder@mindnavigator.io</code></TableCell>
                <TableCell><code className="bg-muted px-2 py-1 rounded-sm text-sm">password</code></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold flex items-center gap-2"><GraduationCap className="h-4 w-4 text-muted-foreground"/>Leerling (12-15 jr)</TableCell>
                <TableCell><code className="bg-muted px-2 py-1 rounded-sm text-sm">leerling-1@mindnavigator.io</code></TableCell>
                <TableCell><code className="bg-muted px-2 py-1 rounded-sm text-sm">password</code></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold flex items-center gap-2"><GraduationCap className="h-4 w-4 text-muted-foreground"/>Leerling (16-18 jr)</TableCell>
                <TableCell><code className="bg-muted px-2 py-1 rounded-sm text-sm">leerling-2@mindnavigator.io</code></TableCell>
                <TableCell><code className="bg-muted px-2 py-1 rounded-sm text-sm">password</code></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground"/>Tutor</TableCell>
                <TableCell><code className="bg-muted px-2 py-1 rounded-sm text-sm">tutor@mindnavigator.io</code></TableCell>
                <TableCell><code className="bg-muted px-2 py-1 rounded-sm text-sm">password</code></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold flex items-center gap-2"><HeartHandshake className="h-4 w-4 text-muted-foreground"/>Coach</TableCell>
                <TableCell><code className="bg-muted px-2 py-1 rounded-sm text-sm">coach@mindnavigator.io</code></TableCell>
                <TableCell><code className="bg-muted px-2 py-1 rounded-sm text-sm">password</code></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
       {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-6">
          {changelogData.length === 0 && (
              <Card className="text-center p-6">
                  <CardTitle>Geen updates</CardTitle>
                  <CardDescription>Er zijn momenteel geen changelog-items om weer te geven.</CardDescription>
              </Card>
          )}
          {changelogData.map((entry, index) => {
            const Icon = iconMap[entry.iconName] || ScrollText;
            return (
              <AccordionItem value={`item-${index}`} key={entry.id || entry.date} disabled={!entry.details} className="bg-card border rounded-lg shadow-md data-[state=open]:shadow-lg">
                <AccordionTrigger className="p-0 hover:no-underline w-full accordion-trigger-no-icon [&[data-state=open]>svg]:rotate-180">
                    <div className="flex flex-col md:flex-row w-full">
                        <div className="p-4 md:border-r flex flex-row md:flex-col items-center justify-center gap-2 md:w-48 text-center bg-muted/50 rounded-t-lg md:rounded-l-lg md:rounded-r-none">
                            <Icon className="h-8 w-8 text-primary"/>
                            <div className="font-semibold text-sm">
                                <FormattedDateCell isoDateString={entry.date} dateFormatPattern="PPPp" />
                            </div>
                        </div>
                        <div className="p-4 flex-1 text-left">
                            <h3 className="font-semibold text-lg text-foreground">{entry.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 mb-3">{entry.description}</p>
                            <div className="flex flex-wrap gap-1">
                                {entry.tags.map(tag => (
                                    <Badge key={tag.text} variant={tag.variant}>{tag.text}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </AccordionTrigger>
                {entry.details && (
                  <AccordionContent className="p-4 pt-2 border-t">
                    <h4 className="font-semibold mb-2">Details van de wijziging:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {entry.details.map((detail, detailIndex) => (
                        <li key={detailIndex} dangerouslySetInnerHTML={{ __html: detail.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      ))}
                    </ul>
                  </AccordionContent>
                )}
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
