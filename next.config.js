const pkg = require('./package.json')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    ringsNodeVersion: pkg.dependencies['@ringsnetwork/rings-node'],
    ringsChatVersion: pkg.version,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
