const nextConfig = {
  experimental: {
    appDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["placeholder.svg"],
    unoptimized: true,
  },
  // Next's default watch ignore plus the folders that browser tooling writes screenshots and
  // logs into; watching them made the dev server recompile in a loop.
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /^((?:[^/]*(?:\/|$))*)(\.(git|next|claude|playwright-mcp)|node_modules)(\/((?:[^/]*(?:\/|$))*)(?:$|\/))?/,
      }
    }
    return config
  },
}

module.exports = nextConfig
