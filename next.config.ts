import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/personal-site",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
