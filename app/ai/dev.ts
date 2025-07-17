
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-coaching-insights.ts';
import '@/ai/flows/generate-quiz-summary.ts';
import '@/ai/flows/generate-ai-quiz-flow.ts';
import '@/ai/flows/generate-quiz-analysis-flow.ts';
import '@/ai/flows/compare-parent-child-insights-flow.ts';
import '@/ai/flows/verify-quiz-questions-flow.ts';
import '@/ai/flows/generate-tool-details-flow.ts';
import '@/ai/flows/generate-react-component-flow.ts';
import '@/ai/flows/generate-blog-post-flow.ts';
import '@/ai/flows/generate-blog-topic-flow.ts';
import '@/ai/flows/propose-quiz-from-blog-flow.ts';
