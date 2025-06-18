
// src/components/admin/feature-management/FeatureTable.tsx
"use client";

import type { AppFeature } from '@/app/dashboard/admin/subscription-management/page';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureTableProps {
  features: AppFeature[];
  onEditFeature: (feature: AppFeature) => void;
  onDeleteFeature: (featureId: string) => void;
}

const getAudienceBadgeVariant = (audience: string): "default" | "secondary" | "outline" => {
  switch (audience) {
    case 'leerling': return 'default';
    case 'ouder': return 'secondary';
    case 'platform': return 'outline';
    case 'beide': return 'outline'; // Using outline for 'beide' too
    default: return 'outline';
  }
};

const getAudienceBadgeClasses = (audience: string): string => {
  switch (audience) {
    case 'leerling': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'ouder': return 'bg-green-100 text-green-700 border-green-300';
    case 'platform': return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'beide': return 'bg-purple-100 text-purple-700 border-purple-300';
    default: return '';
  }
};

export function FeatureTable({ features, onEditFeature, onDeleteFeature }: FeatureTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Label (Titel)</TableHead>
            <TableHead>Omschrijving</TableHead>
            <TableHead>Doelgroep</TableHead>
            <TableHead>Categorie</TableHead>
            <TableHead className="text-right w-[80px]">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Geen features gevonden. Voeg er een toe om te beginnen.
              </TableCell>
            </TableRow>
          )}
          {features.map((feature) => (
            <TableRow key={feature.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">{feature.id}</TableCell>
              <TableCell className="font-medium">{feature.label}</TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                {feature.description || '-'}
              </TableCell>
              <TableCell>
                {feature.targetAudience.map(audience => (
                  <Badge 
                    key={audience} 
                    variant={getAudienceBadgeVariant(audience)} 
                    className={cn("mr-1 mb-1 text-[10px] px-1.5 py-0 leading-tight", getAudienceBadgeClasses(audience))}
                  >
                    {audience.charAt(0).toUpperCase() + audience.slice(1)}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>
                {feature.category ? (
                  <Badge variant="outline" className="text-xs">{feature.category}</Badge>
                ) : '-'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Acties voor {feature.label}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditFeature(feature)}>
                      <Edit className="mr-2 h-4 w-4" /> Bewerken
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteFeature(feature.id)} className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Verwijderen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
