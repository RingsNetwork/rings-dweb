const pkg = require('./package.json')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    ringsNodeVersion: '0.2.5-dev-20230419.0',
    ringsChatVersion: pkg.version,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
