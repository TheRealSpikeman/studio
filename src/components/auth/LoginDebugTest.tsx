// components/LoginDebugTest.tsx
'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export function LoginDebugTest() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('test123')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    if (!auth) {
        setResult('❌ FAILED: Firebase Auth is not initialized. Check your .env configuration.');
        return;
    }
    setLoading(true)
    setResult('')

    try {
      console.log('🔥 DIRECT FIREBASE TEST:')
      console.log('Email:', `"${email}"`)
      console.log('Password:', `"${password}"`)
      console.log('Email length:', email.length)
      console.log('Password length:', password.length)
      
      // Trim any whitespace
      const cleanEmail = email.trim()
      const cleanPassword = password.trim()
      
      console.log('Clean email:', `"${cleanEmail}"`)
      console.log('Clean password length:', cleanPassword.length)

      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword)
      
      setResult(`✅ SUCCESS!
User ID: ${userCredential.user.uid}
Email: ${userCredential.user.email}
Email Verified: ${userCredential.user.emailVerified}
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
4. Use exactly: admin@example.com / test123
5. Check for extra spaces in email/password fields`
      }

      setResult(errorDetails)
    } finally {
      setLoading(false)
    }
  }

  const resetPasswordInConsole = () => {
    setResult(`📋 RESET PASSWORD STEPS:

1. Go to Firebase Console
2. Authentication → Users
3. Find user: ${email}
4. Click 3-dots menu → "Reset password"
5. Set new password: test123
6. Save
7. Test login here with new password`)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 border-2 border-red-300 rounded-lg bg-red-50">
      <h2 className="text-xl font-bold mb-4 text-red-800">🔥 Login Debug Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="admin@example.com"
          />
          <p className="text-xs text-gray-600 mt-1">
            Length: {email.length} | Trimmed: "{email.trim()}"
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="test123"
          />
          <p className="text-xs text-gray-600 mt-1">
            Length: {password.length}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={testLogin}
            disabled={loading}
            className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Direct Login'}
          </button>
          
          <button
            onClick={resetPasswordInConsole}
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Reset Password Guide
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-4 p-3 bg-white rounded border">
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
      
      <div className="mt-6 p-3 bg-yellow-100 border border-yellow-300 rounded">
        <h4 className="font-semibold">📋 Quick Checklist:</h4>
        <ul className="text-sm mt-1 space-y-1">
          <li>□ Firebase Console → Authentication → Users shows: admin@example.com?</li>
          <li>□ Password reset done in Firebase Console?</li>
          <li>□ Using EXACT email: admin@example.com (no typos)?</li>
          <li>□ Using correct password (that you just set)?</li>
          <li>□ No extra spaces in email/password fields?</li>
        </ul>
      </div>
    </div>
  )
}
