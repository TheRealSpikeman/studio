// src/components/admin/feature-management/FeatureTable.tsx
"use client";

import type { AppFeature, SubscriptionPlan, TargetAudience } from '@/types/subscription';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreVertical, Link2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureTableProps {
  features: AppFeature[];
  allSubscriptionPlans: SubscriptionPlan[]; 
  onEditFeature: (feature: AppFeature) => void;
  onDeleteFeature: (featureId: string) => void;
}

const getAudienceBadgeVariant = (audience: TargetAudience): "default" | "secondary" | "outline" => {
  switch (audience) {
    case 'leerling': return 'default'; 
    case 'ouder': return 'secondary';
    case 'tutor': return 'default';
    case 'coach': return 'secondary';
    case 'platform': return 'outline';
    case 'beide': return 'outline'; 
    default: return 'outline';
  }
};
const getAudienceBadgeClasses = (audience: TargetAudience): string => {
  switch (audience) {
    case 'leerling': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'ouder': return 'bg-green-100 text-green-700 border-green-300';
    case 'tutor': return 'bg-violet-100 text-violet-700 border-violet-300';
    case 'coach': return 'bg-cyan-100 text-cyan-700 border-cyan-300';
    case 'platform': return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'beide': return 'bg-purple-100 text-purple-700 border-purple-300';
    default: return '';
  }
};

const planBadgeColorClasses = [
  'bg-sky-100 text-sky-700 border-sky-300',
  'bg-amber-100 text-amber-700 border-amber-300',
  'bg-emerald-100 text-emerald-700 border-emerald-300',
  'bg-rose-100 text-rose-700 border-rose-300',
  'bg-violet-100 text-violet-700 border-violet-300',
  'bg-lime-100 text-lime-700 border-lime-300',
  'bg-pink-100 text-pink-700 border-pink-300',
  'bg-cyan-100 text-cyan-700 border-cyan-300',
  'bg-orange-100 text-orange-700 border-orange-300',
];

export function FeatureTable({ features, allSubscriptionPlans, onEditFeature, onDeleteFeature }: FeatureTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">ID</TableHead>
            <TableHead className="min-w-[200px]">Label (Titel)</TableHead>
            <TableHead className="min-w-[250px]">Omschrijving</TableHead>
            <TableHead className="min-w-[120px]">Doelgroep</TableHead>
            <TableHead className="min-w-[120px]">Categorie</TableHead>
            <TableHead className="min-w-[200px]">Gekoppelde Plannen</TableHead>
            <TableHead className="text-right w-[80px]">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Geen features gevonden. Voeg er een toe om te beginnen.
              </TableCell>
            </TableRow>
          )}
          {features.map((feature) => {
            const linkedPlans = allSubscriptionPlans.filter(
              (plan) => plan.featureAccess && plan.featureAccess[feature.id]
            );
            return (
              <TableRow key={feature.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{feature.id}</TableCell>
                <TableCell className="font-medium flex items-center gap-2">
                  {feature.label}
                  {feature.isRecommendedTool && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" title="Aanbevolen Tool" />}
                </TableCell>
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
                <TableCell>
                  {linkedPlans.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {linkedPlans.map(plan => {
                        const planIndex = allSubscriptionPlans.findIndex(p => p.id === plan.id);
                        const colorClass = planBadgeColorClasses[planIndex % planBadgeColorClasses.length];
                        return (
                            <Badge 
                                key={plan.id} 
                                variant="outline" 
                                className={cn(
                                  "text-[10px] px-1.5 py-0 leading-tight flex items-center",
                                  colorClass
                                )}
                                title={plan.name}
                            >
                               <Link2 className="h-3 w-3 mr-1"/>
                               {plan.shortName || plan.name}
                            </Badge>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
