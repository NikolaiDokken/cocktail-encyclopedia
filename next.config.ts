import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        pathname: "**",
        hostname: "www.thecocktaildb.com",
      },
    ],
  },
};

export default nextConfig;
