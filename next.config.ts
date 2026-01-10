import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
