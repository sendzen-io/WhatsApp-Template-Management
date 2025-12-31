/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui-core"],
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Use a different hash function to avoid WASM issues with Node.js 22
    config.output.hashFunction = 'xxhash64';
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app.sendzen.io',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'growby.sendzen.io',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'sendzen.io',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.sendzen.io',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'wa-mm-media.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

