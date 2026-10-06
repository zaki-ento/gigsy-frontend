/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost/gigsy/wp-json/gn/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
