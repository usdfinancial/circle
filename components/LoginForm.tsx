"use client"

import { useState } from 'react'
import { isCircleConfigured, getDeviceId, setLoginConfigs, performSocialLogin, setAuthentication, getSdk, executeChallenge } from '@/lib/circle'

export default function LoginForm() {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<'google' | null>(null)

  async function handleSocialLogin(p: 'google') {
    setStatus(null)
    setProvider(p)

    if (!isCircleConfigured()) {
      setStatus('Missing Circle env vars. See .env.example.')
      return
    }

    setLoading(true)
    try {
      // 1) Get deviceId from Web SDK (must be before performLogin)
      const deviceId = await getDeviceId()
      if (!deviceId) throw new Error('Failed to get deviceId')

      // 2) Ask server to create device token
      const dtRes = await fetch('/api/social/device-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      })
      if (!dtRes.ok) {
        let errText = 'Failed to create device token'
        try {
          const err = await dtRes.json()
          errText = `${errText}: ${err?.error || ''} ${err?.status || ''} ${JSON.stringify(err?.details || err)}`
        } catch {}
        throw new Error(errText)
      }
      const dtJson = await dtRes.json()
      const deviceToken: string = dtJson?.deviceToken || dtJson?.data?.deviceToken
      const deviceEncryptionKey: string = dtJson?.deviceEncryptionKey || dtJson?.data?.deviceEncryptionKey
      if (!deviceToken || !deviceEncryptionKey) throw new Error('Invalid device token response')

      // 3) Configure provider settings and device key material
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string | undefined
      const googleRedirect = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI as string | undefined
      const resolvedGoogleRedirect = googleRedirect || (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined)

      setLoginConfigs({
        google: googleClientId && resolvedGoogleRedirect ? { clientId: googleClientId, redirectUri: resolvedGoogleRedirect } : undefined,
        deviceToken,
        deviceEncryptionKey,
      })

      // 4) Perform social login via SDK
      await performSocialLogin(p)

      // Retrieve tokens from callback storage
      const userToken = typeof window !== 'undefined' ? localStorage.getItem('circle_user_token') : null
      const encryptionKey = typeof window !== 'undefined' ? localStorage.getItem('circle_encryption_key') : null
      if (!userToken || !encryptionKey) throw new Error('Social login did not return tokens')
      setAuthentication(userToken, encryptionKey)

      // 5) Initialize user and create wallet on server
      const accountType = process.env.NEXT_PUBLIC_ACCOUNT_TYPE || 'SCA' // 'SCA' for EVM, 'EOA' for Solana
      const blockchains = (process.env.NEXT_PUBLIC_BLOCKCHAINS || 'MATIC-AMOY').split(',').map((s) => s.trim())
      const initRes = await fetch('/api/user/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userToken, accountType, blockchains }),
      })
      if (!initRes.ok) {
        let errText = 'Failed to initialize user'
        try {
          const err = await initRes.json()
          errText = `${errText}: ${err?.error || ''}`
        } catch {}
        throw new Error(errText)
      }
      const initJson = await initRes.json()
      const challengeId: string = initJson?.data?.challengeId || initJson?.challengeId
      if (!challengeId) throw new Error('No challengeId returned')

      // 6) Execute challenge (PIN/security flow)
      await executeChallenge(challengeId)

      setStatus('Wallet created and challenge completed.')
    } catch (err: any) {
      setStatus(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-medium">Social Login</h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
          className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading && provider === 'google' ? 'Working…' : 'Login with Google'}
        </button>
      </div>
      {status && <p className="mt-3 text-sm text-gray-700">{status}</p>}
      {!isCircleConfigured() && (
        <p className="mt-2 text-xs text-red-600">Circle is not configured. Provide env vars and integrate SDK in `lib/circle.ts`.</p>
      )}
    </section>
  )
}
