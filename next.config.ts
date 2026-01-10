import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/api/auth/verify-email",
        destination: "/auth/verify-email",
        permanent: true,
      },
      {
        source: "/api/auth/reset-password/:token",
        destination: "/auth/reset-password/:token",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
