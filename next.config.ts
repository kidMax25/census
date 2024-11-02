import type { NextConfig } from "next";
<<<<<<< HEAD
import type { WebpackConfigContext } from 'next/dist/server/config-shared';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },
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
=======

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
>>>>>>> 9c5b9c3682d35d15ff3b86366c0c1cbcd3fe2b0e
