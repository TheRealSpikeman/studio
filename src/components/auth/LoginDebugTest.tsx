'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/lib/firebase'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ShieldAlert } from 'lucide-react'

export function LoginDebugTest() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  // Directly check the environment variables as seen by the client
  const envVars = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };

  const testLogin = async () => {
    setLoading(true)
    setResult('')

    if (!auth || !isFirebaseConfigured) {
        setResult(`❌ FAILED: Firebase is not configured.
Check your .env.local file and ensure the server is restarted.

NEXT_PUBLIC_FIREBASE_API_KEY: ${envVars.apiKey ? 'Loaded' : 'MISSING'}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${envVars.authDomain ? 'Loaded' : 'MISSING'}
NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${envVars.projectId ? 'Loaded' : 'MISSING'}`);
        setLoading(false);
        return;
    }

    try {
      console.log('🔥 DIRECT FIREBASE TEST:')
      console.log('Email:', `"${email}"`)
      console.log('Password:', `"${password}"`)
      
      const cleanEmail = email.trim()
      const cleanPassword = password.trim()
      
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword)
      
      setResult(`✅ SUCCESS!
User ID: ${userCredential.user.uid}
Email: ${userCredential.user.email}
Creation Time: ${userCredential.user.metadata.creationTime}
Last Sign In: ${userCredential.user.metadata.lastSignInTime}`)

      console.log('✅ Login successful:', userCredential.user)

    } catch (error: any) {
      console.error('❌ Login failed:', error)
      
      let errorDetails = `❌ FAILED: ${error.code}
Message: ${error.message}

Debug Info:
- Email tried: "${email}"
- Password length: ${password.length}
- Auth instance: ${auth ? 'OK' : 'MISSING'}
- Project ID: ${auth.app.options.projectId || 'MISSING'}`

      if (error.code === 'auth/invalid-credential') {
        errorDetails += `

SOLUTIONS TO TRY:
1. Check Firebase Console → Authentication → Users
2. Verify exact email address (no typos)
3. Reset password in Firebase Console
4. Use exactly: admin@example.com / password
5. Check for extra spaces in email/password fields`
      } else if (error.code === 'auth/network-request-failed') {
         errorDetails += `

NETWORK ERROR SOLUTIONS:
1. Check your internet connection.
2. Verify .env.local variables are correct.
3. Restart the development server.
4. Check your browser's ad-blockers or firewalls.`
      }

      setResult(errorDetails)
    } finally {
      setLoading(false)
    }
  }

  const deleteAndRetry = () => {
    setResult(`📋 DELETE & RETRY STEPS:

1. Go to Firebase Console → Authentication → Users
2. Find user: ${email}
3. Click 3-dots menu → "Delete account"
4. Return to this app.
5. Try logging in again with the main form. The account will be auto-created with 'password'.`)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 border-2 border-red-300 rounded-lg bg-red-50">
      <h2 className="text-xl font-bold mb-4 text-red-800">🔥 Login Debug Test</h2>

      <div className="p-3 bg-yellow-100 border border-yellow-300 rounded mb-4 text-left text-xs">
          <h4 className="font-semibold mb-1">Environment Variables (Client-Side)</h4>
          <p>API Key: <strong>{envVars.apiKey ? 'Loaded' : 'MISSING!'}</strong></p>
          <p>Auth Domain: <strong>{envVars.authDomain ? 'Loaded' : 'MISSING!'}</strong></p>
          <p>Project ID: <strong>{envVars.projectId ? 'Loaded' : 'MISSING!'}</strong></p>
          {(!envVars.apiKey || !envVars.authDomain || !envVars.projectId) && <p className="text-red-600 font-bold mt-1">One or more variables are missing. Check your `.env` file and restart the server.</p>}
      </div>
      
      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-medium mb-1">Email:</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-white"
            placeholder="admin@example.com"
          />
        </div>
        
        <div>
          <Label className="block text-sm font-medium mb-1">Password:</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-white"
            placeholder="password"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={testLogin}
            disabled={loading}
            className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Direct Login'}
          </Button>
          
          <Button
            type="button"
            onClick={deleteAndRetry}
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            "Invalid Credential" Fix
          </Button>
        </div>
      </div>

      {result && (
        <div className="mt-4 p-3 bg-white rounded border">
          <h4 className="font-semibold text-sm mb-2">Test Result:</h4>
          <pre className="text-xs whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  )
}
