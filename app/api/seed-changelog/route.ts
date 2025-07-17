// app/api/seed-changelog/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { initialChangelogEntries } from '@/lib/data/initial-changelog';
import { Timestamp } from 'firebase-admin/firestore';

export async function GET() {
  const changelogRef = adminDb.collection('changelog');
  let addedCount = 0;
  let skippedCount = 0;

  try {
    console.log('Starting to seed changelog...');
    for (const entry of initialChangelogEntries) {
      const docRef = changelogRef.doc(entry.id);
      const doc = await docRef.get();

      if (doc.exists) {
        console.log(`Skipping existing entry with ID: ${entry.id}`);
        skippedCount++;
        continue;
      }

      const firestoreEntry = {
        ...entry,
        date: Timestamp.fromDate(new Date(entry.date)),
      };
      
      await docRef.set(firestoreEntry);
      console.log(`Added new entry: ${entry.title}`);
      addedCount++;
    }
    console.log('Changelog seeding complete.');
    
    return NextResponse.json({ 
      message: 'Seeding complete.',
      added: addedCount,
      skipped: skippedCount 
    });

  } catch (error) {
    console.error('Error seeding changelog:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Seeding failed', error: errorMessage }, { status: 500 });
  }
}
