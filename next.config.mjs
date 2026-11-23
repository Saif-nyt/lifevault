/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL || "https://lifevault-backend-lake.vercel.app";

const nextConfig = {
  /* config options here */
  async rewrites() {
    // Proxy API through the frontend origin so auth cookies are first-party
    // (avoids third-party cookie blocking on cross-subdomain deployments).
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
