import { Product, Package, DrwProductConfig } from '../types';

// Default configuration
export const defaultConfig: DrwProductConfig = {
  apiBaseUrl: '/api',
  whatsappNumber: '6285852555571',
  brandName: 'DRW Skincare',
  currency: 'IDR',
  priceRole: 'umum',
  enablePackages: true,
  enableCategories: true,
};

// Price formatting utility
export const formatPrice = (
  price: number, 
  currency: 'IDR' | 'USD' = 'IDR'
): string => {
  if (!price || price <= 0) return 'Hubungi Kami';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price);
};

// Get price based on role
export const getPrice = (
  product: Product | Package, 
  role: DrwProductConfig['priceRole'] = 'umum'
): number => {
  // Handle legacy format first
  if (product.hargaUmum && role === 'umum') {
    return product.hargaUmum;
  }
  
  switch (role) {
    case 'director':
      return product.harga_director;
    case 'manager':
      return product.harga_manager;
    case 'supervisor':
      return product.harga_supervisor;
    case 'consultant':
      return product.harga_consultant;
    default:
      return product.harga_umum;
  }
};

// Get product name (handle legacy format)
export const getProductName = (product: Product | Package): string => {
  return product.namaProduk || product.nama_produk || (product as any).nama_paket || 'Produk';
};

// Get product image (handle legacy format)
export const getProductImage = (product: Product | Package): string => {
  return product.gambar || product.foto_utama || '/logo_drwskincare_square.png';
};

// Get product description (handle legacy format)
export const getProductDescription = (product: Product | Package): string => {
  return (
    product.deskripsi || 
    (product as Product).deskripsi_singkat || 
    (product as Package).deskripsi || 
    ''
  );
};

// Get category name from product
export const getCategoryName = (product: Product): string => {
  // Handle legacy format
  if (product.categories?.name) {
    return product.categories.name;
  }
  
  // Handle new format
  if (product.produk_kategori && product.produk_kategori.length > 0) {
    return product.produk_kategori[0].kategori.nama_kategori;
  }
  
  return 'Skincare';
};

// Generate WhatsApp URL
export const generateWhatsAppUrl = (
  product: Product | Package,
  config: Partial<DrwProductConfig> = {}
): string => {
  const finalConfig = { ...defaultConfig, ...config };
  const productName = getProductName(product);
  const price = formatPrice(getPrice(product, finalConfig.priceRole), finalConfig.currency);
  
  const message = product.type === 'package' 
    ? `Halo! Saya tertarik dengan paket ${productName} dengan harga ${price}. Bisa tolong berikan informasi lebih lanjut?`
    : `Halo! Saya mau tanya produk ${productName} dengan harga ${price}. Bisa tolong berikan informasi lebih lanjut?`;
  
  return `https://wa.me/${finalConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
};

// Filter products by search query
export const filterProducts = (
  products: (Product | Package)[],
  searchQuery: string
): (Product | Package)[] => {
  if (!searchQuery.trim()) return products;
  
  const query = searchQuery.toLowerCase().trim();
  
  return products.filter(product => {
    const name = getProductName(product).toLowerCase();
    const description = getProductDescription(product).toLowerCase();
    const bpom = product.bpom?.toLowerCase() || '';
    const category = product.type === 'product' ? getCategoryName(product as Product).toLowerCase() : '';
    
    return (
      name.includes(query) ||
      description.includes(query) ||
      bpom.includes(query) ||
      category.includes(query)
    );
  });
};

// Filter products by category
export const filterByCategory = (
  products: (Product | Package)[],
  categoryName: string
): (Product | Package)[] => {
  if (!categoryName) return products;
  
  return products.filter(product => {
    if (product.type === 'package') return false;
    return getCategoryName(product as Product).toLowerCase() === categoryName.toLowerCase();
  });
};

// Filter products by type
export const filterByType = (
  products: (Product | Package)[],
  type: 'products' | 'packages' | 'all'
): (Product | Package)[] => {
  if (type === 'all') return products;
  
  return products.filter(product => {
    if (type === 'products') {
      return !product.type || product.type === 'product';
    }
    return product.type === 'package';
  });
};

// Utility to merge configs
export const mergeConfig = (...configs: Partial<DrwProductConfig>[]): DrwProductConfig => {
  return configs.reduce((acc, config) => ({ ...acc, ...config }), defaultConfig);
};

// Utility for class name concatenation
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
