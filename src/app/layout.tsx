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
    default: "ZichKoding | Chris - Full Stack Developer",
    template: "%s | ZichKoding",
  },
  description: "Portfolio of Chris, a UCF-certified Full-Stack Web Developer, Lead Developer, and Technology Manager",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ZichKoding",
    title: "ZichKoding | Chris - Full Stack Developer",
    description: "Portfolio of Chris, a UCF-certified Full-Stack Web Developer, Lead Developer, and Technology Manager",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZichKoding | Chris - Full Stack Developer",
    description: "Portfolio of Chris, a UCF-certified Full-Stack Web Developer, Lead Developer, and Technology Manager",
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
