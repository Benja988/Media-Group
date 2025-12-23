import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "T.Media",
    template: "%s • T.Media",
  },
  description: "Secure media management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          min-h-screen
          bg-background
          text-foreground
          antialiased
          font-sans
          leading-relaxed
        `}
      >
        <div className="container-responsive">
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}