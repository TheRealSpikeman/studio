import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

// Assuming your changelogService and ChangelogEntry type are defined elsewhere
// import { changelogService } from '@/services/changelogService';
// import type { ChangelogEntry } from '@/types/changelog';

const execAsync = promisify(exec);

// Define a basic type for ChangelogEntry for this example if not imported
type ChangelogEntry = {
    id: string;
    title: string;
    description: string;
    date: string;
    iconName?: string; // Optional icon name
    tags: { text: string; variant: string }[]; // Array of tag objects
    details?: string[]; // Optional array of detail points
};

export async function POST(request: Request) {
  try {
    // Execute git log command to get the latest commit message
    const { stdout, stderr } = await execAsync('git log -1 --pretty=%B');

    if (stderr) {
      console.error('Git command error:', stderr);
      return NextResponse.json({ error: 'Failed to get latest changes from Git' }, { status: 500 });
    }

    const commitMessage = stdout.trim();

    // Basic parsing of the commit message
    const lines = commitMessage.split('\\n');
    const title = lines[0] || 'New Change';
    const description = lines.slice(1).join('\\n').trim() || 'No description provided';
    const date = new Date().toISOString(); // Use current date/time

    // Create a ChangelogEntry object (basic structure)
    const newEntry: ChangelogEntry = {
        id: Date.now().toString(), // Simple timestamp ID
        title,
        description,
        date,
        iconName: 'GitBranch', // Example icon
        tags: [], // You might want to parse tags from commit message
        details: [], // You might want to parse details from commit message
    };

    // Placeholder: Add the new entry using your changelog service
    // import { changelogService } from '@/services/changelogService'; await changelogService.addChangelogEntry(newEntry);

    // Return the created ChangelogEntry
    return NextResponse.json(newEntry);

  } catch (error) {
    console.error('Error generating changelog:', error);
    return NextResponse.json({ error: 'An error occurred while generating changelog entry' }, { status: 500 });
  }
}