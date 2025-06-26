// src/components/auth/LoginDebugTest.tsx
'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword, deleteUser, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/lib/firebase'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export function LoginDebugTest() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    if (!isFirebaseConfigured || !auth) {
        setResult("❌ FAILED: Firebase is niet geconfigureerd. Controleer je .env bestand.");
        return;
    }
    setLoading(true)
    setResult('')

    try {
      const cleanEmail = email.trim()
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password)
      
      setResult(`✅ SUCCESS!
User ID: ${userCredential.user.uid}
Email: ${userCredential.user.email}`)

      console.log('✅ Login successful:', userCredential.user)

    } catch (error: any) {
      console.error('❌ Login failed:', error)
      
      let errorDetails = `❌ FAILED: ${error.code}\nMessage: ${error.message}`

      if (error.code === 'auth/invalid-credential') {
        errorDetails += `\n\nOPLOSSING:\n1. Verwijder het account "${email}" in de Firebase Console.\n2. Probeer opnieuw in te loggen met 'password'. Het account wordt dan automatisch correct aangemaakt.`
      }

      setResult(errorDetails)
    } finally {
      setLoading(false)
    }
  }

  const deleteAndRecreate = async () => {
     if (!isFirebaseConfigured || !auth) {
        setResult("❌ FAILED: Firebase is niet geconfigureerd.");
        return;
    }
    setLoading(true);
    setResult('Starten met verwijderen en opnieuw aanmaken...');

    if (auth.currentUser && auth.currentUser.email === email) {
       try {
            await deleteUser(auth.currentUser);
            setResult('Huidige gebruiker succesvol verwijderd. Nu opnieuw aanmaken...');
            
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setResult(`✅ SUCCESS! Gebruiker verwijderd en opnieuw aangemaakt.\nUser ID: ${userCredential.user.uid}`);

        } catch (deleteError: any) {
            setResult(`❌ Fout bij verwijderen: ${deleteError.message}\nU moet mogelijk opnieuw inloggen om dit account te verwijderen.`);
        }
    } else {
        setResult('Fout: Om een demo-account te verwijderen via deze knop, moet u er eerst mee ingelogd zijn. Verwijder het handmatig in de Firebase Console en probeer dan in te loggen.');
    }

    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 border-2 border-red-300 rounded-lg bg-red-50/50 mt-6">
      <h2 className="text-lg font-bold mb-2 text-red-800">🔥 Login Debug Test</h2>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            placeholder="admin@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password:</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            placeholder="password"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={testLogin} disabled={loading} className="flex-1" variant="destructive">
            {loading ? 'Testen...' : 'Test Directe Login'}
          </Button>
          <Button onClick={deleteAndRecreate} disabled={loading} className="flex-1" variant="secondary">
            Fix 'Invalid Credential'
          </Button>
        </div>
      </div>

      {result && (
        <div className="mt-3 p-2 bg-white rounded border">
          <pre className="text-xs whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  )
}
