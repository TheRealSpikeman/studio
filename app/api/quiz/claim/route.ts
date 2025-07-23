// src/app/api/quiz/claim/route.ts
import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin'; // Using Admin SDK for backend operations
import crypto from 'crypto';
import type { QuizResult, PendingReport } from '@/types';

// This would be your actual email sending function
async function sendClaimEmail(email: string, claimLink: string) {
  console.log(`---> Sending claim email to ${email}`);
  console.log(`---> Link: ${claimLink}`);
  // In a real app, you would use a service like Resend, SendGrid, or Postmark.
  // For example:
  // await resend.emails.send({
  //   from: 'MindNavigator <no-reply@yourdomain.com>',
  //   to: [email],
  //   subject: 'Voltooi uw registratie en bekijk uw rapport',
  //   html: `<h1>Voltooi uw registratie</h1><p>Klik op de onderstaande link om uw account aan te maken en uw "Ken mijn Kind" rapport op te slaan:</p><a href="${claimLink}">Account aanmaken</a><p>Deze link is 48 uur geldig.</p>`,
  // });
  return Promise.resolve(); // Simulate success
}

export async function POST(request: Request) {
  try {
    const { email, result } = await request.json() as { email: string, result: QuizResult };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !result) {
      return NextResponse.json({ error: 'Ongeldige invoer.' }, { status: 400 });
    }

    // 1. Generate a secure, unique token
    const claimToken = crypto.randomBytes(32).toString('hex');
    
    // 2. Set an expiration date for the claim (e.g., 48 hours from now)
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    // 3. Create the pending report document
    const pendingReport: Omit<PendingReport, 'id'> = {
      email,
      claimToken,
      quizResult: result,
      expiresAt,
      createdAt: new Date(),
    };
    
    // 4. Save to Firestore
    if (!firestore) {
      throw new Error('Firestore is not initialized.');
    }
    const pendingReportsRef = firestore.collection('pending_reports');
    await pendingReportsRef.add(pendingReport);
    
    // 5. Construct the registration link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const claimLink = `${baseUrl}/signup?token=${claimToken}`;
    
    // 6. Send the email
    await sendClaimEmail(email, claimLink);

    return NextResponse.json({ success: true, message: 'Claim e-mail is succesvol verzonden.' });

  } catch (error) {
    console.error('Error in /api/quiz/claim:', error);
    const errorMessage = error instanceof Error ? error.message : 'Onbekende serverfout.';
    return NextResponse.json({ error: 'Kon het rapport niet claimen.', details: errorMessage }, { status: 500 });
  }
}
