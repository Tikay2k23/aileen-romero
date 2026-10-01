import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The work pages used to live under /services: old links still arrive. Temporary (307), so browsers don't
  // remember it for good while the site is still taking shape.
  redirects() {
    return [{ source: "/services/:slug", destination: "/work/:slug", permanent: false }];
  },
  images: {
    // Work page cards (components/ui/hero-parallax.tsx) load their thumbnails through next/image
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
