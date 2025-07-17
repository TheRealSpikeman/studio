// src/components/quiz/results-chart.tsx
"use client";

import { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { getDisplayCategory } from '@/lib/quiz-data/teen-neurodiversity-quiz';

interface ResultsChartProps {
  scores: Record<string, number>;
}

export function ResultsChart({ scores }: ResultsChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(scores).map(([subject, score]) => ({
      subject: getDisplayCategory(subject),
      A: score,
      fullMark: 4,
    }));
  }, [scores]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: '12px', fill: 'hsl(var(--muted-foreground))' }} />
        <PolarRadiusAxis angle={30} domain={[0, 4]} tickCount={5} />
        <Radar
          name="Score"
          dataKey="A"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.6}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)'
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
