"use client"

import { useState } from 'react'
import { isCircleConfigured } from '@/lib/circle'

export default function WalletPanel() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [network, setNetwork] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-medium">Wallet</h2>
      {!isCircleConfigured() ? (
        <p className="text-sm text-gray-700">Configure Circle to enable wallet features.</p>
      ) : walletAddress ? (
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">Address:</span> {walletAddress}</p>
          <p><span className="font-medium">Network:</span> {network}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-700">No active wallet. Sign in to create or load your wallet.</p>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </section>
  )
}
