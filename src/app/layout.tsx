import Providers from "@/components/providers";
import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";

import { cn } from "@/lib/utils";
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
