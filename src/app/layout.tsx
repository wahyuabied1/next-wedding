import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Imperial_Script, Philosopher, Source_Serif_4 } from "next/font/google";
import { site } from "@/lib/config";
import { getPhoto } from "@/lib/photos";
import "./globals.css";

const og = getPhoto(site.ogImage);

const script = Imperial_Script({ weight: "400", subsets: ["latin"], variable: "--font-script" });
const body = Philosopher({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-body" });
const display = Bodoni_Moda({ subsets: ["latin"], variable: "--font-display" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif" });

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
  themeColor: "#0c3022",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${script.variable} ${body.variable} ${display.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
