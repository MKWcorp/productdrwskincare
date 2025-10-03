/**
 * Packages API Route
 * 
 * @description API endpoint untuk mengambil data paket produk
 * @author MKWCorp
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')

    // Build where clause
    const whereClause: any = {}

    if (search) {
      whereClause.OR = [
        {
          nama_paket: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          deskripsi: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Fetch packages with relationships
    const packages = await prisma.paket_produk.findMany({
      where: whereClause,
      include: {
        paket_kategori: {
          include: {
            kategori: true
          }
        },
        paket_isi: {
          include: {
            produk: true
          }
        },
        foto_produk: {
          orderBy: { urutan: 'asc' }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take: limit ? parseInt(limit) : undefined
    })

    // Transform package data to match product structure
    const transformedPackages = packages.map((pkg: any) => ({
      id_produk: `pkg_${pkg.id_paket}`, // Prefix untuk membedakan dari produk regular
      nama_produk: pkg.nama_paket,
      bpom: null, // Paket tidak memiliki BPOM
      harga_director: pkg.harga_director,
      harga_manager: pkg.harga_manager,
      harga_supervisor: pkg.harga_supervisor,
      harga_consultant: pkg.harga_consultant,
      harga_umum: pkg.harga_umum,
      foto_utama: pkg.foto_utama,
      deskripsi_singkat: pkg.deskripsi,
      created_at: pkg.created_at,
      updated_at: pkg.updated_at,
      slug: pkg.slug,
      foto_produk: pkg.foto_produk?.map((foto: any) => ({
        url_foto: foto.url_foto,
        alt_text: foto.alt_text || pkg.nama_paket,
        urutan: foto.urutan
      })) || [],
      categories: pkg.paket_kategori?.map((pk: any) => ({
        id: pk.kategori.id,
        nama_kategori: pk.kategori.nama_kategori
      })) || [],
      primary_category: pkg.paket_kategori?.[0]?.kategori?.nama_kategori || null,
      is_package: true, // Flag untuk menandai ini adalah paket
      package_contents: pkg.paket_isi?.map((isi: any) => ({
        produk_id: isi.produk_id,
        nama_produk: isi.produk.nama_produk,
        jumlah: isi.jumlah
      })) || []
    }))

    // Filter by category if specified
    let filteredPackages = transformedPackages
    if (category) {
      filteredPackages = transformedPackages.filter((pkg: any) =>
        pkg.categories.some((cat: any) => cat.nama_kategori === category)
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredPackages
    })

  } catch (error) {
    console.error('Packages API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch packages',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}