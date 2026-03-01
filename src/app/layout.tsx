import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientRootLayout from "@/components/common/client-layout";
import JsonLd from "@/components/common/json-ld";

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
    default: "Fitbinary Accounts | Access Control Panel",
    template: "%s | Fitbinary Accounts",
  },
  description:
    "Manage your Fitbinary account, subscriptions, users, and organizations. The centralized auth and control panel for the Fitbinary ecosystem.",
  applicationName: "Fitbinary Accounts",
  authors: [{ name: "Fitbinary Team", url: "https://fitbinary.com" }],
  keywords: [
    "Fitbinary",
    "Fitbinary Accounts",
    "Access Control Panel",
    "Subscription Management",
    "Account Management",
    "Fitbinary SSO",
    "Onboarding",
  ],

  metadataBase: new URL("https://accounts.fitbinary.com"),
  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://accounts.fitbinary.com",
    title: "Fitbinary Accounts | Access Control Panel",
    description:
      "Centralized account and organization management for all Fitbinary applications. Manage users, subscriptions, and onboarding.",
    siteName: "Fitbinary",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fitbinary Accounts",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Fitbinary Accounts | Access Control Panel",
    description:
      "Centralized account and organization management for Fitbinary.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <JsonLd />
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
