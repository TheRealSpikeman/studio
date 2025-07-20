import { promises as fs } from 'fs';
import path from 'path';
import type { FirebaseAdminConfig, FirebaseAdminCredentials } from './types/firebase';

const SERVICE_ACCOUNT_FILE = 'serviceAccountKey.json';

async function loadCredentialsFromFile(): Promise<FirebaseAdminCredentials | null> {
  const filePath = path.join(process.cwd(), SERVICE_ACCOUNT_FILE);
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const credentials = JSON.parse(fileContents);
    
    if (credentials.project_id && credentials.client_email && credentials.private_key) {
      console.log('🔑 Loaded Firebase credentials from serviceAccountKey.json');
      return {
        projectId: credentials.project_id,
        clientEmail: credentials.client_email,
        privateKey: credentials.private_key,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

function getCredentialsFromEnv(): FirebaseAdminCredentials | null {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    console.log('🔑 Loaded Firebase credentials from environment variables.');
    return {
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }
  return null;
}

export async function getFirebaseAdminConfig(): Promise<FirebaseAdminConfig | null> {
  let credentials = getCredentialsFromEnv();

  if (!credentials) {
    credentials = await loadCredentialsFromFile();
  }

  if (!credentials) {
    console.error('❌ CRITICAL: Could not resolve Firebase Admin credentials from any source.');
    return null;
  }

  const { projectId } = credentials;

  return {
    ...credentials,
    databaseURL: `https://${projectId}-default-rtdb.europe-west1.firebasedatabase.app`,
    storageBucket: `${projectId}.appspot.com`,
  };
}