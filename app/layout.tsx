// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Outfit, Marcellus } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import SiteProviders, { themeScript } from "@/providers/SiteProviders";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Gifted Homes and Apartments | Luxury shortlets in Lekki",
    template: "%s | Gifted Homes and Apartments",
  },
  description: "Luxury short-stay apartments in Lekki Phase 1 and Ikate, Lagos. Fully serviced, 24/7 power, concierge and fast WiFi.",
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F2EC" },
    { media: "(prefers-color-scheme: dark)", color: "#10161E" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${outfit.variable} ${marcellus.variable} font-outfit antialiased`}
      >
        <AuthProvider>
          <SiteProviders>
            {children}
          </SiteProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
