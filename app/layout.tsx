import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";

import "./globals.css";

import { NextAuthProvider } from "@/providers/session-provider";
import { ThemeProvider } from "@/providers/theme-provider";

import { Navbar } from "@/components/layout/navbar";
import { QueryClientProvider } from "@/providers/queryClient-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stock Market Simulator",
  description: "A simulator for learning about the stock market",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex-grow bg-background`}
      >
        <NextAuthProvider>
          <ThemeProvider>
            <QueryClientProvider>
              <Navbar />
              {children}
            </QueryClientProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
