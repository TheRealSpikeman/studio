// src/components/homework-assistance/TemplatesSection.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet, Download, FileSliders } from 'lucide-react';

const templates = [
  {
    id: 'exam-planning',
    title: 'Examenvrees & Planning Template',
    description: 'Een voorbeeldschema met focusblokken, pauzes en revisiemomenten om je voor te bereiden op examens.',
    icon: FileSliders,
    type: 'PDF Schema',
  },
  {
    id: 'weekly-schedule',
    title: 'Weekplanner Huiswerk',
    description: 'Een blanco weekplanner om je huiswerk per vak en per dag te structureren.',
    icon: FileSpreadsheet,
    type: 'Spreadsheet/PDF',
  },
  {
    id: 'essay-outline',
    title: 'Opzet Werkstuk/Essay',
    description: 'Een structuurtemplate voor het schrijven van een goed onderbouwd werkstuk of essay.',
    icon: FileText,
    type: 'Word/PDF Document',
  },
];

export function TemplatesSection() {

  const handleDownloadTemplate = (templateId: string, templateTitle: string) => {
    // In a real app, this would trigger a download or open a new tab with the template
    alert(`Template "${templateTitle}" downloaden (placeholder).`);
    // Example: window.open(`/api/templates/${templateId}/download`, '_blank');
  };
  
  const handleGeneratePdf = () => {
     alert('PDF van je huidige planning genereren (placeholder). Dit zou je weekplanner of to-do lijst als PDF downloaden.');
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Templates & Voorbeeldschema's
        </CardTitle>
        <CardDescription>Gebruik deze sjablonen om je studie te structureren.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates.map(template => (
          <Card key={template.id} className="p-3 bg-muted/30">
            <div className="flex items-start gap-3">
              <template.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">{template.title}</h4>
                <p className="text-xs text-muted-foreground">{template.description}</p>
                 <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto text-xs mt-1"
                    onClick={() => handleDownloadTemplate(template.id, template.title)}
                    disabled // Placeholder
                >
                  Download {template.type} <Download className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
      <CardFooter>
         <Button variant="outline" className="w-full" onClick={handleGeneratePdf} disabled>
            <Download className="mr-2 h-4 w-4" />
            Genereer PDF van jouw Weekplanning (binnenkort)
        </Button>
      </CardFooter>
    </Card>
  );
}
