import type { NextConfig } from "next";

const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "https://localhost:4200/api/v1"
    : "https://admin.fitbinary.com/api/v1";

const nextConfig: NextConfig = {
  reactCompiler: true,

  transpilePackages: ["@radix-ui/react-slot", "@radix-ui/react-label"],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
