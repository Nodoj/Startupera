/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iyocvtgqkdorbwzlmoau.supabase.co",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
