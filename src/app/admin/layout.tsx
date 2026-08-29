import type { Metadata, Viewport } from "next";

// Scopes a separate PWA identity to /admin/* — the Bubblewrap-packaged
// Android app for internal admin use targets this manifest specifically,
// independent of the customer-facing storefront's manifest.json.
export const metadata: Metadata = {
  title: "NADYA Admin",
  manifest: "/admin-manifest.json",
  icons: {
    icon: [
      { url: "/admin-icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/admin-icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#141210",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
