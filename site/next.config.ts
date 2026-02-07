import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Catch-all: any unknown path → home
      {
        source: "/:path+",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
