import type { NextConfig } from "next";
import type { WebpackConfigContext } from 'next/dist/server/config-shared';

const nextConfig: NextConfig = {
  webpack: (
    config: any,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }: WebpackConfigContext
  ) => {
    config.module.rules.push({
      test: /\.(shp|shx|dbf|prj)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/chunks/[path][name].[hash][ext]'
      }
    });

    // Return the modified config
    return config;
  },
  
  // Enable static file serving from the public directory
  publicRuntimeConfig: {
    staticFolder: '/public',
  },
  
  // Optional: Add TypeScript checking for the config
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
};

export default nextConfig;