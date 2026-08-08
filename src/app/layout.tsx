import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zichkoding.com"),
  title: {
    default: "ZichKoding | Chris Zichko - Software Engineer & AI Systems Builder",
    template: "%s | ZichKoding",
  },
  description:
    "Portfolio of Chris Zichko: UCF-certified full-stack developer, production systems owner, and builder of local-first AI tools.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ZichKoding",
    title: "ZichKoding | Chris Zichko - Software Engineer & AI Systems Builder",
    description:
      "Portfolio of Chris Zichko: UCF-certified full-stack developer, production systems owner, and builder of local-first AI tools.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZichKoding | Chris Zichko - Software Engineer & AI Systems Builder",
    description:
      "Portfolio of Chris Zichko: UCF-certified full-stack developer, production systems owner, and builder of local-first AI tools.",
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
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-slate-950 text-gray-100`}>
        {children}
      </body>
    </html>
  );
}
