import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (!privateKey || !projectId || !clientEmail) {
      throw new Error("Firebase admin credentials are not set in the environment variables.");
    }

    // Correctly format the private key by replacing literal '\n' with actual newlines
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey,
      }),
      databaseURL: `https://${projectId}.firebaseio.com`,
    });
    
    console.log("Firebase Admin SDK initialized successfully.");

  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export default admin;