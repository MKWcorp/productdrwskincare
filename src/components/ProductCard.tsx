import { DatabaseProduct } from "@/types"
import { formatPrice, getWhatsAppMessage } from "@/lib/config"

interface ProductCardProps {
  product: DatabaseProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const handleWhatsAppClick = () => {
    const whatsappUrl = getWhatsAppMessage(product.nama_produk, product.harga_umum)
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="aspect-square relative bg-gray-100">
        {product.foto_produk && product.foto_produk.length > 0 ? (
          <img
            src={product.foto_produk[0].url_foto}
            alt={product.nama_produk}
            className="w-full h-full object-cover"
          />
        ) : product.foto_utama ? (
          <img
            src={product.foto_utama}
            alt={product.nama_produk}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span>No Image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
          {product.nama_produk}
        </h3>
        
        {product.deskripsi_singkat && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.deskripsi_singkat}
          </p>
        )}

        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {product.categories.map((category) => (
                <span
                  key={category.id}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                >
                  {category.nama_kategori}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.harga_umum)}
          </span>
          {product.bpom && (
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
              BPOM: {product.bpom}
            </span>
          )}
        </div>

        <button
          onClick={handleWhatsAppClick}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Pesan via WhatsApp
        </button>
      </div>
    </div>
  )
}