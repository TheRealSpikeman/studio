// scripts/fix-firebase-json-advanced.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Advanced Firebase JSON fix with debugging...');

// Load .env.local file
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

console.log(`📊 .env.local file size: ${envContent.length} chars`);

// Find the FIREBASE_PRIVATE_KEY line specifically
const lines = envContent.split('\n');
let privateKeyLine = '';
let foundPrivateKey = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.startsWith('FIREBASE_PRIVATE_KEY=')) {
    privateKeyLine = line;
    foundPrivateKey = true;
    console.log(`📊 Found FIREBASE_PRIVATE_KEY at line ${i + 1}`);
    break;
  }
}

if (!foundPrivateKey) {
  console.log('❌ FIREBASE_PRIVATE_KEY not found in .env.local');
  process.exit(1);
}

console.log(`📊 Private key line length: ${privateKeyLine.length} chars`);
console.log(`📊 Line starts with: ${privateKeyLine.substring(0, 50)}...`);
console.log(`📊 Line ends with: ...${privateKeyLine.substring(privateKeyLine.length - 50)}`);

// Extract the private key value
const privateKeyRaw = privateKeyLine.substring('FIREBASE_PRIVATE_KEY='.length);

// Remove surrounding quotes if present
let privateKey = privateKeyRaw.replace(/^["']/, '').replace(/["']$/, '');

console.log(`📊 Raw private key length: ${privateKey.length} chars`);
console.log(`📊 Raw key starts with: ${privateKey.substring(0, 50)}...`);
console.log(`📊 Raw key ends with: ...${privateKey.substring(privateKey.length - 50)}`);

// Check if it has the markers before conversion
console.log(`📊 Raw key has BEGIN: ${privateKey.includes('-----BEGIN PRIVATE KEY-----')}`);
console.log(`📊 Raw key has END: ${privateKey.includes('-----END PRIVATE KEY-----')}`);

// Convert \n to actual newlines
const privateKeyFixed = privateKey.replace(/\\n/g, '\n');

console.log(`📊 After newline conversion:`);
console.log(`  Length: ${privateKeyFixed.length} chars`);
console.log(`  Has BEGIN: ${privateKeyFixed.includes('-----BEGIN PRIVATE KEY-----')}`);
console.log(`  Has END: ${privateKeyFixed.includes('-----END PRIVATE KEY-----')}`);
console.log(`  Newlines: ${(privateKeyFixed.match(/\n/g) || []).length}`);

// Show first and last few lines
const keyLines = privateKeyFixed.split('\n');
console.log(`📊 Key has ${keyLines.length} lines`);
console.log(`📊 First line: "${keyLines[0]}"`);
console.log(`📊 Last line: "${keyLines[keyLines.length - 1]}"`);

// Parse other environment variables
const envVars = {};
lines.forEach(line => {
  line = line.trim();
  if (line && line.includes('=') && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    let value = valueParts.join('=');
    value = value.replace(/^["']/, '').replace(/["']$/, '');
    envVars[key] = value;
  }
});

const projectId = envVars['FIREBASE_PROJECT_ID'];
const clientEmail = envVars['FIREBASE_CLIENT_EMAIL'];

if (!projectId || !clientEmail) {
  console.log('❌ Missing PROJECT_ID or CLIENT_EMAIL');
  process.exit(1);
}

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

console.log('✅ Advanced serviceAccountKey.json created!');

// Validate the JSON
try {
  const testCreds = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  const testKey = testCreds.private_key;
  console.log('✅ JSON validation passed');
  console.log(`📊 Final key length: ${testKey.length}`);
  console.log(`📊 Final key has BEGIN: ${testKey.includes('-----BEGIN PRIVATE KEY-----')}`);
  console.log(`📊 Final key has END: ${testKey.includes('-----END PRIVATE KEY-----')}`);
  
  const finalLines = testKey.split('\n');
  console.log(`📊 Final key lines: ${finalLines.length}`);
  console.log(`📊 Final first line: "${finalLines[0]}"`);
  console.log(`📊 Final last line: "${finalLines[finalLines.length - 1]}"`);
  
} catch (error) {
  console.log(`❌ JSON validation failed: ${error.message}`);
  process.exit(1);
}
