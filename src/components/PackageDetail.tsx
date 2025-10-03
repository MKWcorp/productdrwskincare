/**
 * PackageDetail Component
 * 
 * @description Halaman detail paket DR.W Skincare
 * @author MKWCorp
 * @version 1.0.0
 */

"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faGift } from '@fortawesome/free-solid-svg-icons'
import { cn } from '../lib/utils'
import { siteConfig, getThemeColors, formatPrice } from '../lib/config'

interface PackageDetailProps {
  slug: string
}

interface PackageData {
  id_paket: string
  nama_paket: string
  deskripsi: string | null
  harga_umum: number | null
  foto_utama: string | null
  slug: string
  created_at: string
  updated_at: string
  package_contents?: Array<{
    produk_id: number
    nama_produk: string
    jumlah: number
  }>
  categories?: Array<{
    id: number
    nama_kategori: string
  }>
}

export function PackageDetail({ slug }: PackageDetailProps) {
  const [packageData, setPackageData] = useState<PackageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const themeColors = getThemeColors()

  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/packages/${slug}`)
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Failed to fetch package')
        }

        const data = await response.json()
        if (data.success) {
          setPackageData(data.data)
        } else {
          setError(data.message || 'Package not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPackageDetail()
  }, [slug])

  const handleWhatsAppOrder = () => {
    if (!packageData) return
    
    const message = `Halo, saya tertarik dengan paket ${packageData.nama_paket} dari ${siteConfig.name}.
    
Harga: ${packageData.harga_umum ? formatPrice(packageData.harga_umum) : 'Hubungi Kami'}

Mohon info lebih lanjut untuk pemesanan.

Link paket: ${window.location.href}`

    const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 rounded-2xl"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-blue-500">
            <FontAwesomeIcon icon={faBox} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Paket Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">{error || 'Paket yang Anda cari tidak tersedia'}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: themeColors.primary }}
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Package Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
              {packageData.foto_utama ? (
                <Image
                  src={packageData.foto_utama}
                  alt={packageData.nama_paket}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-400 text-center">
                    <div className="text-6xl mb-4">
                      <FontAwesomeIcon icon={faGift} />
                    </div>
                    <div className="text-lg">Foto Paket</div>
                  </div>
                </div>
              )}
              
              {/* Package Badge */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white bg-blue-500">
                PAKET
              </div>
            </div>
          </div>

          {/* Package Information */}
          <div className="space-y-6">
            {/* Package Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              {packageData.nama_paket}
            </h1>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span 
                  className="text-3xl font-bold"
                  style={{ color: themeColors.primary }}
                >
                  {formatPrice(packageData.harga_umum)}
                </span>
              </div>
            </div>

            {/* Description */}
            {packageData.deskripsi && (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {packageData.deskripsi}
                </p>
              </div>
            )}

            {/* Package Contents */}
            {packageData.package_contents && packageData.package_contents.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Isi Paket:</h3>
                <div className="space-y-2">
                  {packageData.package_contents.map((item, index) => (
                    <div key={index} className="flex items-center text-blue-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      <span className="font-medium mr-2">{item.jumlah}x</span>
                      <span>{item.nama_produk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: themeColors.primary }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>Pesan Paket via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}