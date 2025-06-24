// src/app/dashboard/admin/tool-management/new/page.tsx
import { ToolCreatorForm } from '@/components/admin/tool-creator/ToolCreatorForm';
import { Button } from '@/components/ui/button';
import { Wrench, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewToolPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Wrench className="h-8 w-8 text-primary" />
          Nieuwe Tool Aanmaken
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/tool-management">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Overzicht
          </Link>
        </Button>
      </div>
      <ToolCreatorForm />
    </div>
  );
}
