/**
 * Package Detail API Route
 * 
 * @description API endpoint untuk mengambil detail paket berdasarkan slug
 * @author MKWCorp
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      )
    }

    // Fetch package with all related data
    const packageData = await prisma.paket_produk.findUnique({
      where: { slug },
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
      }
    })

    if (!packageData) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      )
    }

    // Transform package data
    const transformedPackage = {
      id_paket: packageData.id_paket.toString(),
      nama_paket: packageData.nama_paket,
      deskripsi: packageData.deskripsi,
      harga_director: packageData.harga_director,
      harga_manager: packageData.harga_manager,
      harga_supervisor: packageData.harga_supervisor,
      harga_consultant: packageData.harga_consultant,
      harga_umum: packageData.harga_umum,
      foto_utama: packageData.foto_utama,
      created_at: packageData.created_at,
      updated_at: packageData.updated_at,
      slug: packageData.slug,
      categories: packageData.paket_kategori?.map((pk: any) => ({
        id: pk.kategori.id,
        nama_kategori: pk.kategori.nama_kategori
      })) || [],
      package_contents: packageData.paket_isi?.map((isi: any) => ({
        produk_id: Number(isi.produk_id),
        nama_produk: isi.produk.nama_produk,
        jumlah: isi.jumlah
      })) || [],
      foto_paket: packageData.foto_produk?.map((foto: any) => ({
        url_foto: foto.url_foto,
        alt_text: foto.alt_text || packageData.nama_paket,
        urutan: foto.urutan
      })) || []
    }

    return NextResponse.json({
      success: true,
      data: transformedPackage
    })

  } catch (error) {
    console.error('Package Detail API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch package detail',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}