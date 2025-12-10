/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withBundle = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin();

const nextConfig = withNextIntl({
  trailingSlash: false,
  transpilePackages: ["@refinedev/antd"],
  productionBrowserSourceMaps: false, // Disable to reduce build size (enable only when debugging)
  generateBuildId: async () => {
    return Date.now().toString(36);
  },
  // Headers for PWA/Service Worker support
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Development
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === "production",
  },
  reactStrictMode: process.env.NODE_ENV !== "production",
  // Image optimization
  images: {
    domains: ["localhost", "res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    // Reduced sizes to minimize build output
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false, // Enable optimization
  },

  // Performance optimizations
  crossOrigin: "anonymous",
  poweredByHeader: false,
  generateEtags: false,

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "@ant-design/icons",
      "antd",
      "framer-motion",
      "react-icons",
      "@refinedev/antd",
      "@refinedev/core",
      "date-fns",
      "dayjs",
    ],
  },

  // Build optimizations
  swcMinify: true,
  compress: true,
  optimizeFonts: true,

  // Modularize imports for better tree-shaking
  modularizeImports: {
    "antd": {
      transform: "antd/es/{{member}}",
      skipDefaultConversion: true,
    },
    "@ant-design/icons": {
      transform: "@ant-design/icons/{{member}}",
    },
    "react-icons": {
      transform: "react-icons/{{member}}",
    },
    "framer-motion": {
      transform: "framer-motion/dist/es/{{member}}",
    },
    "date-fns": {
      transform: "date-fns/{{member}}",
    },
    "lodash": {
      transform: "lodash/{{member}}",
    },
  },

  // Compiler options for older browser support
  compiler: {
    // Remove console logs in production for better performance
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
  reactStrictMode: true,
  // Webpack optimizations
  webpack(config, { isServer, dev, webpack }) {
    // Database fallbacks
    config.resolve.fallback = {
      ...config.resolve?.fallback,
      "pg-hstore": false,
      fs: false,
      net: false,
      tls: false,
    };

    if (!dev) {
      // Ignore moment locales
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/locale$/,
          contextRegExp: /moment$/,
        })
      );

      // Optimize chunks with more aggressive splitting
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 244000, // ~240KB per chunk
          cacheGroups: {
            default: false,
            vendors: false,
            // Refine packages - separate chunk
            refine: {
              test: /[\\/]node_modules[\\/]@refinedev[\\/]/,
              name: "refine",
              priority: 20,
              chunks: "all",
              enforce: true,
            },
            // Ant Design - separate chunk
            antd: {
              test: /[\\/]node_modules[\\/](antd|@ant-design|rc-[a-z]+)[\\/]/,
              name: "antd",
              priority: 19,
              chunks: "all",
              enforce: true,
            },
            // Framer Motion - separate chunk
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: "framer-motion",
              priority: 18,
              chunks: "all",
              enforce: true,
            },
            // React Icons - separate chunk
            reactIcons: {
              test: /[\\/]node_modules[\\/]react-icons[\\/]/,
              name: "react-icons",
              priority: 17,
              chunks: "all",
              enforce: true,
            },
            // Date libraries
            dateLibs: {
              test: /[\\/]node_modules[\\/](date-fns|dayjs|moment)[\\/]/,
              name: "date-libs",
              priority: 16,
              chunks: "all",
            },
            // Next.js and React - separate chunk
            framework: {
              test: /[\\/]node_modules[\\/](react|react-dom|next|scheduler)[\\/]/,
              name: "framework",
              priority: 15,
              chunks: "all",
              enforce: true,
            },
            // Common libraries - shared chunk
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: "commons",
              priority: 10,
              chunks: "all",
              minChunks: 2,
              reuseExistingChunk: true,
            },
            // Other vendors
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              priority: 5,
              chunks: "all",
              minChunks: 1,
            },
          },
        },
      };
    }

    // External server packages
    if (isServer && !dev) {
      config.externals = [
        ...config.externals,
        "sequelize",
        "mysql2",
        "knex",
        "bcrypt",
      ];
    }

    return config;
  },
});

export default withBundle(nextConfig);
