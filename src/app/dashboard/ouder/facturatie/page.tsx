// src/app/dashboard/ouder/facturatie/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CreditCard, Euro, CheckCircle, Download, FileText, Clock, AlertCircle, Info } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import Link from 'next/link';

interface Subscription {
  id: string;
  childName: string;
  planName: string;
  price: string;
  status: 'actief' | 'opgezegd' | 'verlopen';
  nextBillingDate?: string;
}

interface PayableLesson {
  id: string;
  childName: string;
  subject: string;
  tutorName: string;
  lessonDate: string; // ISO
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string; // ISO
  description: string;
  amount: number;
  status: 'Betaald' | 'Openstaand';
}

const dummySubscriptions: Subscription[] = [
  { id: 'sub1', childName: 'Sofie de Tester', planName: 'Coaching Maandelijks', price: '€2,50/mnd', status: 'actief', nextBillingDate: '15-07-2024' },
  { id: 'sub2', childName: 'Max de Tester', planName: 'Coaching Jaarlijks', price: '€25/jaar', status: 'actief', nextBillingDate: '01-01-2025' },
];

const dummyPayableLessons: PayableLesson[] = [
  { id: 'lesson1', childName: 'Sofie de Tester', subject: 'Wiskunde A', tutorName: 'Mevr. Jansen', lessonDate: new Date(Date.now() - 2 * 86400000).toISOString(), amount: 20.00 },
  { id: 'lesson2', childName: 'Max de Tester', subject: 'Engels', tutorName: 'Dhr. Pietersen', lessonDate: new Date(Date.now() - 1 * 86400000).toISOString(), amount: 18.50 },
];

const dummyInvoices: Invoice[] = [
  { id: 'inv1', invoiceNumber: 'INV-2024-001', date: new Date(Date.now() - 30 * 86400000).toISOString(), description: 'Coaching Maandelijks - Sofie (Juni)', amount: 2.50, status: 'Betaald' },
  { id: 'inv2', invoiceNumber: 'INV-2024-002', date: new Date(Date.now() - 5 * 86400000).toISOString(), description: 'Les Wiskunde - Max', amount: 22.00, status: 'Betaald' },
];


export default function FacturatiePage() {
  const { toast } = useToast();
  const [autoDebit, setAutoDebit] = useState(true);
  const [payableLessons, setPayableLessons] = useState<PayableLesson[]>(dummyPayableLessons);

  const handlePayLesson = (lessonId: string, amount: number) => {
    toast({
      title: "Betaling Simulatie",
      description: `Betaling van €${amount.toFixed(2)} voor les ${lessonId} wordt verwerkt (simulatie). U zou worden doorgestuurd naar iDEAL/Credit Card.`,
    });
    // In a real app, this would trigger a payment flow and then update the lesson status.
    // For demo, we'll remove it from the list.
    setPayableLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
  };
  
  const handleDownloadInvoice = (invoiceNumber: string) => {
     toast({
      title: "Factuur Downloaden",
      description: `Factuur ${invoiceNumber}.pdf wordt gedownload (simulatie).`,
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <CreditCard className="h-8 w-8 text-primary" />
          Facturatie & Betalingen
        </h1>
        <p className="text-muted-foreground">
          Beheer hier uw abonnementen, openstaande betalingen en factuurhistorie.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Euro className="h-5 w-5 text-primary"/>Lopende Abonnementen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dummySubscriptions.map(sub => (
            <div key={sub.id} className="p-3 rounded-md border bg-muted/50 flex justify-between items-center">
              <div>
                <p className="font-medium">{sub.childName} - {sub.planName} ({sub.price})</p>
                <p className="text-xs text-muted-foreground">
                  Status: <Badge variant={sub.status === 'actief' ? 'default' : 'secondary'} className={sub.status === 'actief' ? 'bg-green-100 text-green-700 border-green-300' : ''}>{sub.status}</Badge>
                  {sub.nextBillingDate && ` | Volgende betaling: ${sub.nextBillingDate}`}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard/ouder/abonnementen">Beheer abonnement</a>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary"/>Openstaande Betalingen voor Voltooide Lessen
          </CardTitle>
          <CardDescription>
            Hieronder vindt u de lessen die door de tutor als 'Voltooid' zijn gemarkeerd en nog betaald moeten worden.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payableLessons.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kind</TableHead>
                  <TableHead>Vak</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Lesdatum</TableHead>
                  <TableHead>Bedrag</TableHead>
                  <TableHead className="text-right">Actie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payableLessons.map(lesson => (
                  <TableRow key={lesson.id}>
                    <TableCell>{lesson.childName}</TableCell>
                    <TableCell>{lesson.subject}</TableCell>
                    <TableCell>{lesson.tutorName}</TableCell>
                    <TableCell><FormattedDateCell isoDateString={lesson.lessonDate} dateFormatPattern="P" /></TableCell>
                    <TableCell>€{lesson.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handlePayLesson(lesson.id, lesson.amount)} disabled={autoDebit}>
                        Betaal Les
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <Alert variant="default" className="bg-green-50 border-green-200 text-green-700">
                <CheckCircle className="h-5 w-5 !text-green-600" />
                <AlertTitle className="text-green-700 font-semibold">Geen openstaande betalingen</AlertTitle>
                <AlertDescription className="text-green-600">
                  Alle voltooide lessen zijn betaald.
                </AlertDescription>
            </Alert>
          )}
           {autoDebit && payableLessons.length > 0 && (
            <Alert variant="default" className="mt-4 bg-blue-50 border-blue-200 text-blue-700">
                <Info className="h-5 w-5 !text-blue-600" />
                <AlertTitle className="text-blue-700 font-semibold">Automatische incasso is actief</AlertTitle>
                <AlertDescription className="text-blue-600">
                   Openstaande lessen worden automatisch afgeschreven van uw primaire betaalmethode. Handmatige betaling is niet nodig.
                </AlertDescription>
            </Alert>
           )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Betaalinstellingen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-md border">
            <div>
              <Label htmlFor="auto-debit-switch" className="font-medium">Automatische Incasso voor Lessen</Label>
              <p className="text-xs text-muted-foreground">
                {autoDebit ? 'Ingeschakeld: Voltooide lessen worden automatisch betaald.' : 'Uitgeschakeld: U dient elke voltooide les handmatig te betalen.'}
              </p>
            </div>
            <Switch id="auto-debit-switch" checked={autoDebit} onCheckedChange={setAutoDebit} />
          </div>
           {!autoDebit && payableLessons.length > 0 && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Actie vereist!</AlertTitle>
                    <AlertDescription>
                        Automatische incasso staat uit. Betaal de openstaande lessen hierboven handmatig.
                    </AlertDescription>
                </Alert>
            )}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Primaire betaalmethode: Visa **** **** **** 1234</p>
              <Badge variant="outline" className="text-amber-600 border-amber-400">Binnenkort</Badge>
            </div>
            <Button variant="outline" size="sm" className="mt-2" disabled>Betaalmethoden Beheren</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/>Factuurhistorie</CardTitle>
        </CardHeader>
        <CardContent>
          {dummyInvoices.length > 0 ? (
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factuurnr.</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Beschrijving</TableHead>
                  <TableHead>Bedrag</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyInvoices.map(invoice => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell><FormattedDateCell isoDateString={invoice.date} dateFormatPattern="P" /></TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>€{invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                        <Badge variant={invoice.status === 'Betaald' ? 'default' : 'destructive'} className={invoice.status === 'Betaald' ? 'bg-green-100 text-green-700 border-green-300':''}>
                            {invoice.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(invoice.invoiceNumber)}>
                        <Download className="mr-2 h-4 w-4" /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">Geen facturen gevonden.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
