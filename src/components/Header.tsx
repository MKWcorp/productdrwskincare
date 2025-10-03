import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo_drwskincare.png" 
            alt="DR.W Skincare Logo" 
            width={300}
            height={100}
            className="h-10 w-auto"
            quality={100}
            unoptimized
          />
        </Link>
      </div>
    </header>
  )
}