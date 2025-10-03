import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faEnvelope, faPhone, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">DR.W Skincare</h3>
            <p className="text-gray-300 mb-4">
              Solusi perawatan kulit terpercaya dengan produk berkualitas dan konsultasi ahli.
            </p>
            <a 
              href="https://wa.me/6285852555571" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-block transition-colors"
            >
              Konsultasi Gratis
            </a>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak Kami</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
                <span>+62 858-5255-5571</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
                <span>info@drwskincare.com</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4" />
                <span>Indonesia</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Produk Kami</h4>
            <div className="space-y-2 text-gray-300">
              <p><FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-400" />Skincare BPOM</p>
              <p><FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-400" />Treatment Profesional</p>
              <p><FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-400" />Konsultasi Gratis</p>
              <p><FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-400" />Pengiriman Seluruh Indonesia</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 mt-8 text-center text-gray-400">
          <p>&copy; 2024 DR.W Skincare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}