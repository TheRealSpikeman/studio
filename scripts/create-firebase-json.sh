#!/bin/bash
echo "🔧 Creating serviceAccountKey.json from .env.local"
echo "=================================================="

if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    exit 1
fi

echo "✅ Found .env.local"
echo "📊 Extracting Firebase credentials..."

set -a
source .env.local
set +a

echo "Extracted variables:"
echo "  FIREBASE_PROJECT_ID: ${FIREBASE_PROJECT_ID:-NOT SET}"
echo "  FIREBASE_CLIENT_EMAIL: ${FIREBASE_CLIENT_EMAIL:-NOT SET}"
echo "  FIREBASE_PRIVATE_KEY length: ${#FIREBASE_PRIVATE_KEY}"

if [ -z "$FIREBASE_PROJECT_ID" ] || [ -z "$FIREBASE_PRIVATE_KEY" ] || [ -z "$FIREBASE_CLIENT_EMAIL" ]; then
    echo "❌ Missing required Firebase environment variables!"
    exit 1
fi

echo "🏗️ Creating serviceAccountKey.json..."

cat > serviceAccountKey.json << EOF
{
  "type": "service_account",
  "project_id": "$FIREBASE_PROJECT_ID",
  "private_key_id": "${FIREBASE_PRIVATE_KEY_ID:-}",
  "private_key": "$FIREBASE_PRIVATE_KEY",
  "client_email": "$FIREBASE_CLIENT_EMAIL",
  "client_id": "${FIREBASE_CLIENT_ID:-}",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs/firebase-adminsdk%40${FIREBASE_PROJECT_ID}.iam.gserviceaccount.com"
}
