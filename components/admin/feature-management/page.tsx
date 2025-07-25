
// src/app/dashboard/admin/feature-management/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Package, Search } from '@/lib/icons';
import { FeatureTable } from '@/components/admin/feature-management/FeatureTable';
import { FeatureFormDialog, type FeatureFormData } from '@/components/admin/feature-management/FeatureFormDialog';
import { useToast } from '@/hooks/use-toast';
import {
  type AppFeature,
  type SubscriptionPlan,
  type TargetAudience,
  getSubscriptionPlans,
  saveSubscriptionPlans,
  getAllFeatures,
  saveAllFeatures
} from '@/types/subscription';
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

  useEffect(() => {
    setIsLoading(true);
    setFeatures(getAllFeatures().sort((a, b) => a.label.localeCompare(b.label)));
    setIsLoading(false);
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


  const handleSaveFeature = (featureFormData: FeatureFormData) => {
    const featureCoreData: AppFeature = {
        id: featureFormData.id,
        label: featureFormData.label,
        description: featureFormData.description,
        targetAudience: featureFormData.targetAudience,
        category: featureFormData.category,
        isRecommendedTool: featureFormData.isRecommendedTool,
    };

    let updatedFeaturesList;
    const currentFeatures = getAllFeatures();
    if (featureToEdit) { 
      updatedFeaturesList = currentFeatures.map(f => f.id === featureCoreData.id ? featureCoreData : f);
      toast({ title: "Feature Bijgewerkt", description: `Feature "${featureCoreData.label}" is succesvol bijgewerkt.` });
    } else { 
      if (currentFeatures.some(f => f.id === featureCoreData.id)) {
        toast({ title: "Fout", description: `Een feature met ID "${featureCoreData.id}" bestaat al. Kies een uniek ID.`, variant: "destructive" });
        return;
      }
      updatedFeaturesList = [featureCoreData, ...currentFeatures];
      toast({ title: "Feature Toegevoegd", description: `Feature "${featureCoreData.label}" is succesvol toegevoegd.` });
    }
    const sortedUpdatedFeatures = updatedFeaturesList.sort((a, b) => a.label.localeCompare(b.label));
    saveAllFeatures(sortedUpdatedFeatures);
    setFeatures(sortedUpdatedFeatures);


    try {
        let plansToUpdate: SubscriptionPlan[] = getSubscriptionPlans();
        const featureId = featureCoreData.id;
        const linkedPlanIdsSet = new Set(featureFormData.linkedPlans || []);

        plansToUpdate = plansToUpdate.map(plan => {
            const newFeatureAccess = { ...(plan.featureAccess || {}) }; 
            if (linkedPlanIdsSet.has(plan.id)) {
                newFeatureAccess[featureId] = true;
            } else {
                delete newFeatureAccess[featureId];
            }
            return { ...plan, featureAccess: newFeatureAccess };
        });
        saveSubscriptionPlans(plansToUpdate);
        toast({ title: "Abonnementen Bijgewerkt", description: `De koppelingen voor feature "${featureCoreData.label}" zijn verwerkt.`})
    } catch (error) {
        console.error("Error updating subscription plans with feature linkages:", error);
        toast({ title: "Fout bij Koppelen", description: "Kon de feature niet correct aan alle abonnementen koppelen.", variant: "destructive"});
    }

    setIsFormDialogOpen(false);
    setFeatureToEdit(null);
  };

  const handleEditFeature = (feature: AppFeature) => {
    setFeatureToEdit(feature);
    setIsFormDialogOpen(true);
  };

  const handleDeleteFeature = (featureId: string) => {
    const featureLabel = features.find(f => f.id === featureId)?.label || featureId;
    
    const allStoredPlans: SubscriptionPlan[] = getSubscriptionPlans();

    const updatedPlans = allStoredPlans.map(plan => {
        const newFeatureAccess = { ...plan.featureAccess };
        if (newFeatureAccess.hasOwnProperty(featureId)) {
            delete newFeatureAccess[featureId];
        }
        return { ...plan, featureAccess: newFeatureAccess };
    });

    saveSubscriptionPlans(updatedPlans);
    
    const currentFeatures = getAllFeatures();
    const updatedFeatures = currentFeatures.filter(f => f.id !== featureId);
    saveAllFeatures(updatedFeatures);
    setFeatures(updatedFeatures.sort((a,b) => a.label.localeCompare(b.label)));
    
    toast({ title: "Feature Verwijderd", description: `Feature "${featureLabel}" en de koppelingen in abonnementen zijn verwijderd.` });
  };

  const handleAddNewFeature = () => {
    setFeatureToEdit(null);
    setIsFormDialogOpen(true);
  };

  if (isLoading) {
    return <div className="p-8 text-center">App Features laden...</div>;
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
                <SelectContent>
                  <SelectItem value="all">Alle/Geen Gekoppeld Plan</SelectItem>
                  {allSubscriptionPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                  ))}
                </SelectContent>
          </div>
          <FeatureTable
            features={filteredFeatures}
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
      />
    </div>
  );
}
