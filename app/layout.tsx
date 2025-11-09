import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zplitgpt - AI Comparison Environment",
  description: "Advanced AI comparison environment for developers and enthusiasts. Compare multiple LLM responses side-by-side with precision controls.",
  keywords: ["Zplitgpt", "AI", "LLM", "Comparison", "Development", "React"],
  authors: [{ name: "Zplitgpt Team" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/ZplitGPT.png",
  },
  openGraph: {
    title: "Zplitgpt - AI Comparison Environment",
    description: "Advanced AI comparison environment for developers and enthusiasts",
    url: "https://chat.z.ai",
    siteName: "Zplitgpt",
    type: "website",
    images: [
      {
        url: "/ZplitGPT.png",
        width: 1200,
        height: 630,
        alt: "ZplitGPT Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zplitgpt - AI Comparison Environment",
    description: "Advanced AI comparison environment for developers and enthusiasts",
    images: ["/ZplitGPT.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground dark`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
