
// src/app/dashboard/admin/tool-management/edit/[toolId]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, AlertTriangle } from '@/lib/icons';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { ToolCreatorForm, type ToolFormData } from '@/components/admin/tool-creator/ToolCreatorForm';
import type { Tool } from '@/lib/quiz-data/tools-data';

const LOCAL_STORAGE_TOOLS_KEY = 'mindnavigator_tools_v1';

export default function EditToolPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const toolId = params?.toolId as string;
  
  const [toolToEdit, setToolToEdit] = useState<Tool | null | undefined>(undefined);

  useEffect(() => {
    if (toolId) {
      try {
        const storedToolsRaw = localStorage.getItem(LOCAL_STORAGE_TOOLS_KEY);
        if (storedToolsRaw && storedToolsRaw !== 'undefined') {
          const allTools: Tool[] = JSON.parse(storedToolsRaw);
          const foundTool = allTools.find(t => t.id === toolId);
          
          if (foundTool) {
            // Migration step: ensure all tools have a status
            const migratedTool = {
              ...foundTool,
              status: foundTool.status || 'online',
            };
            setToolToEdit(migratedTool);
          } else {
            setToolToEdit(null);
          }
        } else {
          setToolToEdit(null);
        }
      } catch (error) {
        console.error("Error loading tool from localStorage:", error);
        setToolToEdit(null);
      }
    }
  }, [toolId]);

  const handleSave = (data: ToolFormData) => {
    try {
      const storedToolsRaw = localStorage.getItem(LOCAL_STORAGE_TOOLS_KEY);
      const existingTools: Tool[] = (storedToolsRaw && storedToolsRaw !== 'undefined') ? JSON.parse(storedToolsRaw) : [];
      
      const updatedTools = existingTools.map(t => 
        t.id === toolId ? { ...t, ...data } : t
      );

      localStorage.setItem(LOCAL_STORAGE_TOOLS_KEY, JSON.stringify(updatedTools));
      
      toast({ title: "Tool bijgewerkt!", description: `De tool "${data.title}" is succesvol bijgewerkt.` });
      router.push('/dashboard/admin/tool-management');
    } catch (error) {
      console.error("Error saving tool to localStorage", error);
      toast({ title: "Fout", description: "Kon de tool niet opslaan.", variant: "destructive" });
    }
  };

  const handleDelete = () => {
    try {
        const storedToolsRaw = localStorage.getItem(LOCAL_STORAGE_TOOLS_KEY);
        const existingTools: Tool[] = (storedToolsRaw && storedToolsRaw !== 'undefined') ? JSON.parse(storedToolsRaw) : [];
        const updatedTools = existingTools.filter(t => t.id !== toolId);
        localStorage.setItem(LOCAL_STORAGE_TOOLS_KEY, JSON.stringify(updatedTools));

        toast({ title: "Tool Verwijderd", description: `De tool "${toolToEdit?.title}" is permanent verwijderd.`});
        router.push('/dashboard/admin/tool-management');
    } catch (error) {
         console.error("Error deleting tool from localStorage", error);
         toast({ title: "Fout", description: "Kon de tool niet verwijderen.", variant: "destructive" });
    }
  }

  if (toolToEdit === undefined) {
    return <div className="p-8 text-center">Tool-gegevens laden...</div>;
  }

  if (toolToEdit === null) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
        <h1 className="text-2xl font-bold">Tool niet gevonden</h1>
        <p className="text-muted-foreground">De tool met ID "{toolId}" kon niet worden gevonden.</p>
        <Button asChild>
          <Link href="/dashboard/admin/tool-management">Terug naar Overzicht</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Edit className="h-8 w-8 text-primary" />
          Tool Bewerken: {toolToEdit.title}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/tool-management">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Overzicht
          </Link>
        </Button>
      </div>
      <ToolCreatorForm 
        onSave={handleSave} 
        initialData={toolToEdit}
        isNewTool={false}
        onDelete={handleDelete}
      />
    </div>
  );
}
