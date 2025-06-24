
// src/components/admin/tool-management/ToolTable.tsx
"use client";

import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { Tool } from '@/lib/quiz-data/tools-data';
import { getToolIconComponent } from '@/lib/quiz-data/tools-data';

interface ToolTableProps {
  tools: Tool[];
  onDelete: (tool: Tool) => void;
}

export function ToolTable({ tools, onDelete }: ToolTableProps) {
  return (
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
        {tools.map(tool => {
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
                <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/admin/tool-management/edit/${tool.id}`}>
                            <Edit className="mr-2 h-4 w-4" /> Bewerken
                        </Link>
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(tool)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Verwijderen
                    </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
        {tools.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              Geen tools gevonden. Voeg een nieuwe tool toe of herstel de standaard tools.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
