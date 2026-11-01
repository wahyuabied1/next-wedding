import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Monsieur_La_Doulaise, Noto_Serif, Pinyon_Script, Quicksand } from "next/font/google";
import { site } from "@/lib/config";
import "./globals.css";

const og = site.ogImage;

// Padanan terdekat (Google Fonts, lisensi OFL) untuk skrip copperplate pada situs referensi.
const script = Pinyon_Script({ weight: "400", subsets: ["latin"], variable: "--font-script" });
const display = Monsieur_La_Doulaise({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Cormorant_Garamond({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-body" });

// teks ayat pada kartu oval (serif tegas seperti pada referensi)
const verse = Noto_Serif({ weight: "400", subsets: ["latin"], variable: "--font-verse" });

// teks penutup pada oval marun (sans bulat seperti pada referensi)
const thanks = Quicksand({ subsets: ["latin"], variable: "--font-thanks" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.title,
    type: "website",
    locale: "id_ID",
    images: [{ url: og.src, width: og.width, height: og.height }],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: [og.src] },
  robots: { index: false, follow: false }, // undangan pribadi
};

export const viewport: Viewport = {
  themeColor: "#0a261d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${script.variable} ${display.variable} ${body.variable} ${verse.variable} ${thanks.variable}`}>
      <body>{children}</body>
    </html>
  );
}
