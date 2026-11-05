import type { NextConfig } from 'next';
const config: NextConfig = { images: { remotePatterns: [{ protocol: 'https', hostname: 'images.microcms-assets.io' }] } };
export default config;
