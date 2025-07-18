// src/app/dashboard/admin/feature-management/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Package, Search, Loader2 } from '@/lib/icons';
import { FeatureTable } from '@/components/admin/feature-management/FeatureTable';
import { FeatureFormDialog, type FeatureFormData } from '@/components/admin/feature-management/FeatureFormDialog';
import { useToast } from '@/hooks/use-toast';
import {
  type AppFeature,
  type TargetAudience
} from '@/types/subscription';
import { getSubscriptionPlans, saveSubscriptionPlans } from '@/services/subscriptionService';
import { getAllFeatures, saveFeature, deleteFeature } from '@/services/featureService';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FeatureManagementPage() {
  const { toast } = useToast();
  const [features, setFeatures] = useState<AppFeature[]>([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [featureToEdit, setFeatureToEdit] = useState<AppFeature | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [targetAudienceFilter, setTargetAudienceFilter] = useState<TargetAudience | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');
  const [linkedPlanFilter, setLinkedPlanFilter] = useState<string | 'all'>('all');

  const fetchData = async () => {
    setIsLoading(true);
    try {
        const fetchedFeatures = await getAllFeatures();
        setFeatures(fetchedFeatures.sort((a, b) => a.label.localeCompare(b.label)));
    } catch (e) {
        toast({ title: "Fout bij laden", description: "Kon features niet ophalen.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uniqueTargetAudiences = useMemo(() => {
    const audiences = new Set<TargetAudience>();
    features.forEach(f => f.targetAudience.forEach(ta => audiences.add(ta)));
    return Array.from(audiences).sort();
  }, [features]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    features.forEach(f => { if (f.category) categories.add(f.category) });
    return Array.from(categories).sort();
  }, [features]);

  const filteredFeatures = useMemo(() => {
    const allSubscriptionPlans = getSubscriptionPlans();
    return features.filter(feature => {
      const matchesSearch = searchTerm === '' ||
        feature.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (feature.description && feature.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesAudience = targetAudienceFilter === 'all' || feature.targetAudience.includes(targetAudienceFilter);
      
      const matchesCategory = categoryFilter === 'all' || feature.category === categoryFilter;
      
      const matchesPlan = linkedPlanFilter === 'all' || 
        allSubscriptionPlans.find(plan => plan.id === linkedPlanFilter && plan.featureAccess && plan.featureAccess[feature.id]);

      return matchesSearch && matchesAudience && matchesCategory && matchesPlan;
    });
  }, [features, searchTerm, targetAudienceFilter, categoryFilter, linkedPlanFilter]);


  const handleSaveFeature = async (featureFormData: FeatureFormData) => {
    const featureCoreData: AppFeature = {
        id: featureFormData.id,
        label: featureFormData.label,
        description: featureFormData.description,
        targetAudience: featureFormData.targetAudience,
        category: featureFormData.category,
        isRecommendedTool: featureFormData.isRecommendedTool,
    };

    try {
      await saveFeature(featureCoreData, featureToEdit?.id);

      toast({ title: featureToEdit ? "Feature Bijgewerkt" : "Feature Toegevoegd", description: `Feature "${featureCoreData.label}" is succesvol opgeslagen.` });
      
      const plansToUpdate = getSubscriptionPlans();
      const featureId = featureCoreData.id;
      const linkedPlanIdsSet = new Set(featureFormData.linkedPlans || []);

      const updatedPlans = plansToUpdate.map(plan => {
          const newFeatureAccess = { ...(plan.featureAccess || {}) };
          const isLinked = linkedPlanIdsSet.has(plan.id);
          
          if (isLinked) {
              newFeatureAccess[featureId] = true;
          } else {
              delete newFeatureAccess[featureId];
          }
          return { ...plan, featureAccess: newFeatureAccess };
      });

      saveSubscriptionPlans(updatedPlans);
      toast({ title: "Abonnementen Bijgewerkt", description: `De koppelingen voor feature "${featureCoreData.label}" zijn verwerkt.`})

      fetchData(); // Refresh all data
      setIsFormDialogOpen(false);
      setFeatureToEdit(null);

    } catch (error) {
      toast({ title: "Fout bij opslaan", description: (error as Error).message, variant: "destructive"});
    }
  };

  const handleEditFeature = (feature: AppFeature) => {
    setFeatureToEdit(feature);
    setIsFormDialogOpen(true);
  };

  const handleDeleteFeature = async (featureId: string) => {
    const featureLabel = features.find(f => f.id === featureId)?.label || featureId;
    try {
        await deleteFeature(featureId);
        toast({ title: "Feature Verwijderd", description: `Feature "${featureLabel}" en de koppelingen in abonnementen zijn verwijderd.` });
        fetchData();
    } catch(error) {
         toast({ title: "Fout bij verwijderen", description: (error as Error).message, variant: "destructive"});
    }
  };

  const handleAddNewFeature = () => {
    setFeatureToEdit(null);
    setIsFormDialogOpen(true);
  };

  if (isLoading) {
    return <div className="p-8 text-center flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin mr-2" /> App Features laden...</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Feature Management
              </CardTitle>
              <CardDescription>
                Beheer hier alle features die aan abonnementen gekoppeld kunnen worden.
              </CardDescription>
            </div>
            <Button onClick={handleAddNewFeature}>
              <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Feature Toevoegen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Zoek feature..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={targetAudienceFilter} onValueChange={(value) => setTargetAudienceFilter(value as TargetAudience | 'all')}>
              <SelectTrigger><SelectValue placeholder="Filter op doelgroep" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Doelgroepen</SelectItem>
                {uniqueTargetAudiences.map(audience => (
                  <SelectItem key={audience} value={audience}>{audience.charAt(0).toUpperCase() + audience.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger><SelectValue placeholder="Filter op categorie" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Categorieën</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={linkedPlanFilter} onValueChange={setLinkedPlanFilter}>
              <SelectTrigger><SelectValue placeholder="Filter op gekoppeld plan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle/Geen Gekoppeld Plan</SelectItem>
                {getSubscriptionPlans().filter(p=>p.active).map(plan => (
                  <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <FeatureTable
            features={filteredFeatures}
            allSubscriptionPlans={getSubscriptionPlans()}
            onEditFeature={handleEditFeature}
            onDeleteFeature={handleDeleteFeature}
          />
        </CardContent>
      </Card>

      <FeatureFormDialog
        isOpen={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        feature={featureToEdit}
        onSave={handleSaveFeature}
        allSubscriptionPlans={getSubscriptionPlans()}
      />
    </div>
  );
}
