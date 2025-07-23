// app/api/user/save-agreements/route.ts
import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!auth) { return NextResponse.json({ error: "Authentication not configured" }, { status: 500 }); }
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const body = await request.json();
    const { agreements } = body;

    if (!agreements || typeof agreements !== 'object') {
        return new NextResponse('Bad Request: Missing agreements object.', { status: 400 });
    }

    if (!db) { return NextResponse.json({ error: "Database not configured" }, { status: 500 }); }
    const userDocRef = db.collection('users').doc(userId);

    const dataToStore = {
      onboardingAgreements: {
        ...agreements,
        agreedAt: serverTimestamp(),
        version: 'onboarding_v1.2', // Versioning the agreements set
      },
      lastLogin: serverTimestamp(), // Centralize lastLogin update
      updatedAt: serverTimestamp(),
    };

    // Use setDoc with { merge: true } for a robust "upsert" operation.
    await userDocRef.set(dataToStore, { merge: true });

    return NextResponse.json({ success: true, message: 'Agreements saved successfully.' });

  } catch (error) {
    console.error('Error saving agreements:', error);
    if (error instanceof Error && 'code' in error && error.code === 'auth/id-token-expired') {
        return new NextResponse('Token expired', { status: 401 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
