import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App Management",
  description:
    "Manage and configure applications connected to your Fitbinary ecosystem.",
};

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
