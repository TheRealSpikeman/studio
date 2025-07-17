// src/app/dashboard/admin/reporting/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileBarChart, Users, Briefcase, Clock, Download, Filter, TrendingUp } from '@/lib/icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/common/date-picker-with-range'; 
import { Input } from '@/components/ui/input'; 
import { Badge } from '@/components/ui/badge';

export default function AdminReportingPage() {
  // State for filters would go here
  // const [reportType, setReportType] = useState('user_activity');
  // const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            Rapportages <Badge variant="outline" className="text-lg">In Ontwikkeling</Badge>
        </h1>
        <p className="text-muted-foreground">
          Genereer en download aangepaste rapporten over gebruikers, tutors, sessies en financiën.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Rapport Filters
          </CardTitle>
          <CardDescription>Selecteer de criteria voor je rapport.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="reportType" className="text-sm font-medium">Rapport Type</label>
            <Select defaultValue="user_activity" disabled>
              <SelectTrigger id="reportType">
                <SelectValue placeholder="Kies rapport type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user_activity">Gebruikersactiviteit</SelectItem>
                <SelectItem value="tutor_performance">Tutor Prestaties</SelectItem>
                <SelectItem value="session_logs">Sessie Logs</SelectItem>
                <SelectItem value="financial_summary">Financieel Overzicht</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="dateRange" className="text-sm font-medium">Periode</label>
            {/* <DatePickerWithRange className="w-full" onDateChange={setDateRange} /> */}
            <Input type="text" placeholder="Datum selectie (nog niet functioneel)" disabled className="mt-1"/>
          </div>
           <div>
            <label htmlFor="customFilter" className="text-sm font-medium">Extra Filters (Optioneel)</label>
            <Input placeholder="Bijv. Vak, Tutor ID..." disabled className="mt-1"/>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled>
            <Download className="mr-2 h-4 w-4" /> Genereer & Download Rapport (CSV/PDF)
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Populaire Rapporten
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="link" className="p-0 h-auto block" disabled>Nieuwe Gebruikers (Laatste 30d)</Button>
            <Button variant="link" className="p-0 h-auto block" disabled>Meest Actieve Tutors (Kwartaal)</Button>
            <Button variant="link" className="p-0 h-auto block" disabled>Sessies per Vak (Jaaroverzicht)</Button>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Geplande Rapporten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Stel automatische rapportage in (bijv. wekelijks financieel overzicht). (Functionaliteit nog niet beschikbaar)
            </p>
            <Button className="mt-3" variant="outline" disabled>Nieuw Gepland Rapport</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
