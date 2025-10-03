import pkg from 'pg'
const { Client } = pkg

async function testConnection() {
  const client = new Client({
    host: '213.190.4.159',
    database: 'drwskincare',
    user: 'berkomunitas',
    password: 'berkomunitas688',
    port: 5432,
    ssl: false
  })

  try {  
    console.log('🔄 Mencoba koneksi ke database...')
    await client.connect()
    console.log('✅ Berhasil terhubung ke database PostgreSQL!')
    
    // Test query untuk melihat tabel yang tersedia
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `)
    
    console.log('📋 Tabel yang tersedia:')
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`)
    })
    
      // Test query produk  
    try {
      const productsResult = await client.query('SELECT COUNT(*) as total FROM produk LIMIT 1')
      console.log(`📦 Total produk: ${productsResult.rows[0].total}`)
      
      // Ambil sample data
      const sampleResult = await client.query('SELECT * FROM produk LIMIT 3')
      console.log('📝 Sample data:')
      sampleResult.rows.forEach((row, i) => {
        console.log(`   ${i+1}. ${row.nama_produk || 'Unknown'} - Rp ${row.harga_umum || 'N/A'}`)
        console.log(`      ID: ${row.id}, Kategori: ${row.kategori_id || 'N/A'}`)
      })
      
      // Test join dengan kategori
      const joinResult = await client.query(`
        SELECT p.nama_produk, p.harga_umum, k.nama as kategori_nama
        FROM produk p 
        LEFT JOIN kategori k ON p.kategori_id = k.id 
        LIMIT 5
      `)
      console.log('📝 Data dengan kategori:')
      joinResult.rows.forEach((row, i) => {
        console.log(`   ${i+1}. ${row.nama_produk} - ${row.kategori_nama || 'No Category'} - Rp ${row.harga_umum}`)
      })
      
    } catch (err) {
      console.log('❌ Error query produk:', err.message)
    }  } catch (error) {
    console.error('❌ Error koneksi database:', error.message)
    console.error('Details:', error)
  } finally {
    await client.end()
    console.log('🔌 Koneksi database ditutup')
  }
}

testConnection()