// app/actions/changelogActions.ts
'use server';

import { runTerminalCommand } from '@/lib/run-command'; // A wrapper for running terminal commands safely
import { generateChangelogFromDiff } from '@/lib/ai/changelog-generator'; // Hypothetical AI service
import { addChangelogEntry } from '@/app/services/changelogService'; // Corrected import path
import { revalidatePath } from 'next/cache';

export interface GenerateChangelogDraftResult {
    success: boolean;
    draft?: {
        title: string;
        description: string;
        tags: string[]; // Keep it simple for the AI, we can map to variants later
        details: string[];
    };
    error?: string;
    diff?: string;
}

/**
 * Generates a changelog draft by analyzing the git diff between HEAD and the previous commit.
 */
export async function generateChangelogDraft(): Promise<GenerateChangelogDraftResult> {
    try {
        const diffCommand = 'git diff HEAD~1 HEAD';
        const { stdout: diff, stderr } = await runTerminalCommand(diffCommand);

        if (stderr) {
            console.error('Git diff error:', stderr);
            // Ignore common "no such revision" errors for the very first commit
            if (!stderr.includes("bad revision")) {
                 return { success: false, error: 'Could not retrieve code changes from Git.' };
            }
        }
        
        if (!diff || diff.trim() === '') {
            return { success: false, error: 'No code changes detected since the last commit.' };
        }

        // Call the AI to generate a structured changelog entry from the diff
        const aiResult = await generateChangelogFromDiff(diff);

        if (!aiResult) {
            return { success: false, error: 'The AI failed to generate a changelog entry.', diff };
        }

        return { success: true, draft: aiResult, diff };

    } catch (error) {
        console.error('Failed to generate changelog draft:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}


export interface SubmitChangelogEntryResult {
    success: boolean;
    id?: string;
    error?: string;
}

/**
 * Submits the final, edited changelog entry to the database.
 * @param entryData The complete changelog entry to save.
 */
export async function submitChangelogEntry(entryData: any): Promise<SubmitChangelogEntryResult> {
    try {
        // Here you would add validation logic (e.g., using Zod)
        const result = await addChangelogEntry(entryData);
        
        if(result.success) {
            // Invalidate the cache for the changelog page to show the new entry immediately
            revalidatePath('/dashboard/admin/documentation/changelog');
            return { success: true, id: result.id };
        } else {
            return { success: false, error: result.error };
        }

    } catch (error) {
         console.error('Failed to submit changelog entry:', error);
         const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
         return { success: false, error: errorMessage };
    }
}
