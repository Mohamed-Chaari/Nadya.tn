import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "NADYA — Art & Handcraft | Bijoux de mariée artisanaux",
  description:
    "NADYA — Art & Handcraft, à Sfax depuis 2023. Couronnes, tiares, peignes et bijoux de cheveux artisanaux pour femmes inoubliables.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-nadya-cream font-sans text-nadya-black">
        {children}
      </body>
    </html>
  );
}
