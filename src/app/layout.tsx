import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientRootLayout from "@/components/common/client-layout";

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
    default: "Fitbinary Accounts",
    template: "%s | Fitbinary Accounts",
  },
  description:
    "Fitbinary Accounts is the centralized authentication and organization management portal for all Fitbinary applications.",
  applicationName: "Fitbinary Accounts",

  metadataBase: new URL("https://accounts.fitbinary.com"),
  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://accounts.fitbinary.com",
    title: "Fitbinary Accounts",
    description:
      "Secure sign-in and organization management for Fitbinary applications.",
    siteName: "Fitbinary",
  },

  twitter: {
    card: "summary_large_image",
    title: "Fitbinary Accounts",
    description:
      "Centralized authentication and organization management for Fitbinary.",
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
