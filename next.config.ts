import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:4200/api/:path*"
            : "https://admin.fitbinary.com/api/:path*",
      },
    ];
  },
  reactCompiler: true,
  transpilePackages: ["@radix-ui/react-slot", "@radix-ui/react-label"],
};

export default nextConfig;
