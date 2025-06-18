
// src/app/dashboard/admin/feature-management/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ListFilter, Edit, Package } from 'lucide-react'; // Added Package icon
import { FeatureTable } from '@/components/admin/feature-management/FeatureTable';
import { FeatureFormDialog } from '@/components/admin/feature-management/FeatureFormDialog';
import { useToast } from '@/hooks/use-toast';
import type { AppFeature } from '@/app/dashboard/admin/subscription-management/page'; // Import AppFeature
import { DEFAULT_APP_FEATURES, LOCAL_STORAGE_FEATURES_KEY } from '@/app/dashboard/admin/subscription-management/page';

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
        const parsedFeatures = JSON.parse(storedFeaturesRaw);
        // Ensure all default keys exist for each feature
        const completeFeatures = parsedFeatures.map((feat: Partial<AppFeature>) => ({
            id: feat.id || `feature-${Date.now()}-${Math.random().toString(36).substring(2,7)}`, // Ensure ID
            label: feat.label || 'Nieuwe Feature',
            description: feat.description || '',
            targetAudience: feat.targetAudience && Array.isArray(feat.targetAudience) ? feat.targetAudience : ['leerling'],
            category: feat.category || 'Algemeen',
        }));
        setFeatures(completeFeatures);
      } else {
        setFeatures(DEFAULT_APP_FEATURES);
        localStorage.setItem(LOCAL_STORAGE_FEATURES_KEY, JSON.stringify(DEFAULT_APP_FEATURES));
      }
    } catch (error) {
      console.error("Error loading features from localStorage:", error);
      setFeatures(DEFAULT_APP_FEATURES);
      localStorage.setItem(LOCAL_STORAGE_FEATURES_KEY, JSON.stringify(DEFAULT_APP_FEATURES));
    }
    setIsLoading(false);
  }, []);

  const handleSaveFeature = (featureData: AppFeature) => {
    let updatedFeatures;
    if (featureToEdit) { // Editing existing feature
      updatedFeatures = features.map(f => f.id === featureData.id ? featureData : f);
      toast({ title: "Feature Bijgewerkt", description: `Feature "${featureData.label}" is succesvol bijgewerkt.` });
    } else { // Adding new feature
      if (features.some(f => f.id === featureData.id)) {
        toast({ title: "Fout", description: `Een feature met ID "${featureData.id}" bestaat al. Kies een uniek ID.`, variant: "destructive" });
        return;
      }
      updatedFeatures = [featureData, ...features];
      toast({ title: "Feature Toegevoegd", description: `Feature "${featureData.label}" is succesvol toegevoegd.` });
    }
    setFeatures(updatedFeatures);
    localStorage.setItem(LOCAL_STORAGE_FEATURES_KEY, JSON.stringify(updatedFeatures));
    setIsFormDialogOpen(false);
    setFeatureToEdit(null);
  };

  const handleEditFeature = (feature: AppFeature) => {
    setFeatureToEdit(feature);
    setIsFormDialogOpen(true);
  };

  const handleDeleteFeature = (featureId: string) => {
    const featureLabel = features.find(f => f.id === featureId)?.label || featureId;
    const updatedFeatures = features.filter(f => f.id !== featureId);
    setFeatures(updatedFeatures);
    localStorage.setItem(LOCAL_STORAGE_FEATURES_KEY, JSON.stringify(updatedFeatures));
    toast({ title: "Feature Verwijderd", description: `Feature "${featureLabel}" is verwijderd.` });
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
                <Package className="h-6 w-6 text-primary" /> {/* Changed icon */}
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
          {/* Placeholder for filters */}
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
