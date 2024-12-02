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
  // 與 getServerSideProps 衝突
  // output: "export", 
  basePath: "/bpm-guide",
  // publicRuntimeConfig:{
  //   basePath: "/bpm-guide",
  // }
};

export default nextConfig;
