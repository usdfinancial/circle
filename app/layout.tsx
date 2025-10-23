import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Circle Wallet Demo',
  description: 'Email login and user-controlled wallet on Next.js + Netlify',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-2xl p-6">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold">Circle Wallet Demo</h1>
            <p className="text-sm text-gray-600">Next.js 14 + Tailwind + Netlify</p>
          </header>
          <main>{children}</main>
          <footer className="mt-12 text-xs text-gray-500">Deployed on Netlify</footer>
        </div>
      </body>
    </html>
  )
}
