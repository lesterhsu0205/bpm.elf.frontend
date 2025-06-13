/** @type {import('next').NextConfig} */
const nextConfig = {
  // 配置 Rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`, // proxy to container
      },
    ]
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'docs.material-tailwind.com' },
    ],
  },
  reactStrictMode: true,
  // ... rest of the configuration.
  output: 'standalone',
  // 與 getServerSideProps 無法完美支援動態路由頁面衝突
  // output: "export",
  basePath: '/bpm-elf',
  // publicRuntimeConfig:{
  //   basePath: "/bpm-elf",
  // }
}

export default nextConfig
