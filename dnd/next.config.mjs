/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: function () {
    return [
      {
        source: "/__/auth/:path*",
        destination: `https://dungeons-dragons-f04f6.firebaseapp.com/__/auth/:path*`, // Proxy to Backend
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      // these image remote patterns below are for demo purposes only, should be removed for prod
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
      },
      {
        protocol: "https",
        hostname: "www.d20radio.com",
      },
    ],
  },
};

export default nextConfig;
