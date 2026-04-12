import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Google Drive direct-view URLs
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/uc/**",
      },
      // Google user content (where Drive images are actually served from)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // Catch-all for any other hosted artwork URLs (Dropbox, Cloudinary, etc.)
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
