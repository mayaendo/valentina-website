import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Google Drive thumbnail URLs
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/thumbnail/**",
      },
      // Google user content (where Drive images are actually served from)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
      // Catch-all for any other hosted artwork URLs (Dropbox, Cloudinary, etc.)
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  /** Browsers often request /favicon.ico before parsing HTML; serve the PNG there too. */
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/icono-web-val.png",
      },
    ];
  },
};

export default nextConfig;
