// src/hooks/useCoachingData.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { generateCoachingInsights, type GenerateCoachingInsightsOutput } from '../app/ai/flows/generate-coaching-insights';
import { storageService } from '@/services/storageService';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';

export const useCoachingData = (selectedDate: Date | undefined) => {
  const { user } = useAuth();
  const [aiCoachingContent, setAiCoachingContent] = useState<GenerateCoachingInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDataForDate = useCallback(async (date: Date, signal: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const storedAnalysis = storageService.getOnboardingAnalysis();
      const userName = user?.name; // Get username from AuthContext

      const input = {
        onboardingAnalysisText: storedAnalysis || "",
        userName: userName,
        currentDate: format(date, "EEEE d MMMM", { locale: nl })
      };

      const result = await generateCoachingInsights(input);

      if (signal.aborted) return;
      
      setAiCoachingContent(result);

    } catch (e) {
      if (signal.aborted) return;
      
      console.error("Error fetching AI coaching insights:", e);
      const errorMessage = e instanceof Error ? e.message : "Kon gepersonaliseerde coaching content niet laden.";
      setError(errorMessage);
      setAiCoachingContent({
        dailyAffirmation: "Begin de dag met een glimlach.",
        dailyCoachingTip: "Neem vandaag even tijd voor jezelf.",
        microTaskSuggestion: "Adem diep in en uit."
      });
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!selectedDate) {
      setIsLoading(false);
      return;
    }
    
    const controller = new AbortController();
    loadDataForDate(selectedDate, controller.signal);

    return () => {
      controller.abort();
    };
  }, [selectedDate, loadDataForDate]);

  return { aiCoachingContent, isLoading, error };
};
