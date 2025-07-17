// components/common/StructuredContentDisplay.tsx
import type { StructuredContent } from '@/types/content-hub';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StructuredContentDisplayProps {
  content: StructuredContent;
}

const themeClasses = {
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-800' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800' },
};

// A small utility to safely render a Lucide icon by its name string
const Icon = ({ name, className }: { name: string; className: string }) => {
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) {
    return <LucideIcons.HelpCircle className={className} />; // Fallback icon
  }
  return <LucideIcon className={className} />;
};

export function StructuredContentDisplay({ content }: StructuredContentDisplayProps) {
  const theme = themeClasses[content.themeColor] || themeClasses.blue;

  return (
    <div className="space-y-6">
      {content.sections.map((section, index) => (
        <Card key={index} className={`${theme.bg} ${theme.border}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${theme.text}`}>
              <Icon name={section.iconName} className="h-6 w-6 mr-3" />
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base text-foreground/80">{section.paragraph}</p>
            <ul className="space-y-2">
              {section.points.map((point, pointIndex) => (
                <li key={pointIndex} className="flex items-start">
                  <LucideIcons.CheckCircle2 className={`h-5 w-5 mr-3 mt-1 flex-shrink-0 ${theme.text}`} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
