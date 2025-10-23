"use client"

import { useEffect } from 'react'
import { getSdk } from '@/lib/circle'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    // Initialize SDK so it can process the OAuth callback context if needed
    getSdk()
    // After a short delay, return to home
    const t = setTimeout(() => router.replace('/'), 800)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-medium">Completing sign-in…</h2>
      <p className="text-sm text-gray-700">You can close this tab if it does not automatically redirect.</p>
    </div>
  )
}
