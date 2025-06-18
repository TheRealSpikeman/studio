
// src/app/dashboard/admin/feature-management/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ListFilter, Package } from 'lucide-react';
import { FeatureTable } from '@/components/admin/feature-management/FeatureTable';
import { FeatureFormDialog, type FeatureFormData } from '@/components/admin/feature-management/FeatureFormDialog';
import { useToast } from '@/hooks/use-toast';
import type { AppFeature, SubscriptionPlan } from '@/app/dashboard/admin/subscription-management/page';
import { DEFAULT_APP_FEATURES, LOCAL_STORAGE_FEATURES_KEY, LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY } from '@/app/dashboard/admin/subscription-management/page';

export default function FeatureManagementPage() {
  const { toast } = useToast();
  const [features, setFeatures] = useState<AppFeature[]>([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [featureToEdit, setFeatureToEdit] = useState<AppFeature | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedFeaturesRaw = localStorage.getItem(LOCAL_STORAGE_FEATURES_KEY);
      if (storedFeaturesRaw) {
        const parsedFeatures = JSON.parse(storedFeaturesRaw) as Partial<AppFeature>[];
        const completeFeatures = parsedFeatures.map((feat) => ({
            id: feat.id || `feature-${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
            label: feat.label || 'Nieuwe Feature',
            description: feat.description || '',
            targetAudience: feat.targetAudience && Array.isArray(feat.targetAudience) ? feat.targetAudience : ['leerling'],
            category: feat.category || 'Algemeen',
        } as AppFeature));
        setFeatures(completeFeatures);
      } else {
        setFeatures(DEFAULT_APP_FEATURES);
        localStorage.setItem(LOCAL_STORAGE_FEATURES_KEY, JSON.stringify(DEFAULT_APP_FEATURES));
      }
    } catch (error) {
      console.error("Error loading features from localStorage:", error);
      setFeatures(DEFAULT_APP_FEATURES); // Fallback to defaults
      localStorage.setItem(LOCAL_STORAGE_FEATURES_KEY, JSON.stringify(DEFAULT_APP_FEATURES));
    }
    setIsLoading(false);
  }, []);

  const handleSaveFeature = (featureFormData: FeatureFormData) => {
    // 1. Save/Update the feature itself
    const featureCoreData: AppFeature = {
        id: featureFormData.id,
        label: featureFormData.label,
        description: featureFormData.description,
        targetAudience: featureFormData.targetAudience,
        category: featureFormData.category,
    };

    let updatedFeaturesList;
    if (featureToEdit) { // Editing existing feature
      updatedFeaturesList = features.map(f => f.id === featureCoreData.id ? featureCoreData : f);
      toast({ title: "Feature Bijgewerkt", description: `Feature "${featureCoreData.label}" is succesvol bijgewerkt.` });
    } else { // Adding new feature
      if (features.some(f => f.id === featureCoreData.id)) {
        toast({ title: "Fout", description: `Een feature met ID "${featureCoreData.id}" bestaat al. Kies een uniek ID.`, variant: "destructive" });
        return;
      }
      updatedFeaturesList = [featureCoreData, ...features];
      toast({ title: "Feature Toegevoegd", description: `Feature "${featureCoreData.label}" is succesvol toegevoegd.` });
    }
    setFeatures(updatedFeaturesList);
    localStorage.setItem(LOCAL_STORAGE_FEATURES_KEY, JSON.stringify(updatedFeaturesList));

    // 2. Update subscription plans based on linkedPlans
    try {
        const storedPlansRaw = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY);
        let plansToUpdate: SubscriptionPlan[] = storedPlansRaw ? JSON.parse(storedPlansRaw) : [];
        const featureId = featureCoreData.id;
        const linkedPlanIdsSet = new Set(featureFormData.linkedPlans || []);

        plansToUpdate = plansToUpdate.map(plan => {
            const newFeatureAccess = { ...(plan.featureAccess || {}) }; // Ensure featureAccess exists
            if (linkedPlanIdsSet.has(plan.id)) {
                newFeatureAccess[featureId] = true;
            } else {
                newFeatureAccess[featureId] = false;
            }
            return { ...plan, featureAccess: newFeatureAccess };
        });
        localStorage.setItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, JSON.stringify(plansToUpdate));
        toast({ title: "Abonnementen Bijgewerkt", description: `De koppelingen voor feature "${featureCoreData.label}" zijn verwerkt in de abonnementen.`})
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
    // Note: This only deletes the feature. It does not automatically remove it from plans' featureAccess.
    // That might be desired to prevent breaking existing plan configurations if a feature is accidentally deleted.
    // Or, a more advanced version could offer to clean up linkages.
    const featureLabel = features.find(f => f.id === featureId)?.label || featureId;
    const updatedFeatures = features.filter(f => f.id !== featureId);
    setFeatures(updatedFeatures);
    localStorage.setItem(LOCAL_STORAGE_FEATURES_KEY, JSON.stringify(updatedFeatures));
    toast({ title: "Feature Verwijderd", description: `Feature "${featureLabel}" is verwijderd. Dit verwijdert de feature niet automatisch uit bestaande abonnementen.` });
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
          <div className="mb-4">
            <Button variant="outline" disabled>
              <ListFilter className="mr-2 h-4 w-4" /> Filters (binnenkort)
            </Button>
          </div>
          <FeatureTable
            features={features}
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
