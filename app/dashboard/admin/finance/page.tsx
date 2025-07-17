// src/app/dashboard/admin/finance/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Euro, CreditCard, TrendingUp, Download } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminFinancePage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          Financieel Overzicht <Badge variant="outline" className="text-lg">Placeholder</Badge>
        </h1>
        <p className="text-muted-foreground">
          Beheer betalingen, transfers, refunds en genereer financiële rapportages.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Omzet (Platform)</CardTitle>
            <Euro className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€ 75.230,50</div>
            <p className="text-xs text-muted-foreground">+8.5% vs. vorige maand</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uitbetalingen aan Tutors (Maand)</CardTitle>
            <CreditCard className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€ 12.850,00</div>
            <p className="text-xs text-muted-foreground">Volgende batch: 01-06-2025</p>
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Openstaande Facturen</CardTitle>
            <TrendingUp className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€ 875,20</div>
            <p className="text-xs text-muted-foreground">3 facturen > 30 dagen</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Transactiegeschiedenis</CardTitle>
          <CardDescription>Bekijk recente betalingen en uitbetalingen.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground italic">Tabel placeholder: Transactielijst</p>
          </div>
           <Button variant="outline" className="mt-4" disabled>
            <Download className="mr-2 h-4 w-4" /> Exporteer Transacties (CSV)
          </Button>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Financiële Instellingen</CardTitle>
          <CardDescription>Beheer betaalmethoden, factuurinstellingen en belastinginformatie.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[100px] bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground italic">Formulier placeholder: Financiële instellingen</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
