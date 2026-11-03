/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Файлы данных читаются на сервере через fs — говорим Next включить их в серверную сборку (важно для Vercel).
  outputFileTracingIncludes: {
    '/api/builds': ['./data/builds.json'],
    '/api/reviews': ['./data/reviews.json'],
    '/api/img/[name]': ['./data/uploads/**/*'],
  },
}

export default nextConfig
