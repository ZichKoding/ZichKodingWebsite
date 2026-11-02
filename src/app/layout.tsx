import type { Metadata } from "next";
import { Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";

const brandSans = Montserrat({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE = "ZichKoding | Chris Zichko - Lead Developer & Technology Manager";
const SITE_DESCRIPTION =
  "Portfolio of Chris Zichko, Lead Developer & Technology Manager. Traditional software, AI engineering, and small open models on the device, driven by Gemma 4 E4B.";

export const metadata: Metadata = {
  metadataBase: new URL("https://zichkoding.com"),
  title: {
    default: SITE_TITLE,
    template: "%s | ZichKoding",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ZichKoding",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${brandSans.variable} ${geistMono.variable} font-sans antialiased bg-black text-gray-100`}>
        {children}
      </body>
    </html>
  );
}
