// src/app/api/seed-changelog/route.ts
import { NextResponse } from 'next/server';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Define the collection name locally since constants file doesn't exist
const CHANGELOG_COLLECTION = 'changelog';

/**
 * API Route: GET /api/seed-changelog
 * 
 * Seeds the Firestore 'changelog' collection with initial data if it's empty.
 * This is useful for setting up a new environment or for demo purposes.
 * 
 * WARNING: This is a destructive operation if run on a non-empty collection.
 * It's currently protected by an emptiness check.
 * 
 * @returns {NextResponse} A JSON response indicating success or failure.
 */
export async function GET() {
  try {
    if (!db) { return NextResponse.json({ error: "Database not configured" }, { status: 500 }); }
    const changelogRef = collection(db, CHANGELOG_COLLECTION);
    const snapshot = await getDocs(changelogRef);
    
    // Safety check: only seed if the collection is empty.
    if (!snapshot.empty) {
      return NextResponse.json({
        success: false,
        message: 'Changelog collection is not empty. Seeding aborted.',
      }, { status: 409 }); // 409 Conflict
    }

    // Use a batch write for atomicity
    const batch = writeBatch(db);
    
    // Initial changelog entries (placeholder data)
    const initialEntries = [
      {
        title: 'Platform Launch',
        description: 'Initial launch of the tutoring platform',
        details: ['User registration and authentication', 'Basic dashboard functionality', 'Quiz system implementation'],
        tags: ['launch', 'platform', 'core'],
        createdAt: new Date('2024-01-01'),
        version: '1.0.0'
      },
      {
        title: 'AI Features Added',
        description: 'Integration of AI-powered features for personalized learning',
        details: ['AI coaching insights', 'Personalized recommendations', 'Automated content generation'],
        tags: ['ai', 'features', 'personalization'],
        createdAt: new Date('2024-02-15'),
        version: '1.1.0'
      }
    ];

    // Add entries to batch
    initialEntries.forEach(entry => {
    if (!db) { throw new Error("Database not configured"); }
      const docRef = doc(collection(db, CHANGELOG_COLLECTION));
      batch.set(docRef, entry);
    });
    
    await batch.commit();
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded changelog with ${initialEntries.length} items.`,
    });

  } catch (error) {
    console.error('Error seeding changelog:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({
      success: false,
      message: 'Failed to seed changelog.',
      error: errorMessage,
    }, { status: 500 });
  }
}