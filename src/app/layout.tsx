import Providers from "@/components/providers";
import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const eb_garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-ebgaramond",
});

export const metadata: Metadata = {
  title: {
    default: "Pingquins - Real-Time SaaS Insights to Discord",
    template: "%s | Pingquins",
  },
  description:
    "Get instant Discord notifications for sales, new users, and critical events in your SaaS. Monitor your business in real-time with Pingquins - the easiest way to track what matters.",
  keywords: [
    "SaaS monitoring",
    "Discord notifications",
    "real-time alerts",
    "event tracking",
    "business analytics",
    "API monitoring",
    "webhook notifications",
  ],
  authors: [{ name: "ucokman" }],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={cn(inter.variable, eb_garamond.variable)}>
      <body className="font-sans antialiased">
        <Providers>
          <main className="relative">
            {children}
            <Toaster />
          </main>
        </Providers>
      </body>
    </html>
  );
}
