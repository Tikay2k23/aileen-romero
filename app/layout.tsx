import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Preloader from "@/components/preloader";
import ProjectInquiry from "@/components/project-inquiry";
import GhlChatWidget from "@/components/ghl-chat-widget";
import { ignoreKnownGhlWidgetBug } from "@/lib/ghl-error-guard";
import { introImages } from "@/lib/intro-images";
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
        <Preloader introImages={introImages()}>{children}</Preloader>
        <ProjectInquiry />
        <GhlChatWidget />
        {/* Quiets a known bug in the GoHighLevel chat widget: see lib/ghl-error-guard.ts */}
        <Script id="ghl-known-bug-guard" strategy="beforeInteractive">
          {ignoreKnownGhlWidgetBug}
        </Script>
      </body>
    </html>
  );
}
