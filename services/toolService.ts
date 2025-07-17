// services/toolService.ts
import type { ElementType } from 'react';
import { Timer, Gamepad2, ShieldBan, NotebookPen, BarChart, Bell, PauseCircle, Fingerprint, Waves, Sun, Gauge, GitBranch, Share2, Lightbulb, Users, Compass, BookOpenCheck, Brain, Zap, Sparkles, MessageCircle, ClipboardList } from '@/lib/icons';

// Interface and type definitions, kept within the service for now.
export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Focus & Concentratie' | 'Energie & Beweging' | 'Rust & Regulatie' | 'Stemming & Emotie' | 'Sociaal & Communicatie' | 'Interesses & Hobby';
  status?: 'online' | 'offline';
  reasoning: {
    high: string;
    medium: string;
    low: string;
  };
  usage: {
    when: string;
    benefit: string;
  }
}

export type ToolScores = {
  attention: number;
  energy: number;
  prikkels: number;
  sociaal: number;
  stemming: number;
};

// Mock data, now self-contained in the service.
const MOCK_TOOLS: Tool[] = [
  // ... (Full list of tools would be pasted here)
];

/**
 * Fetches all available tools.
 * In the future, this will read from the 'tools' collection in Firestore.
 * @returns {Promise<Tool[]>} A promise that resolves to an array of all tools.
 */
export const getTools = async (): Promise<Tool[]> => {
  console.log("Fetching all tools from the mock data source...");
  await new Promise(resolve => setTimeout(resolve, 50));
  return MOCK_TOOLS;
};

/**
 * Fetches a single tool by its ID.
 * @param {string} id - The ID of the tool to fetch.
 * @returns {Promise<Tool | null>} A promise that resolves to the tool object or null if not found.
 */
export const getToolById = async (id: string): Promise<Tool | null> => {
    console.log(`Fetching tool with ID: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 50));
    const tool = MOCK_TOOLS.find(t => t.id === id);
    return tool || null;
};

// --- Recommendation Logic ---
const getCategoryForScore = (score: number, thresholds: [number, number, number]): 'low' | 'medium' | 'high' => {
  if (score <= thresholds[0]) return 'low';
  if (score <= thresholds[1]) return 'medium';
  return 'high';
}

export const calculateToolRecommendations = (scores: ToolScores): { high: Tool[], medium: Tool[], low: Tool[] } => {
  const recommendations: { high: Set<string>, medium: Set<string>, low: Set<string> } = { high: new Set(), medium: new Set(), low: new Set() };
  
  const addTools = (toolIds: string[], priority: 'high' | 'medium' | 'low') => {
    toolIds.forEach(id => {
      if (!recommendations.high.has(id) && !recommendations.medium.has(id)) {
        recommendations[priority].add(id);
      } else if (priority === 'medium' && !recommendations.high.has(id)) {
        recommendations.medium.add(id);
      } else if (priority === 'high') {
        recommendations.high.add(id);
      }
    });
  };

  // The recommendation logic from the original file would be pasted here...
  // For brevity, it is omitted from this display.

  const findToolById = (id: string): Tool | undefined => MOCK_TOOLS.find(tool => tool.id === id);
  return {
    high: Array.from(recommendations.high).map(findToolById).filter((t): t is Tool => !!t),
    medium: Array.from(recommendations.medium).map(findToolById).filter((t): t is Tool => !!t),
    low: Array.from(recommendations.low).map(findToolById).filter((t): t is Tool => !!t),
  };
};


// Helper function to get the icon component by name.
export const getToolIconComponent = (iconName: string): ElementType | undefined => {
    const allToolIcons: { name: string, component: ElementType }[] = [
        { name: 'Timer', component: Timer }, { name: 'Gamepad2', component: Gamepad2 }, { name: 'ShieldBan', component: ShieldBan },
        { name: 'NotebookPen', component: NotebookPen }, { name: 'BarChart', component: BarChart }, { name: 'Bell', component: Bell },
        { name: 'PauseCircle', component: PauseCircle }, { name: 'Fingerprint', component: Fingerprint }, { name: 'Waves', component: Waves },
        { name: 'Sun', component: Sun }, { name: 'Gauge', component: Gauge }, { name: 'GitBranch', component: GitBranch },
        { name: 'Share2', component: Share2 }, { name: 'Lightbulb', component: Lightbulb }, { name: 'Users', component: Users },
        { name: 'Compass', component: Compass }, { name: 'BookOpenCheck', component: BookOpenCheck }, { name: 'Brain', component: Brain },
        { name: 'Zap', component: Zap }, { name: 'Sparkles', component: Sparkles }, { name: 'MessageCircle', component: MessageCircle },
        { name: 'ClipboardList', component: ClipboardList },
    ];
    return allToolIcons.find(icon => icon.name === iconName)?.component;
};
