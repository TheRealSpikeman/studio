// src/app/dashboard/admin/quiz-management/reports/page.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChartHorizontal, Users, Clock, Trophy, Filter } from '@/lib/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { QuizAdmin } from '@/types/quiz-admin';

// Dummy data for quiz completions. In a real app, this would come from a database.
interface QuizCompletion {
  quizId: string;
  quizTitle: string;
  userId: string;
  completedAt: string;
  scores: Record<string, number>;
}

const generateDummyCompletions = (): QuizCompletion[] => {
  const completions: QuizCompletion[] = [];
  const users = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'];
  const quizzes: QuizAdmin[] = [];

  if (quizzes.length === 0) return []; // Prevent errors if no quizzes are defined

  for (let i = 0; i < 50; i++) {
    const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString();
    
    completions.push({
      quizId: randomQuiz.id,
      quizTitle: randomQuiz.title,
      userId: randomUser,
      completedAt: randomDate,
      scores: {
        ADD: Math.random() * 4,
        ADHD: Math.random() * 4,
        HSP: Math.random() * 4,
        ASS: Math.random() * 4,
        AngstDepressie: Math.random() * 4,
      },
    });
  }
  return completions;
};

const dummyCompletions = generateDummyCompletions();

export default function QuizReportsPage() {
  const [completions, setCompletions] = useState<QuizCompletion[]>(dummyCompletions);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('all');

  const filteredCompletions = useMemo(() => {
    if (selectedQuizId === 'all') {
      return completions;
    }
    return completions.filter(c => c.quizId === selectedQuizId);
  }, [completions, selectedQuizId]);
  
  const uniqueQuizzes = useMemo(() => {
    const quizMap = new Map<string, string>();
    completions.forEach(c => {
      quizMap.set(c.quizId, c.quizTitle);
    });
    return Array.from(quizMap.entries()).map(([id, title]) => ({ id, title }));
  }, [completions]);

  const kpiData = useMemo(() => {
    const totalCompletions = filteredCompletions.length;
    const uniqueUsers = new Set(filteredCompletions.map(c => c.userId)).size;

    const completionsByQuiz = filteredCompletions.reduce((acc, curr) => {
      acc[curr.quizTitle] = (acc[curr.quizTitle] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostPopularQuiz = Object.entries(completionsByQuiz).sort((a, b) => b[1] - a[1])[0];
    
    return {
      totalCompletions,
      uniqueUsers,
      mostPopularQuiz: mostPopularQuiz ? mostPopularQuiz[0] : 'N/A',
      averageCompletionTime: '8 min', // Dummy data
    };
  }, [filteredCompletions]);
  
  const chartData = useMemo(() => {
     const completionsByQuiz = filteredCompletions.reduce((acc, curr) => {
      // Shorten title for chart
      const shortTitle = curr.quizTitle.length > 25 ? `${curr.quizTitle.substring(0, 22)}...` : curr.quizTitle;
      acc[shortTitle] = (acc[shortTitle] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(completionsByQuiz)
      .map(([name, afnames]) => ({ name, afnames }))
      .sort((a,b) => b.afnames - a.afnames)
      .slice(0, 10); // Show top 10
  }, [filteredCompletions]);
  
  const averageScoresData = useMemo(() => {
    const scoreSums: Record<string, { sum: number, count: number }> = {};
    filteredCompletions.forEach(c => {
      Object.entries(c.scores).forEach(([profile, score]) => {
        if (!scoreSums[profile]) {
          scoreSums[profile] = { sum: 0, count: 0 };
        }
        scoreSums[profile].sum += score;
        scoreSums[profile].count += 1;
      });
    });
    
    return Object.entries(scoreSums).map(([profile, data]) => ({
      profile,
      average: (data.sum / data.count).toFixed(2),
      count: data.count,
    })).sort((a,b) => b.count - a.count);
  }, [filteredCompletions]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <BarChartHorizontal className="h-6 w-6 text-primary" />
                Quiz Rapportages
              </CardTitle>
              <CardDescription>
                Gedetailleerde analyses van quizdeelnames, scores en vraagprestaties.
              </CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
               <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
                 <SelectTrigger className="w-full sm:w-[250px]">
                   <Filter className="h-4 w-4 mr-2 text-muted-foreground"/>
                   <SelectValue placeholder="Filter op quiz..." />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">Alle Quizzen</SelectItem>
                   {uniqueQuizzes.map(quiz => (
                     <SelectItem key={quiz.id} value={quiz.id}>{quiz.title}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Totaal Afnames</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{kpiData.totalCompletions}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Unieke Deelnemers</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{kpiData.uniqueUsers}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Gem. Voltooiingstijd</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{kpiData.averageCompletionTime}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Populairste Quiz</CardTitle></CardHeader><CardContent><div className="text-lg font-bold truncate" title={kpiData.mostPopularQuiz}>{kpiData.mostPopularQuiz}</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quiz Afnames (Top 10)</CardTitle>
            <CardDescription>Aantal keer dat elke quiz is voltooid.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="afnames" fill="hsl(var(--primary))" name="Aantal afnames" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
           <CardHeader>
            <CardTitle>Gemiddelde Profielscores</CardTitle>
            <CardDescription>Gemiddelde score (0-4) per neuroprofiel over alle afnames.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profiel</TableHead>
                  <TableHead className="text-right">Gem. Score</TableHead>
                  <TableHead className="text-right">Aantal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {averageScoresData.map(item => (
                  <TableRow key={item.profile}>
                    <TableCell className="font-medium">{item.profile}</TableCell>
                    <TableCell className="text-right font-semibold">{item.average}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
