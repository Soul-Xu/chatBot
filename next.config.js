/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  reactStrictMode: true, 
   swcMinify: true, 
   sassOptions: { 
    includePaths: [path.join(__dirname, 'styles')] 
  },
  experimental: {
    optimizeFonts: false,
  },
  basePath: '/chatbot/web'
}

module.exports = nextConfig
