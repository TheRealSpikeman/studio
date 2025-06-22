
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-coaching-insights.ts';
import '@/ai/flows/generate-quiz-summary.ts';
import '@/ai/flows/generate-ai-quiz-flow.ts';
import '@/ai/flows/generate-quiz-analysis-flow.ts';
import '@/ai/flows/compare-parent-child-insights-flow.ts'; // Nieuwe import
import '@/ai/flows/verify-quiz-questions-flow.ts';


