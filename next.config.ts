import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.contentful.com" },
      { protocol: "https", hostname: "mountaincollective.com" },
      { protocol: "https", hostname: "www.indyskipass.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "www.skiutah.com" },
    ],
  },
};

export default nextConfig;
