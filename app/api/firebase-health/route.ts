// app/api/firebase-health/route.ts
import { NextResponse } from 'next/server';
import { verifyFirebaseServices } from '@/lib/firebase-verification';
import type { FirebaseServicesStatus } from '@/lib/types/firebase';

/**
 * API route to perform a health check of the Firebase Admin services.
 * Returns a JSON response with the status of Firestore, Auth, and Storage.
 */
export async function GET() {
  console.log('API /api/firebase-health: Received health check request.');
  const status: FirebaseServicesStatus = await verifyFirebaseServices();
  
  const isHealthy = status.firestore.ok && status.auth.ok && status.storage.ok;
  
  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      overallStatus: isHealthy ? 'healthy' : 'unhealthy',
      services: status,
    },
    {
      status: isHealthy ? 200 : 503, // 503 Service Unavailable if any check fails
    }
  );
}
