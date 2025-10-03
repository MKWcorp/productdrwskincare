// Site configuration based on environment variables
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'DR.W Skincare',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://drwskincare.com',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890',
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#FF6B9D',
  secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || '#4ECDC4',
  hero: {
    title: 'Produk Berkualitas untuk Kulit Sehat',
    subtitle: 'Temukan koleksi produk skincare terbaik yang telah terpercaya',
    ctaText: 'Lihat Produk'
  },
  features: {
    search: true,
    categories: true,
    whatsappIntegration: true,
    priceDisplay: true
  }
}

export const getThemeColors = () => ({
  primary: siteConfig.primaryColor,
  secondary: siteConfig.secondaryColor,
  accent: '#45B7D1',
  dark: '#2C3E50',
  light: '#F8F9FA',
})

export const getWhatsAppMessage = (productName: string, price: number) => {
  const message = `Halo, saya tertarik dengan produk *${productName}* seharga Rp ${price.toLocaleString('id-ID')}. Bisakah saya mendapatkan informasi lebih lanjut?`
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export const formatPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined || isNaN(price)) {
    return 'Hubungi Kami'
  }
  return `Rp ${price.toLocaleString('id-ID')}`
}