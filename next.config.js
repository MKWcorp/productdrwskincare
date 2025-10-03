/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['213.190.4.159', 'drwgroup.id'],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    NEXT_PUBLIC_PRIMARY_COLOR: process.env.NEXT_PUBLIC_PRIMARY_COLOR,
    NEXT_PUBLIC_SECONDARY_COLOR: process.env.NEXT_PUBLIC_SECONDARY_COLOR,
  },
}

module.exports = nextConfig