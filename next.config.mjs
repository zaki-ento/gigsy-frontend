/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost/gigneo/wp-json/gn/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
