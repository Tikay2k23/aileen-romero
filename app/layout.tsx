import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Preloader from "@/components/preloader";
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
  title: "Aileen Romero",
  description: "Portfolio of Aileen Romero",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Preloader>{children}</Preloader>
      </body>
    </html>
  );
}
