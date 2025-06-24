
// src/app/dashboard/admin/tool-management/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Wrench, Search, Edit, Trash2, MoreVertical, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_TOOLS, type Tool, getToolIconComponent } from '@/lib/quiz-data/tools-data';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const LOCAL_STORAGE_TOOLS_KEY = 'mindnavigator_tools_v1';

export default function ToolManagementPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);

  useEffect(() => {
    try {
      const storedToolsRaw = localStorage.getItem(LOCAL_STORAGE_TOOLS_KEY);
      if (storedToolsRaw) {
        setTools(JSON.parse(storedToolsRaw));
      } else {
        // Start with an empty list if nothing is in storage.
        setTools([]);
      }
    } catch (error) {
      console.error("Error loading tools from localStorage.", error);
      setTools([]);
    }
    setIsLoading(false);
  }, []);
  
  const handleDeleteTool = (toolId: string) => {
    const updatedTools = tools.filter(tool => tool.id !== toolId);
    setTools(updatedTools);
    localStorage.setItem(LOCAL_STORAGE_TOOLS_KEY, JSON.stringify(updatedTools));
    toast({
      title: "Tool verwijderd",
      description: `De tool is succesvol verwijderd.`,
    });
    setToolToDelete(null);
  };

  const handleRestoreDefaults = () => {
    // This will overwrite any custom tools. We should probably ask for confirmation.
    // For now, let's just merge them.
    const currentTools = [...tools];
    const defaultToolsToAdd = DEFAULT_TOOLS.filter(
        defaultTool => !currentTools.some(currentTool => currentTool.id === defaultTool.id)
    );

    if (defaultToolsToAdd.length === 0) {
        toast({ title: "Geen actie nodig", description: "Alle standaard tools zijn al aanwezig in uw lijst." });
        return;
    }

    const mergedTools = [...currentTools, ...defaultToolsToAdd].sort((a,b) => a.title.localeCompare(b.title));
    setTools(mergedTools);
    localStorage.setItem(LOCAL_STORAGE_TOOLS_KEY, JSON.stringify(mergedTools));
    toast({ title: "Standaard Tools Hersteld", description: `${defaultToolsToAdd.length} standaard tool(s) zijn toegevoegd aan de lijst.` });
  };


  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-8 text-center">Tools laden...</div>;
  }

  return (
    <>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Wrench className="h-6 w-6 text-primary" />
                  Toolbeheer
                </CardTitle>
                <CardDescription>
                  Beheer hier de tools die aanbevolen worden aan gebruikers.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                 <Button onClick={handleRestoreDefaults} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" /> Herstel Standaard Tools
                </Button>
                <Button asChild>
                    <Link href="/dashboard/admin/tool-management/new">
                    <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Tool Toevoegen
                    </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Zoek tool..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tool</TableHead>
                  <TableHead>Categorie</TableHead>
                  <TableHead>Beschrijving</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTools.map(tool => {
                  const Icon = getToolIconComponent(tool.icon);
                  return (
                    <TableRow key={tool.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {Icon && <Icon className="h-5 w-5 text-primary" />}
                        {tool.title}
                      </TableCell>
                      <TableCell><Badge variant="outline">{tool.category}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-sm truncate">{tool.description}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Acties voor {tool.title}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/admin/tool-management/edit/${tool.id}`}>
                                <Edit className="mr-2 h-4 w-4" /> Bewerken
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setToolToDelete(tool)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Verwijderen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
                 {filteredTools.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            Geen tools gevonden. Voeg een nieuwe tool toe of herstel de standaard tools.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!toolToDelete} onOpenChange={(isOpen) => !isOpen && setToolToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Dit zal de tool "{toolToDelete?.title}" permanent verwijderen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toolToDelete) {
                  handleDeleteTool(toolToDelete.id);
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Ja, verwijder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
