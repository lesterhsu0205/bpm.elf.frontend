/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "docs.material-tailwind.com" },
    ],
  },
  reactStrictMode: true,
  // output: "export", // 與 getServerSideProps 衝突
  basePath: "/bpm-guide",
};

export default nextConfig;
