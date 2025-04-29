import createWithNextra from 'nextra'
import path from 'path'

const withNextra = createWithNextra({
  defaultShowCopyCode: true,
  staticImage: true,
  unstable_shouldAddLocaleToLinks: false,
})


/**
 * @type {import("next").NextConfig}
 */
export default withNextra({
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  cleanDistDir: true,
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    }
    return config
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'localhost:3002', 'localhost:3003', 'localhost:3004', 'localhost:3005', 'localhost:3006', 'localhost:3007']
    },
    scrollRestoration: true,
    esmExternals: true
  }
})
