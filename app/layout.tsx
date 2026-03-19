import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { site } from "../lib/site";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xindanzhang.github.io/personal-site"),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#e8e8e8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} bg-[#e8e8e8] font-mono antialiased`}>
        {children}
      </body>
    </html>
  );
}
