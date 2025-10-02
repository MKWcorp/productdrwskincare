// Product and category types for DRW Skincare components
export interface Category {
  id: number;
  nama_kategori: string;
  deskripsi?: string;
  created_at?: Date;
}

export interface ProductCategory {
  produk_id: number;
  kategori_id: number;
  kategori: Category;
}

export interface ProductDetail {
  produk_id: number;
  kegunaan?: string;
  komposisi?: string;
  cara_pakai?: string;
  netto?: string;
  no_bpom?: string;
}

export interface Product {
  id_produk: number;
  nama_produk: string;
  slug?: string;
  bpom?: string;
  harga_director: number;
  harga_manager: number;
  harga_supervisor: number;
  harga_consultant: number;
  harga_umum: number;
  foto_utama?: string;
  deskripsi_singkat?: string;
  created_at?: Date;
  updated_at?: Date;
  produk_kategori?: ProductCategory[];
  produk_detail?: ProductDetail;
  
  // Legacy compatibility fields (for existing websites)
  namaProduk?: string;
  hargaUmum?: number;
  gambar?: string;
  deskripsi?: string;
  categories?: { name: string };
  type?: 'product' | 'package';
}

export interface Package {
  id_paket: number;
  nama_paket: string;
  slug?: string;
  deskripsi?: string;
  foto_utama?: string;
  harga_director: number;
  harga_manager: number;
  harga_supervisor: number;
  harga_consultant: number;
  harga_umum: number;
  created_at?: Date;
  updated_at?: Date;
  
  // Package contents
  packageContents?: Product[];
  
  // Legacy compatibility
  namaProduk?: string;
  hargaUmum?: number;
  gambar?: string;
  type?: 'product' | 'package';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProductListResponse extends ApiResponse<{
  products: Product[];
  packages: Package[];
}> {}

export interface ProductDetailResponse extends ApiResponse<Product> {}

// Configuration interface for the library
export interface DrwProductConfig {
  apiBaseUrl: string;
  whatsappNumber: string;
  brandName?: string;
  currency?: 'IDR' | 'USD';
  priceRole?: 'director' | 'manager' | 'supervisor' | 'consultant' | 'umum';
  enablePackages?: boolean;
  enableCategories?: boolean;
}

// Component props interfaces
export interface ProductCardProps {
  product: Product | Package;
  onWhatsAppClick?: (product: Product | Package) => void;
  onCategoryClick?: (categoryName: string) => void;
  config?: Partial<DrwProductConfig>;
  className?: string;
}

export interface ProductListProps {
  products: (Product | Package)[];
  onWhatsAppClick?: (product: Product | Package) => void;
  onCategoryClick?: (categoryName: string) => void;
  config?: Partial<DrwProductConfig>;
  className?: string;
  enableSearch?: boolean;
  enableFilters?: boolean;
}

export interface ProductDetailProps {
  product: Product;
  onWhatsAppClick?: (product: Product) => void;
  onBackClick?: () => void;
  config?: Partial<DrwProductConfig>;
  className?: string;
  showRelatedProducts?: boolean;
}
