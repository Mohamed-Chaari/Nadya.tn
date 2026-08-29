import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

function r2RemotePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) return [];
  const { hostname, protocol } = new URL(publicUrl);
  return [
    {
      protocol: protocol.replace(":", "") as "http" | "https",
      hostname,
    },
  ];
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2RemotePatterns(),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default withNextIntl(nextConfig);
