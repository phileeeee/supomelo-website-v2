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
  title: "Supomelo Studio | Product Design for Startups",
  description: "From seed to scale. Design that helps startups flourish. Product design studio for startups and scale-ups.",
  keywords: ["product design", "startup design", "UX design", "UI design", "design studio"],
  authors: [{ name: "Supomelo Studio" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Supomelo Studio | Product Design for Startups",
    description: "From seed to scale. Design that helps startups flourish.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supomelo Studio | Product Design for Startups",
    description: "From seed to scale. Design that helps startups flourish.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
