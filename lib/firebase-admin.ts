// lib/firebase-admin.ts
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

console.log('🔍 FIREBASE DEBUG - Start of firebase-admin.ts file execution.');

// Force environment loading if not already loaded
if (!process.env.FIREBASE_PROJECT_ID) {
  try {
    require('dotenv').config({ path: '.env.local' });
    console.log('🔍 FIREBASE DEBUG - Loaded .env.local file');
  } catch (error) {
    console.log('🔍 FIREBASE DEBUG - Could not load dotenv, continuing...');
  }
}

// Enhanced Debug Logging
const logDebug = (message: string, data?: any) => {
  console.log(`🔍 FIREBASE DEBUG: ${message}`);
  if (data) {
    console.log('📊 Data:', typeof data === 'string' && data.length > 100 
      ? data.substring(0, 100) + '...' 
      : data
    );
  }
};

const logError = (message: string, error?: any) => {
  console.error(`❌ FIREBASE ERROR: ${message}`);
  if (error) {
    console.error('🚨 Error details:', error);
  }
};

// Type definitions
interface FirebaseConfig {
  type: string;
  project_id: string;
  private_key_id?: string;
  private_key: string;
  client_email: string;
  client_id?: string;
  auth_uri?: string;
  token_uri?: string;
  auth_provider_x509_cert_url?: string;
  client_x509_cert_url?: string;
}

let firebaseApp: any = null;
let isInitialized = false;

// Enhanced Environment Variables Method
function getCredentialsFromEnv(): ServiceAccount | null {
  logDebug('🔍 Checking environment variables...');
  
  // Log all available environment variables that start with FIREBASE
  const firebaseVars = Object.keys(process.env)
    .filter(key => key.startsWith('FIREBASE'))
    .reduce((obj, key) => {
      obj[key] = process.env[key] ? 'SET' : 'NOT SET';
      return obj;
    }, {} as Record<string, string>);
  
  logDebug('Available Firebase env vars:', firebaseVars);

  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL'
  ];

  // Check each required variable
  const envCheck = requiredEnvVars.map(varName => {
    const value = process.env[varName];
    const status = value ? `SET (${value.length} chars)` : 'NOT SET';
    logDebug(`${varName}: ${status}`);
    return { varName, value, isSet: !!value };
  });

  const missingVars = envCheck.filter(item => !item.isSet).map(item => item.varName);
  
  if (missingVars.length > 0) {
    logError(`Missing environment variables: ${missingVars.join(', ')}`);
    return null;
  }

  try {
    // Clean and format private key
    const privateKey = process.env.FIREBASE_PRIVATE_KEY!
      .replace(/\\n/g, '\n')  // Replace literal \n with actual newlines
      .replace(/\r/g, '')     // Remove any carriage returns
      .trim();                // Remove leading/trailing whitespace

    logDebug('Private key format check:', {
      startsWithBegin: privateKey.startsWith('-----BEGIN PRIVATE KEY-----'),
      endsWithEnd: privateKey.endsWith('-----END PRIVATE KEY-----'),
      hasNewlines: privateKey.includes('\n'),
      length: privateKey.length
    });

    const credentials: ServiceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID!,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || undefined,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL!,
      client_id: process.env.FIREBASE_CLIENT_ID || undefined,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || undefined
    };

    logDebug('✅ Environment credentials parsed successfully');
    logDebug('Credentials summary:', {
      project_id: credentials.project_id,
      client_email: credentials.client_email,
      private_key_preview: credentials.private_key.substring(0, 50) + '...',
      hasRequiredFields: !!(credentials.project_id && credentials.private_key && credentials.client_email)
    });
    
    return credentials;
  } catch (error) {
    logError('Failed to parse environment credentials', error);
    return null;
  }
}

// Initialize Firebase Admin
async function initializeFirebaseAdmin(): Promise<boolean> {
  if (isInitialized) {
    logDebug('Firebase Admin already initialized');
    return true;
  }

  logDebug('🚀 Starting Firebase Admin initialization...');

  try {
    // Check if already initialized
    if (getApps().length > 0) {
      logDebug('Firebase app already exists, using existing app');
      firebaseApp = getApps()[0];
      isInitialized = true;
      return true;
    }

    // Get credentials from environment
    logDebug('🔍 Attempting to load credentials from environment variables');
    const credentials = getCredentialsFromEnv();

    if (!credentials) {
      logError('❌ CRITICAL: Could not resolve Firebase Admin credentials from environment variables.');
      logError('❌ CRITICAL: Firebase Admin configuration is missing. Cannot initialize.');
      return false;
    }

    logDebug('✅ Credentials obtained, initializing Firebase App...');

    // Initialize Firebase Admin
    firebaseApp = initializeApp({
      credential: cert(credentials),
      projectId: credentials.project_id
    });

    isInitialized = true;
    logDebug('✅ Firebase Admin SDK initialized successfully');
    return true;

  } catch (error) {
    logError('Failed to initialize Firebase Admin', error);
    logError('❌ CRITICAL: Firebase Admin configuration is missing. Cannot initialize.');
    return false;
  }
}

// Initialize immediately
const initPromise = initializeFirebaseAdmin();

// Export functions that ensure initialization
export async function getFirebaseServices() {
  const initialized = await initPromise;
  
  if (!initialized) {
    console.error('❌ Could not initialize direct exports because Firebase Admin failed to initialize.');
    throw new Error('❌ FATAL: Firebase Admin SDK failed to initialize. Check previous logs.');
  }

  return {
    app: firebaseApp,
    db: getFirestore(firebaseApp),
    auth: getAuth(firebaseApp)
  };
}

// Direct exports with initialization check
export const db = (async () => {
  try {
    const services = await getFirebaseServices();
    return services.db;
  } catch (error) {
    console.error('❌ Could not initialize direct exports because Firebase Admin failed to initialize.');
    throw error;
  }
})();

export const auth = (async () => {
  try {
    const services = await getFirebaseServices();
    return services.auth;
  } catch (error) {
    console.error('❌ Could not initialize direct exports because Firebase Admin failed to initialize.');
    throw error;
  }
})();

export const app = (async () => {
  try {
    const services = await getFirebaseServices();
    return services.app;
  } catch (error) {
    console.error('❌ Could not initialize direct exports because Firebase Admin failed to initialize.');
    throw error;
  }
})();