// src/app/actions/toolActions.ts
"use server";

import fs from 'fs/promises';
import path from 'path';
import { generateReactComponent } from '@/app/ai/flows/generate-react-component-flow';
import { toPascalCase } from '@/lib/string-utils';

interface CreateToolComponentFileResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export async function createToolComponentFile(toolId: string, title: string, description: string): Promise<CreateToolComponentFileResult> {
  if (!toolId || !title || !description) {
    return { success: false, error: "Ontbrekende tool-ID, titel of beschrijving." };
  }

  try {
    // 1. Generate the component code using the AI flow
    const componentGenerationResult = await generateReactComponent({ title, description });
    const componentCode = componentGenerationResult.componentCode;

    if (!componentCode) {
      return { success: false, error: "AI kon geen componentcode genereren." };
    }

    // 2. Determine the file path and name
    const componentName = toPascalCase(toolId);
    const fileName = `${componentName}.tsx`;
    const toolsDir = path.join(process.cwd(), 'src', 'components', 'tools');
    const filePath = path.join(toolsDir, fileName);

    // Ensure the directory exists (optional, but good practice)
    await fs.mkdir(toolsDir, { recursive: true });

    // 3. Write the file to the filesystem
    await fs.writeFile(filePath, componentCode, 'utf8');

    console.log(`Successfully created tool component at: ${filePath}`);
    // Return the path but not the code, as the client will now render it dynamically.
    return { success: true, filePath: `/dashboard/tools/${toolId}` };

  } catch (error) {
    console.error("Failed to create tool component file:", error);
    const errorMessage = error instanceof Error ? error.message : "Een onbekende fout is opgetreden.";
    return { success: false, error: `Kon het componentbestand niet aanmaken: ${errorMessage}` };
  }
}

export async function checkToolComponentExists(toolId: string): Promise<boolean> {
  if (!toolId) return false;

  const componentName = toPascalCase(toolId);
  const fileName = `${componentName}.tsx`;
  const filePath = path.join(process.cwd(), 'src', 'components', 'tools', fileName);

  try {
    await fs.access(filePath);
    return true; // File exists
  } catch {
    return false; // File does not exist
  }
}
