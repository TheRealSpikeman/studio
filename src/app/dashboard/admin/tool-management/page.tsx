// src/app/dashboard/admin/tool-management/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Wrench, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { allTools, type Tool } from '@/lib/quiz-data/tools-data';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function ToolManagementPage() {
  const [tools, setTools] = useState<Tool[]>(allTools);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = tools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
            <Button disabled>
              <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Tool Toevoegen (Binnenkort)
            </Button>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.map(tool => {
                const Icon = tool.icon;
                return (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      {tool.title}
                    </TableCell>
                    <TableCell><Badge variant="outline">{tool.category}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{tool.description}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
           <p className="mt-6 text-sm text-muted-foreground italic">
            Bewerk- en voegfunctionaliteit voor tools is in ontwikkeling.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
