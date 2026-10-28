import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      }
    ],
    minimumCacheTTL: 60 * 60 * 24, // 缓存图片24小时，减少重复请求
  },
};

export default nextConfig;
