import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/:path*`,
      },
    ];
  },

  reactCompiler: true,

  transpilePackages: ["@radix-ui/react-slot", "@radix-ui/react-label"],
};

export default nextConfig;
