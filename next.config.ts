import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  transpilePackages: ["@radix-ui/react-slot", "@radix-ui/react-label"],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:4200/api/v1/:path*"
            : "https://admin.fitbinary.com/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
