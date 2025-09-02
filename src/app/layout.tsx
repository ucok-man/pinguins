import Providers from "@/components/providers";
import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";

import BgPattern from "@/components/bg-pattern";
import { cn } from "@/lib/utils";
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
  title: "Pingquins",
  description: "A discord saas notification",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, eb_garamond.variable)}>
      <body className="min-h-[calc(100vh-1px)] font-primary bg-brand-primary-50 antialiased">
        <Providers>
          <div className="fixed top-0 inset-0 -z-10">
            <BgPattern />
          </div>
          <main className="relative">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
