import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ski Utah Trip Planner",
    template: "%s | Ski Utah Trip Planner",
  },
  description:
    "Plan your perfect Utah ski vacation. Search flights, hotels, lift tickets, gear rentals, dining, and activities across all 15 Utah ski resorts — with your AI concierge.",
  keywords: ["ski utah", "utah skiing", "ski trip planner", "park city", "snowbird", "alta", "deer valley"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
