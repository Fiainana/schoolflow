import type { NextConfig } from 'next';

// Adresse interne de l'API (réseau Docker). Lue au build : les appels /api/* du navigateur
// passent par Next, donc une seule origine publique et aucun CORS.
const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? 'http://localhost:3000';

const config: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_INTERNAL_URL}/api/:path*` }];
  },
};

export default config;
