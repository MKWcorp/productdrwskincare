import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || 'DR.W Skincare',
  description: 'Produk skincare berkualitas untuk kulit sehat dan cantik',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-8">
                  <a href="/" className="text-xl font-bold text-gray-900">
                    DR.W Skincare
                  </a>
                  <div className="hidden md:flex space-x-6">
                    <a href="/" className="text-gray-600 hover:text-gray-900">
                      Home
                    </a>
                    <a href="/demo" className="text-gray-600 hover:text-gray-900">
                      Generic Demo
                    </a>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Refactored for NPM Library
                </div>
              </div>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  )
}