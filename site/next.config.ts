import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Domain redirects (301)
      {
        source: "/:path*",
        has: [{ type: "host", value: "o1lab.com.au" }],
        destination: "https://o1-lab.xyz/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.o1lab.com.au" }],
        destination: "https://o1-lab.xyz/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.o1-lab.xyz" }],
        destination: "https://o1-lab.xyz/:path*",
        permanent: true,
      },
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
