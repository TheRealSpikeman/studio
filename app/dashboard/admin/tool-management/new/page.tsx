// src/app/dashboard/admin/tool-management/new/page.tsx
"use client";

import { ToolCreatorForm, type ToolFormData } from '@/components/admin/tool-creator/ToolCreatorForm';
import { Button } from '@/components/ui/button';
import { Wrench, ArrowLeft } from '@/lib/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Tool } from '@/lib/quiz-data/tools-data';

const LOCAL_STORAGE_TOOLS_KEY = 'mindnavigator_tools_v1';

export default function NewToolPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSave = (data: ToolFormData) => {
    const newTool: Tool = { ...data };

    try {
      const storedToolsRaw = localStorage.getItem(LOCAL_STORAGE_TOOLS_KEY);
      const existingTools: Tool[] = storedToolsRaw ? JSON.parse(storedToolsRaw) : [];

      if (existingTools.some(t => t.id === newTool.id)) {
        toast({ title: "Fout", description: `Een tool met ID "${newTool.id}" bestaat al.`, variant: "destructive" });
        return;
      }
      
      const updatedTools = [...existingTools, newTool];
      localStorage.setItem(LOCAL_STORAGE_TOOLS_KEY, JSON.stringify(updatedTools));
      
      toast({ title: "Tool opgeslagen!", description: `De tool "${data.title}" is succesvol opgeslagen.` });
      router.push('/dashboard/admin/tool-management');
    } catch (error) {
      console.error("Error saving tool to localStorage", error);
      toast({ title: "Fout", description: "Kon de tool niet opslaan.", variant: "destructive" });
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
