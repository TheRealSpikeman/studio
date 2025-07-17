// src/components/admin/tool-management/ToolTable.tsx
"use client";

import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Pencil, Trash2, MoreVertical, Eye, Circle } from '@/lib/icons'; // CORRECTED IMPORT
import type { Tool } from '@/lib/quiz-data/tools-data';
import { getToolIconComponent } from '@/lib/quiz-data/tools-data';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ToolTableProps {
  tools: Tool[];
  onDelete: (tool: Tool) => void;
}

// Define which tool components are implemented.
const existingToolComponentIds = ['focus-timer-pro', 'concentratie-games', 'distraction-blocker', 'fidget-simulator'];

export function ToolTable({ tools, onDelete }: ToolTableProps) {
  const router = useRouter();

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
          const componentExists = existingToolComponentIds.includes(tool.id);
          
          let statusColorClass = "fill-gray-400 text-gray-400"; // Default: Offline
          let statusTitle = "Offline";

          if (!componentExists) {
            statusColorClass = "fill-orange-500 text-orange-500";
            statusTitle = "Component niet gegenereerd";
          } else if (tool.status === 'online') {
            statusColorClass = "fill-green-500 text-green-500";
            statusTitle = "Online";
          }

          return (
            <TableRow key={tool.id}>
              <TableCell className="font-medium flex items-center gap-3">
                <Circle 
                  aria-label={statusTitle} 
                  title={statusTitle} 
                  className={cn("h-3 w-3 flex-shrink-0", statusColorClass)} 
                />
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
                    <DropdownMenuItem asChild disabled={!componentExists}>
                      <Link
                        href={`/dashboard/tools/${tool.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="mr-2 h-4 w-4" /> Bekijken (Live)
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/admin/tool-management/edit/${tool.id}`}
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Eigenschappen Bewerken
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => onDelete(tool)}
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
