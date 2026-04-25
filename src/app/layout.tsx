import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "SalmoTrack Dashboard",
  description: "IoT dashboard for SalmoTrack sensor data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} dark antialiased`}>
      <body className="bg-[#202020] text-white min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
