# MindNavigator Platform - Firebase Setup Guide

This guide details how to set up the Firebase Admin integration for local development and production environments.

## 1. Local Development Setup

### Method 1: Environment Variables (Recommended)

The most secure way to manage credentials locally is through an environment variables file.

1.  **Create the file:** In the root of the project, create a new file named `.env.local`.

2.  **Populate the file:** Add the following content to `.env.local`. You can get these values from your Firebase project's service account JSON key.

    ```env
    # --- FIREBASE ADMIN SDK (SERVER-SIDE) ---
    # Get these from your Service Account JSON file
    FIREBASE_PROJECT_ID="<your-project-id>"
    FIREBASE_CLIENT_EMAIL="<your-service-account-email>"
    # Important: The entire private key must be enclosed in double quotes
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_LINE_1
...
-----END PRIVATE KEY-----
"

    # --- FIREBASE CLIENT SDK (CLIENT-SIDE) ---
    # Get these from Project Settings > General in the Firebase Console
    NEXT_PUBLIC_FIREBASE_API_KEY="<your-public-api-key>"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="<your-project-id>.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="<your-project-id>"
    # ... add other NEXT_PUBLIC_ variables as needed
    ```

### Method 2: Service Account JSON (Fallback)

As a fallback for easy setup, you can place your service account key file directly in the project root.

1.  **Rename the file:** Rename your downloaded service account JSON file to `serviceAccountKey.json`.
2.  **Place it in the root:** Ensure this file is in the root directory of the project.
3.  **DO NOT COMMIT THIS FILE.** The `.gitignore` file is already configured to ignore `serviceAccountKey.json`, but always double-check.

## 2. Production Deployment

For production environments (Vercel, Google Cloud Run, etc.), you **must** use environment variables. Do not include the `serviceAccountKey.json` file in your deployment build.

1.  Navigate to your hosting provider's dashboard (e.g., Vercel Project Settings > Environment Variables).
2.  Add the same variables from the `.env.local` file (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`).
3.  Ensure the `FIREBASE_PRIVATE_KEY` is copied exactly, including the quotes and `
` newline characters.

## 3. Verifying the Setup

After setting up your configuration, you can verify that all Firebase services are connected correctly.

### Health Check Endpoint

While the server is running, you can access the following API endpoint to get a real-time status of the Firebase connections:

**URL:** `http://localhost:3000/api/firebase-health`

A successful response will look like this:
```json
{
  "timestamp": "...",
  "overallStatus": "healthy",
  "services": {
    "firestore": { "ok": true, "message": "..." },
    "auth": { "ok": true, "message": "..." },
    "storage": { "ok": true, "message": "..." }
  }
}
```

## 4. Troubleshooting

**Error: "Firebase not configured" / "The default Firebase app does not exist."**
This is the most common error. It means the Admin SDK could not initialize.
- **Check `.env.local`:** Is the file name correct? Are the variable names spelled correctly (`FIREBASE_PROJECT_ID`, etc.)?
- **Private Key Formatting:** The `FIREBASE_PRIVATE_KEY` **must** be enclosed in double quotes in your `.env.local` file.
- **Restart the Server:** The server **only** reads `.env.local` on startup. You must restart your `npm run dev` process after any changes to this file.

**Error: "Could not retrieve code changes from Git." (Changelog Generator)**
- **No Commits:** The generator compares the last two commits. Make sure you have at least two commits in your repository.
- **Uncommitted Changes:** Commit your recent changes before trying to generate a changelog.

---
This robust setup ensures a stable and secure connection to Firebase services across all environments.
