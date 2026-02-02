/** @type {import('next').NextConfig} */
const nextConfig = {};

// Only apply these settings in production for GitHub Pages
if (process.env.NODE_ENV === 'production') {
  nextConfig.output = 'export'; // Required for static exports in production
  nextConfig.basePath = '/Hacathon2-Todo-App'; // GitHub Pages subdirectory path (matching repo name)
  nextConfig.assetPrefix = '/Hacathon2-Todo-App/'; // Prefix for asset paths (note the trailing slash)
  nextConfig.trailingSlash = true; // Important for GitHub Pages
}

nextConfig.env = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000', // Local development API URL
};

nextConfig.images = {
  ...(process.env.NODE_ENV === 'production' && {unoptimized: true}), // Required for GitHub Pages
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
    },
    {
      protocol: 'https',
      hostname: 'your-backend-domain.com',
    },
    {
      protocol: 'https',
      hostname: 'syedaanabia.github.io',
    }
  ],
};

module.exports = nextConfig;