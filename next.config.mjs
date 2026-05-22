/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/livestock", destination: "/cows" },
      { source: "/livestock/:path*", destination: "/cows/:path*" },
      { source: "/offspring", destination: "/calves/new" },
      { source: "/offspring/:path*", destination: "/calves/:path*" },
      { source: "/sires", destination: "/bulls" },
      { source: "/sires/:path*", destination: "/bulls/:path*" },
      { source: "/locations", destination: "/pastures" },
      { source: "/locations/:path*", destination: "/pastures/:path*" },
    ];
  },
};

export default nextConfig;
