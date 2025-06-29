// src/app/dashboard/admin/tool-management/new/page.tsx
"use client";

import { ToolCreatorForm, type ToolFormData } from '@/components/admin/tool-creator/ToolCreatorForm';
import { Button } from '@/components/ui/button';
import { Wrench, ArrowLeft } from '@/lib/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Tool } from '@/lib/quiz-data/tools-data';
import { createToolComponentFile } from '@/app/actions/toolActions';

const LOCAL_STORAGE_TOOLS_KEY = 'mindnavigator_tools_v1';

export default function NewToolPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSave = async (data: ToolFormData) => {
    const newTool: Tool = { ...data };

    try {
      // 1. Save tool properties to localStorage
      const storedToolsRaw = localStorage.getItem(LOCAL_STORAGE_TOOLS_KEY);
      const existingTools: Tool[] = storedToolsRaw ? JSON.parse(storedToolsRaw) : [];

      if (existingTools.some(t => t.id === newTool.id)) {
        toast({ title: "Fout", description: `Een tool met ID "${newTool.id}" bestaat al.`, variant: "destructive" });
        return;
      }
      
      const updatedTools = [...existingTools, newTool];
      localStorage.setItem(LOCAL_STORAGE_TOOLS_KEY, JSON.stringify(updatedTools));
      
      toast({ title: "Tool Eigenschappen Opgeslagen!", description: `Component voor "${data.title}" wordt nu gegenereerd...` });
      
      // 2. Generate component file via Server Action
      const result = await createToolComponentFile(data.id, data.title, data.description);

      if (result.success) {
        toast({
            title: "Tool Succesvol Aangemaakt!",
            description: `De tool "${data.title}" is aangemaakt en het component is gegenereerd.`,
            duration: 5000,
        });
        router.push('/dashboard/admin/tool-management');
      } else {
        toast({
            title: "Component Generatie Mislukt",
            description: result.error || "De tool eigenschappen zijn opgeslagen, maar het component kon niet worden aangemaakt.",
            variant: "destructive",
            duration: 8000,
        });
      }
    } catch (error) {
      console.error("Error saving tool and generating component:", error);
      toast({ title: "Fout", description: "Kon de tool niet opslaan of genereren.", variant: "destructive" });
    }
  };

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
      <ToolCreatorForm onSave={handleSave} isNewTool={true} />
    </div>
  );
}
