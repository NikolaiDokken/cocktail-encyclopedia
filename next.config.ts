import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        pathname: "**",
        hostname: "tailwindui.com",
      },
      {
        protocol: "https",
        pathname: "**",
        hostname: "www.thecocktaildb.com",
      },
    ],
  },
};

export default nextConfig;
