import type { Metadata, Viewport } from "next";
import { Playfair_Display, Jost, Amiri, Cairo } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "NADYA — Art & Handcraft | Bijoux de mariée artisanaux",
  description:
    "NADYA — Art & Handcraft, à Sfax depuis 2023. Couronnes, tiares, peignes et bijoux de cheveux artisanaux pour femmes inoubliables.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#141210",
};

// Runs before paint so /ar and /en routes never flash the fr/ltr default
// from the static <html> attributes below. See suppressHydrationWarning.
const SYNC_HTML_DIR_SCRIPT = `
(function () {
  var m = window.location.pathname.match(/^\\/(ar|en|fr)(\\/|$)/);
  var locale = m ? m[1] : "fr";
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      dir="ltr"
      suppressHydrationWarning
      className={`${playfair.variable} ${jost.variable} ${amiri.variable} ${cairo.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SYNC_HTML_DIR_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-nadya-cream font-sans text-nadya-black">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
