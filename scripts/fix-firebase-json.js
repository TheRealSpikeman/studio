// scripts/fix-firebase-json.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Loading environment variables from .env.local...');

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
  line = line.trim();
  if (line && line.includes('=') && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    let value = valueParts.join('=');
    // Remove quotes if present
    value = value.replace(/^["']/, '').replace(/["']$/, '');
    envVars[key] = value;
  }
});

// Get Firebase credentials
const projectId = envVars['FIREBASE_PROJECT_ID'];
const privateKey = envVars['FIREBASE_PRIVATE_KEY'];
const clientEmail = envVars['FIREBASE_CLIENT_EMAIL'];

console.log('📊 Found environment variables:');
console.log(`  Project ID: ${projectId}`);
console.log(`  Client Email: ${clientEmail}`);
console.log(`  Private Key Length: ${privateKey ? privateKey.length : 0}`);

if (!projectId || !privateKey || !clientEmail) {
  console.log('❌ Missing required environment variables');
  process.exit(1);
}

// Convert \n to actual newlines
const privateKeyFixed = privateKey.replace(/\\n/g, '\n');

console.log('📊 After newline conversion:');
console.log(`  Private Key Length: ${privateKeyFixed.length}`);
console.log(`  Contains BEGIN marker: ${privateKeyFixed.includes('-----BEGIN PRIVATE KEY-----')}`);
console.log(`  Contains END marker: ${privateKeyFixed.includes('-----END PRIVATE KEY-----')}`);
console.log(`  Actual newlines: ${(privateKeyFixed.match(/\n/g) || []).length}`);

// Create the JSON
const credentials = {
  "type": "service_account",
  "project_id": projectId,
  "private_key_id": envVars['FIREBASE_PRIVATE_KEY_ID'] || "",
  "private_key": privateKeyFixed,
  "client_email": clientEmail,
  "client_id": envVars['FIREBASE_CLIENT_ID'] || "",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": `https://www.googleapis.com/oauth2/v1/certs/firebase-adminsdk%40${projectId}.iam.gserviceaccount.com`
};

// Write to file
const outputPath = path.join(process.cwd(), 'serviceAccountKey.json');
fs.writeFileSync(outputPath, JSON.stringify(credentials, null, 2));

console.log('✅ Fixed serviceAccountKey.json created with Node.js!');

// Validate the JSON
try {
  const testCreds = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  console.log('✅ JSON validation passed');
  console.log(`📊 Final private key preview: ${testCreds.private_key.substring(0, 50)}...`);
} catch (error) {
  console.log(`❌ JSON validation failed: ${error.message}`);
  process.exit(1);
}
