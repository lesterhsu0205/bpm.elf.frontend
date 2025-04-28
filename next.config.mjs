/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "docs.material-tailwind.com" },
    ],
  },
  reactStrictMode: true,
  // ... rest of the configuration.
  output: "standalone",
  // 與 getServerSideProps 無法完美支援動態路由頁面衝突
  // output: "export", 
  basePath: "/bpm-elf",
  // publicRuntimeConfig:{
  //   basePath: "/bpm-elf",
  // }
};

export default nextConfig;
