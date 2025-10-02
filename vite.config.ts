import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  return {
    plugins: [
      react()
    ],
    ...(isLib && {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/lib/index.ts'),
          name: 'DrwProductComponents',
          formats: ['es', 'cjs'],
          fileName: (format) => `index.${format === 'es' ? 'es.js' : 'js'}`
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react-router-dom', 'axios', '@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons', '@fortawesome/free-brands-svg-icons'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react-router-dom': 'ReactRouterDOM',
              axios: 'axios',
              '@fortawesome/react-fontawesome': 'FontAwesome',
              '@fortawesome/free-solid-svg-icons': 'FontAwesomeSolid',
              '@fortawesome/free-brands-svg-icons': 'FontAwesomeBrands'
            }
          }
        },
        sourcemap: true
      }
    })
  }
})
