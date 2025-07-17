// src/app/actions/blogActions.ts
'use server';
import fs from 'fs/promises';
import path from 'path';
import type { BlogTagCategories } from '@/config/blog-tags';

export async function updateBlogTagConfigFile(newConfig: BlogTagCategories): Promise<{ success: boolean; error?: string }> {
  const configFilePath = path.join(process.cwd(), 'src', 'config', 'blog-tags.ts');
  
  // Format the file content as a TypeScript export
  const fileContent = `// src/config/blog-tags.ts

export interface BlogTagCategories {
  [key: string]: string[];
}

export const blogTagConfig: BlogTagCategories = ${JSON.stringify(newConfig, null, 2)};

export const getAllBlogTags = (): string[] => {
  return Object.values(blogTagConfig).flat();
};
`;
  try {
    await fs.writeFile(configFilePath, fileContent, 'utf8');
    return { success: true };
  } catch (error) {
    console.error("Failed to write blog tags config file:", error);
    return { success: false, error: (error as Error).message };
  }
}
