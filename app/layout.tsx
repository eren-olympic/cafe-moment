import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Caveat, Noto_Sans_TC, Roboto_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cafe Moment - 一日咖啡館",
  description: "在忙碌生活中找到片刻寧靜的數位空間",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} 
          ${playfairDisplay.variable} ${caveat.variable} 
          ${notoSansTC.variable} ${robotoMono.variable} 
          antialiased font-noto
        `}
      >
        {children}
      </body>
    </html>
  );
}
