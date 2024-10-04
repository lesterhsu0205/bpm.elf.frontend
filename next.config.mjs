/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: "export", // 與 getServerSideProps 衝突
  basePath: "/bpm-guide",
};

export default nextConfig;
