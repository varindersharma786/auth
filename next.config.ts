import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/api/auth/verify-email/:token+",
        destination: "/auth/verify-email?token=:token+",
        permanent: false,
      },
      {
        source: "/api/auth/verify-email",
        destination: "/auth/verify-email",
        permanent: false,
      },
      {
        source: "/api/auth/reset-password/:token*",
        destination: "/auth/reset-password?token=:token*",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:5000/api/auth/:path*",
      },
    ];
  },
};

export default nextConfig;
